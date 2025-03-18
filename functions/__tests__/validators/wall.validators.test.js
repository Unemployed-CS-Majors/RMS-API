// __tests__/validators/wall.validators.test.js
const { validateCreateWall, validateUpdateWall } = require('../../app/validators/wall.validators');

describe('Wall Validators', () => {
    describe('validateCreateWall', () => {
        it('should validate valid wall data', () => {
            const req = {
                body: {
                    x1: 10,
                    y1: 20,
                    x2: 100,
                    y2: 20
                }
            };

            expect(validateCreateWall(req)).toBeNull();
        });

        it('should reject when required fields are missing', () => {
            // Missing x1
            const req1 = {
                body: {
                    y1: 20,
                    x2: 100,
                    y2: 20
                }
            };
            expect(validateCreateWall(req1)).toBe('All fields are required');

            // Missing y1
            const req2 = {
                body: {
                    x1: 10,
                    x2: 100,
                    y2: 20
                }
            };
            expect(validateCreateWall(req2)).toBe('All fields are required');

            // Missing x2
            const req3 = {
                body: {
                    x1: 10,
                    y1: 20,
                    y2: 20
                }
            };
            expect(validateCreateWall(req3)).toBe('All fields are required');

            // Missing y2
            const req4 = {
                body: {
                    x1: 10,
                    y1: 20,
                    x2: 100
                }
            };
            expect(validateCreateWall(req4)).toBe('All fields are required');

            // Empty body
            const req5 = {
                body: {}
            };
            expect(validateCreateWall(req5)).toBe('All fields are required');
        });

        it('should reject when coordinates are not integers', () => {
            // Non-integer x1
            const req1 = {
                body: {
                    x1: 10.5, // Not an integer
                    y1: 20,
                    x2: 100,
                    y2: 20
                }
            };
            expect(validateCreateWall(req1)).toBe('x1 must be an integer');

            // Non-integer y1
            const req2 = {
                body: {
                    x1: 10,
                    y1: 20.5, // Not an integer
                    x2: 100,
                    y2: 20
                }
            };
            expect(validateCreateWall(req2)).toBe('y1 must be an integer');

            // Non-integer x2
            const req3 = {
                body: {
                    x1: 10,
                    y1: 20,
                    x2: 100.5, // Not an integer
                    y2: 20
                }
            };
            expect(validateCreateWall(req3)).toBe('x2 must be an integer');

            // Non-integer y2
            const req4 = {
                body: {
                    x1: 10,
                    y1: 20,
                    x2: 100,
                    y2: 20.5 // Not an integer
                }
            };
            expect(validateCreateWall(req4)).toBe('y2 must be an integer');

            // String coordinates
            const req5 = {
                body: {
                    x1: '10', // String, not number
                    y1: 20,
                    x2: 100,
                    y2: 20
                }
            };
            expect(validateCreateWall(req5)).toBe('x1 must be an integer');
        });

        it('should handle negative and zero values correctly', () => {
            // All fields with valid types but potentially problematic values
            const req = {
                body: {
                    x1: 0,      // Zero
                    y1: -20,    // Negative
                    x2: 0,      // Zero
                    y2: -20     // Negative
                }
            };

            // The current implementation only validates types, not specific value ranges
            expect(validateCreateWall(req)).toBeNull();
        });
    });

    describe('validateUpdateWall', () => {
        it('should validate valid wall update data', () => {
            const req = {
                body: {
                    x1: 15,
                    y1: 25,
                    x2: 150,
                    y2: 25
                }
            };

            expect(validateUpdateWall(req)).toBeNull();
        });

        it('should validate partial wall update data', () => {
            // Only updating x1
            const req1 = {
                body: {
                    x1: 15
                }
            };
            expect(validateUpdateWall(req1)).toBeNull();

            // Only updating y1
            const req2 = {
                body: {
                    y1: 25
                }
            };
            expect(validateUpdateWall(req2)).toBeNull();

            // Only updating x2
            const req3 = {
                body: {
                    x2: 150
                }
            };
            expect(validateUpdateWall(req3)).toBeNull();

            // Only updating y2
            const req4 = {
                body: {
                    y2: 25
                }
            };
            expect(validateUpdateWall(req4)).toBeNull();

            // Updating multiple fields
            const req5 = {
                body: {
                    x1: 15,
                    y1: 25
                }
            };
            expect(validateUpdateWall(req5)).toBeNull();
        });

        it('should reject when no fields are provided', () => {
            const req = {
                body: {}
            };
            expect(validateUpdateWall(req)).toBe('At least one field is required');
        });

        it('should reject when coordinates are not integers', () => {
            // Non-integer x1
            const req1 = {
                body: {
                    x1: 15.5 // Not an integer
                }
            };
            expect(validateUpdateWall(req1)).toBe('x1 must be an integer');

            // Non-integer y1
            const req2 = {
                body: {
                    y1: 25.5 // Not an integer
                }
            };
            expect(validateUpdateWall(req2)).toBe('y1 must be an integer');

            // Non-integer x2
            const req3 = {
                body: {
                    x2: 150.5 // Not an integer
                }
            };
            expect(validateUpdateWall(req3)).toBe('x2 must be an integer');

            // Non-integer y2
            const req4 = {
                body: {
                    y2: 25.5 // Not an integer
                }
            };
            expect(validateUpdateWall(req4)).toBe('y2 must be an integer');

            // String coordinates
            const req5 = {
                body: {
                    x1: '15' // String, not number
                }
            };
            expect(validateUpdateWall(req5)).toBe('x1 must be an integer');
        });

        it('should handle negative and zero values correctly in updates', () => {
            // All fields with valid types but potentially problematic values
            const req = {
                body: {
                    x1: 0,      // Zero
                    y1: -25,    // Negative
                    x2: 0,      // Zero
                    y2: -25     // Negative
                }
            };

            // The current implementation only validates types, not specific value ranges
            expect(validateUpdateWall(req)).toBeNull();
        });

        it('should handle combinations of valid and invalid fields', () => {
            // Mix of valid and invalid fields
            const req = {
                body: {
                    x1: 15,       // Valid
                    y1: 25.5,     // Invalid - not an integer
                    x2: 150,      // Valid
                    y2: '25'      // Invalid - string, not number
                }
            };

            // Should fail on the first invalid field encountered (y1)
            expect(validateUpdateWall(req)).toBe('y1 must be an integer');
        });
    });
});