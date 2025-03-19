// functions/app/config/stripe.config.js
const { logger } = require("../logger/FirebaseLogger");
let stripe;

try {
  if (!process.env.STRIPE_SECRET_KEY) {
    logger.log("error", "STRIPE_SECRET_KEY environment variable is not set");
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  logger.log("info", "Stripe initialized successfully");
} catch (error) {
  logger.log("error", `Failed to initialize Stripe: ${error.message}`);
  // Initialize with a placeholder that will throw clearer errors if used
  stripe = {
    paymentIntents: {
      create: () => {
        throw new Error("Stripe not properly initialized. Check your STRIPE_SECRET_KEY.");
      },
      retrieve: () => {
        throw new Error("Stripe not properly initialized. Check your STRIPE_SECRET_KEY.");
      },
    },
    checkout: {
      sessions: {
        create: () => {
          throw new Error("Stripe not properly initialized. Check your STRIPE_SECRET_KEY.");
        },
        retrieve: () => {
          throw new Error("Stripe not properly initialized. Check your STRIPE_SECRET_KEY.");
        },
      },
    },
    webhooks: {
      constructEvent: () => {
        throw new Error("Stripe not properly initialized. Check your STRIPE_SECRET_KEY.");
      },
    },
  };
}

module.exports = stripe;
