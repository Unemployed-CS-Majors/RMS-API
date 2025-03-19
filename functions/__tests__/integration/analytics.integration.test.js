// __tests__/integration/analytics.integration.test.js
const request = require("supertest");
const express = require("express");
const cors = require("cors");
const app = express();
const analyticsRouter = require("../../app/routes/analytics.router");
const { createResponse } = require("../../app/utils/response.utils");

// Mock the auth and privileges middleware
jest.mock("../../app/middlewares/auth.middleware", () => ({
  verifyIdToken: jest.fn((req, res, next) => next()),
}));

jest.mock("../../app/middlewares/privilages.middleware", () => ({
  isOwner: jest.fn((req, res, next) => next()),
}));

// Mock analytics service responses
jest.mock("../../app/services/analytics.service", () => ({
  getRevenueAnalytics: jest.fn().mockResolvedValue({
    totalRevenue: 10000,
    dailyRevenue: { "2023-10-15": 1200 },
    weeklyRevenue: { "2023-10-09": 8000 },
    revenueByPaymentMethod: { online: 6000, cash_on_delivery: 2500, in_store: 1500 },
    revenueByDeliveryMethod: { home_delivery: 8500, pickup: 1500 },
    averageOrderValue: 65.25,
  }),
  getMenuItemAnalytics: jest.fn().mockResolvedValue({
    topItems: [{ id: "item1", name: "Pizza", totalQuantity: 150 }],
    bottomItems: [{ id: "item3", name: "Salad", totalQuantity: 35 }],
    itemsByQuantity: { item1: 150, item2: 120, item3: 35 },
    itemsByRevenue: [{ id: "item1", totalRevenue: 2250 }],
    averagePreparationTime: 15,
  }),
  getReservationAnalytics: jest.fn().mockResolvedValue({
    totalReservations: 85,
    reservationsByStatus: { pending: 15, confirmed: 45, cancelled: 5, completed: 20 },
    reservationsByDayOfWeek: { 5: 20, 6: 25 },
    averagePartySize: 4,
    tablePopularity: { 1: 20, 2: 15 },
    cancellationRate: 0.15,
  }),
  getOrderStatusAnalytics: jest.fn().mockResolvedValue({
    ordersByStatus: { completed: 150, in_progress: 10 },
    averageCompletionTime: 35.5,
    ordersByPaymentMethod: { online: 95 },
    ordersByDeliveryMethod: { home_delivery: 105 },
  }),
  getCustomerAnalytics: jest.fn().mockResolvedValue({
    totalCustomers: 200,
    returning: 35,
    averageOrdersPerCustomer: 2.5,
    topCustomers: [{ name: "John Doe", orderCount: 8 }],
  }),
  getOperationalAnalytics: jest.fn().mockResolvedValue({
    currentStats: {
      activeTables: 20,
      tableUtilizationRate: 75,
      pendingOrders: 5,
      todayReservations: 8,
    },
  }),
  getDashboardSummary: jest.fn().mockResolvedValue({
    todayRevenue: 1250,
    todayOrders: 15,
    revenueChange: 12.5,
    activeOrdersCount: 5,
    todayReservationsCount: 8,
  }),
  getAllAnalytics: jest.fn().mockResolvedValue({
    dashboardSummary: { todayRevenue: 1250 },
    revenueAnalytics: { totalRevenue: 10000 },
    menuItemAnalytics: { topItems: [{ name: "Pizza" }] },
    reservationAnalytics: { totalReservations: 85 },
    orderStatusAnalytics: { ordersByStatus: { completed: 150 } },
    customerAnalytics: { totalCustomers: 200 },
    operationalAnalytics: { currentStats: { activeTables: 20 } },
  }),
}));

// Setup express app
app.use(cors());
app.use(express.json());
app.use("/analytics", analyticsRouter);

// Add a 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse("error", "Endpoint not found"));
});

describe("Analytics Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Route existence tests", () => {
    it("should have a route for dashboard summary", async () => {
      const response = await request(app).get("/analytics/dashboard-summary");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("todayRevenue");
    });

    it("should have a route for revenue analytics", async () => {
      const response = await request(app).get("/analytics/revenue");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("totalRevenue");
    });

    it("should have a route for menu item analytics", async () => {
      const response = await request(app).get("/analytics/menu-items");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("topItems");
    });

    it("should have a route for reservation analytics", async () => {
      const response = await request(app).get("/analytics/reservations");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("totalReservations");
    });

    it("should have a route for order status analytics", async () => {
      const response = await request(app).get("/analytics/orders");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("ordersByStatus");
    });

    it("should have a route for customer analytics", async () => {
      const response = await request(app).get("/analytics/customers");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("totalCustomers");
    });

    it("should have a route for operational analytics", async () => {
      const response = await request(app).get("/analytics/operational");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("currentStats");
    });

    it("should have a route for all analytics", async () => {
      const response = await request(app).get("/analytics/all");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("dashboardSummary");
      expect(response.body.data).toHaveProperty("revenueAnalytics");
      expect(response.body.data).toHaveProperty("menuItemAnalytics");
      expect(response.body.data).toHaveProperty("reservationAnalytics");
      expect(response.body.data).toHaveProperty("orderStatusAnalytics");
      expect(response.body.data).toHaveProperty("customerAnalytics");
      expect(response.body.data).toHaveProperty("operationalAnalytics");
    });

    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/analytics/nonexistent-route");
      expect(response.status).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("Query parameter handling", () => {
    it("should handle days parameter for revenue analytics", async () => {
      await request(app).get("/analytics/revenue?days=60");
      expect(
        require("../../app/services/analytics.service").getRevenueAnalytics
      ).toHaveBeenCalledWith(60);
    });

    it("should handle days parameter for menu item analytics", async () => {
      await request(app).get("/analytics/menu-items?days=45");
      expect(
        require("../../app/services/analytics.service").getMenuItemAnalytics
      ).toHaveBeenCalledWith(45);
    });
  });

  describe("Response structure", () => {
    it("should return a properly structured response for revenue analytics", async () => {
      const response = await request(app).get("/analytics/revenue");

      expect(response.body).toMatchObject({
        status: "success",
        message: "Revenue analytics retrieved successfully",
        data: {
          totalRevenue: expect.any(Number),
          dailyRevenue: expect.any(Object),
          weeklyRevenue: expect.any(Object),
          revenueByPaymentMethod: expect.any(Object),
          revenueByDeliveryMethod: expect.any(Object),
          averageOrderValue: expect.any(Number),
        },
      });
    });

    it("should return a properly structured response for dashboard summary", async () => {
      const response = await request(app).get("/analytics/dashboard-summary");

      expect(response.body).toMatchObject({
        status: "success",
        message: "Dashboard summary retrieved successfully",
        data: {
          todayRevenue: expect.any(Number),
          todayOrders: expect.any(Number),
          revenueChange: expect.any(Number),
          activeOrdersCount: expect.any(Number),
          todayReservationsCount: expect.any(Number),
        },
      });
    });
  });
});
