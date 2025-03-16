const AnalyticsService = require("../services/analytics.service");
const { createResponse } = require("../utils/response.utils");
const { logger } = require("../logger/FirebaseLogger");

class AnalyticsController {
    /**
     * Get revenue analytics
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Revenue analytics data
     */
    static async getRevenueAnalytics(req, res) {
        try {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 30;

            const revenueAnalytics = await AnalyticsService.getRevenueAnalytics(daysNumber);

            return res.status(200).json(createResponse("success", "Revenue analytics retrieved successfully", revenueAnalytics));
        } catch (error) {
            logger.error("Error in getRevenueAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve revenue analytics", error.message));
        }
    }

    /**
     * Get menu item analytics
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Menu item analytics data
     */
    static async getMenuItemAnalytics(req, res) {
        try {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 30;

            const menuItemAnalytics = await AnalyticsService.getMenuItemAnalytics(daysNumber);

            return res.status(200).json(createResponse("success", "Menu item analytics retrieved successfully", menuItemAnalytics));
        } catch (error) {
            logger.error("Error in getMenuItemAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve menu item analytics", error.message));
        }
    }

    /**
     * Get reservation analytics
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Reservation analytics data
     */
    static async getReservationAnalytics(req, res) {
        try {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 30;

            const reservationAnalytics = await AnalyticsService.getReservationAnalytics(daysNumber);

            return res.status(200).json(createResponse("success", "Reservation analytics retrieved successfully", reservationAnalytics));
        } catch (error) {
            logger.error("Error in getReservationAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve reservation analytics", error.message));
        }
    }

    /**
     * Get order status analytics
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Order status analytics data
     */
    static async getOrderStatusAnalytics(req, res) {
        try {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 30;

            const orderStatusAnalytics = await AnalyticsService.getOrderStatusAnalytics(daysNumber);

            return res.status(200).json(createResponse("success", "Order status analytics retrieved successfully", orderStatusAnalytics));
        } catch (error) {
            logger.error("Error in getOrderStatusAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve order status analytics", error.message));
        }
    }

    /**
     * Get customer analytics
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Customer analytics data
     */
    static async getCustomerAnalytics(req, res) {
        try {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 90;

            const customerAnalytics = await AnalyticsService.getCustomerAnalytics(daysNumber);

            return res.status(200).json(createResponse("success", "Customer analytics retrieved successfully", customerAnalytics));
        } catch (error) {
            logger.error("Error in getCustomerAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve customer analytics", error.message));
        }
    }

    /**
     * Get operational analytics
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Operational analytics data
     */
    static async getOperationalAnalytics(req, res) {
        try {
            const operationalAnalytics = await AnalyticsService.getOperationalAnalytics();

            return res.status(200).json(createResponse("success", "Operational analytics retrieved successfully", operationalAnalytics));
        } catch (error) {
            logger.error("Error in getOperationalAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve operational analytics", error.message));
        }
    }

    /**
     * Get dashboard summary
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} Dashboard summary data
     */
    static async getDashboardSummary(req, res) {
        try {
            const dashboardSummary = await AnalyticsService.getDashboardSummary();

            return res.status(200).json(createResponse("success", "Dashboard summary retrieved successfully", dashboardSummary));
        } catch (error) {
            logger.error("Error in getDashboardSummary controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve dashboard summary", error.message));
        }
    }

    /**
     * Get all analytics in a single call
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<Object>} All analytics data
     */
    static async getAllAnalytics(req, res) {
        try {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 30;

            
            const [
                dashboardSummary,
                revenueAnalytics,
                menuItemAnalytics,
                reservationAnalytics,
                orderStatusAnalytics,
                customerAnalytics,
                operationalAnalytics
            ] = await Promise.all([
                AnalyticsService.getDashboardSummary(),
                AnalyticsService.getRevenueAnalytics(daysNumber),
                AnalyticsService.getMenuItemAnalytics(daysNumber),
                AnalyticsService.getReservationAnalytics(daysNumber),
                AnalyticsService.getOrderStatusAnalytics(daysNumber),
                AnalyticsService.getCustomerAnalytics(daysNumber),
                AnalyticsService.getOperationalAnalytics()
            ]);

            
            const allAnalytics = {
                dashboardSummary,
                revenueAnalytics,
                menuItemAnalytics,
                reservationAnalytics,
                orderStatusAnalytics,
                customerAnalytics,
                operationalAnalytics
            };

            return res.status(200).json(createResponse("success", "All analytics retrieved successfully", allAnalytics));
        } catch (error) {
            logger.error("Error in getAllAnalytics controller:", error);
            return res.status(500).json(createResponse("error", "Failed to retrieve analytics", error.message));
        }
    }
}

module.exports = AnalyticsController;