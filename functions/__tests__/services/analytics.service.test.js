// __tests__/services/analytics.service.test.js
const AnalyticsService = require("../../app/services/analytics.service");
const { db } = require("../../app/config/firebase.config");
const { OrderStatus, DeliveryMethod, PaymentMethod } = require("../../app/models/order.model");
const { ReservationStatus } = require("../../app/models/reservation.model");
const TableService = require("../../app/services/table.service");

// Mock dependencies
jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock("../../app/services/table.service");

describe("Analytics Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRevenueAnalytics", () => {
    it("should return revenue analytics for completed orders within the given time period", async () => {
      // Mock data
      const days = 30;

      const mockOrdersData = [
        {
          id: "order1",
          userId: "user1",
          total: 50.99,
          createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
          paymentMethod: PaymentMethod.ONLINE,
          deliveryMethod: DeliveryMethod.HOME_DELIVERY,
          status: OrderStatus.COMPLETED,
        },
        {
          id: "order2",
          userId: "user2",
          total: 35.5,
          createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
          updatedAt: Date.now() - 9 * 24 * 60 * 60 * 1000, // 9 days ago
          paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
          deliveryMethod: DeliveryMethod.HOME_DELIVERY,
          status: OrderStatus.COMPLETED,
        },
        {
          id: "order3",
          userId: "user3",
          total: 27.75,
          createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
          paymentMethod: PaymentMethod.IN_STORE,
          deliveryMethod: DeliveryMethod.PICKUP,
          status: OrderStatus.COMPLETED,
        },
      ];

      // Mock Firestore collections and queries
      const mockWhere = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue({
        empty: false,
        docs: mockOrdersData.map((order) => ({
          id: order.id,
          data: () => order,
        })),
        forEach: jest.fn((callback) => {
          mockOrdersData.forEach((order) => {
            callback({
              id: order.id,
              data: () => order,
            });
          });
        }),
      });

      db.collection.mockReturnValue({
        where: mockWhere,
        get: mockGet,
      });

      // Call the service
      const result = await AnalyticsService.getRevenueAnalytics(days);

      // Assertions
      expect(db.collection).toHaveBeenCalledWith("orders");
      expect(mockWhere).toHaveBeenCalledWith("status", "in", [OrderStatus.COMPLETED]);
      expect(mockWhere).toHaveBeenCalledWith("updatedAt", ">=", expect.any(Number));

      // Check the result structure
      expect(result).toHaveProperty("totalRevenue");
      expect(result).toHaveProperty("dailyRevenue");
      expect(result).toHaveProperty("weeklyRevenue");
      expect(result).toHaveProperty("revenueByPaymentMethod");
      expect(result).toHaveProperty("revenueByDeliveryMethod");
      expect(result).toHaveProperty("averageOrderValue");

      // Check the calculations
      expect(result.totalRevenue).toBeCloseTo(50.99 + 35.5 + 27.75);
      expect(result.averageOrderValue).toBeCloseTo((50.99 + 35.5 + 27.75) / 3);

      // Check payment method breakdown
      expect(result.revenueByPaymentMethod[PaymentMethod.ONLINE]).toBeCloseTo(50.99);
      expect(result.revenueByPaymentMethod[PaymentMethod.CASH_ON_DELIVERY]).toBeCloseTo(35.5);
      expect(result.revenueByPaymentMethod[PaymentMethod.IN_STORE]).toBeCloseTo(27.75);

      // Check delivery method breakdown
      expect(result.revenueByDeliveryMethod[DeliveryMethod.HOME_DELIVERY]).toBeCloseTo(
        50.99 + 35.5,
      );
      expect(result.revenueByDeliveryMethod[DeliveryMethod.PICKUP]).toBeCloseTo(27.75);
    });

    it("should return default values when no orders are found", async () => {
      // Mock empty result
      const mockGet = jest.fn().mockResolvedValue({
        empty: true,
        docs: [],
        forEach: jest.fn(),
      });

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: mockGet,
      });

      // Call the service
      const result = await AnalyticsService.getRevenueAnalytics(30);

      // Assertions
      expect(result.totalRevenue).toBe(0);
      expect(result.averageOrderValue).toBe(0);
      expect(Object.keys(result.dailyRevenue).length).toBe(0);
      expect(Object.keys(result.weeklyRevenue).length).toBe(0);
    });
  });

  describe("getMenuItemAnalytics", () => {
    it("should return menu item analytics with top and bottom items by quantity", async () => {
      // Mock menu items
      const mockMenuItems = [
        {
          id: "item1",
          name: "Burger",
          price: 10.99,
          avgWaitTime: 15,
          type: "main",
          totalQuantity: 0,
          totalRevenue: 0,
        },
        {
          id: "item2",
          name: "Pizza",
          price: 15.99,
          avgWaitTime: 20,
          type: "main",
          totalQuantity: 0,
          totalRevenue: 0,
        },
        {
          id: "item3",
          name: "Salad",
          price: 8.99,
          avgWaitTime: 10,
          type: "appetizer",
          totalQuantity: 0,
          totalRevenue: 0,
        },
      ];

      // Mock completed orders
      const mockOrders = [
        {
          id: "order1",
          status: OrderStatus.COMPLETED,
          items: [
            { id: "item1", quantity: 2, price: 10.99 },
            { id: "item2", quantity: 1, price: 15.99 },
          ],
          createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
          updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        },
        {
          id: "order2",
          status: OrderStatus.COMPLETED,
          items: [
            { id: "item1", quantity: 1, price: 10.99 },
            { id: "item3", quantity: 2, price: 8.99 },
          ],
          createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
          updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
        },
      ];

      // Mock Firestore for menu items
      const mockMenuItemsGet = jest.fn().mockResolvedValue({
        docs: mockMenuItems.map((item) => ({
          id: item.id,
          data: () => item,
        })),
        forEach: jest.fn((callback) => {
          mockMenuItems.forEach((item) => {
            callback({
              id: item.id,
              data: () => item,
            });
          });
        }),
      });

      // Mock Firestore for orders
      const mockOrdersGet = jest.fn().mockResolvedValue({
        empty: false,
        docs: mockOrders.map((order) => ({
          id: order.id,
          data: () => order,
        })),
        forEach: jest.fn((callback) => {
          mockOrders.forEach((order) => {
            callback({
              id: order.id,
              data: () => order,
            });
          });
        }),
      });

      // Setup mocks
      db.collection.mockImplementation((collection) => {
        if (collection === "menuItems") {
          return { get: mockMenuItemsGet };
        } else if (collection === "orders") {
          return {
            where: jest.fn().mockReturnThis(),
            get: mockOrdersGet,
          };
        }
      });

      // Call the service
      const result = await AnalyticsService.getMenuItemAnalytics(30);

      // Assertions
      expect(db.collection).toHaveBeenCalledWith("menuItems");
      expect(db.collection).toHaveBeenCalledWith("orders");

      // Check the result structure
      expect(result).toHaveProperty("topItems");
      expect(result).toHaveProperty("bottomItems");
      expect(result).toHaveProperty("itemsByQuantity");
      expect(result).toHaveProperty("itemsByRevenue");
      expect(result).toHaveProperty("averagePreparationTime");

      // Check the calculations
      // Item1 should be most popular with 3 total quantity (2+1)
      // Item3 should be second with 2 total quantity
      // Item2 should be least popular with 1 total quantity
      expect(result.topItems[0].id).toBe("item1");
      expect(result.topItems[0].totalQuantity).toBe(3);

      expect(result.bottomItems[0].id).toBe("item2");
      expect(result.bottomItems[0].totalQuantity).toBe(1);

      // Average prep time: (15 + 20 + 10) / 3 = 15
      expect(result.averagePreparationTime).toBe(15);
    });
  });

  describe("getReservationAnalytics", () => {
    it("should return reservation analytics with status breakdown and table popularity", async () => {
      // Setup mock data with various states
      const mockReservations = [
        {
          id: "res1",
          userId: "user1",
          tableId: "table1",
          people: 4,
          startTime: Math.floor(Date.now() / 1000) - 24 * 60 * 60, // 1 day ago
          endTime: Math.floor(Date.now() / 1000) - 23 * 60 * 60, // 23 hours ago
          status: ReservationStatus.COMPLETED,
        },
        {
          id: "res2",
          userId: "user2",
          tableId: "table2",
          people: 2,
          startTime: Math.floor(Date.now() / 1000) - 48 * 60 * 60, // 2 days ago
          endTime: Math.floor(Date.now() / 1000) - 47 * 60 * 60, // 47 hours ago
          status: ReservationStatus.CONFIRMED,
        },
        {
          id: "res3",
          userId: "user3",
          tableId: "table1",
          people: 6,
          startTime: Math.floor(Date.now() / 1000) - 72 * 60 * 60, // 3 days ago
          endTime: Math.floor(Date.now() / 1000) - 71 * 60 * 60, // 71 hours ago
          status: ReservationStatus.CANCELLED,
        },
      ];

      // Mock tables
      const mockTables = {
        table1: { id: "table1", tabeleNum: 101 },
        table2: { id: "table2", tabeleNum: 102 },
      };

      // Mock TableService.getTable
      TableService.getTable.mockImplementation((tableId) => {
        return Promise.resolve(mockTables[tableId]);
      });

      // Mock Firestore for reservations
      const mockReservationsGet = jest.fn().mockResolvedValue({
        empty: false,
        docs: mockReservations.map((res) => ({
          id: res.id,
          data: () => res,
        })),
        forEach: jest.fn((callback) => {
          mockReservations.forEach((res) => {
            callback({
              id: res.id,
              data: () => res,
            });
          });
        }),
      });

      // Setup mocks
      db.collection.mockImplementation((collection) => {
        if (collection === "reservations") {
          return {
            where: jest.fn().mockReturnThis(),
            get: mockReservationsGet,
          };
        }
      });

      // Call the service
      const result = await AnalyticsService.getReservationAnalytics(30);

      // Assertions
      expect(db.collection).toHaveBeenCalledWith("reservations");

      // Check the result structure
      expect(result).toHaveProperty("totalReservations");
      expect(result).toHaveProperty("reservationsByStatus");
      expect(result).toHaveProperty("reservationsByDayOfWeek");
      expect(result).toHaveProperty("averagePartySize");
      expect(result).toHaveProperty("tablePopularity");
      expect(result).toHaveProperty("cancellationRate");

      // Check the calculations
      expect(result.totalReservations).toBe(3);

      // Status breakdown
      expect(result.reservationsByStatus[ReservationStatus.COMPLETED]).toBe(1);
      expect(result.reservationsByStatus[ReservationStatus.CONFIRMED]).toBe(1);
      expect(result.reservationsByStatus[ReservationStatus.CANCELLED]).toBe(1);

      // Average party size: (4 + 2 + 6) / 3 = 4
      expect(result.averagePartySize).toBe(4);

      // Table popularity: table1 has 2 reservations, table2 has 1
      expect(result.tablePopularity["101"]).toBe(2);
      expect(result.tablePopularity["102"]).toBe(1);

      // Cancellation rate: 1/3 = 0.333...
      expect(result.cancellationRate).toBeCloseTo(1 / 3);
    });
  });
});
