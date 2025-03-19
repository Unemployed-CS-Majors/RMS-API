// __tests__/controllers/payment.controller.test.js
const PaymentController = require("../../app/controllers/payment.controller");
const StripeService = require("../../app/services/stripe.service");
const OrderService = require("../../app/services/order.service");
const { mockRequest, mockResponse } = require("../helpers");
const { logger } = require("../../app/logger/FirebaseLogger");

jest.mock("../../app/services/stripe.service");
jest.mock("../../app/services/order.service");
jest.mock("../../app/services/email.service");
jest.mock("../../app/services/user.service");
jest.mock("../../app/logger/FirebaseLogger");
jest.mock("../../app/config/firebase.config");

describe("Payment Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handlePaymentSuccess", () => {
    it("returns 400 if session_id is missing", async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await PaymentController.handlePaymentSuccess(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Missing session ID" })
      );
    });

    it("returns 500 on error", async () => {
      const req = mockRequest({ query: { session_id: "cs_1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      StripeService.retrieveCheckoutSession.mockRejectedValue(error);

      await PaymentController.handlePaymentSuccess(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error handling payment success", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error while receiving order",
          data: error,
        })
      );
    });
  });

  describe("handlePaymentCancel", () => {
    it("handles payment cancel and redirects to cancel page", async () => {
      const req = mockRequest({ query: { orderId: "order1" } });
      const res = mockResponse();

      await PaymentController.handlePaymentCancel(req, res);

      expect(OrderService.updateOrderStatus).toHaveBeenCalledWith("order1", "pending_payment", {
        paymentNote: "Payment was canceled",
      });
      expect(res.redirect).toHaveBeenCalledWith("/order/canceled");
    });

    it("redirects to cancel page if orderId is missing", async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await PaymentController.handlePaymentCancel(req, res);

      expect(res.redirect).toHaveBeenCalledWith("/order/canceled");
    });

    it("returns 500 on error", async () => {
      const req = mockRequest({ query: { orderId: "order1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      OrderService.updateOrderStatus.mockRejectedValue(error);

      await PaymentController.handlePaymentCancel(req, res);

      expect(logger.log).toHaveBeenCalledWith(
        "error",
        `Error handling payment cancel: ${error.message}`
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error while receiving order",
          data: error,
        })
      );
    });
  });
});
