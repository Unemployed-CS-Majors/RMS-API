const express = require("express");
const AnalyticsController = require("../controllers/analytics.controller");
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Restaurant analytics and reporting
 */

/**
 * @swagger
 * /analytics/dashboard-summary:
 *   get:
 *     summary: Get dashboard summary data
 *     tags: [Analytics]
 *     description: Retrieves a summary of key metrics for the dashboard.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/dashboard-summary", verifyIdToken, isOwner, AnalyticsController.getDashboardSummary);

/**
 * @swagger
 * /analytics/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Analytics]
 *     description: Retrieves revenue analytics broken down by time periods and categories.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back for analytics
 *     responses:
 *       200:
 *         description: Revenue analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/revenue", verifyIdToken, isOwner, AnalyticsController.getRevenueAnalytics);

/**
 * @swagger
 * /analytics/menu-items:
 *   get:
 *     summary: Get menu item analytics
 *     tags: [Analytics]
 *     description: Retrieves analytics about menu item performance.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back for analytics
 *     responses:
 *       200:
 *         description: Menu item analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/menu-items", verifyIdToken, isOwner, AnalyticsController.getMenuItemAnalytics);

/**
 * @swagger
 * /analytics/reservations:
 *   get:
 *     summary: Get reservation analytics
 *     tags: [Analytics]
 *     description: Retrieves analytics about reservations.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back for analytics
 *     responses:
 *       200:
 *         description: Reservation analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/reservations", verifyIdToken, isOwner, AnalyticsController.getReservationAnalytics);

/**
 * @swagger
 * /analytics/orders:
 *   get:
 *     summary: Get order status analytics
 *     tags: [Analytics]
 *     description: Retrieves analytics about order statuses and processing times.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back for analytics
 *     responses:
 *       200:
 *         description: Order status analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/orders", verifyIdToken, isOwner, AnalyticsController.getOrderStatusAnalytics);

/**
 * @swagger
 * /analytics/customers:
 *   get:
 *     summary: Get customer analytics
 *     tags: [Analytics]
 *     description: Retrieves analytics about customer behavior and retention.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 90
 *         description: Number of days to look back for analytics
 *     responses:
 *       200:
 *         description: Customer analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/customers", verifyIdToken, isOwner, AnalyticsController.getCustomerAnalytics);

/**
 * @swagger
 * /analytics/operational:
 *   get:
 *     summary: Get operational analytics
 *     tags: [Analytics]
 *     description: Retrieves analytics about current operational status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operational analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/operational", verifyIdToken, isOwner, AnalyticsController.getOperationalAnalytics);

/**
 * @swagger
 * /analytics/all:
 *   get:
 *     summary: Get all analytics data
 *     tags: [Analytics]
 *     description: Retrieves all analytics data in a single call.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back for analytics
 *     responses:
 *       200:
 *         description: All analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an owner
 */
router.get("/all", verifyIdToken, isOwner, AnalyticsController.getAllAnalytics);

module.exports = router;
