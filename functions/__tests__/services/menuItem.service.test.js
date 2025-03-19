// __tests__/services/menuItem.service.test.js
const MenuItemService = require("../../app/services/menuItem.service");
const { db, storage } = require("../../app/config/firebase.config");
const { MenuItem } = require("../../app/models/menuItem.model");
const { mockFirestoreCollection, mockDocumentSnapshot } = require("../helpers");
const { v4: uuidv4 } = require("uuid");

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
  storage: {
    bucket: jest.fn().mockReturnValue({
      file: jest.fn().mockReturnValue({
        save: jest.fn(),
        makePublic: jest.fn(),
        exists: jest.fn(),
        delete: jest.fn(),
      }),
      name: "test-bucket",
    }),
  },
  admin: {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(),
      },
    },
  },
}));

describe("MenuItem Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("uploads an image and returns the URL", async () => {
      const file = {
        originalname: "test.jpg",
        buffer: Buffer.from("test"),
        mimetype: "image/jpeg",
      };
      uuidv4.mockReturnValue("unique-id");
      const fileRef = storage.bucket().file("menu-items/unique-id_test.jpg");
      fileRef.save.mockResolvedValue();
      fileRef.makePublic.mockResolvedValue();

      const result = await MenuItemService.uploadImage(file);

      expect(result).toBe(
        "https://storage.googleapis.com/test-bucket/menu-items/unique-id_test.jpg"
      );
    });

    it("returns null if no file is provided", async () => {
      const result = await MenuItemService.uploadImage(null);
      expect(result).toBeNull();
    });
  });

  describe("deleteImage", () => {
    it("deletes an image if it exists", async () => {
      const imageUrl = "https://storage.googleapis.com/test-bucket/menu-items/test.jpg";
      const fileRef = storage.bucket().file("menu-items/test.jpg");
      fileRef.exists.mockResolvedValue([true]);
      fileRef.delete.mockResolvedValue();

      await MenuItemService.deleteImage(imageUrl);

      expect(fileRef.delete).toHaveBeenCalled();
    });

    it("does nothing if the image does not exist", async () => {
      const imageUrl = "https://storage.googleapis.com/test-bucket/menu-items/test.jpg";
      const fileRef = storage.bucket().file("menu-items/test.jpg");
      fileRef.exists.mockResolvedValue([false]);

      await MenuItemService.deleteImage(imageUrl);

      expect(fileRef.delete).not.toHaveBeenCalled();
    });

    it("does nothing if no imageUrl is provided", async () => {
      await MenuItemService.deleteImage(null);
      expect(storage.bucket().file).not.toHaveBeenCalled();
    });
  });

  describe("createMenuItem", () => {
    it("creates a new menu item with an image", async () => {
      const data = { name: "Burger", price: 10.99 };
      const file = {
        originalname: "test.jpg",
        buffer: Buffer.from("test"),
        mimetype: "image/jpeg",
      };
      const mockDocRef = {
        id: "menuItem1",
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("menuItem1", data)),
      };
      db.collection.mockReturnValue({ add: jest.fn().mockResolvedValue(mockDocRef) });
      uuidv4.mockReturnValue("unique-id");
      const fileRef = storage.bucket().file("menu-items/unique-id_test.jpg");
      fileRef.save.mockResolvedValue();
      fileRef.makePublic.mockResolvedValue();

      const result = await MenuItemService.createMenuItem(data, file);

      expect(result).toEqual(MenuItem.fromFirestore(mockDocumentSnapshot("menuItem1", data)));
    });

    it("creates a new menu item without an image", async () => {
      const data = { name: "Burger", price: 10.99 };
      const mockDocRef = {
        id: "menuItem1",
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("menuItem1", data)),
      };
      db.collection.mockReturnValue({ add: jest.fn().mockResolvedValue(mockDocRef) });

      const result = await MenuItemService.createMenuItem(data, null);

      expect(result).toEqual(MenuItem.fromFirestore(mockDocumentSnapshot("menuItem1", data)));
    });
  });

  describe("getAllMenuItems", () => {
    it("retrieves all menu items", async () => {
      const mockMenuItems = [
        { id: "1", name: "Burger", price: 10.99 },
        { id: "2", name: "Pizza", price: 15.99 },
      ];
      const mockSnapshot = mockFirestoreCollection(mockMenuItems);
      db.collection.mockReturnValue({ get: mockSnapshot.mockGet });

      await MenuItemService.getAllMenuItems();
    });
  });

  describe("getMenuItemById", () => {
    it("retrieves a menu item by its ID", async () => {
      const mockMenuItem = { id: "1", name: "Burger", price: 10.99 };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockMenuItem)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await MenuItemService.getMenuItemById("1");

      expect(result).toEqual(MenuItem.fromFirestore(mockDocumentSnapshot("1", mockMenuItem)));
    });

    it("throws an error if the menu item does not exist", async () => {
      const mockDocRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      await expect(MenuItemService.getMenuItemById("1")).rejects.toThrow("Menu item not found");
    });
  });

  describe("updateMenuItem", () => {
    it("updates a menu item with a new image", async () => {
      const data = { name: "Updated Burger", price: 12.99 };
      const file = { originalname: "new.jpg", buffer: Buffer.from("new"), mimetype: "image/jpeg" };
      const mockMenuItem = {
        id: "1",
        name: "Burger",
        price: 10.99,
        imageUrl: "https://storage.googleapis.com/test-bucket/menu-items/old.jpg",
      };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockMenuItem)),
        update: jest.fn(),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });
      uuidv4.mockReturnValue("unique-id");
      const fileRef = storage.bucket().file("menu-items/unique-id_new.jpg");
      fileRef.save.mockResolvedValue();
      fileRef.makePublic.mockResolvedValue();
      const oldFileRef = storage.bucket().file("menu-items/old.jpg");
      oldFileRef.exists.mockResolvedValue([true]);
      oldFileRef.delete.mockResolvedValue();

      await MenuItemService.updateMenuItem("1", data, file);
    });

    it("updates a menu item without a new image", async () => {
      const data = { name: "Updated Burger", price: 12.99 };
      const mockMenuItem = {
        id: "1",
        name: "Burger",
        price: 10.99,
        imageUrl: "https://storage.googleapis.com/test-bucket/menu-items/old.jpg",
      };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockMenuItem)),
        update: jest.fn(),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });
      await MenuItemService.updateMenuItem("1", data, null);
    });

    it("throws an error if the menu item does not exist", async () => {
      const mockDocRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      await expect(
        MenuItemService.updateMenuItem("1", { name: "Updated Burger" }, null)
      ).rejects.toThrow("Menu item not found");
    });
  });

  describe("deleteMenuItem", () => {
    it("deletes a menu item and its image", async () => {
      const mockMenuItem = {
        id: "1",
        name: "Burger",
        price: 10.99,
        imageUrl: "https://storage.googleapis.com/test-bucket/menu-items/test.jpg",
      };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockMenuItem)),
        delete: jest.fn(),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });
      const fileRef = storage.bucket().file("menu-items/test.jpg");
      fileRef.exists.mockResolvedValue([true]);
      fileRef.delete.mockResolvedValue();

      const result = await MenuItemService.deleteMenuItem("1");

      expect(result).toEqual({ message: "Menu item successfully deleted" });
      expect(fileRef.delete).toHaveBeenCalled();
    });

    it("deletes a menu item without an image", async () => {
      const mockMenuItem = { id: "1", name: "Burger", price: 10.99, imageUrl: null };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockMenuItem)),
        delete: jest.fn(),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await MenuItemService.deleteMenuItem("1");

      expect(result).toEqual({ message: "Menu item successfully deleted" });
      expect(storage.bucket().file).not.toHaveBeenCalled();
    });

    it("throws an error if the menu item does not exist", async () => {
      const mockDocRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      await expect(MenuItemService.deleteMenuItem("1")).rejects.toThrow("Menu item not found");
    });
  });
});
