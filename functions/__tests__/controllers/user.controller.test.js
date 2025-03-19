// __tests__/controllers/user.controller.test.js
const UserController = require('../../app/controllers/user.controller');
const UserService = require('../../app/services/user.service');
const { mockRequest, mockResponse } = require('../helpers');
const { logger } = require('../../app/logger/FirebaseLogger');

jest.mock('../../app/services/user.service');
jest.mock('../../app/logger/FirebaseLogger');

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUser', () => {
        it('retrieves a user successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockUser = { id: 'user1', name: 'John Doe' };

            UserService.verifyUser.mockResolvedValue('user1');
            UserService.getUser.mockResolvedValue(mockUser);

            await UserController.getUser(req, res);

            expect(UserService.verifyUser).toHaveBeenCalledWith(req);
            expect(UserService.getUser).toHaveBeenCalledWith('user1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: mockUser
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            UserService.verifyUser.mockRejectedValue(error);

            await UserController.getUser(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting user details', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('getAllUsers', () => {
        it('retrieves all users successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockUsers = [{ id: 'user1', name: 'John Doe' }];

            UserService.getAllUsers.mockResolvedValue(mockUsers);

            await UserController.getAllUsers(req, res);

            expect(UserService.getAllUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: mockUsers
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            UserService.getAllUsers.mockRejectedValue(error);

            await UserController.getAllUsers(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting all users', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('getAllPrivilegedUsers', () => {
        it('retrieves all privileged users successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockUsers = [{ id: 'user1', name: 'John Doe', privilege: 'admin' }];

            UserService.getAllPrivilegedUsers.mockResolvedValue(mockUsers);

            await UserController.getAllPrivilegedUsers(req, res);

            expect(UserService.getAllPrivilegedUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                data: mockUsers
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');

            UserService.getAllPrivilegedUsers.mockRejectedValue(error);

            await UserController.getAllPrivilegedUsers(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error getting all privileged users', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });

    describe('changePrivilege', () => {
        it('changes user privilege successfully', async () => {
            const req = mockRequest({ params: { userId: 'user1' }, body: { privilege: 'admin' } });
            const res = mockResponse();

            await UserController.changePrivilege(req, res);

            expect(UserService.changePrivilege).toHaveBeenCalledWith('user1', 'admin');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                message: 'Privilege updated successfully'
            }));
        });

        it('handles errors and returns 500 status', async () => {
            const req = mockRequest({ params: { userId: 'user1' }, body: { privilege: 'admin' } });
            const res = mockResponse();
            const error = new Error('Database error');

            UserService.changePrivilege.mockRejectedValue(error);

            await UserController.changePrivilege(req, res);

            expect(logger.error).toHaveBeenCalledWith('Error changing user privilege', error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 'error',
                message: 'Database error'
            }));
        });
    });
});