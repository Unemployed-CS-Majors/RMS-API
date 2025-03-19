// __tests__/controllers/door.controller.test.js
const DoorController = require('../../app/controllers/door.controller');
const DoorService = require('../../app/services/door.service');
const { mockRequest, mockResponse } = require('../helpers');
const { logger } = require('../../app/logger/FirebaseLogger');

jest.mock('../../app/services/door.service');
jest.mock('../../app/logger/FirebaseLogger');

describe('Door Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createDoor', () => {
        it('creates a new door successfully', async () => {
            const req = mockRequest({ body: { name: 'Front Door' } });
            const res = mockResponse();
            const mockDoorId = 'door1';

            DoorService.createDoor.mockResolvedValue(mockDoorId);

            await DoorController.createDoor(req, res);
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ body: { name: 'Front Door' } });
            const res = mockResponse();
            const error = new Error('Database error');

            DoorService.createDoor.mockRejectedValue(error);

            await DoorController.createDoor(req, res);
        });
    });
});