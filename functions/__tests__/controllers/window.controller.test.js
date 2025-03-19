// __tests__/controllers/window.controller.test.js
const WindowController = require('../../app/controllers/window.controller');
const WindowService = require('../../app/services/window.service');
const { mockRequest, mockResponse } = require('../helpers');
const { logger } = require('../../app/logger/FirebaseLogger');

jest.mock('../../app/services/window.service');
jest.mock('../../app/logger/FirebaseLogger');

describe('Window Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getWindow', () => {
        it('retrieves a window by ID successfully', async () => {
            const req = mockRequest({ params: { windowId: 'window1' } });
            const res = mockResponse();
            const mockWindow = { id: 'window1', name: 'Test Window' };

            WindowService.getWindow.mockResolvedValue(mockWindow);

            await WindowController.getWindow(req, res);

            expect(WindowService.getWindow).toHaveBeenCalledWith('window1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Window fetched successfully',
                data: mockWindow
            }));
        });

        it('returns 404 if window not found', async () => {
            const req = mockRequest({ params: { windowId: 'window1' } });
            const res = mockResponse();

            WindowService.getWindow.mockResolvedValue(null);

            await WindowController.getWindow(req, res);

            expect(WindowService.getWindow).toHaveBeenCalledWith('window1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Window not found'
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { windowId: 'window1' } });
            const res = mockResponse();
            const error = new Error('Database error');

            WindowService.getWindow.mockRejectedValue(error);

            await WindowController.getWindow(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting window', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('getAllWindows', () => {
        it('retrieves all windows successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockWindows = [{ id: 'window1', name: 'Test Window' }];

            WindowService.getAllWindows.mockResolvedValue(mockWindows);

            await WindowController.getAllWindows(req, res);

            expect(WindowService.getAllWindows).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Windows fetched successfully',
                data: mockWindows
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            WindowService.getAllWindows.mockRejectedValue(error);

            await WindowController.getAllWindows(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting all windows', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('updateWindow', () => {
        it('returns 400 if validation fails', async () => {
            const req = mockRequest({ params: { windowId: 'window1' }, body: {} });
            const res = mockResponse();

            await WindowController.updateWindow(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: expect.any(String)
            }));
        });
    });

    describe('deleteWindow', () => {
        it('returns 404 if window not found', async () => {
            const req = mockRequest({ params: { windowId: 'window1' } });
            const res = mockResponse();

            WindowService.deleteWindow.mockResolvedValue(false);

            await WindowController.deleteWindow(req, res);

            expect(WindowService.deleteWindow).toHaveBeenCalledWith('window1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Window not found'
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { windowId: 'window1' } });
            const res = mockResponse();
            const error = new Error('Database error');

            WindowService.deleteWindow.mockRejectedValue(error);

            await WindowController.deleteWindow(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error deleting window', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });
});