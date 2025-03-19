// __tests__/controllers/wall.controller.test.js
const WallController = require("../../app/controllers/wall.controller");
const WallService = require("../../app/services/wall.service");
const { mockRequest, mockResponse } = require("../helpers");
const { logger } = require("../../app/logger/FirebaseLogger");

jest.mock("../../app/services/wall.service");
jest.mock("../../app/logger/FirebaseLogger");

describe("Wall Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWall", () => {
    it("retrieves a wall by ID successfully", async () => {
      const req = mockRequest({ params: { wallId: "wall1" } });
      const res = mockResponse();
      const mockWall = { id: "wall1", name: "Test Wall" };

      WallService.getWall.mockResolvedValue(mockWall);

      await WallController.getWall(req, res);

      expect(WallService.getWall).toHaveBeenCalledWith("wall1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Wall fetched successfully",
          data: mockWall,
        })
      );
    });

    it("returns 404 if wall not found", async () => {
      const req = mockRequest({ params: { wallId: "wall1" } });
      const res = mockResponse();

      WallService.getWall.mockResolvedValue(null);

      await WallController.getWall(req, res);

      expect(WallService.getWall).toHaveBeenCalledWith("wall1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Wall not found",
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest({ params: { wallId: "wall1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      WallService.getWall.mockRejectedValue(error);

      await WallController.getWall(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error getting wall", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Database error",
        })
      );
    });
  });

  describe("getAllWalls", () => {
    it("retrieves all walls successfully", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockWalls = [{ id: "wall1", name: "Test Wall" }];

      WallService.getAllWalls.mockResolvedValue(mockWalls);

      await WallController.getAllWalls(req, res);

      expect(WallService.getAllWalls).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Walls fetched successfully",
          data: mockWalls,
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error("Database error");

      WallService.getAllWalls.mockRejectedValue(error);

      await WallController.getAllWalls(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error getting all walls", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Database error",
        })
      );
    });
  });

  describe("updateWall", () => {
    it("returns 400 if validation fails", async () => {
      const req = mockRequest({ params: { wallId: "wall1" }, body: {} });
      const res = mockResponse();

      await WallController.updateWall(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: expect.any(String),
        })
      );
    });
  });

  describe("deleteWall", () => {
    it("deletes a wall successfully", async () => {
      const req = mockRequest({ params: { wallId: "wall1" } });
      const res = mockResponse();

      await WallController.deleteWall(req, res);

      expect(WallService.deleteWall).toHaveBeenCalledWith("wall1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Wall deleted successfully",
          data: null,
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest({ params: { wallId: "wall1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      WallService.deleteWall.mockRejectedValue(error);

      await WallController.deleteWall(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error deleting wall", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Database error",
        })
      );
    });
  });
});
