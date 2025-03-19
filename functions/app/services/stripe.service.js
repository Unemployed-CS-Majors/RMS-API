// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logger } = require("../logger/FirebaseLogger");
const stripe = require("../config/stripe.config");

/**
 * Service for handling Stripe payment operations
 */
class StripeService {
  /**
   * Creates a payment intent for an order
   *
   * @param {Order} order - The order to create a payment intent for
   * @param {string} currency - The currency to use (default: 'usd')
   * @returns {Object} Stripe payment intent data
   */
  static async createPaymentIntent(order, currency = "usd") {
    try {
      // Convert order total to cents for Stripe
      const amount = Math.round(order.total * 100);

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          orderId: order.id,
          userId: order.userId,
        },
      });

      logger.log("info", `Created payment intent ${paymentIntent.id} for order ${order.id}`);
      return paymentIntent;
    } catch (error) {
      logger.log("error", `Error creating payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves a payment intent by ID
   *
   * @param {string} paymentIntentId - The ID of the payment intent to retrieve
   * @returns {Object} Stripe payment intent data
   */
  static async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.log("error", `Error retrieving payment intent ${paymentIntentId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirms the payment intent was successful
   *
   * @param {string} paymentIntentId - The ID of the payment intent to confirm
   * @returns {boolean} True if payment is successful, false otherwise
   */
  static async confirmPaymentSuccess(paymentIntentId) {
    try {
      const paymentIntent = await this.retrievePaymentIntent(paymentIntentId);

      // Check if the payment is successful
      if (paymentIntent.status === "succeeded") {
        logger.log("info", `Payment ${paymentIntentId} confirmed as successful`);
        return true;
      }

      logger.log(
        "info",
        `Payment ${paymentIntentId} is not successful. Status: ${paymentIntent.status}`
      );
      return false;
    } catch (error) {
      logger.log("error", `Error confirming payment success: ${error.message}`);
      return false;
    }
  }

  /**
   * Create a checkout session for an order
   *
   * @param {Order} order - The order to create a checkout session for
   * @param {string} successUrl - URL to redirect to on successful payment
   * @param {string} cancelUrl - URL to redirect to on canceled payment
   * @returns {Object} Stripe checkout session data
   */
  static async createCheckoutSession(order, successUrl, cancelUrl) {
    try {
      // Transform order items to Stripe line items
      const lineItems = order.items.map((item) => {
        // Create a basic product data object with name
        const productData = {
          name: item.name || "Menu Item",
        };

        // Only add description if it exists and is not empty
        if (item.description && item.description.trim() !== "") {
          productData.description = item.description;
        }

        return {
          price_data: {
            currency: "usd",
            product_data: productData,
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      });

      // Add tax and delivery fee as separate line items if needed
      if (order.tax > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tax",
            },
            unit_amount: Math.round(order.tax * 100),
          },
          quantity: 1,
        });
      }

      if (order.deliveryFee > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Delivery Fee",
            },
            unit_amount: Math.round(order.deliveryFee * 100),
          },
          quantity: 1,
        });
      }

      // Create the session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          orderId: order.id,
          userId: order.userId,
        },
      });

      console.log(`Created checkout session ${session.id} for order ${order.id}`);
      return session;
    } catch (error) {
      console.error(`Error creating checkout session: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve a checkout session by ID
   *
   * @param {string} sessionId - The ID of the checkout session to retrieve
   * @returns {Object} Stripe checkout session data
   */
  static async retrieveCheckoutSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      logger.log("error", `Error retrieving checkout session ${sessionId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   *
   * @param {string} payload - The raw webhook payload
   * @param {string} signature - The Stripe signature header
   * @returns {Object} The parsed webhook event
   */
  static async handleWebhookEvent(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      logger.log("info", `Received Stripe webhook event: ${event.type}`);
      return event;
    } catch (error) {
      logger.log("error", `Webhook error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = StripeService;
