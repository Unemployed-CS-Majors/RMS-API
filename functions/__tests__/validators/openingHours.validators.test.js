// __tests__/validators/openingHours.validators.test.js
const { validateOpeningHours } = require('../../app/validators/openingHours.validators');

describe('Opening Hours Validators', () => {
    describe('validateOpeningHours', () => {
        it('should validate valid opening hours data', () => {
            const req = {
                body: {
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '17:00'
                }
            };

            expect(validateOpeningHours(req)).toBeNull();
        });

        it('should reject when day is missing', () => {
            const req = {
                body: {
                    startTime: '09:00',
                    endTime: '17:00'
                }
            };

            expect(validateOpeningHours(req)).toBe('All fields are required');
        });

        it('should reject when start time is after end time', () => {
            const req = {
                body: {
                    day: 'Monday',
                    startTime: '18:00',
                    endTime: '17:00'
                }
            };

            expect(validateOpeningHours(req)).toBe('Start time must be before end time');
        });

        it('should reject when start time is equal to end time', () => {
            const req = {
                body: {
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '09:00'
                }
            };

            expect(validateOpeningHours(req)).toBe('Start time must be before end time');
        });

        it('should validate when only day is provided', () => {
            const req = {
                body: {
                    day: 'Monday'
                }
            };

            expect(validateOpeningHours(req)).toBeNull();
        });

        it('should validate when start time is before end time', () => {
            const req = {
                body: {
                    day: 'Monday',
                    startTime: '08:00',
                    endTime: '09:00'
                }
            };

            expect(validateOpeningHours(req)).toBeNull();
        });
    });
});