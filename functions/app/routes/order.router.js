const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isEmployee } = require("../middlewares/privilages.middleware");

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     description: Creates a new order with specified items, delivery method, and payment method.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - deliveryMethod
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Menu item ID
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the item
 *                     price:
 *                       type: number
 *                       description: Price of the item
 *                     name:
 *                       type: string
 *                       description: Name of the item
 *               deliveryMethod:
 *                 type: string
 *                 enum: [home_delivery, pickup]
 *                 description: Method of delivery
 *               paymentMethod:
 *                 type: string
 *                 enum: [online, cash_on_delivery, in_store]
 *                 description: Method of payment
 *               deliveryAddress:
 *                 type: object
 *                 description: Required for home_delivery
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                 subtotal:
 *                   type: number
 *                 tax:
 *                   type: number
 *                 deliveryFee:
 *                   type: number
 *                 total:
 *                   type: number
 *                 deliveryMethod:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *                 status:
 *                   type: string
 *                 redirectUrl:
 *                   type: string
 *                   description: URL to redirect for online payment (if applicable)
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", verifyIdToken, OrderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Order]
 *     description: Retrieves all orders for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of orders to return
 *     responses:
 *       200:
 *         description: A list of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                   subtotal:
 *                     type: number
 *                   tax:
 *                     type: number
 *                   deliveryFee:
 *                     type: number
 *                   total:
 *                     type: number
 *                   deliveryMethod:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyIdToken, OrderController.getUserOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
 *     description: Retrieves a specific order by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                 subtotal:
 *                   type: number
 *                 tax:
 *                   type: number
 *                 deliveryFee:
 *                   type: number
 *                 total:
 *                   type: number
 *                 deliveryMethod:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.get("/:orderId", verifyIdToken, OrderController.getOrder);

/**
 * @swagger
 * /order/{orderId}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Order]
 *     description: Cancels an existing order if it's in a cancellable state.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to cancel.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancelReason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [canceled]
 *                 cancelReason:
 *                   type: string
 *       400:
 *         description: Order cannot be canceled in its current state
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.post("/:orderId/cancel", verifyIdToken, OrderController.cancelOrder);

/**
 * @swagger
 * /order/{orderId}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Order]
 *     description: Updates the status of an order (restaurant employees only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending_payment, paid, in_progress, ready_for_pickup, out_for_delivery, completed, canceled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status or status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a restaurant employee
 *       404:
 *         description: Order not found
 */
router.patch("/:orderId/status", verifyIdToken, isEmployee, OrderController.updateOrderStatus);

/**
 * @swagger
 * /order/employee/active:
 *   get:
 *     summary: Get active orders
 *     tags: [Order]
 *     description: Retrieves all active orders (restaurant employees only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of orders to return
 *     responses:
 *       200:
 *         description: List of active orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a restaurant employee
 */
router.get("/employee/active", verifyIdToken, isEmployee, OrderController.getActiveOrders);

/**
 * @swagger
 * /order/employee/all:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     description: Retrieves all orders (restaurant employees only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of orders to return
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a restaurant employee
 */
router.get("/employee/all", verifyIdToken, isEmployee, OrderController.getAllOrders);

/**
 * @swagger
 * /order/employee/status/{status}:
 *   get:
 *     summary: Get orders by status
 *     tags: [Order]
 *     description: Retrieves all orders with a specific status (restaurant employees only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: The status to filter by.
 *         schema:
 *           type: string
 *           enum: [pending_payment, paid, in_progress, ready_for_pickup, out_for_delivery, completed, canceled]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of orders to return
 *     responses:
 *       200:
 *         description: List of orders with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: number
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a restaurant employee
 */
router.get(
  "/employee/status/:status",
  verifyIdToken,
  isEmployee,
  OrderController.getOrdersByStatus,
);

module.exports = router;
