// __tests__/utils/response.utils.test.js
const { createResponse } = require('../../app/utils/response.utils');

describe('Response Utils', () => {
    describe('createResponse', () => {
        it('should create a response object with status and message', () => {
            const response = createResponse('success', 'Operation successful');

            expect(response).toEqual({
                status: 'success',
                message: 'Operation successful',
                data: null
            });
        });

        it('should create a response object with status, message, and data', () => {
            const data = { id: 1, name: 'Test' };
            const response = createResponse('success', 'Operation successful', data);

            expect(response).toEqual({
                status: 'success',
                message: 'Operation successful',
                data
            });
        });

        it('should create an error response', () => {
            const response = createResponse('error', 'An error occurred');

            expect(response).toEqual({
                status: 'error',
                message: 'An error occurred',
                data: null
            });
        });

        it('should handle null message', () => {
            const data = { result: 'some data' };
            const response = createResponse('success', null, data);

            expect(response).toEqual({
                status: 'success',
                message: null,
                data
            });
        });

        it('should use null as default value for data when not provided', () => {
            const response = createResponse('warning', 'This is a warning');

            expect(response).toEqual({
                status: 'warning',
                message: 'This is a warning',
                data: null
            });
        });
    });
});