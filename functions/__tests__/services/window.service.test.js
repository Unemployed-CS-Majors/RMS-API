// __tests__/services/window.service.test.js
const WindowService = require("../../app/services/window.service");
const { Window } = require("../../app/models/window.model");
const { db } = require("../../app/config/firebase.config");
const { mockDocumentSnapshot, mockQuerySnapshot } = require("../helpers");

jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe("Window Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWindow", () => {
    it("retrieves a window by ID successfully", async () => {
      const windowData = { id: "window1", width: 100, height: 200 };
      const mockWindowRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("window1", windowData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWindowRef) });

      const result = await WindowService.getWindow("window1");

      expect(result).toEqual(Window.fromFirestore(mockDocumentSnapshot("window1", windowData)));
    });

    it("returns null if window does not exist", async () => {
      const mockWindowRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWindowRef) });

      const result = await WindowService.getWindow("window1");

      expect(result).toBeNull();
    });
  });

  describe("getAllWindows", () => {
    it("retrieves all windows successfully", async () => {
      const windowsData = [
        { id: "window1", width: 100, height: 200 },
        { id: "window2", width: 150, height: 250 },
      ];
      const mockWindowsRef = { get: jest.fn().mockResolvedValue(mockQuerySnapshot(windowsData)) };
      db.collection.mockReturnValue(mockWindowsRef);

      const result = await WindowService.getAllWindows();

      expect(result).toEqual(
        windowsData.map((data) => Window.fromFirestore(mockDocumentSnapshot(data.id, data))),
      );
    });
  });

  describe("updateWindow", () => {
    it("updates a window successfully", async () => {
      const windowData = { width: 120, height: 220 };
      const mockWindowRef = {
        update: jest.fn().mockResolvedValue({}),
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("window1", windowData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWindowRef) });

      const result = await WindowService.updateWindow("window1", windowData);

      expect(mockWindowRef.update).toHaveBeenCalledWith(windowData);
      expect(result).toEqual(Window.fromFirestore(mockDocumentSnapshot("window1", windowData)));
    });
  });

  describe("deleteWindow", () => {
    it("deletes a window successfully", async () => {
      const mockWindowRef = { delete: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWindowRef) });

      await WindowService.deleteWindow("window1");

      expect(mockWindowRef.delete).toHaveBeenCalled();
    });
  });
});
