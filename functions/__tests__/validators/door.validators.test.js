// __tests__/validators/door.validators.test.js
const { validateCreateDoor, validateUpdateDoor } = require('../../app/validators/door.validators');

describe('Door Validators', () => {
    describe('validateCreateDoor', () => {
        it('should validate valid door data', () => {
            const req = {
                body: {
                    x: 10,
                    y: 20,
                    width: 30,
                    height: 40,
                    rotation: 0
                }
            };

            expect(validateCreateDoor(req)).toBeNull();
        });

        it('should reject when required fields are missing', () => {
            const req1 = { body: { y: 20, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateDoor(req1)).toBe('All fields are required');

            const req2 = { body: { x: 10, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateDoor(req2)).toBe('All fields are required');

            const req3 = { body: { x: 10, y: 20, height: 40, rotation: 0 } };
            expect(validateCreateDoor(req3)).toBe('All fields are required');

            const req4 = { body: { x: 10, y: 20, width: 30, rotation: 0 } };
            expect(validateCreateDoor(req4)).toBe('All fields are required');

            const req5 = { body: { x: 10, y: 20, width: 30, height: 40 } };
            expect(validateCreateDoor(req5)).toBe('All fields are required');

            const req6 = { body: {} };
            expect(validateCreateDoor(req6)).toBe('All fields are required');
        });

        it('should reject when coordinates are not integers', () => {
            const req1 = { body: { x: 10.5, y: 20, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateDoor(req1)).toBe('x must be an integer');

            const req2 = { body: { x: 10, y: 20.5, width: 30, height: 40, rotation: 0 } };
            expect(validateCreateDoor(req2)).toBe('y must be an integer');

            const req3 = { body: { x: 10, y: 20, width: 30.5, height: 40, rotation: 0 } };
            expect(validateCreateDoor(req3)).toBe('width must be an integer');

            const req4 = { body: { x: 10, y: 20, width: 30, height: 40.5, rotation: 0 } };
            expect(validateCreateDoor(req4)).toBe('height must be an integer');

            const req5 = { body: { x: 10, y: 20, width: 30, height: 40, rotation: 0.5 } };
            expect(validateCreateDoor(req5)).toBe('rotation must be an integer');
        });
    });

    describe('validateUpdateDoor', () => {
        it('should validate valid door update data', () => {
            const req = {
                body: {
                    x: 15,
                    y: 25,
                    width: 35,
                    height: 45,
                    rotation: 90
                }
            };

            expect(validateUpdateDoor(req)).toBeNull();
        });

        it('should reject when required fields are missing', () => {
            const req1 = { body: { y: 25, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateDoor(req1)).toBe('All fields are required');

            const req2 = { body: { x: 15, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateDoor(req2)).toBe('All fields are required');

            const req3 = { body: { x: 15, y: 25, height: 45, rotation: 90 } };
            expect(validateUpdateDoor(req3)).toBe('All fields are required');

            const req4 = { body: { x: 15, y: 25, width: 35, rotation: 90 } };
            expect(validateUpdateDoor(req4)).toBe('All fields are required');

            const req5 = { body: { x: 15, y: 25, width: 35, height: 45 } };
            expect(validateUpdateDoor(req5)).toBe('All fields are required');

            const req6 = { body: {} };
            expect(validateUpdateDoor(req6)).toBe('All fields are required');
        });

        it('should reject when coordinates are not integers', () => {
            const req1 = { body: { x: 15.5, y: 25, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateDoor(req1)).toBe('x must be an integer');

            const req2 = { body: { x: 15, y: 25.5, width: 35, height: 45, rotation: 90 } };
            expect(validateUpdateDoor(req2)).toBe('y must be an integer');

            const req3 = { body: { x: 15, y: 25, width: 35.5, height: 45, rotation: 90 } };
            expect(validateUpdateDoor(req3)).toBe('width must be an integer');

            const req4 = { body: { x: 15, y: 25, width: 35, height: 45.5, rotation: 90 } };
            expect(validateUpdateDoor(req4)).toBe('height must be an integer');

            const req5 = { body: { x: 15, y: 25, width: 35, height: 45, rotation: 90.5 } };
            expect(validateUpdateDoor(req5)).toBe('rotation must be an integer');
        });
    });
});