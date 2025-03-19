// __tests__/controllers/table.controller.test.js
const TableController = require('../../app/controllers/table.controller');
const TableService = require('../../app/services/table.service');
const { mockRequest, mockResponse } = require('../helpers');
const { logger } = require('firebase-functions');

// Mock dependencies
jest.mock('../../app/services/table.service');
jest.mock('firebase-functions', () => ({
    logger: {
        error: jest.fn()
    }
}));

describe('Table Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTable', () => {
        it('should return table by id with 200 status', async () => {
            // Setup mock request
            const req = mockRequest({
                params: { tableId: 'table123' }
            });
            const res = mockResponse();

            // Mock table service response
            const mockTable = {
                id: 'table123',
                seats: 4,
                tabeleNum: 1,
                position: { x: 10, y: 10 },
                width: 4,
                height: 4,
                isActive: true
            };
            TableService.getTable.mockResolvedValue(mockTable);

            // Call controller method
            await TableController.getTable(req, res);

            // Assertions
            expect(TableService.getTable).toHaveBeenCalledWith('table123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Table fetched successfully',
                data: mockTable
            });
        });

        it('should return 404 when table not found', async () => {
            // Setup mock request
            const req = mockRequest({
                params: { tableId: 'nonexistent' }
            });
            const res = mockResponse();

            // Mock table service to return null (not found)
            TableService.getTable.mockResolvedValue(null);

            // Call controller method
            await TableController.getTable(req, res);

            // Assertions
            expect(TableService.getTable).toHaveBeenCalledWith('nonexistent');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Table not found',
                data: null
            });
        });

        it('should handle errors and return 500 status', async () => {
            // Setup mock request
            const req = mockRequest({
                params: { tableId: 'table123' }
            });
            const res = mockResponse();

            // Mock service to throw error
            const error = new Error('Database connection failed');
            TableService.getTable.mockRejectedValue(error);

            // Call controller method
            await TableController.getTable(req, res);

            // Assertions
            expect(logger.error).toHaveBeenCalledWith('Error getting table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: error.message,
                data: null
            });
        });
    });

    describe('getAllTables', () => {
        it('should return all tables with 200 status', async () => {
            // Setup mock request and response
            const req = mockRequest();
            const res = mockResponse();

            // Mock table service response
            const mockTables = [
                { id: 'table1', seats: 4, tabeleNum: 1, position: { x: 10, y: 10 }, width: 4, height: 4, isActive: true },
                { id: 'table2', seats: 6, tabeleNum: 2, position: { x: 20, y: 20 }, width: 6, height: 4, isActive: true }
            ];
            TableService.getAllTables.mockResolvedValue(mockTables);

            // Call controller method
            await TableController.getAllTables(req, res);

            // Assertions
            expect(TableService.getAllTables).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Tables fetched successfully',
                data: mockTables
            });
        });

        it('should handle errors and return 500 status', async () => {
            // Setup mock request
            const req = mockRequest();
            const res = mockResponse();

            // Mock service to throw error
            const error = new Error('Database connection failed');
            TableService.getAllTables.mockRejectedValue(error);

            // Call controller method
            await TableController.getAllTables(req, res);

            // Assertions
            expect(logger.error).toHaveBeenCalledWith('Error getting all tables', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: error.message,
                data: null
            });
        });
    });

    describe('createTable', () => {
        it('should return 400 if validation fails', async () => {
            // Setup request with invalid data
            const req = mockRequest({
                body: { /* Missing required fields */ }
            });
            const res = mockResponse();

            // Override the imported validator to simulate validation failure
            const TableController = jest.requireActual('../../app/controllers/table.controller');
            TableController.validateCreateTable = jest.fn().mockReturnValue('Validation error message');

            // Call controller method with validation failure
            const validationErrorMessage = 'Required fields missing';
            jest.spyOn(require('../../app/validators/table.validators'), 'validateCreateTable')
                .mockReturnValue(validationErrorMessage);

            await TableController.createTable(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: expect.any(String),
                data: null
            });
            expect(TableService.createTable).not.toHaveBeenCalled();
        });
    });

    describe('updateTable', () => {
        it('should update table and return 200 status with updated table', async () => {
            // Setup valid request
            const tableId = 'table123';
            const updateData = {
                seats: 6,
                isActive: true
            };
            const req = mockRequest({
                params: { tableId },
                body: updateData
            });
            const res = mockResponse();

            // Mock service response
            const updatedTable = {
                id: tableId,
                seats: 6,
                tabeleNum: 1,
                position: { x: 10, y: 10 },
                width: 4,
                height: 4,
                isActive: true
            };
            TableService.updateTable.mockResolvedValue(updatedTable);

            // Call controller method
            await TableController.updateTable(req, res);

            // Assertions
            expect(TableService.updateTable).toHaveBeenCalledWith(tableId, updateData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Table updated successfully',
                data: updatedTable
            });
        });

        it('should handle errors and return 500 status during update', async () => {
            // Setup request
            const tableId = 'table123';
            const updateData = {
                seats: 6
            };
            const req = mockRequest({
                params: { tableId },
                body: updateData
            });
            const res = mockResponse();

            // Mock service to throw error
            const error = new Error('Database error');
            TableService.updateTable.mockRejectedValue(error);

            // Call controller method
            await TableController.updateTable(req, res);

            // Assertions
            expect(logger.error).toHaveBeenCalledWith('Error updating table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: error.message,
                data: null
            });
        });
    });

    describe('deleteTable', () => {
        it('should delete table and return 200 status', async () => {
            // Setup request
            const tableId = 'table123';
            const req = mockRequest({
                params: { tableId }
            });
            const res = mockResponse();

            // Mock service response
            TableService.deleteTable.mockResolvedValue(true);

            // Call controller method
            await TableController.deleteTable(req, res);

            // Assertions
            expect(TableService.deleteTable).toHaveBeenCalledWith(tableId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Table deleted successfully',
                data: null
            });
        });

        it('should handle errors and return 500 status during delete', async () => {
            // Setup request
            const tableId = 'table123';
            const req = mockRequest({
                params: { tableId }
            });
            const res = mockResponse();

            // Mock service to throw error
            const error = new Error('Database error');
            TableService.deleteTable.mockRejectedValue(error);

            // Call controller method
            await TableController.deleteTable(req, res);

            // Assertions
            expect(logger.error).toHaveBeenCalledWith('Error deleting table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: error.message,
                data: null
            });
        });
    });

    describe('deactivateTable', () => {
        it('should deactivate table and return 200 status', async () => {
            // Setup request
            const tableId = 'table123';
            const req = mockRequest({
                params: { tableId }
            });
            const res = mockResponse();

            // Mock service response
            const updatedTable = {
                id: tableId,
                seats: 4,
                tabeleNum: 1,
                position: { x: 10, y: 10 },
                width: 4,
                height: 4,
                isActive: false
            };
            TableService.updateTable.mockResolvedValue(updatedTable);

            // Call controller method
            await TableController.deactivateTable(req, res);

            // Assertions
            expect(TableService.updateTable).toHaveBeenCalledWith(tableId, { isActive: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Table deactivated successfully',
                data: updatedTable
            });
        });

        it('should handle errors and return 500 status during deactivation', async () => {
            // Setup request
            const tableId = 'table123';
            const req = mockRequest({
                params: { tableId }
            });
            const res = mockResponse();

            // Mock service to throw error
            const error = new Error('Database error');
            TableService.updateTable.mockRejectedValue(error);

            // Call controller method
            await TableController.deactivateTable(req, res);

            // Assertions
            expect(logger.error).toHaveBeenCalledWith('Error deactivating table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: error.message,
                data: null
            });
        });
    });

    describe('activateTable', () => {
        it('should activate table and return 200 status', async () => {
            // Setup request
            const tableId = 'table123';
            const req = mockRequest({
                params: { tableId }
            });
            const res = mockResponse();

            // Mock service response
            const updatedTable = {
                id: tableId,
                seats: 4,
                tabeleNum: 1,
                position: { x: 10, y: 10 },
                width: 4,
                height: 4,
                isActive: true
            };
            TableService.updateTable.mockResolvedValue(updatedTable);

            // Call controller method
            await TableController.activateTable(req, res);

            // Assertions
            expect(TableService.updateTable).toHaveBeenCalledWith(tableId, { isActive: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Table activated successfully',
                data: updatedTable
            });
        });

        it('should handle errors and return 500 status during activation', async () => {
            // Setup request
            const tableId = 'table123';
            const req = mockRequest({
                params: { tableId }
            });
            const res = mockResponse();

            // Mock service to throw error
            const error = new Error('Database error');
            TableService.updateTable.mockRejectedValue(error);

            // Call controller method
            await TableController.activateTable(req, res);

            // Assertions
            expect(logger.error).toHaveBeenCalledWith('Error activating table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: error.message,
                data: null
            });
        });
    });
});