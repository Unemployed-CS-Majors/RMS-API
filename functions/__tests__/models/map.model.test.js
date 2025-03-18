// __tests__/models/map.model.test.js
const { Map } = require('../../app/models/map.model');

describe('Map Model', () => {
    describe('Map constructor', () => {
        it('should create a new Map instance with provided map URL', () => {
            const mapUrl = 'https://maps.google.com/?q=Dublin,Ireland';
            const mapModel = new Map(mapUrl);
            expect(mapModel.mapUrl).toBe(mapUrl);
        });

        it('should accept null or undefined map URL', () => {
            // Test with null
            const mapModel1 = new Map(null);
            expect(mapModel1.mapUrl).toBeNull();

            // Test with undefined
            const mapModel2 = new Map(undefined);
            expect(mapModel2.mapUrl).toBeUndefined();
        });
    });

    describe('toFirestore', () => {
        it('should convert Map instance to Firestore format', () => {
            const mapUrl = 'https://maps.google.com/?q=Dublin,Ireland';
            const mapModel = new Map(mapUrl);
            const firestoreData = mapModel.toFirestore();

            expect(firestoreData).toEqual({
                mapUrl: mapUrl
            });
        });

        it('should preserve null or undefined values in Firestore data', () => {
            // Test with null
            const mapModel1 = new Map(null);
            expect(mapModel1.toFirestore()).toEqual({ mapUrl: null });

            // Test with undefined
            const mapModel2 = new Map(undefined);
            expect(mapModel2.toFirestore()).toEqual({ mapUrl: undefined });
        });
    });

    describe('fromFirestore', () => {
        it('should create a Map instance from Firestore snapshot', () => {
            const mapUrl = 'https://maps.google.com/?q=Dublin,Ireland';
            const snapshot = {
                data: () => ({
                    mapUrl: mapUrl
                })
            };

            const mapModel = Map.fromFirestore(snapshot);

            expect(mapModel).toBeInstanceOf(Map);
            expect(mapModel.mapUrl).toBe(mapUrl);
        });

        it('should handle missing mapUrl field in Firestore snapshot', () => {
            const snapshot = {
                data: () => ({
                    // Missing mapUrl field
                })
            };

            const mapModel = Map.fromFirestore(snapshot);

            expect(mapModel).toBeInstanceOf(Map);
            expect(mapModel.mapUrl).toBeUndefined();
        });
    });

    describe('Map usage scenarios', () => {
        it('should handle different map URL formats', () => {
            // Test with Google Maps URL
            const mapModel1 = new Map('https://maps.google.com/?q=Dublin,Ireland');
            expect(mapModel1.mapUrl).toBe('https://maps.google.com/?q=Dublin,Ireland');

            // Test with coordinate-based URL
            const mapModel2 = new Map('https://maps.google.com/?ll=53.3498,-6.2603');
            expect(mapModel2.mapUrl).toBe('https://maps.google.com/?ll=53.3498,-6.2603');

            // Test with place ID
            const mapModel3 = new Map('https://maps.google.com/?cid=12345678901234567890');
            expect(mapModel3.mapUrl).toBe('https://maps.google.com/?cid=12345678901234567890');

            // Test with empty string
            const mapModel4 = new Map('');
            expect(mapModel4.mapUrl).toBe('');
        });
    });
});