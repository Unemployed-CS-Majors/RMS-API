// __tests__/controllers/order.controller.test.js
const OrderController = require("../../app/controllers/order.controller");
const OrderService = require("../../app/services/order.service");
const UserService = require("../../app/services/user.service");
const { mockRequest, mockResponse } = require("../helpers");
const { logger } = require("../../app/logger/FirebaseLogger");

jest.mock("../../app/services/order.service");
jest.mock("../../app/services/user.service");
jest.mock("../../app/services/email.service");
jest.mock("../../app/logger/FirebaseLogger");

describe("Order Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrder", () => {
    it("retrieves an order by ID successfully", async () => {
      const req = mockRequest({ params: { orderId: "order1" } });
      const res = mockResponse();
      const mockOrder = { id: "order1", items: [] };

      OrderService.getOrderById.mockResolvedValue(mockOrder);

      await OrderController.getOrder(req, res);

      expect(OrderService.getOrderById).toHaveBeenCalledWith("order1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Order retrieved successfully",
          data: mockOrder,
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest({ params: { orderId: "order1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      OrderService.getOrderById.mockRejectedValue(error);

      await OrderController.getOrder(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error getting order: Database error", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error getting order",
        })
      );
    });
  });

  describe("getUserOrders", () => {
    it("retrieves orders for the authenticated user successfully", async () => {
      const req = mockRequest({ query: { limit: "10" } });
      const res = mockResponse();
      const mockOrders = [{ id: "order1", items: [] }];

      UserService.verifyUser.mockResolvedValue("user1");
      OrderService.getUserOrders.mockResolvedValue(mockOrders);

      await OrderController.getUserOrders(req, res);

      expect(OrderService.getUserOrders).toHaveBeenCalledWith("user1", 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Order retrieved successfully",
          data: mockOrders,
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error("Database error");

      UserService.verifyUser.mockRejectedValue(error);

      await OrderController.getUserOrders(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error getting user orders: Database error", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error getting order",
        })
      );
    });
  });

  describe("updateOrderStatus", () => {
    it("updates an order status successfully", async () => {
      const req = mockRequest({ params: { orderId: "order1" }, body: { status: "IN_PROGRESS" } });
      const res = mockResponse();
      const mockOrder = { id: "order1", status: "IN_PROGRESS" };

      UserService.verifyUser.mockResolvedValue("user1");
      OrderService.updateOrderStatus.mockResolvedValue(mockOrder);

      await OrderController.updateOrderStatus(req, res);

      expect(OrderService.updateOrderStatus).toHaveBeenCalledWith(
        "order1",
        "IN_PROGRESS",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Order updated successfully",
          data: mockOrder,
        })
      );
    });

    it("returns 400 if status is missing", async () => {
      const req = mockRequest({ params: { orderId: "order1" }, body: {} });
      const res = mockResponse();

      await OrderController.updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Missing required fields",
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest({ params: { orderId: "order1" }, body: { status: "IN_PROGRESS" } });
      const res = mockResponse();
      const error = new Error("Database error");

      UserService.verifyUser.mockRejectedValue(error);

      await OrderController.updateOrderStatus(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Error updating order status: Database error",
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error getting order",
        })
      );
    });
  });

  describe("getActiveOrders", () => {
    it("retrieves all active orders successfully", async () => {
      const req = mockRequest({ query: { limit: "10" } });
      const res = mockResponse();
      const mockOrders = [{ id: "order1", items: [] }];

      OrderService.getActiveOrders.mockResolvedValue(mockOrders);

      await OrderController.getActiveOrders(req, res);

      expect(OrderService.getActiveOrders).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Order retrieved successfully",
          data: mockOrders,
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error("Database error");

      OrderService.getActiveOrders.mockRejectedValue(error);

      await OrderController.getActiveOrders(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Error getting active orders: Database error",
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error getting order",
        })
      );
    });
  });

  describe("getOrdersByStatus", () => {
    it("returns 400 if status is invalid", async () => {
      const req = mockRequest({ params: { status: "INVALID_STATUS" } });
      const res = mockResponse();

      await OrderController.getOrdersByStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Invalid status",
        })
      );
    });
  });

  describe("cancelOrder", () => {
    it("handles errors and returns 500 status", async () => {
      const req = mockRequest({ params: { orderId: "order1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      OrderService.getOrderById.mockRejectedValue(error);

      await OrderController.cancelOrder(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error canceling order: Database error", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error getting order",
        })
      );
    });
  });

  describe("getAllOrders", () => {
    it("retrieves all orders successfully", async () => {
      const req = mockRequest({ query: { limit: "10" } });
      const res = mockResponse();
      const mockOrders = [{ id: "order1", items: [] }];

      OrderService.getAllOrders.mockResolvedValue(mockOrders);

      await OrderController.getAllOrders(req, res);

      expect(OrderService.getAllOrders).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Orders retrieved successfully",
          data: mockOrders,
        })
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error("Database error");

      OrderService.getAllOrders.mockRejectedValue(error);

      await OrderController.getAllOrders(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error getting all orders: Database error", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error getting order",
        })
      );
    });
  });
});
