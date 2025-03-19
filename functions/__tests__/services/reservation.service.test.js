// __tests__/services/reservation.service.test.js
const ReservationService = require('../../app/services/reservation.service');
const { db } = require('../../app/config/firebase.config');
const { ReservationStatus } = require('../../app/models/reservation.model');
const { mockFirestoreCollection, mockDocumentSnapshot } = require('../helpers');

jest.mock('../../app/config/firebase.config', () => ({
    db: {
        collection: jest.fn()
    }
}));

describe('Reservation Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkForOverlap', () => {
        it('returns null if there is no overlap', async () => {
            const mockQuerySnapshot = { empty: true };
            db.collection.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockResolvedValue(mockQuerySnapshot)
            });

            const result = await ReservationService.checkForOverlap('table1', new Date(), new Date());

            expect(result).toBeNull();
        });

        it('returns a message if there is an overlap', async () => {
            const mockQuerySnapshot = { empty: false };
            db.collection.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                get: jest.fn().mockResolvedValue(mockQuerySnapshot)
            });

            const result = await ReservationService.checkForOverlap('table1', new Date(), new Date());

            expect(result).toBe('Time slot is already booked');
        });
    });

    describe('createReservation', () => {
        it('creates a new reservation successfully', async () => {
            const reservationData = {
                userId: 'user1',
                tableId: 'table1',
                startTime: new Date(),
                endTime: new Date(),
                status: ReservationStatus.PENDING
            };
            const mockReservationRef = { id: 'reservation1', get: jest.fn().mockResolvedValue(mockDocumentSnapshot('reservation1', reservationData)) };
            db.collection.mockReturnValue({ add: jest.fn().mockResolvedValue(mockReservationRef) });
        });

        it('throws an error if reservation creation fails', async () => {
            const reservationData = {
                userId: 'user1',
                tableId: 'table1',
                startTime: new Date(),
                endTime: new Date(),
                status: ReservationStatus.PENDING
            };
        });
    });
});