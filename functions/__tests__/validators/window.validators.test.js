// __tests__/validators/window.validators.test.js
const { validateCreateWindow, validateUpdateWall } = require('../../app/validators/window.validators');

describe('Window Validators', () => {
    describe('validateCreateWindow', () => {
        it('should validate valid window data', () => {
            const req = {
                body: {
                    x: 10,
                    y: 20,
                    width: 30,
                    height: 40,
                    rotation: 0
                }
            };

            expect(validateCreateWindow(req)).toBeNull();
        });

        it('should reject when required fields are missing', () => {
            const req1 = { body: { y: 20, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateWindow(req1)).toBe('All fields are required');

            const req2 = { body: { x: 10, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateWindow(req2)).toBe('All fields are required');

            const req3 = { body: { x: 10, y: 20, height: 40, rotation: 0 } };
            expect(validateCreateWindow(req3)).toBe('All fields are required');

            const req4 = { body: { x: 10, y: 20, width: 30, rotation: 0 } };
            expect(validateCreateWindow(req4)).toBe('All fields are required');

            const req5 = { body: { x: 10, y: 20, width: 30, height: 40 } };
            expect(validateCreateWindow(req5)).toBe('All fields are required');

            const req6 = { body: {} };
            expect(validateCreateWindow(req6)).toBe('All fields are required');
        });

        it('should reject when coordinates are not integers', () => {
            const req1 = { body: { x: 10.5, y: 20, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateWindow(req1)).toBe('x must be an integer');

            const req2 = { body: { x: 10, y: 20.5, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateWindow(req2)).toBe('y must be an integer');

            const req3 = { body: { x: 10, y: 20, width: 30.5, height: 40, rotation: 0 } };
            expect(validateCreateWindow(req3)).toBe('width must be an integer');

            const req4 = { body: { x: 10, y: 20, width: 30, height: 40.5, rotation: 0 } };
            expect(validateCreateWindow(req4)).toBe('height must be an integer');

            const req5 = { body: { x: 10, y: 20, width: 30, height: 40, rotation: 0.5 } };
            expect(validateCreateWindow(req5)).toBe('rotation must be an integer');
        });
    });

    describe('validateUpdateWall', () => {
        it('should validate valid wall update data', () => {
            const req = {
                body: {
                    x: 15,
                    y: 25,
                    width: 35,
                    height: 45,
                    rotation: 90
                }
            };

            expect(validateUpdateWall(req)).toBeNull();
        });

        it('should reject when required fields are missing', () => {
            const req1 = { body: { y: 25, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateWall(req1)).toBe('All fields are required');

            const req2 = { body: { x: 15, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateWall(req2)).toBe('All fields are required');

            const req3 = { body: { x: 15, y: 25, height: 45, rotation: 90 } };
            expect(validateUpdateWall(req3)).toBe('All fields are required');

            const req4 = { body: { x: 15, y: 25, width: 35, rotation: 90 } };
            expect(validateUpdateWall(req4)).toBe('All fields are required');

            const req5 = { body: { x: 15, y: 25, width: 35, height: 45 } };
            expect(validateUpdateWall(req5)).toBe('All fields are required');

            const req6 = { body: {} };
            expect(validateUpdateWall(req6)).toBe('All fields are required');
        });

        it('should reject when coordinates are not integers', () => {
            const req1 = { body: { x: 15.5, y: 25, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateWall(req1)).toBe('x must be an integer');

            const req2 = { body: { x: 15, y: 25.5, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateWall(req2)).toBe('y must be an integer');

            const req3 = { body: { x: 15, y: 25, width: 35.5, height: 45, rotation: 90 } };
            expect(validateUpdateWall(req3)).toBe('width must be an integer');

            const req4 = { body: { x: 15, y: 25, width: 35, height: 45.5, rotation: 90 } };
            expect(validateUpdateWall(req4)).toBe('height must be an integer');

            const req5 = { body: { x: 15, y: 25, width: 35, height: 45, rotation: 90.5 } };
            expect(validateUpdateWall(req5)).toBe('rotation must be an integer');
        });
    });
});