// services/orderService.js - Handles order operations

const { logger } = require("../logger/FirebaseLogger");
const { Order, OrderStatus, PaymentMethod } = require("../models/order.model");
const stripeService = require("./stripe.service");
const {db} = require("../config/firebase.config");
/**
 * Service for handling order operations
 */
class OrderService {
    /**
     * Creates a new order
     *
     * @param {Order} order - The order to create
     * @returns {Order} The created order
     */
    static async createOrder(order) {
        try {
            // Validate the order
            const validation = await order.validate();
            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            // Fetch menu items to validate prices and availability
            this.validateOrderItems(order.items);

            // Save the order to Firestore
            const orderRef = await db.collection('orders').add(order.toFirestore());

            // Get the saved order with its ID
            const savedOrder = await this.getOrderById(orderRef.id);

            logger.log("info", `Created order ${savedOrder.id}`);
            return savedOrder;
        } catch (error) {
            logger.log("error", `Error creating order: ${error.message}`);
            throw error;
        }
    }

    /**
     * Validates items in an order against the menu
     *
     * @param {Array<Object>} orderItems - Items in the order to validate
     * @returns {boolean} True if all items are valid
     */
    static async validateOrderItems(orderItems) {
        try {
            // Get all item IDs from the order
            const itemIds = orderItems.map(item => item.id);

            // Query for these items in the menu
            const querySnapshot = await db.collection('menuItems')
                .where('__name__', 'in', itemIds)
                .get();

            // Check if all items exist and have correct prices
            if (querySnapshot.size !== itemIds.length) {
                throw new Error("Some items in the order do not exist in the menu");
            }

            // Map menu items to a dictionary by ID for easier lookup
            const menuItems = {};
            querySnapshot.forEach(doc => {
                menuItems[doc.id] = doc.data();
            });

            // Validate each item's price
            for (const orderItem of orderItems) {
                const menuItem = menuItems[orderItem.id];
                if (!menuItem) {
                    throw new Error(`Menu item ${orderItem.id} not found`);
                }

                // Allow a small difference due to floating point issues
                if (Math.abs(orderItem.price - menuItem.price) > 0.01) {
                    throw new Error(`Price mismatch for item ${orderItem.id}`);
                }
            }

            return true;
        } catch (error) {
            logger.log("error", `Error validating order items: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets an order by ID
     *
     * @param {string} orderId - The ID of the order to retrieve
     * @returns {Order} The order
     */
    static async getOrderById(orderId) {
        try {
            const orderDoc = await db.collection('orders').doc(orderId).get();

            if (!orderDoc.exists) {
                throw new Error(`Order ${orderId} not found`);
            }

            return Order.fromFirestore(orderDoc);
        } catch (error) {
            logger.log("error", `Error getting order ${orderId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Updates an order's status
     *
     * @param {string} orderId - The ID of the order to update
     * @param {string} status - The new status
     * @param {Object} additionalData - Additional data to update
     * @returns {Order} The updated order
     */
    static async updateOrderStatus(orderId, status, additionalData = {}) {
        try {
            // Validate that the status is a valid OrderStatus value
            if (!Object.values(OrderStatus).includes(status)) {
                throw new Error(`Invalid order status: ${status}`);
            }

            // Get current order to check for valid status transitions
            const order = await this.getOrderById(orderId);

            // Validate status transition
            this.validateStatusTransition(order.status, status);

            // Prepare update data
            const updateData = {
                status,
                updatedAt: Date.now(),
                ...additionalData
            };

            // Update the order
            await db.collection('orders').doc(orderId).update(updateData);

            // Get the updated order
            const updatedOrder = await this.getOrderById(orderId);

            logger.log("info", `Updated order ${orderId} status to ${status}`);
            return updatedOrder;
        } catch (error) {
            logger.log("error", `Error updating order ${orderId} status: ${error.message}`);
            throw error;
        }
    }

    /**
     * Validates a status transition
     *
     * @param {string} currentStatus - The current order status
     * @param {string} newStatus - The new order status
     * @returns {boolean} True if the transition is valid
     */
    static async validateStatusTransition(currentStatus, newStatus) {
        // Define valid transitions
        const validTransitions = {
            [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELED],
            [OrderStatus.PAID]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
            [OrderStatus.IN_PROGRESS]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELED],
            [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.COMPLETED, OrderStatus.CANCELED],
            [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.COMPLETED, OrderStatus.CANCELED],
            [OrderStatus.COMPLETED]: [], // Terminal state
            [OrderStatus.CANCELED]: []  // Terminal state
        };

        // Check if the transition is valid
        if (!validTransitions[currentStatus].includes(newStatus) && currentStatus !== newStatus) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }

        return true;
    }

    /**
     * Process payment for an order
     *
     * @param {Order} order - The order to process payment for
     * @param {string} successUrl - URL to redirect to on successful payment
     * @param {string} cancelUrl - URL to redirect to on canceled payment
     * @returns {Object} Payment processing result
     */
    static async processPayment(order, successUrl, cancelUrl) {
        try {
            // Skip online payment for cash on delivery or in-store payment
            if (order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY ||
                order.paymentMethod === PaymentMethod.IN_STORE) {
                return { success: true, requiresRedirect: false };
            }

            // For online payment, create a checkout session
            const session = await stripeService.createCheckoutSession(
                order,
                successUrl,
                cancelUrl
            );

            // Update the order with both payment intent ID and session ID
            await db.collection("orders").doc(order.id).update({
                paymentIntentId: session.payment_intent,
                checkoutSessionId: session.id, // Store the session ID too
                updatedAt: Date.now()
            });

            console.log(`Order ${order.id} updated with payment intent ${session.payment_intent} and session ${session.id}`);

            return {
                success: true,
                requiresRedirect: true,
                redirectUrl: session.url
            };
        } catch (error) {
            console.error(`Error processing payment for order ${order.id}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Handle a successful payment
     *
     * @param {string} paymentIntentId - The ID of the payment intent
     * @returns {Order} The updated order
     */
    static async handleSuccessfulPayment(paymentIntentId) {
        try {
            // Query for the order with this payment intent
            const querySnapshot = await db.collection('orders')
                .where('paymentIntentId', '==', paymentIntentId)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                throw new Error(`No order found with payment intent ${paymentIntentId}`);
            }

            const orderId = querySnapshot.docs[0].id;

            // Verify the payment was successful
            const isPaymentSuccessful = await stripeService.confirmPaymentSuccess(paymentIntentId);

            if (!isPaymentSuccessful) {
                logger.log("warning", `Payment ${paymentIntentId} verification failed`);
                return this.updateOrderStatus(orderId, OrderStatus.CANCELED, {
                    cancelReason: 'Payment verification failed'
                });
            }

            // Update the order status to PAID
            return this.updateOrderStatus(orderId, OrderStatus.PAID);
        } catch (error) {
            logger.log("error", `Error handling successful payment: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets orders for a user
     *
     * @param {string} userId - The ID of the user
     * @param {number} limit - Maximum number of orders to return
     * @returns {Array<Order>} The user's orders
     */
    static async getUserOrders(userId, limit = 20) {
        try {
            logger.debug("User id:", userId);
            const querySnapshot = await db.collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            const orders = [];
            querySnapshot.forEach(doc => {
                orders.push(Order.fromFirestore(doc));
            });

            return orders;
        } catch (error) {
            logger.log("error", `Error getting orders for user ${userId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets all active orders (not completed or canceled)
     *
     * @param {number} limit - Maximum number of orders to return
     * @returns {Array<Order>} Active orders
     */
    static async getActiveOrders(limit = 50) {
        try {
            const querySnapshot = await db.collection('orders')
                .where('status', 'not-in', [OrderStatus.COMPLETED, OrderStatus.CANCELED])
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            const orders = [];
            querySnapshot.forEach(doc => {
                orders.push(Order.fromFirestore(doc));
            });

            return orders;
        } catch (error) {
            logger.log("error", `Error getting active orders: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets all orders by status
     *
     * @param {string} status - The status to filter by
     * @param {number} limit - Maximum number of orders to return
     * @returns {Array<Order>} Orders with the specified status
     */
    static async getOrdersByStatus(status, limit = 50) {
        try {
            const querySnapshot = await db.collection('orders')
                .where('status', '==', status)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            const orders = [];
            querySnapshot.forEach(doc => {
                orders.push(Order.fromFirestore(doc));
            });

            return orders;
        } catch (error) {
            logger.log("error", `Error getting orders with status ${status}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = OrderService;