// __tests__/models/order.model.test.js
const {
  Order,
  DeliveryMethod,
  PaymentMethod,
  OrderStatus,
} = require("../../app/models/order.model");
const MenuItemService = require("../../app/services/menuItem.service");

// Mock the MenuItemService
jest.mock("../../app/services/menuItem.service");
jest.mock("../../app/logger/FirebaseLogger", () => ({
  logger: {
    log: jest.fn(),
  },
}));

describe("Order Model", () => {
  const sampleOrderData = {
    id: "order123",
    userId: "user123",
    items: [
      { id: "item1", quantity: 2, price: 10.99 },
      { id: "item2", quantity: 1, price: 15.99 },
    ],
    subtotal: 37.97,
    tax: 3.04,
    deliveryFee: 5,
    total: 46.01,
    deliveryMethod: DeliveryMethod.HOME_DELIVERY,
    paymentMethod: PaymentMethod.ONLINE,
    status: OrderStatus.PENDING_PAYMENT,
    deliveryAddress: {
      street: "123 Main St",
      city: "Dublin",
      county: "Dublin",
      eirCode: "D01 AB12",
      country: "Ireland",
    },
    paymentIntentId: "pi_123456",
    createdAt: 1635789600000,
    updatedAt: 1635789600000,
    estimatedDeliveryTime: 1635793200000,
  };

  describe("Order constructor", () => {
    it("should create a new Order instance with provided values", () => {
      const order = new Order(
        sampleOrderData.id,
        sampleOrderData.userId,
        sampleOrderData.items,
        sampleOrderData.subtotal,
        sampleOrderData.tax,
        sampleOrderData.deliveryFee,
        sampleOrderData.total,
        sampleOrderData.deliveryMethod,
        sampleOrderData.paymentMethod,
        sampleOrderData.status,
        sampleOrderData.deliveryAddress,
        sampleOrderData.paymentIntentId,
        sampleOrderData.createdAt,
        sampleOrderData.updatedAt,
        sampleOrderData.estimatedDeliveryTime
      );

      expect(order.id).toBe(sampleOrderData.id);
      expect(order.userId).toBe(sampleOrderData.userId);
      expect(order.items).toEqual(sampleOrderData.items);
      expect(order.subtotal).toBe(sampleOrderData.subtotal);
      expect(order.tax).toBe(sampleOrderData.tax);
      expect(order.deliveryFee).toBe(sampleOrderData.deliveryFee);
      expect(order.total).toBe(sampleOrderData.total);
      expect(order.deliveryMethod).toBe(sampleOrderData.deliveryMethod);
      expect(order.paymentMethod).toBe(sampleOrderData.paymentMethod);
      expect(order.status).toBe(sampleOrderData.status);
      expect(order.deliveryAddress).toEqual(sampleOrderData.deliveryAddress);
      expect(order.paymentIntentId).toBe(sampleOrderData.paymentIntentId);
      expect(order.createdAt).toBe(sampleOrderData.createdAt);
      expect(order.updatedAt).toBe(sampleOrderData.updatedAt);
      expect(order.estimatedDeliveryTime).toBe(sampleOrderData.estimatedDeliveryTime);
    });

    it("should create a new Order instance with default values when not provided", () => {
      const order = new Order(
        null,
        sampleOrderData.userId,
        sampleOrderData.items,
        sampleOrderData.subtotal,
        sampleOrderData.tax,
        undefined, // should default to 0
        sampleOrderData.total,
        sampleOrderData.deliveryMethod,
        sampleOrderData.paymentMethod
      );

      expect(order.id).toBeNull();
      expect(order.deliveryFee).toBe(0);
      expect(order.status).toBe(OrderStatus.PENDING_PAYMENT);
      expect(order.deliveryAddress).toBeNull();
      expect(order.paymentIntentId).toBeNull();
      expect(order.createdAt).toBeNull();
      expect(order.updatedAt).toBeNull();
      expect(order.estimatedDeliveryTime).toBeNull();
    });
  });

  describe("toFirestore", () => {
    it("should convert Order instance to Firestore format", () => {
      const order = new Order(
        sampleOrderData.id,
        sampleOrderData.userId,
        sampleOrderData.items,
        sampleOrderData.subtotal,
        sampleOrderData.tax,
        sampleOrderData.deliveryFee,
        sampleOrderData.total,
        sampleOrderData.deliveryMethod,
        sampleOrderData.paymentMethod,
        sampleOrderData.status,
        sampleOrderData.deliveryAddress,
        sampleOrderData.paymentIntentId,
        sampleOrderData.createdAt,
        sampleOrderData.updatedAt,
        sampleOrderData.estimatedDeliveryTime
      );

      const firestoreData = order.toFirestore();

      expect(firestoreData).toEqual({
        userId: sampleOrderData.userId,
        items: sampleOrderData.items,
        subtotal: sampleOrderData.subtotal,
        tax: sampleOrderData.tax,
        deliveryFee: sampleOrderData.deliveryFee,
        total: sampleOrderData.total,
        deliveryMethod: sampleOrderData.deliveryMethod,
        estimatedDeliveryTime: sampleOrderData.estimatedDeliveryTime,
        paymentMethod: sampleOrderData.paymentMethod,
        status: sampleOrderData.status,
        deliveryAddress: sampleOrderData.deliveryAddress,
        paymentIntentId: sampleOrderData.paymentIntentId,
        createdAt: sampleOrderData.createdAt,
        updatedAt: expect.any(Number), // This should be updated to current time
      });

      // id should not be included in Firestore data
      expect(firestoreData.id).toBeUndefined();
    });

    it("should handle null values when converting to Firestore", () => {
      const order = new Order(
        null,
        sampleOrderData.userId,
        sampleOrderData.items,
        sampleOrderData.subtotal,
        sampleOrderData.tax,
        sampleOrderData.deliveryFee,
        sampleOrderData.total,
        sampleOrderData.deliveryMethod,
        sampleOrderData.paymentMethod
      );

      const firestoreData = order.toFirestore();

      expect(firestoreData.deliveryAddress).toBeUndefined();
      expect(firestoreData.paymentIntentId).toBeUndefined();
      expect(firestoreData.estimatedDeliveryTime).toBeUndefined();
      expect(firestoreData.createdAt).toEqual(expect.any(Number));
    });
  });

  describe("fromFirestore", () => {
    it("should create an Order instance from Firestore snapshot", () => {
      const snapshot = {
        id: sampleOrderData.id,
        data: () => ({
          userId: sampleOrderData.userId,
          items: sampleOrderData.items,
          subtotal: sampleOrderData.subtotal,
          tax: sampleOrderData.tax,
          deliveryFee: sampleOrderData.deliveryFee,
          total: sampleOrderData.total,
          deliveryMethod: sampleOrderData.deliveryMethod,
          paymentMethod: sampleOrderData.paymentMethod,
          status: sampleOrderData.status,
          deliveryAddress: sampleOrderData.deliveryAddress,
          paymentIntentId: sampleOrderData.paymentIntentId,
          createdAt: sampleOrderData.createdAt,
          updatedAt: sampleOrderData.updatedAt,
          estimatedDeliveryTime: sampleOrderData.estimatedDeliveryTime,
        }),
      };

      const order = Order.fromFirestore(snapshot);

      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBe(sampleOrderData.id);
      expect(order.userId).toBe(sampleOrderData.userId);
      expect(order.items).toEqual(sampleOrderData.items);
      expect(order.subtotal).toBe(sampleOrderData.subtotal);
      expect(order.tax).toBe(sampleOrderData.tax);
      expect(order.deliveryFee).toBe(sampleOrderData.deliveryFee);
      expect(order.total).toBe(sampleOrderData.total);
      expect(order.deliveryMethod).toBe(sampleOrderData.deliveryMethod);
      expect(order.paymentMethod).toBe(sampleOrderData.paymentMethod);
      expect(order.status).toBe(sampleOrderData.status);
      expect(order.deliveryAddress).toEqual(sampleOrderData.deliveryAddress);
      expect(order.paymentIntentId).toBe(sampleOrderData.paymentIntentId);
      expect(order.createdAt).toBe(sampleOrderData.createdAt);
      expect(order.updatedAt).toBe(sampleOrderData.updatedAt);
      expect(order.estimatedDeliveryTime).toBe(sampleOrderData.estimatedDeliveryTime);
    });

    it("should handle missing optional fields in Firestore snapshot", () => {
      const snapshot = {
        id: "order456",
        data: () => ({
          userId: "user456",
          items: [{ id: "item3", quantity: 1, price: 12.99 }],
          subtotal: 12.99,
          tax: 1.04,
          total: 14.03,
          deliveryMethod: DeliveryMethod.PICKUP,
          paymentMethod: PaymentMethod.IN_STORE,
          status: OrderStatus.PAID,
          // Missing other optional fields
        }),
      };

      const order = Order.fromFirestore(snapshot);

      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBe("order456");
      expect(order.deliveryFee).toBe(0); // Default value
      expect(order.deliveryAddress).toBeNull();
      expect(order.paymentIntentId).toBeNull();
      expect(order.createdAt).toBeNull();
      expect(order.updatedAt).toBeNull();
      expect(order.estimatedDeliveryTime).toBeNull();
    });
  });

  describe("fromRequestBody", () => {
    it("should create an Order instance from request body data", () => {
      const requestData = {
        items: [
          { id: "item1", quantity: 2, price: 10.99 },
          { id: "item2", quantity: 1, price: 15.99 },
        ],
        deliveryMethod: DeliveryMethod.HOME_DELIVERY,
        paymentMethod: PaymentMethod.ONLINE,
        deliveryAddress: {
          street: "123 Main St",
          city: "Dublin",
          county: "Dublin",
          eirCode: "D01 AB12",
          country: "Ireland",
        },
      };
      const userId = "user789";

      const order = Order.fromRequestBody(requestData, userId);

      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBeNull();
      expect(order.userId).toBe(userId);
      expect(order.items).toEqual(requestData.items);
      expect(order.subtotal).toBeCloseTo(37.97, 2);
      expect(order.tax).toBeCloseTo(3.04, 2);
      expect(order.deliveryFee).toBe(5);
      expect(order.total).toBeCloseTo(46.01, 2);
      expect(order.deliveryMethod).toBe(DeliveryMethod.HOME_DELIVERY);
      expect(order.paymentMethod).toBe(PaymentMethod.ONLINE);
      expect(order.status).toBe(OrderStatus.PENDING_PAYMENT);
      expect(order.deliveryAddress).toEqual(requestData.deliveryAddress);
      expect(order.paymentIntentId).toBeNull();
      expect(order.createdAt).toBeNull();
      expect(order.updatedAt).toBeNull();
      expect(order.estimatedDeliveryTime).toBeNull();
    });

    it("should calculate zero delivery fee for pickup orders", () => {
      const requestData = {
        items: [{ id: "item1", quantity: 1, price: 10.99 }],
        deliveryMethod: DeliveryMethod.PICKUP,
        paymentMethod: PaymentMethod.IN_STORE,
      };
      const userId = "user789";

      const order = Order.fromRequestBody(requestData, userId);

      expect(order.deliveryFee).toBe(0);
      expect(order.total).toBeCloseTo(11.87, 2); // 10.99 + (10.99*0.08)
    });
  });

  describe("validate", () => {
    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();

      // Mock the MenuItemService.getMenuItemById method
      MenuItemService.getMenuItemById.mockImplementation((id) => {
        const menuItems = {
          item1: { id: "item1", price: 10.99 },
          item2: { id: "item2", price: 15.99 },
        };
        return Promise.resolve(menuItems[id] || null);
      });
    });

    it("should validate a valid home delivery order", async () => {
      const order = new Order(
        null,
        "user123",
        [
          { id: "item1", quantity: 2, price: 10.99 },
          { id: "item2", quantity: 1, price: 15.99 },
        ],
        37.97,
        3.04,
        5,
        46.01,
        DeliveryMethod.HOME_DELIVERY,
        PaymentMethod.ONLINE,
        OrderStatus.PENDING_PAYMENT,
        {
          street: "123 Main St",
          city: "Dublin",
          county: "Dublin",
          eirCode: "D01 AB12",
          country: "Ireland",
        }
      );

      const result = await order.validate();
      expect(result.isValid).toBe(true);
      expect(MenuItemService.getMenuItemById).toHaveBeenCalledTimes(2);
    });

    it("should validate a valid pickup order", async () => {
      const order = new Order(
        null,
        "user123",
        [{ id: "item1", quantity: 2, price: 10.99 }],
        21.98,
        1.76,
        0,
        23.74,
        DeliveryMethod.PICKUP,
        PaymentMethod.IN_STORE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(true);
      expect(MenuItemService.getMenuItemById).toHaveBeenCalledTimes(1);
    });

    it("should reject order with missing required fields", async () => {
      const order = new Order(
        null,
        "user123",
        [], // Empty items array
        0,
        0,
        0,
        0,
        DeliveryMethod.HOME_DELIVERY,
        PaymentMethod.ONLINE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Missing required order fields");
      expect(MenuItemService.getMenuItemById).not.toHaveBeenCalled();
    });

    it("should reject order with invalid item structure", async () => {
      const order = new Order(
        null,
        "user123",
        [
          { id: "item1" }, // Missing quantity and price
        ],
        10.99,
        0.88,
        0,
        11.87,
        DeliveryMethod.PICKUP,
        PaymentMethod.IN_STORE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid item structure in order");
    });

    it("should reject order with invalid menu item ID", async () => {
      // Mock the MenuItemService to return null for an invalid ID
      MenuItemService.getMenuItemById.mockResolvedValueOnce(null);

      const order = new Order(
        null,
        "user123",
        [{ id: "invalid-item", quantity: 1, price: 10.99 }],
        10.99,
        0.88,
        0,
        11.87,
        DeliveryMethod.PICKUP,
        PaymentMethod.IN_STORE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid menu item ID");
    });

    it("should reject order with incorrect price for menu item", async () => {
      const order = new Order(
        null,
        "user123",
        [
          { id: "item1", quantity: 1, price: 9.99 }, // Price doesn't match mocked menu item (10.99)
        ],
        9.99,
        0.8,
        0,
        10.79,
        DeliveryMethod.PICKUP,
        PaymentMethod.IN_STORE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid price for menu item");
    });

    it("should reject order with negative price or quantity", async () => {
      const order = new Order(
        null,
        "user123",
        [{ id: "item1", quantity: -1, price: 10.99 }],
        -10.99,
        0.88,
        0,
        -10.11,
        DeliveryMethod.PICKUP,
        PaymentMethod.IN_STORE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid price or quantity");
    });

    it("should reject home delivery order without delivery address", async () => {
      const order = new Order(
        null,
        "user123",
        [{ id: "item1", quantity: 1, price: 10.99 }],
        10.99,
        0.88,
        5,
        16.87,
        DeliveryMethod.HOME_DELIVERY,
        PaymentMethod.ONLINE,
        OrderStatus.PENDING_PAYMENT,
        null // Missing delivery address
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Delivery address is required for home delivery");
    });

    it("should reject home delivery order with incomplete address", async () => {
      const order = new Order(
        null,
        "user123",
        [{ id: "item1", quantity: 1, price: 10.99 }],
        10.99,
        0.88,
        5,
        16.87,
        DeliveryMethod.HOME_DELIVERY,
        PaymentMethod.ONLINE,
        OrderStatus.PENDING_PAYMENT,
        {
          street: "123 Main St",
          // Missing city, county, etc.
        }
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Incomplete delivery address");
    });

    it("should reject order with invalid payment method for delivery method", async () => {
      const order = new Order(
        null,
        "user123",
        [{ id: "item1", quantity: 1, price: 10.99 }],
        10.99,
        0.88,
        5,
        16.87,
        DeliveryMethod.HOME_DELIVERY,
        PaymentMethod.IN_STORE // Invalid for home delivery
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid payment method for home delivery");
    });

    it("should reject order with invalid delivery method", async () => {
      const order = new Order(
        null,
        "user123",
        [{ id: "item1", quantity: 1, price: 10.99 }],
        10.99,
        0.88,
        0,
        11.87,
        "invalid_delivery_method", // Invalid delivery method
        PaymentMethod.ONLINE
      );

      const result = await order.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid delivery method");
    });
  });

  describe("Enum values", () => {
    it("should have the correct DeliveryMethod values", () => {
      expect(DeliveryMethod.HOME_DELIVERY).toBe("home_delivery");
      expect(DeliveryMethod.PICKUP).toBe("pickup");
    });

    it("should have the correct PaymentMethod values", () => {
      expect(PaymentMethod.ONLINE).toBe("online");
      expect(PaymentMethod.CASH_ON_DELIVERY).toBe("cash_on_delivery");
      expect(PaymentMethod.IN_STORE).toBe("in_store");
    });

    it("should have the correct OrderStatus values", () => {
      expect(OrderStatus.PENDING_PAYMENT).toBe("pending_payment");
      expect(OrderStatus.PAID).toBe("paid");
      expect(OrderStatus.IN_PROGRESS).toBe("in_progress");
      expect(OrderStatus.READY_FOR_PICKUP).toBe("ready_for_pickup");
      expect(OrderStatus.OUT_FOR_DELIVERY).toBe("out_for_delivery");
      expect(OrderStatus.COMPLETED).toBe("completed");
      expect(OrderStatus.CANCELED).toBe("canceled");
    });
  });
});
