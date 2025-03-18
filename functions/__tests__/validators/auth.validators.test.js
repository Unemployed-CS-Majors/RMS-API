// __tests__/validators/auth.validators.test.js
const {
    validateRegister,
    validateLogin,
    validateRefreshToken,
    isValidEmail
} = require('../../app/validators/auth.validators');

describe('Auth Validators', () => {
    describe('validateRegister', () => {
        it('should return null for valid registration data', () => {
            const req = {
                body: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    phoneNumber: '+1234567890'
                }
            };
            expect(validateRegister(req)).toBeNull();
        });

        it('should return error message when fields are missing', () => {
            const req = {
                body: {
                    firstName: 'John',
                    lastName: 'Doe',
                    // email is missing
                    password: 'password123',
                    phoneNumber: '+1234567890'
                }
            };
            expect(validateRegister(req)).toBe('All fields are required');
        });

        it('should return error message when all fields are missing', () => {
            const req = { body: {} };
            expect(validateRegister(req)).toBe('All fields are required');
        });
    });

    describe('validateLogin', () => {
        it('should return null for valid login data', () => {
            const req = {
                body: {
                    email: 'john.doe@example.com',
                    password: 'password123'
                }
            };
            expect(validateLogin(req)).toBeNull();
        });

        it('should return error message when email is missing', () => {
            const req = {
                body: {
                    password: 'password123'
                }
            };
            expect(validateLogin(req)).toBe('All fields are required');
        });

        it('should return error message when password is missing', () => {
            const req = {
                body: {
                    email: 'john.doe@example.com'
                }
            };
            expect(validateLogin(req)).toBe('All fields are required');
        });

        it('should return error message when all fields are missing', () => {
            const req = { body: {} };
            expect(validateLogin(req)).toBe('All fields are required');
        });
    });

    describe('validateRefreshToken', () => {
        it('should return null for valid refresh token', () => {
            const req = {
                body: {
                    refreshToken: 'validRefreshToken123'
                }
            };
            expect(validateRefreshToken(req)).toBeNull();
        });

        it('should return error message when refresh token is missing', () => {
            const req = { body: {} };
            expect(validateRefreshToken(req)).toBe('Refresh token is required');
        });

        it('should return error message when refresh token is empty', () => {
            const req = {
                body: {
                    refreshToken: ''
                }
            };
            expect(validateRefreshToken(req)).toBe('Refresh token is required');
        });
    });

    describe('isValidEmail', () => {
        it('should return true for valid email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
            expect(isValidEmail('a@b.c')).toBe(true);
        });

        it('should return false for invalid email addresses', () => {
            expect(isValidEmail('plaintext')).toBe(false);
            expect(isValidEmail('missing@domain')).toBe(false);
            expect(isValidEmail('@nodomain.com')).toBe(false);
            expect(isValidEmail('user@.com')).toBe(false);
            expect(isValidEmail('user@domain.')).toBe(false);
            expect(isValidEmail('user name@domain.com')).toBe(false);
        });
    });
});