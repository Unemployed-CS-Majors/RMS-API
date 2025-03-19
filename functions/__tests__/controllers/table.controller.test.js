// __tests__/controllers/table.controller.test.js
const TableController = require('../../app/controllers/table.controller');
const TableService = require('../../app/services/table.service');
const { mockRequest, mockResponse } = require('../helpers');
const { logger } = require('firebase-functions');

jest.mock('../../app/services/table.service');
jest.mock('firebase-functions');

describe('Table Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTable', () => {
        it('retrieves a table by ID successfully', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const mockTable = { id: 'table1', isActive: true, seats: 4 };

            TableService.getTable.mockResolvedValue(mockTable);

            await TableController.getTable(req, res);

            expect(TableService.getTable).toHaveBeenCalledWith('table1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Table fetched successfully',
                data: mockTable
            }));
        });

        it('returns 404 if table not found', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();

            TableService.getTable.mockResolvedValue(null);

            await TableController.getTable(req, res);

            expect(TableService.getTable).toHaveBeenCalledWith('table1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Table not found'
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const error = new Error('Database error');

            TableService.getTable.mockRejectedValue(error);

            await TableController.getTable(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('getAllTables', () => {
        it('retrieves all tables successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockTables = [{ id: 'table1', isActive: true, seats: 4 }];

            TableService.getAllTables.mockResolvedValue(mockTables);

            await TableController.getAllTables(req, res);

            expect(TableService.getAllTables).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Tables fetched successfully',
                data: mockTables
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            TableService.getAllTables.mockRejectedValue(error);

            await TableController.getAllTables(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting all tables', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('updateTable', () => {
        it('updates a table successfully', async () => {
            const req = mockRequest({ params: { tableId: 'table1' }, body: { seats: 6 } });
            const res = mockResponse();
            const mockUpdatedTable = { id: 'table1', seats: 6, isActive: true };

            TableService.updateTable.mockResolvedValue(mockUpdatedTable);

            await TableController.updateTable(req, res);

            expect(TableService.updateTable).toHaveBeenCalledWith('table1', { seats: 6 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Table updated successfully',
                data: mockUpdatedTable
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { tableId: 'table1' }, body: { seats: 6 } });
            const res = mockResponse();
            const error = new Error('Database error');

            TableService.updateTable.mockRejectedValue(error);

            await TableController.updateTable(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error updating table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('deleteTable', () => {
        it('deletes a table successfully', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();

            await TableController.deleteTable(req, res);

            expect(TableService.deleteTable).toHaveBeenCalledWith('table1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Table deleted successfully',
                data: null
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const error = new Error('Database error');

            TableService.deleteTable.mockRejectedValue(error);

            await TableController.deleteTable(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error deleting table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('deactivateTable', () => {
        it('deactivates a table successfully', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const mockUpdatedTable = { id: 'table1', isActive: false };

            TableService.updateTable.mockResolvedValue(mockUpdatedTable);

            await TableController.deactivateTable(req, res);

            expect(TableService.updateTable).toHaveBeenCalledWith('table1', { isActive: false });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Table deactivated successfully',
                data: mockUpdatedTable
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const error = new Error('Database error');

            TableService.updateTable.mockRejectedValue(error);

            await TableController.deactivateTable(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error deactivating table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('activateTable', () => {
        it('activates a table successfully', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const mockUpdatedTable = { id: 'table1', isActive: true };

            TableService.updateTable.mockResolvedValue(mockUpdatedTable);

            await TableController.activateTable(req, res);

            expect(TableService.updateTable).toHaveBeenCalledWith('table1', { isActive: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Table activated successfully',
                data: mockUpdatedTable
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { tableId: 'table1' } });
            const res = mockResponse();
            const error = new Error('Database error');

            TableService.updateTable.mockRejectedValue(error);

            await TableController.activateTable(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error activating table', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });
});