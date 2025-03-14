const { logger } = require("../logger/FirebaseLogger");
const { Order, OrderStatus, DeliveryMethod, PaymentMethod } = require("../models/order.model");
const OrderService = require("../services/order.service");
const UserService = require("../services/user.service");
const {createResponse} = require("../utils/response.utils");
const EmailService = require("../services/email.service");
const isEmulator = process.env.FIREBASE_EMULATOR_HUB ? true : false;
/**
 * Controller for handling order-related endpoints
 */
class OrderController {
    /**
     * Creates a new order
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async createOrder(req, res) {
        try {
            const userId = await UserService.verifyUser(req);

            if (!req.body.items || !req.body.deliveryMethod || !req.body.paymentMethod) {
                return res.status(400).json({
                    error: "Missing required fields"
                });
            }

            if (req.body.deliveryMethod === DeliveryMethod.HOME_DELIVERY && !req.body.deliveryAddress) {
                return res.status(400).json({
                    error: "Delivery address is required for home delivery"
                });
            }

            const order = Order.fromRequestBody(req.body, userId);

            const validation =await order.validate();
            if (!validation.isValid) {
                return res.status(400).json({ error: validation.message });
            }

            // Save the order
            const createdOrder = await OrderService.createOrder(order);

            // Process payment if needed
            if (createdOrder.paymentMethod === PaymentMethod.ONLINE) {
                // Create success and cancel URLs
                const successUrl = isEmulator ? `http://127.0.0.1:5001/restaurant-management-sy-1a0cd/us-central1/api/payments/success` : `${req.protocol}://${req.get('host')}/payments/success`  ;
                const cancelUrl = isEmulator ? `http://127.0.0.1:5001/restaurant-management-sy-1a0cd/us-central1/api/payments/cancel` : `${req.protocol}://${req.get('host')}/payments/cancel`;
                logger.info(successUrl);
                logger.info(cancelUrl);
                // Process payment
                const paymentResult = await OrderService.processPayment(
                    createdOrder,
                    successUrl,
                    cancelUrl
                );

                // If redirect is required, provide the redirect URL
                if (paymentResult.requiresRedirect) {
                    return res.status(201).json({
                        orderId: createdOrder.id,
                        redirectUrl: paymentResult.redirectUrl
                    });
                }
            } else if (createdOrder.paymentMethod === PaymentMethod.IN_STORE) {
                // For in-store payment, keep status as PENDING_PAYMENT
                await OrderService.updateOrderStatus(
                    createdOrder.id,
                    OrderStatus.PENDING_PAYMENT
                );
            } else if (createdOrder.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
                // For cash on delivery, move to PAID status directly
                await OrderService.updateOrderStatus(
                    createdOrder.id,
                    OrderStatus.PAID
                );
            }
            const user = await UserService.getUser(userId);
            await EmailService.sendOrderPlacedEmail(user, order);

            return res.status(201).json(createResponse("success", "Order created successfully", createdOrder));
            
        } catch (error) {
            logger.log("error", `Error creating order: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error creating order", error.message));
        }
    }

    /**
     * Gets an order by ID
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getOrder(req, res) {
        try {
            const { orderId } = req.params;

            // Get the order
            const order = await OrderService.getOrderById(orderId);

            return res.status(200).json(createResponse("success", "Order retrieved successfully", order));
        } catch (error) {
            logger.log("error", `Error getting order: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error getting order", error.message));
        }
    }

    /**
     * Gets orders for the authenticated user
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getUserOrders(req, res) {
        try {
            const userId = await UserService.verifyUser(req);
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;

            // Get the user's orders
            const orders = await OrderService.getUserOrders(userId, limit);

            return res.status(200).json(createResponse("success", "Order retrieved successfully", orders));
        } catch (error) {
            logger.log("error", `Error getting user orders: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error getting order", error.message));
        }
    }

    /**
     * Updates an order's status (for restaurant employees)
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async updateOrderStatus(req, res) {
        try {
            // Check if user is a restaurant employee
            const { orderId } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json(createResponse("error", "Missing required fields"));
            }

            // For orders being marked as "IN_PROGRESS", set estimated delivery time
            let additionalData = {};
            if (status === OrderStatus.IN_PROGRESS) {
                // Get current order to determine delivery method
                const order = await OrderService.getOrderById(orderId);

                // Set estimated time based on delivery method
                // For pickup: 15-30 min; For delivery: 30-45 min
                const baseMinutes = order.deliveryMethod === DeliveryMethod.PICKUP ? 15 : 30;
                const randomAdd = Math.floor(Math.random() * 16); // 0-15 additional minutes

                // Calculate estimated time
                const now = new Date();
                const estimatedTime = new Date(now.getTime() + (baseMinutes + randomAdd) * 60000);

                additionalData.estimatedDeliveryTime = estimatedTime.getTime();
            }
            const user = await UserService.getUser(userId);


            // Update the order status
            const updatedOrder = await OrderService.updateOrderStatus(orderId, status, additionalData);
            switch (status) {
                case OrderStatus.IN_PROGRESS:
                    await EmailService.sendOrderBeingPreparedEmail(user, updatedOrder);
                    break;
                case OrderStatus.READY_FOR_PICKUP:
                    await EmailService.sendOrderReadyForPickupEmail(user, updatedOrder);
                    break;
                case OrderStatus.OUT_FOR_DELIVERY:
                    await EmailService.sendOrderIsOnTheWayEmail(user, updatedOrder);
                    break;
            }
            return res.status(200).json(createResponse("success", "Order updated successfully", updatedOrder));
        } catch (error) {
            logger.log("error", `Error updating order status: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error getting order", error.message));
        }
    }

    /**
     * Gets all active orders (for restaurant employees)
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getActiveOrders(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;

            const orders = await OrderService.getActiveOrders(limit);

            return res.status(200).json(createResponse("success", "Order retrieved successfully", orders));
        } catch (error) {
            logger.log("error", `Error getting active orders: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error getting order", error.message));
        }
    }

    /**
     * Gets orders by status (for restaurant employees)
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async getOrdersByStatus(req, res) {
        try {
            const { status } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;

            // Validate the status
            if (!Object.values(OrderStatus).includes(status)) {
                return res.status(400).json(createResponse("error", "Invalid status"));
            }

            // Get orders by status
            const orders = await OrderService.getOrdersByStatus(status, limit);

            return res.status(200).json(createResponse("success", "Order retrieved successfully", orders));
        } catch (error) {
            logger.log("error", `Error getting orders by status: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error getting order", error.message));
        }
    }

    /**
     * Cancels an order
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;

            const order = await OrderService.getOrderById(orderId);

            // Check if order can be canceled
            if ([OrderStatus.COMPLETED, OrderStatus.CANCELED].includes(order.status)) {
                return res.status(400).json({
                    error: "Order cannot be canceled in its current state"
                });
            }

            // Add cancel reason if provided
            const additionalData = {};
            if (req.body.cancelReason) {
                additionalData.cancelReason = req.body.cancelReason;
            }

            // Cancel the order
            const canceledOrder = await OrderService.updateOrderStatus(
                orderId,
                OrderStatus.CANCELED,
                additionalData
            );

            return res.status(200).json(createResponse("success", "Order cancelled successfully", canceledOrder));
        } catch (error) {
            logger.log("error", `Error canceling order: ${error.message}`);
            return res.status(500).json(createResponse("error", "Error getting order", error.message));
        }
    }
}

module.exports = OrderController;