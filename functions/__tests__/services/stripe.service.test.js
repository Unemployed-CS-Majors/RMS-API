// __tests__/services/stripe.service.test.js
const StripeService = require("../../app/services/stripe.service");
const { Order } = require("../../app/models/order.model");
const stripe = require("../../app/config/stripe.config");

jest.mock("../../app/config/stripe.config");
jest.mock("../../app/logger/FirebaseLogger");

describe("Stripe Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPaymentIntent", () => {
    it("creates a payment intent successfully", async () => {
      const order = new Order(
        null,
        "user1",
        [
          {
            id: "item1",
            quantity: 2,
            price: 10.99,
          },
        ],
        21.98,
        1.76,
        5.0,
        28.74,
        "home_delivery",
        "online"
      );
      const mockPaymentIntent = { id: "pi_123", amount: 2874, currency: "usd" };
      stripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const result = await StripeService.createPaymentIntent(order);

      expect(result).toEqual(mockPaymentIntent);
      expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 2874,
          currency: "usd",
        })
      );
    });

    it("throws an error if payment intent creation fails", async () => {
      const order = new Order(
        null,
        "user1",
        [
          {
            id: "item1",
            quantity: 2,
            price: 10.99,
          },
        ],
        21.98,
        1.76,
        5.0,
        28.74,
        "home_delivery",
        "online"
      );
      stripe.paymentIntents.create.mockRejectedValue(new Error("Failed to create payment intent"));

      await expect(StripeService.createPaymentIntent(order)).rejects.toThrow(
        "Failed to create payment intent"
      );
    });
  });

  describe("retrievePaymentIntent", () => {
    it("retrieves a payment intent successfully", async () => {
      const mockPaymentIntent = { id: "pi_123", amount: 2874, currency: "usd" };
      stripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const result = await StripeService.retrievePaymentIntent("pi_123");

      expect(result).toEqual(mockPaymentIntent);
      expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith("pi_123");
    });

    it("throws an error if payment intent retrieval fails", async () => {
      stripe.paymentIntents.retrieve.mockRejectedValue(
        new Error("Failed to retrieve payment intent")
      );

      await expect(StripeService.retrievePaymentIntent("pi_123")).rejects.toThrow(
        "Failed to retrieve payment intent"
      );
    });
  });

  describe("confirmPaymentSuccess", () => {
    it("confirms payment success successfully", async () => {
      const mockPaymentIntent = { id: "pi_123", status: "succeeded" };
      stripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const result = await StripeService.confirmPaymentSuccess("pi_123");

      expect(result).toBe(true);
      expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith("pi_123");
    });

    it("returns false if payment is not successful", async () => {
      const mockPaymentIntent = { id: "pi_123", status: "requires_payment_method" };
      stripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const result = await StripeService.confirmPaymentSuccess("pi_123");

      expect(result).toBe(false);
    });

    it("throws an error if payment intent retrieval fails", async () => {
      stripe.paymentIntents.retrieve.mockRejectedValue(
        new Error("Failed to retrieve payment intent")
      );

      await expect(StripeService.confirmPaymentSuccess("pi_123")).resolves.toBe(false);
    });
  });

  describe("createCheckoutSession", () => {
    it("creates a checkout session successfully", async () => {
      const order = new Order(
        null,
        "user1",
        [
          {
            id: "item1",
            quantity: 2,
            price: 10.99,
          },
        ],
        21.98,
        1.76,
        5.0,
        28.74,
        "home_delivery",
        "online"
      );
      const mockSession = { id: "cs_123", url: "https://checkout.stripe.com/pay/cs_123" };
      stripe.checkout.sessions.create.mockResolvedValue(mockSession);

      const result = await StripeService.createCheckoutSession(
        order,
        "https://success.url",
        "https://cancel.url"
      );

      expect(result).toEqual(mockSession);
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          cancel_url: "https://cancel.url",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Menu Item" },
                unit_amount: 1099,
              },
              quantity: 2,
            },
            {
              price_data: { currency: "usd", product_data: { name: "Tax" }, unit_amount: 176 },
              quantity: 1,
            },
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Delivery Fee" },
                unit_amount: 500,
              },
              quantity: 1,
            },
          ],
          metadata: { orderId: null, userId: "user1" },
          mode: "payment",
          payment_method_types: ["card"],
          success_url: "https://success.url?session_id={CHECKOUT_SESSION_ID}",
        })
      );
    });

    it("throws an error if checkout session creation fails", async () => {
      const order = new Order(
        null,
        "user1",
        [
          {
            id: "item1",
            quantity: 2,
            price: 10.99,
          },
        ],
        21.98,
        1.76,
        5.0,
        28.74,
        "home_delivery",
        "online"
      );
      stripe.checkout.sessions.create.mockRejectedValue(
        new Error("Failed to create checkout session")
      );

      await expect(
        StripeService.createCheckoutSession(order, "https://success.url", "https://cancel.url")
      ).rejects.toThrow("Failed to create checkout session");
    });
  });

  describe("retrieveCheckoutSession", () => {
    it("retrieves a checkout session successfully", async () => {
      const mockSession = { id: "cs_123", url: "https://checkout.stripe.com/pay/cs_123" };
      stripe.checkout.sessions.retrieve.mockResolvedValue(mockSession);

      const result = await StripeService.retrieveCheckoutSession("cs_123");

      expect(result).toEqual(mockSession);
      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith("cs_123");
    });

    it("throws an error if checkout session retrieval fails", async () => {
      stripe.checkout.sessions.retrieve.mockRejectedValue(
        new Error("Failed to retrieve checkout session")
      );

      await expect(StripeService.retrieveCheckoutSession("cs_123")).rejects.toThrow(
        "Failed to retrieve checkout session"
      );
    });
  });

  describe("handleWebhookEvent", () => {
    it("handles a webhook event successfully", async () => {
      const payload = JSON.stringify({ id: "evt_123", type: "payment_intent.succeeded" });
      const signature = "t123";
      const mockEvent = { id: "evt_123", type: "payment_intent.succeeded" };
      stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = await StripeService.handleWebhookEvent(payload, signature);

      expect(result).toEqual(mockEvent);
      expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
        payload,
        signature,
        expect.any(String)
      );
    });

    it("throws an error if webhook event handling fails", async () => {
      const payload = JSON.stringify({ id: "evt_123", type: "payment_intent.succeeded" });
      const signature = "t123";
      stripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      await expect(StripeService.handleWebhookEvent(payload, signature)).rejects.toThrow(
        "Invalid signature"
      );
    });
  });
});
