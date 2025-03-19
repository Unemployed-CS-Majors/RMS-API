// __tests__/controllers/analytics.controller.test.js
const AnalyticsController = require("../../app/controllers/analytics.controller");
const AnalyticsService = require("../../app/services/analytics.service");
const { mockRequest, mockResponse } = require("../helpers");
const { logger } = require("../../app/logger/FirebaseLogger");

// Mock dependencies
jest.mock("../../app/services/analytics.service");
jest.mock("../../app/logger/FirebaseLogger");

describe("Analytics Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRevenueAnalytics", () => {
    it("should return revenue analytics with default 30 days period", async () => {
      // Setup mock request and response
      const req = mockRequest({
        query: {},
      });
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        totalRevenue: 1250.75,
        dailyRevenue: { "2023-10-01": 425.5, "2023-10-02": 825.25 },
        weeklyRevenue: { "2023-09-25": 1250.75 },
        revenueByPaymentMethod: { online: 750.25, cash_on_delivery: 250.5, in_store: 250.0 },
        revenueByDeliveryMethod: { home_delivery: 1000.75, pickup: 250.0 },
        averageOrderValue: 62.54,
      };

      AnalyticsService.getRevenueAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getRevenueAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getRevenueAnalytics).toHaveBeenCalledWith(30);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Revenue analytics retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should use custom days period from query params", async () => {
      // Setup mock request with custom days
      const req = mockRequest({
        query: { days: "90" },
      });
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = { totalRevenue: 3500.0 };
      AnalyticsService.getRevenueAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getRevenueAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getRevenueAnalytics).toHaveBeenCalledWith(90);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Database connection failed");
      AnalyticsService.getRevenueAnalytics.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getRevenueAnalytics(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getRevenueAnalytics controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve revenue analytics",
        data: error.message,
      });
    });
  });

  describe("getMenuItemAnalytics", () => {
    it("should return menu item analytics with default 30 days period", async () => {
      // Setup mock request and response
      const req = mockRequest({
        query: {},
      });
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        topItems: [
          { id: "item1", name: "Pizza", totalQuantity: 150, totalRevenue: 2250.0 },
          { id: "item2", name: "Burger", totalQuantity: 120, totalRevenue: 1440.0 },
        ],
        bottomItems: [
          { id: "item3", name: "Salad", totalQuantity: 35, totalRevenue: 350.0 },
          { id: "item4", name: "Soup", totalQuantity: 42, totalRevenue: 336.0 },
        ],
        itemsByQuantity: { item1: 150, item2: 120, item3: 35, item4: 42 },
        itemsByRevenue: [
          { id: "item1", name: "Pizza", totalRevenue: 2250.0 },
          { id: "item2", name: "Burger", totalRevenue: 1440.0 },
          { id: "item3", name: "Salad", totalRevenue: 350.0 },
          { id: "item4", name: "Soup", totalRevenue: 336.0 },
        ],
        averagePreparationTime: 18.5,
      };

      AnalyticsService.getMenuItemAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getMenuItemAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getMenuItemAnalytics).toHaveBeenCalledWith(30);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Menu item analytics retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Failed to retrieve menu items");
      AnalyticsService.getMenuItemAnalytics.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getMenuItemAnalytics(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getMenuItemAnalytics controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve menu item analytics",
        data: error.message,
      });
    });
  });

  describe("getReservationAnalytics", () => {
    it("should return reservation analytics with default 30 days period", async () => {
      // Setup mock request and response
      const req = mockRequest({
        query: {},
      });
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        totalReservations: 125,
        reservationsByStatus: {
          pending: 15,
          confirmed: 45,
          cancelled: 25,
          completed: 40,
        },
        reservationsByDayOfWeek: {
          0: 10, // Sunday
          1: 12, // Monday
          2: 14,
          3: 18,
          4: 22,
          5: 26,
          6: 23, // Saturday
        },
        averagePartySize: 4.2,
        tablePopularity: {
          1: 28,
          2: 32,
          3: 15,
          4: 50,
        },
        cancellationRate: 0.2,
      };

      AnalyticsService.getReservationAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getReservationAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getReservationAnalytics).toHaveBeenCalledWith(30);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Reservation analytics retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Failed to retrieve reservations");
      AnalyticsService.getReservationAnalytics.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getReservationAnalytics(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getReservationAnalytics controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve reservation analytics",
        data: error.message,
      });
    });
  });

  describe("getOrderStatusAnalytics", () => {
    it("should return order status analytics with default 30 days period", async () => {
      // Setup mock request and response
      const req = mockRequest({
        query: {},
      });
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        ordersByStatus: {
          pending_payment: 12,
          paid: 25,
          in_progress: 18,
          ready_for_pickup: 5,
          out_for_delivery: 8,
          completed: 120,
          canceled: 15,
        },
        averageCompletionTime: 45.8, // minutes
        ordersByPaymentMethod: {
          online: 95,
          cash_on_delivery: 58,
          in_store: 50,
        },
        ordersByDeliveryMethod: {
          home_delivery: 105,
          pickup: 98,
        },
      };

      AnalyticsService.getOrderStatusAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getOrderStatusAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getOrderStatusAnalytics).toHaveBeenCalledWith(30);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Order status analytics retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Failed to retrieve order statuses");
      AnalyticsService.getOrderStatusAnalytics.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getOrderStatusAnalytics(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getOrderStatusAnalytics controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve order status analytics",
        data: error.message,
      });
    });
  });

  describe("getCustomerAnalytics", () => {
    it("should return customer analytics with default 90 days period", async () => {
      // Setup mock request and response
      const req = mockRequest({
        query: {},
      });
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        totalCustomers: 350,
        returning: 42.5, // percentage
        averageOrdersPerCustomer: 2.8,
        topCustomers: [
          {
            userId: "user1",
            name: "John Doe",
            email: "john@example.com",
            orderCount: 12,
            totalSpent: 950.5,
          },
          {
            userId: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            orderCount: 10,
            totalSpent: 875.25,
          },
        ],
      };

      AnalyticsService.getCustomerAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getCustomerAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getCustomerAnalytics).toHaveBeenCalledWith(90);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Customer analytics retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Failed to retrieve customer data");
      AnalyticsService.getCustomerAnalytics.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getCustomerAnalytics(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getCustomerAnalytics controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve customer analytics",
        data: error.message,
      });
    });
  });

  describe("getOperationalAnalytics", () => {
    it("should return operational analytics", async () => {
      // Setup mock request and response
      const req = mockRequest();
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        currentStats: {
          activeTables: 25,
          tableUtilizationRate: 68.0,
          pendingOrders: 8,
          inProgressOrders: 5,
          readyOrders: 3,
          todayReservations: 12,
          employeeCount: 15,
        },
        tables: [
          { id: 1, seats: 4 },
          { id: 2, seats: 6 },
        ],
        activeOrders: [{ id: "order1", status: "in_progress" }],
        todayReservations: [{ id: "res1", tableNum: 5, startTime: 1635789600 }],
      };

      AnalyticsService.getOperationalAnalytics.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getOperationalAnalytics(req, res);

      // Assertions
      expect(AnalyticsService.getOperationalAnalytics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Operational analytics retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Failed to retrieve operational data");
      AnalyticsService.getOperationalAnalytics.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getOperationalAnalytics(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getOperationalAnalytics controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve operational analytics",
        data: error.message,
      });
    });
  });

  describe("getDashboardSummary", () => {
    it("should return dashboard summary", async () => {
      // Setup mock request and response
      const req = mockRequest();
      const res = mockResponse();

      // Mock service response
      const mockAnalyticsData = {
        todayRevenue: 1250.75,
        todayOrders: 18,
        revenueChange: 15.2, // percentage increase from yesterday
        activeOrdersCount: 7,
        todayReservationsCount: 12,
      };

      AnalyticsService.getDashboardSummary.mockResolvedValue(mockAnalyticsData);

      // Call controller method
      await AnalyticsController.getDashboardSummary(req, res);

      // Assertions
      expect(AnalyticsService.getDashboardSummary).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Dashboard summary retrieved successfully",
        data: mockAnalyticsData,
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Setup mock request
      const req = mockRequest();
      const res = mockResponse();

      // Mock service to throw error
      const error = new Error("Failed to retrieve dashboard data");
      AnalyticsService.getDashboardSummary.mockRejectedValue(error);

      // Call controller method
      await AnalyticsController.getDashboardSummary(req, res);

      // Assertions
      expect(logger.error).toHaveBeenCalledWith(
        "Error in getDashboardSummary controller:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to retrieve dashboard summary",
        data: error.message,
      });
    });
  });
});
