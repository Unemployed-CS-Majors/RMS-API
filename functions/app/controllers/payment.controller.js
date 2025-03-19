const { logger } = require("../logger/FirebaseLogger");
const OrderService = require("../services/order.service");
const StripeService = require("../services/stripe.service");
const { db } = require("../config/firebase.config");
const { createResponse } = require("../utils/response.utils");
const EmailService = require("../services/email.service");
const UserService = require("../services/user.service");
/**
 * Controller for handling payment-related endpoints
 */
class PaymentController {
  /**
   * Handle Stripe webhook events
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async handleWebhook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];

      // Parse the event
      const event = await StripeService.handleWebhookEvent(req.rawBody, sig);

      // Handle different event types
      switch (event.type) {
      case "payment_intent.succeeded":
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await this.handlePaymentIntentFailed(event.data.object);
        break;

      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        logger.log("info", `Unhandled Stripe event type: ${event.type}`);
      }

      // Return success response
      return res
        .status(200)
        .json(createResponse("success", "Webhook received", { received: true }));
    } catch (error) {
      logger.log("error", `Error handling webhook: ${error.message}`);
      return res.status(400).json(createResponse("error", "Error while receiving webhook", error));
    }
  }

  /**
   * Handle Stripe payment intent succeeded event
   *
   * @param {Object} paymentIntent - The payment intent object
   */
  static async handlePaymentIntentSucceeded(paymentIntent) {
    try {
      logger.log("info", `Payment intent succeeded: ${paymentIntent.id}`);

      // Update the order status to PAID
      await OrderService.handleSuccessfulPayment(paymentIntent.id);
    } catch (error) {
      logger.log("error", `Error handling payment intent succeeded: ${error.message}`);
    }
  }

  /**
   * Handle Stripe payment intent failed event
   *
   * @param {Object} paymentIntent - The payment intent object
   */
  static async handlePaymentIntentFailed(paymentIntent) {
    try {
      logger.log("info", `Payment intent failed: ${paymentIntent.id}`);

      // Query for the order with this payment intent
      const querySnapshot = await db
        .collection("orders")
        .where("paymentIntentId", "==", paymentIntent.id)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        logger.log("warning", `No order found with payment intent ${paymentIntent.id}`);
        return;
      }

      const orderId = querySnapshot.docs[0].id;

      // Update the order status to CANCELED with reason
      await OrderService.updateOrderStatus(orderId, "canceled", {
        cancelReason: "Payment failed",
      });
    } catch (error) {
      logger.log("error", `Error handling payment intent failed: ${error.message}`);
    }
  }

  /**
   * Handle Stripe checkout session completed event
   *
   * @param {Object} session - The checkout session object
   */
  static async handleCheckoutSessionCompleted(session) {
    try {
      logger.log("info", `Checkout session completed: ${session.id}`);

      // Check if the payment was successful
      if (session.payment_status === "paid") {
        // Update the order status to PAID
        await OrderService.handleSuccessfulPayment(session.payment_intent);
      }
    } catch (error) {
      logger.log("error", `Error handling checkout session completed: ${error.message}`);
    }
  }

  /**
   * Handle successful payment redirect from Stripe
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async handlePaymentSuccess(req, res) {
    try {
      const { session_id: sessionId } = req.query;

      if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
      }

      logger.log(`Processing successful payment for session: ${sessionId}`);

      // Retrieve the session from Stripe
      const session = await StripeService.retrieveCheckoutSession(sessionId);

      // First try to find order by checkout session ID
      let querySnapshot = await db
        .collection("orders")
        .where("checkoutSessionId", "==", sessionId)
        .limit(1)
        .get();

      // If not found, try to find by payment intent ID
      if (querySnapshot.empty && session.payment_intent) {
        logger.error(
          `No order found with session ID ${sessionId}, trying payment intent ${session.payment_intent}`,
        );
        querySnapshot = await db
          .collection("orders")
          .where("paymentIntentId", "==", session.payment_intent)
          .limit(1)
          .get();
      }

      // If still not found, look in metadata
      if (querySnapshot.empty && session.metadata && session.metadata.orderId) {
        logger.log(
          `No order found with payment intent, trying metadata orderId: ${session.metadata.orderId}`,
        );
        querySnapshot = await db
          .collection("orders")
          .where("__name__", "==", session.metadata.orderId)
          .limit(1)
          .get();
      }

      // If no order is found, return an error
      if (querySnapshot.empty) {
        logger.error(
          `No order found for session ${sessionId} or payment intent ${session.payment_intent}`,
        );
        return res
          .status(404)
          .json(
            createResponse(
              "error",
              "No order found for this payment session. Please contact support with reference: ${session_id}",
              { session_id: sessionId },
            ),
          );
      }

      // Get the order ID and update the order
      const orderId = querySnapshot.docs[0].id;
      logger.log(`Found order: ${orderId}`);

      // Check if the payment was successful and update the order
      if (session.payment_status === "paid") {
        await OrderService.updateOrderStatus(orderId, "paid", {
          paymentConfirmedAt: Date.now(),
          paymentIntentId: session.payment_intent, // Ensure it's saved
          checkoutSessionId: sessionId, // Ensure it's saved
        });
        try {
          const user = await UserService.getUser(querySnapshot.docs[0].data().userId);
          const order = OrderService.getOrderById(orderId);
          await EmailService.sendOrderPaymentReceivedEmail(user, order);
        } catch (error) {
          logger.error("Error sending email", error);
        }

        // Redirect to a success page (can be configured as needed)
        return res.redirect(
          `https://restaurant-management-sy-1a0cd.web.app/profile#orders?order=${orderId}`,
        );
      } else {
        // If payment wasn't successful for some reason
        logger.warn(`Payment not marked as paid for session ${sessionId}`);
        return res.redirect(
          `https://restaurant-management-sy-1a0cd.web.app/profile#orders?order=${orderId}`,
        );
      }
    } catch (error) {
      logger.error("Error handling payment success", error);
      return res.status(500).json(createResponse("error", "Error while receiving order", error));
    }
  }

  /**
   * Handle canceled payment from Stripe
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async handlePaymentCancel(req, res) {
    try {
      // The order ID might be in the query parameters if we added it to the cancel URL
      const { orderId } = req.query;

      if (orderId) {
        // Update the order status to indicate payment was canceled
        await OrderService.updateOrderStatus(orderId, "pending_payment", {
          paymentNote: "Payment was canceled",
        });
      }

      // Redirect to a page indicating payment was canceled
      return res.redirect("/order/canceled");
    } catch (error) {
      logger.log("error", `Error handling payment cancel: ${error.message}`);
      return res.status(500).json(createResponse("error", "Error while receiving order", error));
    }
  }
}

module.exports = PaymentController;
