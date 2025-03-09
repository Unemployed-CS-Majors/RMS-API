const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const PaymentController = require("../controllers/payment.controller");

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     description: Endpoint for handling Stripe webhook events.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event received and processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *       400:
 *         description: Invalid webhook signature or payload
 */
router.post("/webhook", PaymentController.handleWebhook);

/**
 * @swagger
 * /payments/success:
 *   get:
 *     summary: Payment success redirect
 *     description: Endpoint for handling successful payment redirects from Stripe.
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         description: The Stripe Checkout Session ID.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to success page
 *       400:
 *         description: Missing session ID
 *       500:
 *         description: Error processing successful payment
 */
router.get("/success", PaymentController.handlePaymentSuccess);

/**
 * @swagger
 * /payments/cancel:
 *   get:
 *     summary: Payment cancel redirect
 *     description: Endpoint for handling canceled payment redirects from Stripe.
 *     parameters:
 *       - in: query
 *         name: orderId
 *         description: The order ID (if available).
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to cancellation page
 *       500:
 *         description: Error processing payment cancellation
 */
router.get("/cancel", PaymentController.handlePaymentCancel);

module.exports = router;