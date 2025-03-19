// __tests__/controllers/restaurantConfig.controller.test.js
const RestaurantConfigController = require('../../app/controllers/restaurantConfig.controller');
const RestaurantConfigService = require('../../app/services/restaurantConfig.service');
const { mockRequest, mockResponse } = require('../helpers');
const { logger } = require('../../app/logger/FirebaseLogger');

jest.mock('../../app/services/restaurantConfig.service');
jest.mock('../../app/logger/FirebaseLogger');

describe('RestaurantConfig Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addPhoneNumber', () => {
        it('adds a phone number successfully', async () => {
            const req = mockRequest({ body: { phoneNumber: '1234567890' } });
            const res = mockResponse();

            await RestaurantConfigController.addPhoneNumber(req, res);

            expect(RestaurantConfigService.addPhoneNumber).toHaveBeenCalledWith('1234567890');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Phone number added successfully',
                data: null
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ body: { phoneNumber: '1234567890' } });
            const res = mockResponse();
            const error = new Error('Database error');

            RestaurantConfigService.addPhoneNumber.mockRejectedValue(error);

            await RestaurantConfigController.addPhoneNumber(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error',
                data: null
            }));
        });
    });

    describe('updatePhoneNumber', () => {
        it('updates a phone number successfully', async () => {
            const req = mockRequest({ body: { phoneNumber: '0987654321' } });
            const res = mockResponse();

            await RestaurantConfigController.updatePhoneNumber(req, res);

            expect(RestaurantConfigService.updatePhoneNumber).toHaveBeenCalledWith('0987654321');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Phone number updated successfully',
                data: null
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ body: { phoneNumber: '0987654321' } });
            const res = mockResponse();
            const error = new Error('Database error');

            RestaurantConfigService.updatePhoneNumber.mockRejectedValue(error);

            await RestaurantConfigController.updatePhoneNumber(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error',
                data: null
            }));
        });
    });

    describe('deletePhoneNumber', () => {
        it('deletes a phone number successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await RestaurantConfigController.deletePhoneNumber(req, res);

            expect(RestaurantConfigService.deletePhoneNumber).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Phone number deleted successfully',
                data: null
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            RestaurantConfigService.deletePhoneNumber.mockRejectedValue(error);

            await RestaurantConfigController.deletePhoneNumber(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error',
                data: null
            }));
        });
    });

    describe('getPhoneNumber', () => {
        it('retrieves a phone number successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockPhoneNumber = '1234567890';

            RestaurantConfigService.getPhoneNumber.mockResolvedValue(mockPhoneNumber);

            await RestaurantConfigController.getPhoneNumber(req, res);

            expect(RestaurantConfigService.getPhoneNumber).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Phone number fetched successfully',
                data: mockPhoneNumber
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            RestaurantConfigService.getPhoneNumber.mockRejectedValue(error);

            await RestaurantConfigController.getPhoneNumber(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error',
                data: null
            }));
        });
    });
});