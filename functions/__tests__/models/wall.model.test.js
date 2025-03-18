// __tests__/models/wall.model.test.js
const { Wall } = require('../../app/models/wall.model');

describe('Wall Model', () => {
    const sampleWallData = {
        id: 'wall123',
        x1: 10,
        y1: 20,
        x2: 100,
        y2: 20
    };

    describe('Wall constructor', () => {
        it('should create a new Wall instance with provided values', () => {
            const wall = new Wall(
                sampleWallData.id,
                sampleWallData.x1,
                sampleWallData.y1,
                sampleWallData.x2,
                sampleWallData.y2
            );

            expect(wall.id).toBe(sampleWallData.id);
            expect(wall.x1).toBe(sampleWallData.x1);
            expect(wall.y1).toBe(sampleWallData.y1);
            expect(wall.x2).toBe(sampleWallData.x2);
            expect(wall.y2).toBe(sampleWallData.y2);
        });
    });

    describe('toFirestore', () => {
        it('should convert Wall instance to Firestore format', () => {
            const wall = new Wall(
                sampleWallData.id,
                sampleWallData.x1,
                sampleWallData.y1,
                sampleWallData.x2,
                sampleWallData.y2
            );

            const firestoreData = wall.toFirestore();

            expect(firestoreData).toEqual({
                x1: sampleWallData.x1,
                y1: sampleWallData.y1,
                x2: sampleWallData.x2,
                y2: sampleWallData.y2
            });

            // id should not be included in Firestore data
            expect(firestoreData.id).toBeUndefined();
        });
    });

    describe('fromFirestore', () => {
        it('should create a Wall instance from Firestore snapshot', () => {
            const snapshot = {
                id: sampleWallData.id,
                data: () => ({
                    x1: sampleWallData.x1,
                    y1: sampleWallData.y1,
                    x2: sampleWallData.x2,
                    y2: sampleWallData.y2
                })
            };

            const wall = Wall.fromFirestore(snapshot);

            expect(wall).toBeInstanceOf(Wall);
            expect(wall.id).toBe(sampleWallData.id);
            expect(wall.x1).toBe(sampleWallData.x1);
            expect(wall.y1).toBe(sampleWallData.y1);
            expect(wall.x2).toBe(sampleWallData.x2);
            expect(wall.y2).toBe(sampleWallData.y2);
        });
    });

    describe('Wall coordinates handling', () => {
        it('should handle zero coordinates', () => {
            const wall = new Wall('wall0', 0, 0, 0, 0);

            expect(wall.x1).toBe(0);
            expect(wall.y1).toBe(0);
            expect(wall.x2).toBe(0);
            expect(wall.y2).toBe(0);

            const firestoreData = wall.toFirestore();
            expect(firestoreData.x1).toBe(0);
            expect(firestoreData.y1).toBe(0);
            expect(firestoreData.x2).toBe(0);
            expect(firestoreData.y2).toBe(0);
        });

        it('should handle negative coordinates', () => {
            const wall = new Wall('wall-neg', -10, -20, 30, -40);

            expect(wall.x1).toBe(-10);
            expect(wall.y1).toBe(-20);
            expect(wall.x2).toBe(30);
            expect(wall.y2).toBe(-40);

            const firestoreData = wall.toFirestore();
            expect(firestoreData.x1).toBe(-10);
            expect(firestoreData.y1).toBe(-20);
            expect(firestoreData.x2).toBe(30);
            expect(firestoreData.y2).toBe(-40);
        });
    });
});