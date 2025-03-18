// __tests__/routes/analytics.router.test.js
const request = require('supertest');
const express = require('express');
const analyticsRouter = require('../../app/routes/analytics.router');
const AnalyticsController = require('../../app/controllers/analytics.controller');
const { verifyIdToken } = require('../../app/middlewares/auth.middleware');
const { isOwner } = require('../../app/middlewares/privilages.middleware');

// Mock the middlewares and controller methods
jest.mock('../../app/controllers/analytics.controller');
jest.mock('../../app/middlewares/auth.middleware');
jest.mock('../../app/middlewares/privilages.middleware');

describe('Analytics Router', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock the middleware to pass through
        verifyIdToken.mockImplementation((req, res, next) => next());
        isOwner.mockImplementation((req, res, next) => next());

        // Setup mock responses for all controller methods
        Object.keys(AnalyticsController).forEach(method => {
            AnalyticsController[method].mockImplementation((req, res) => {
                return res.status(200).json({
                    status: 'success',
                    message: `${method} endpoint called`,
                    data: { test: true }
                });
            });
        });

        // Create a new Express app and use the router
        app = express();
        app.use(express.json());
        app.use('/analytics', analyticsRouter);
    });

    describe('GET /analytics/dashboard-summary', () => {
        it('should call getDashboardSummary controller and return 200', async () => {
            const response = await request(app).get('/analytics/dashboard-summary');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getDashboardSummary endpoint called');
            expect(AnalyticsController.getDashboardSummary).toHaveBeenCalled();
            expect(verifyIdToken).toHaveBeenCalled();
            expect(isOwner).toHaveBeenCalled();
        });

        it('should properly pass request objects to controller', async () => {
            await request(app).get('/analytics/dashboard-summary');

            // Check that the controller was called with req and res objects
            expect(AnalyticsController.getDashboardSummary).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object)
            );
        });
    });

    describe('GET /analytics/revenue', () => {
        it('should call getRevenueAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/revenue');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getRevenueAnalytics endpoint called');
            expect(AnalyticsController.getRevenueAnalytics).toHaveBeenCalled();
        });

        it('should pass query parameters to controller', async () => {
            await request(app).get('/analytics/revenue?days=60');

            // The first argument should be the request object with query params
            const reqArg = AnalyticsController.getRevenueAnalytics.mock.calls[0][0];
            expect(reqArg.query.days).toBe('60');
        });
    });

    describe('GET /analytics/menu-items', () => {
        it('should call getMenuItemAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/menu-items');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getMenuItemAnalytics endpoint called');
            expect(AnalyticsController.getMenuItemAnalytics).toHaveBeenCalled();
        });
    });

    describe('GET /analytics/reservations', () => {
        it('should call getReservationAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/reservations');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getReservationAnalytics endpoint called');
            expect(AnalyticsController.getReservationAnalytics).toHaveBeenCalled();
        });
    });

    describe('GET /analytics/orders', () => {
        it('should call getOrderStatusAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/orders');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getOrderStatusAnalytics endpoint called');
            expect(AnalyticsController.getOrderStatusAnalytics).toHaveBeenCalled();
        });
    });

    describe('GET /analytics/customers', () => {
        it('should call getCustomerAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/customers');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getCustomerAnalytics endpoint called');
            expect(AnalyticsController.getCustomerAnalytics).toHaveBeenCalled();
        });
    });

    describe('GET /analytics/operational', () => {
        it('should call getOperationalAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/operational');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getOperationalAnalytics endpoint called');
            expect(AnalyticsController.getOperationalAnalytics).toHaveBeenCalled();
        });
    });

    describe('GET /analytics/all', () => {
        it('should call getAllAnalytics controller and return 200', async () => {
            const response = await request(app).get('/analytics/all');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('getAllAnalytics endpoint called');
            expect(AnalyticsController.getAllAnalytics).toHaveBeenCalled();
        });

        it('should pass query parameters to controller', async () => {
            await request(app).get('/analytics/all?days=45');

            // The first argument should be the request object with query params
            const reqArg = AnalyticsController.getAllAnalytics.mock.calls[0][0];
            expect(reqArg.query.days).toBe('45');
        });
    });

    describe('Authentication and Authorization', () => {
        it('should return 401 when auth middleware fails', async () => {
            // Mock auth middleware to simulate unauthorized request
            verifyIdToken.mockImplementation((req, res, next) => {
                return res.status(401).json({ status: 'error', message: 'Unauthorized' });
            });

            const response = await request(app).get('/analytics/dashboard-summary');

            expect(response.status).toBe(401);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Unauthorized');
            expect(AnalyticsController.getDashboardSummary).not.toHaveBeenCalled();
        });

        it('should return 403 when owner privilege check fails', async () => {
            // Mock auth middleware to pass but owner check to fail
            verifyIdToken.mockImplementation((req, res, next) => next());
            isOwner.mockImplementation((req, res, next) => {
                return res.status(403).json({ status: 'error', message: 'Forbidden - Not an owner' });
            });

            const response = await request(app).get('/analytics/dashboard-summary');

            expect(response.status).toBe(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Forbidden - Not an owner');
            expect(AnalyticsController.getDashboardSummary).not.toHaveBeenCalled();
        });
    });
});