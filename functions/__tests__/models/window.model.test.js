// __tests__/models/window.model.test.js
const { Window } = require('../../app/models/window.model');

describe('Window Model', () => {
    const sampleWindowData = {
        id: 'window123',
        x: 100,
        y: 200,
        width: 50,
        height: 30,
        rotation: 0
    };

    describe('Window constructor', () => {
        it('should create a new Window instance with provided values', () => {
            const windowObj = new Window(
                sampleWindowData.id,
                sampleWindowData.x,
                sampleWindowData.y,
                sampleWindowData.width,
                sampleWindowData.height,
                sampleWindowData.rotation
            );

            expect(windowObj.id).toBe(sampleWindowData.id);
            expect(windowObj.x).toBe(sampleWindowData.x);
            expect(windowObj.y).toBe(sampleWindowData.y);
            expect(windowObj.width).toBe(sampleWindowData.width);
            expect(windowObj.height).toBe(sampleWindowData.height);
            expect(windowObj.rotation).toBe(sampleWindowData.rotation);
        });
    });

    describe('toFirestore', () => {
        it('should convert Window instance to Firestore format', () => {
            const windowObj = new Window(
                sampleWindowData.id,
                sampleWindowData.x,
                sampleWindowData.y,
                sampleWindowData.width,
                sampleWindowData.height,
                sampleWindowData.rotation
            );

            const firestoreData = windowObj.toFirestore();

            expect(firestoreData).toEqual({
                x: sampleWindowData.x,
                y: sampleWindowData.y,
                width: sampleWindowData.width,
                height: sampleWindowData.height,
                rotation: sampleWindowData.rotation
            });

            // id should not be included in Firestore data
            expect(firestoreData.id).toBeUndefined();
        });
    });

    describe('fromFirestore', () => {
        it('should create a Window instance from Firestore snapshot', () => {
            const snapshot = {
                id: sampleWindowData.id,
                data: () => ({
                    x: sampleWindowData.x,
                    y: sampleWindowData.y,
                    width: sampleWindowData.width,
                    height: sampleWindowData.height,
                    rotation: sampleWindowData.rotation
                })
            };

            const windowObj = Window.fromFirestore(snapshot);

            expect(windowObj).toBeInstanceOf(Window);
            expect(windowObj.id).toBe(sampleWindowData.id);
            expect(windowObj.x).toBe(sampleWindowData.x);
            expect(windowObj.y).toBe(sampleWindowData.y);
            expect(windowObj.width).toBe(sampleWindowData.width);
            expect(windowObj.height).toBe(sampleWindowData.height);
            expect(windowObj.rotation).toBe(sampleWindowData.rotation);
        });
    });

    describe('Window properties handling', () => {
        it('should handle zero values', () => {
            const windowObj = new Window('window0', 0, 0, 0, 0, 0);

            expect(windowObj.x).toBe(0);
            expect(windowObj.y).toBe(0);
            expect(windowObj.width).toBe(0);
            expect(windowObj.height).toBe(0);
            expect(windowObj.rotation).toBe(0);

            const firestoreData = windowObj.toFirestore();
            expect(firestoreData.x).toBe(0);
            expect(firestoreData.y).toBe(0);
            expect(firestoreData.width).toBe(0);
            expect(firestoreData.height).toBe(0);
            expect(firestoreData.rotation).toBe(0);
        });

        it('should handle negative coordinates and rotation values', () => {
            const windowObj = new Window('window-neg', -10, -20, 30, 40, -45);

            expect(windowObj.x).toBe(-10);
            expect(windowObj.y).toBe(-20);
            expect(windowObj.width).toBe(30);
            expect(windowObj.height).toBe(40);
            expect(windowObj.rotation).toBe(-45);

            const firestoreData = windowObj.toFirestore();
            expect(firestoreData.x).toBe(-10);
            expect(firestoreData.y).toBe(-20);
            expect(firestoreData.width).toBe(30);
            expect(firestoreData.height).toBe(40);
            expect(firestoreData.rotation).toBe(-45);
        });

        it('should handle large values', () => {
            const windowObj = new Window('window-large', 1000, 2000, 500, 300, 180);

            expect(windowObj.x).toBe(1000);
            expect(windowObj.y).toBe(2000);
            expect(windowObj.width).toBe(500);
            expect(windowObj.height).toBe(300);
            expect(windowObj.rotation).toBe(180);

            const firestoreData = windowObj.toFirestore();
            expect(firestoreData.x).toBe(1000);
            expect(firestoreData.y).toBe(2000);
            expect(firestoreData.width).toBe(500);
            expect(firestoreData.height).toBe(300);
            expect(firestoreData.rotation).toBe(180);
        });
    });
});