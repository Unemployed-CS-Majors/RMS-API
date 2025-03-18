// __tests__/models/feature.model.test.js
const { Feature, FeatureName } = require('../../app/models/feature.model');

describe('Feature Model', () => {
    describe('Feature constructor', () => {
        it('should create a new Feature instance with provided values', () => {
            const feature = new Feature(FeatureName.ONLINE_ORDERING, true);

            expect(feature.name).toBe(FeatureName.ONLINE_ORDERING);
            expect(feature.enabled).toBe(true);
        });
    });

    describe('toFirestore', () => {
        it('should convert Feature instance to Firestore format', () => {
            const feature = new Feature(FeatureName.ONLINE_RESERVATIONS, true);

            const firestoreData = feature.toFirestore();

            expect(firestoreData).toEqual({
                name: FeatureName.ONLINE_RESERVATIONS,
                enabled: true
            });
        });

        it('should convert non-boolean enabled values to boolean', () => {
            // Test with truthy values
            let feature = new Feature(FeatureName.MENU, 1);
            expect(feature.toFirestore().enabled).toBe(true);

            feature = new Feature(FeatureName.MENU, 'true');
            expect(feature.toFirestore().enabled).toBe(true);

            feature = new Feature(FeatureName.MENU, {});
            expect(feature.toFirestore().enabled).toBe(true);

            // Test with falsy values
            feature = new Feature(FeatureName.MENU, 0);
            expect(feature.toFirestore().enabled).toBe(false);

            feature = new Feature(FeatureName.MENU, '');
            expect(feature.toFirestore().enabled).toBe(false);

            feature = new Feature(FeatureName.MENU, null);
            expect(feature.toFirestore().enabled).toBe(false);

            feature = new Feature(FeatureName.MENU, undefined);
            expect(feature.toFirestore().enabled).toBe(false);
        });
    });

    describe('fromFirestore', () => {
        it('should create a Feature instance from Firestore snapshot', () => {
            const snapshot = {
                data: () => ({
                    name: FeatureName.HOME_DELIVERY,
                    enabled: true
                })
            };

            const feature = Feature.fromFirestore(snapshot);

            expect(feature).toBeInstanceOf(Feature);
            expect(feature.name).toBe(FeatureName.HOME_DELIVERY);
            expect(feature.enabled).toBe(true);
        });

        it('should handle boolean conversion from Firestore data', () => {
            // Test with non-boolean values
            const snapshot = {
                data: () => ({
                    name: FeatureName.HOME_DELIVERY,
                    enabled: 1 // Non-boolean value
                })
            };

            const feature = Feature.fromFirestore(snapshot);

            expect(feature.enabled).toBe(1); // Original value preserved
            expect(feature.toFirestore().enabled).toBe(true); // Converted during toFirestore
        });
    });

    describe('FeatureName enum', () => {
        it('should have the correct feature name values', () => {
            expect(FeatureName.ONLINE_RESERVATIONS).toBe('online_reservations');
            expect(FeatureName.ONLINE_ORDERING).toBe('online_ordering');
            expect(FeatureName.MENU).toBe('menu');
            expect(FeatureName.HOME_DELIVERY).toBe('home_delivery');
            expect(FeatureName.ORDER_PICKUP).toBe('order_pickup');
            expect(FeatureName.ONLINE_PAYMENT).toBe('online_payment');
            expect(FeatureName.CASH_PAYMENT).toBe('cash_payment');
            expect(FeatureName.IN_STORE_PAYMENT).toBe('in_store_payment');
        });
    });

    describe('Feature usage scenarios', () => {
        it('should support toggling feature state', () => {
            const feature = new Feature(FeatureName.ONLINE_ORDERING, true);

            // Toggle feature off
            feature.enabled = false;
            expect(feature.enabled).toBe(false);
            expect(feature.toFirestore().enabled).toBe(false);

            // Toggle feature on
            feature.enabled = true;
            expect(feature.enabled).toBe(true);
            expect(feature.toFirestore().enabled).toBe(true);
        });
    });
});