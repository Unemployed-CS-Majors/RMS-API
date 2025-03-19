// __tests__/services/wall.service.test.js
const WallService = require('../../app/services/wall.service');
const { Wall } = require('../../app/models/wall.model');
const { db } = require('../../app/config/firebase.config');
const { mockDocumentSnapshot, mockQuerySnapshot } = require('../helpers');

jest.mock('../../app/config/firebase.config', () => ({
    db: {
        collection: jest.fn()
    }
}));

describe('Wall Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getWall', () => {
        it('retrieves a wall by ID successfully', async () => {
            const wallData = { id: 'wall1', length: 10, height: 5 };
            const mockWallRef = { get: jest.fn().mockResolvedValue(mockDocumentSnapshot('wall1', wallData)) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWallRef) });

            const result = await WallService.getWall('wall1');

            expect(result).toEqual(Wall.fromFirestore(mockDocumentSnapshot('wall1', wallData)));
        });

        it('returns null if wall does not exist', async () => {
            const mockWallRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWallRef) });

            const result = await WallService.getWall('wall1');

            expect(result).toBeNull();
        });
    });

    describe('getAllWalls', () => {
        it('retrieves all walls successfully', async () => {
            const wallsData = [
                { id: 'wall1', length: 10, height: 5 },
                { id: 'wall2', length: 15, height: 7 }
            ];
            const mockWallsRef = { get: jest.fn().mockResolvedValue(mockQuerySnapshot(wallsData)) };
            db.collection.mockReturnValue(mockWallsRef);

            const result = await WallService.getAllWalls();

            expect(result).toEqual(wallsData.map(data => Wall.fromFirestore(mockDocumentSnapshot(data.id, data))));
        });
    });

    describe('deleteWall', () => {
        it('deletes a wall successfully', async () => {
            const mockWallRef = { delete: jest.fn().mockResolvedValue({}) };
            db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockWallRef) });

            await WallService.deleteWall('wall1');

            expect(mockWallRef.delete).toHaveBeenCalled();
        });
    });
});