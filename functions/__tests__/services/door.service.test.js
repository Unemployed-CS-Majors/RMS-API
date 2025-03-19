// __tests__/services/door.service.test.js
const DoorService = require('../../app/services/door.service');
const { db } = require('../../app/config/firebase.config');
const { Door } = require('../../app/models/door.model');

// Mock Firestore
jest.mock('../../app/config/firebase.config', () => ({
    db: {
        collection: jest.fn(),
        runTransaction: jest.fn()
    }
}));

describe('Door Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDoor', () => {
        it('retrieves a door by its ID', async () => {
            const mockDoorData = { id: '1', location: 'Front', isAutomatic: true };
            const mockDoc = { exists: true, data: () => mockDoorData };
            const mockDocRef = { get: jest.fn().mockResolvedValue(mockDoc) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

            const result = await DoorService.getDoor('1');

            expect(db.collection).toHaveBeenCalledWith('doors');
            expect(mockDocRef.get).toHaveBeenCalled();
            expect(result).toEqual(Door.fromFirestore(mockDoc));
        });

        it('returns null if the door does not exist', async () => {
            const mockDoc = { exists: false };
            const mockDocRef = { get: jest.fn().mockResolvedValue(mockDoc) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

            const result = await DoorService.getDoor('1');

            expect(db.collection).toHaveBeenCalledWith('doors');
            expect(mockDocRef.get).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('getAllDoors', () => {
        it('retrieves all doors', async () => {
            const mockDoorsData = [
                { id: '1', location: 'Front', isAutomatic: true },
                { id: '2', location: 'Back', isAutomatic: false }
            ];
            const mockSnapshot = {
                forEach: jest.fn(callback => mockDoorsData.forEach(data => callback({ data: () => data })))
            };
            db.collection.mockReturnValue({ get: jest.fn().mockResolvedValue(mockSnapshot) });

            const result = await DoorService.getAllDoors();

            expect(db.collection).toHaveBeenCalledWith('doors');
            expect(mockSnapshot.forEach).toHaveBeenCalled();
        });
    });

    describe('createDoor', () => {
        it('creates a new door and increments the counter', async () => {
            const mockCounterDoc = { exists: true, data: () => ({ count: 1 }) };
            const mockCounterRef = { get: jest.fn().mockResolvedValue(mockCounterDoc), update: jest.fn() };
            const mockDoorRef = { doc: jest.fn().mockReturnValue({ set: jest.fn() }) };
            db.collection.mockImplementation(collection => {
                if (collection === 'counters') return { doc: jest.fn().mockReturnValue(mockCounterRef) };
                if (collection === 'doors') return mockDoorRef;
            });

            db.runTransaction.mockImplementation(async (transactionFn) => {
                const transaction = {
                    get: jest.fn().mockResolvedValue(mockCounterDoc),
                    update: jest.fn(),
                    set: jest.fn()
                };
                return transactionFn(transaction);
            });

            const doorData = { location: 'Front', isAutomatic: true };
            const result = await DoorService.createDoor(doorData);

            expect(db.collection).toHaveBeenCalledWith('counters');
            expect(db.collection).toHaveBeenCalledWith('doors');
            expect(result).toBe(2);
        });

        it('throws an error if the counter document does not exist', async () => {
            const mockCounterDoc = { exists: false };
            const mockCounterRef = { get: jest.fn().mockResolvedValue(mockCounterDoc) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockCounterRef) });

            db.runTransaction.mockImplementation(async (transactionFn) => {
                const transaction = {
                    get: jest.fn().mockResolvedValue(mockCounterDoc),
                    update: jest.fn(),
                    set: jest.fn()
                };
                return transactionFn(transaction);
            });

            await expect(DoorService.createDoor({ location: 'Front', isAutomatic: true }))
                .rejects.toThrow('Counter document does not exist!');
        });
    });

    describe('updateDoor', () => {
        it('updates a door by its ID', async () => {
            const mockDoorData = { location: 'Front', isAutomatic: true };
            const mockDocRef = { update: jest.fn(), get: jest.fn().mockResolvedValue({ data: () => mockDoorData }) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

            const result = await DoorService.updateDoor('1', mockDoorData);

            expect(db.collection).toHaveBeenCalledWith('doors');
            expect(mockDocRef.update).toHaveBeenCalledWith(mockDoorData);
            expect(result).toEqual(Door.fromFirestore({ data: () => mockDoorData }));
        });
    });

    describe('deleteDoor', () => {
        it('deletes a door by its ID', async () => {
            const mockDocRef = { delete: jest.fn() };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

            await DoorService.deleteDoor('1');

            expect(db.collection).toHaveBeenCalledWith('doors');
            expect(mockDocRef.delete).toHaveBeenCalled();
        });
    });
});