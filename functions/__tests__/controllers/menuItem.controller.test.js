// __tests__/controllers/menuItem.controller.test.js
const MenuItemController = require("../../app/controllers/menuItem.controller");
const menuItemService = require("../../app/services/menuItem.service");
const { mockRequest, mockResponse } = require("../helpers");

jest.mock("../../app/services/menuItem.service");
jest.mock("../../app/logger/FirebaseLogger");

describe("MenuItem Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMenuItem", () => {
    it("returns 400 if validation fails", async () => {
      const req = mockRequest({ body: { name: "" } });
      const res = mockResponse();

      await MenuItemController.createMenuItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Validation failed",
        })
      );
    });
  });

  describe("getMenuItemById", () => {
    it("retrieves a menu item by ID successfully", async () => {
      const req = mockRequest({ params: { id: "item1" } });
      const res = mockResponse();
      const mockMenuItem = { id: "item1", name: "Pizza", price: 12.99 };

      menuItemService.getMenuItemById.mockResolvedValue(mockMenuItem);

      await MenuItemController.getMenuItemById(req, res);

      expect(menuItemService.getMenuItemById).toHaveBeenCalledWith("item1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Menu item retrieved successfully",
          data: mockMenuItem,
        })
      );
    });

    it("returns 404 if menu item does not exist", async () => {
      const req = mockRequest({ params: { id: "item1" } });
      const res = mockResponse();

      menuItemService.getMenuItemById.mockRejectedValue(new Error("Menu item not found"));

      await MenuItemController.getMenuItemById(req, res);

      expect(menuItemService.getMenuItemById).toHaveBeenCalledWith("item1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Menu item not found",
        })
      );
    });
  });
});
