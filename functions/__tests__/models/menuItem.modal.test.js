// __tests__/models/menuItem.model.test.js
const { MenuItem, ItemType, Allergen } = require('../../app/models/menuItem.model');

// Mock the logger
jest.mock('../../app/logger/FirebaseLogger', () => ({
    logger: {
        log: jest.fn()
    }
}));

describe('MenuItem Model', () => {
    const sampleMenuItemData = {
        id: 'item123',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce and mozzarella',
        price: 12.99,
        type: ItemType.MAIN,
        calories: 800,
        avgWaitTime: 15,
        allergens: [Allergen.GLUTEN, Allergen.DAIRY],
        imageUrl: 'https://example.com/pizza.jpg',
        createdAt: 1635789600000,
        updatedAt: 1635789600000
    };

    describe('MenuItem constructor', () => {
        it('should create a new MenuItem instance with provided values', () => {
            const menuItem = new MenuItem(
                sampleMenuItemData.id,
                sampleMenuItemData.name,
                sampleMenuItemData.description,
                sampleMenuItemData.price,
                sampleMenuItemData.type,
                sampleMenuItemData.calories,
                sampleMenuItemData.avgWaitTime,
                sampleMenuItemData.allergens,
                sampleMenuItemData.imageUrl,
                sampleMenuItemData.createdAt,
                sampleMenuItemData.updatedAt
            );

            expect(menuItem.id).toBe(sampleMenuItemData.id);
            expect(menuItem.name).toBe(sampleMenuItemData.name);
            expect(menuItem.description).toBe(sampleMenuItemData.description);
            expect(menuItem.price).toBe(sampleMenuItemData.price);
            expect(menuItem.type).toBe(sampleMenuItemData.type);
            expect(menuItem.calories).toBe(sampleMenuItemData.calories);
            expect(menuItem.avgWaitTime).toBe(sampleMenuItemData.avgWaitTime);
            expect(menuItem.allergens).toEqual(sampleMenuItemData.allergens);
            expect(menuItem.imageUrl).toBe(sampleMenuItemData.imageUrl);
            expect(menuItem.createdAt).toBe(sampleMenuItemData.createdAt);
            expect(menuItem.updatedAt).toBe(sampleMenuItemData.updatedAt);
        });

        it('should create a new MenuItem instance with default values when not provided', () => {
            const menuItem = new MenuItem(
                null,
                sampleMenuItemData.name,
                null,
                sampleMenuItemData.price,
                sampleMenuItemData.type
            );

            expect(menuItem.id).toBeNull();
            expect(menuItem.description).toBeNull();
            expect(menuItem.calories).toBeNull();
            expect(menuItem.avgWaitTime).toBeNull();
            expect(menuItem.allergens).toEqual([]);
            expect(menuItem.imageUrl).toBeNull();
            expect(menuItem.createdAt).toBeNull();
            expect(menuItem.updatedAt).toBeNull();
        });
    });

    describe('toFirestore', () => {
        it('should convert MenuItem instance to Firestore format', () => {
            const menuItem = new MenuItem(
                sampleMenuItemData.id,
                sampleMenuItemData.name,
                sampleMenuItemData.description,
                sampleMenuItemData.price,
                sampleMenuItemData.type,
                sampleMenuItemData.calories,
                sampleMenuItemData.avgWaitTime,
                sampleMenuItemData.allergens,
                sampleMenuItemData.imageUrl,
                sampleMenuItemData.createdAt,
                sampleMenuItemData.updatedAt
            );

            const firestoreData = menuItem.toFirestore();

            expect(firestoreData).toEqual({
                name: sampleMenuItemData.name,
                description: sampleMenuItemData.description,
                price: sampleMenuItemData.price,
                type: sampleMenuItemData.type,
                calories: sampleMenuItemData.calories,
                avgWaitTime: sampleMenuItemData.avgWaitTime,
                allergens: sampleMenuItemData.allergens,
                imageUrl: sampleMenuItemData.imageUrl,
                createdAt: sampleMenuItemData.createdAt,
                updatedAt: expect.any(Number) // This should be updated to current time
            });

            // id should not be included in Firestore data
            expect(firestoreData.id).toBeUndefined();
        });

        it('should add createdAt timestamp for new items', () => {
            const menuItem = new MenuItem(
                null, // New item without ID
                sampleMenuItemData.name,
                sampleMenuItemData.description,
                sampleMenuItemData.price,
                sampleMenuItemData.type
            );

            const firestoreData = menuItem.toFirestore();

            expect(firestoreData.createdAt).toEqual(expect.any(Number));
            expect(firestoreData.updatedAt).toEqual(expect.any(Number));
        });

        it('should only include defined optional fields', () => {
            const menuItem = new MenuItem(
                sampleMenuItemData.id,
                sampleMenuItemData.name,
                sampleMenuItemData.description,
                sampleMenuItemData.price,
                sampleMenuItemData.type,
                null, // No calories
                15,   // Has avgWaitTime
                [],   // Empty allergens
                null  // No imageUrl
            );

            const firestoreData = menuItem.toFirestore();

            expect(firestoreData.calories).toBeUndefined();
            expect(firestoreData.avgWaitTime).toBe(15);
            expect(firestoreData.allergens).toEqual([]);
            expect(firestoreData.imageUrl).toBeUndefined();
        });
    });

    describe('fromFirestore', () => {
        it('should create a MenuItem instance from Firestore snapshot', () => {
            const snapshot = {
                id: sampleMenuItemData.id,
                data: () => ({
                    name: sampleMenuItemData.name,
                    description: sampleMenuItemData.description,
                    price: sampleMenuItemData.price,
                    type: sampleMenuItemData.type,
                    calories: sampleMenuItemData.calories,
                    avgWaitTime: sampleMenuItemData.avgWaitTime,
                    allergens: sampleMenuItemData.allergens,
                    imageUrl: sampleMenuItemData.imageUrl,
                    createdAt: sampleMenuItemData.createdAt,
                    updatedAt: sampleMenuItemData.updatedAt
                })
            };

            const menuItem = MenuItem.fromFirestore(snapshot);

            expect(menuItem).toBeInstanceOf(MenuItem);
            expect(menuItem.id).toBe(sampleMenuItemData.id);
            expect(menuItem.name).toBe(sampleMenuItemData.name);
            expect(menuItem.description).toBe(sampleMenuItemData.description);
            expect(menuItem.price).toBe(sampleMenuItemData.price);
            expect(menuItem.type).toBe(sampleMenuItemData.type);
            expect(menuItem.calories).toBe(sampleMenuItemData.calories);
            expect(menuItem.avgWaitTime).toBe(sampleMenuItemData.avgWaitTime);
            expect(menuItem.allergens).toEqual(sampleMenuItemData.allergens);
            expect(menuItem.imageUrl).toBe(sampleMenuItemData.imageUrl);
            expect(menuItem.createdAt).toBe(sampleMenuItemData.createdAt);
            expect(menuItem.updatedAt).toBe(sampleMenuItemData.updatedAt);
        });

        it('should handle missing optional fields in Firestore snapshot', () => {
            const snapshot = {
                id: 'item456',
                data: () => ({
                    name: 'Caesar Salad',
                    description: 'Fresh salad with Caesar dressing',
                    price: 8.99,
                    type: ItemType.APPETIZER
                    // Missing other optional fields
                })
            };

            const menuItem = MenuItem.fromFirestore(snapshot);

            expect(menuItem).toBeInstanceOf(MenuItem);
            expect(menuItem.id).toBe('item456');
            expect(menuItem.name).toBe('Caesar Salad');
            expect(menuItem.calories).toBeNull();
            expect(menuItem.avgWaitTime).toBeNull();
            expect(menuItem.allergens).toEqual([]);
            expect(menuItem.imageUrl).toBeNull();
            expect(menuItem.createdAt).toBeNull();
            expect(menuItem.updatedAt).toBeNull();
        });
    });

    describe('fromRequestBody', () => {
        beforeEach(() => {
            // Reset mocks
            jest.clearAllMocks();
        });

        it('should create a MenuItem instance from request body data', () => {
            const requestData = {
                name: 'Chicken Wings',
                description: 'Spicy buffalo wings',
                price: '9.99',
                type: ItemType.APPETIZER,
                calories: '450',
                avgWaitTime: '10',
                allergens: JSON.stringify([Allergen.EGGS]),
                imageUrl: 'https://example.com/wings.jpg'
            };

            const menuItem = MenuItem.fromRequestBody(requestData);

            expect(menuItem).toBeInstanceOf(MenuItem);
            expect(menuItem.id).toBeNull();
            expect(menuItem.name).toBe(requestData.name);
            expect(menuItem.description).toBe(requestData.description);
            expect(menuItem.price).toBe(9.99); // Converted to number
            expect(menuItem.type).toBe(requestData.type);
            expect(menuItem.calories).toBe(450); // Converted to number
            expect(menuItem.avgWaitTime).toBe(10); // Converted to number
            expect(menuItem.allergens).toEqual([Allergen.EGGS]);
            expect(menuItem.imageUrl).toBe(requestData.imageUrl);
        });

        it('should handle allergens as an array in request body', () => {
            const requestData = {
                name: 'Seafood Pasta',
                description: 'Pasta with mixed seafood',
                price: '14.99',
                type: ItemType.MAIN,
                allergens: [Allergen.SHELLFISH, Allergen.GLUTEN, Allergen.FISH]
            };

            const menuItem = MenuItem.fromRequestBody(requestData);

            expect(menuItem.allergens).toEqual([
                Allergen.SHELLFISH,
                Allergen.GLUTEN,
                Allergen.FISH
            ]);
        });

        it('should handle missing optional fields in request body', () => {
            const requestData = {
                name: 'House Salad',
                price: '6.99',
                type: ItemType.APPETIZER
                // Missing description, calories, avgWaitTime, allergens, imageUrl
            };

            const menuItem = MenuItem.fromRequestBody(requestData);

            expect(menuItem.description).toBeNull();
            expect(menuItem.calories).toBeNull();
            expect(menuItem.avgWaitTime).toBeNull();
            expect(menuItem.allergens).toEqual([]);
            expect(menuItem.imageUrl).toBeNull();
        });
    });

    describe('toJSON', () => {
        it('should convert MenuItem instance to a plain object', () => {
            const menuItem = new MenuItem(
                sampleMenuItemData.id,
                sampleMenuItemData.name,
                sampleMenuItemData.description,
                sampleMenuItemData.price,
                sampleMenuItemData.type,
                sampleMenuItemData.calories,
                sampleMenuItemData.avgWaitTime,
                sampleMenuItemData.allergens,
                sampleMenuItemData.imageUrl,
                sampleMenuItemData.createdAt,
                sampleMenuItemData.updatedAt
            );

            const json = menuItem.toJSON();

            expect(json).toEqual({
                id: sampleMenuItemData.id,
                name: sampleMenuItemData.name,
                description: sampleMenuItemData.description,
                price: sampleMenuItemData.price,
                type: sampleMenuItemData.type,
                calories: sampleMenuItemData.calories,
                avgWaitTime: sampleMenuItemData.avgWaitTime,
                allergens: sampleMenuItemData.allergens,
                imageUrl: sampleMenuItemData.imageUrl,
                createdAt: sampleMenuItemData.createdAt,
                updatedAt: sampleMenuItemData.updatedAt
            });
        });
    });

    describe('Enum values', () => {
        it('should have the correct ItemType values', () => {
            expect(ItemType.APPETIZER).toBe('appetizer');
            expect(ItemType.MAIN).toBe('main');
            expect(ItemType.DESSERT).toBe('dessert');
            expect(ItemType.BEVERAGE).toBe('beverage');
            expect(ItemType.SIDE).toBe('side');
            expect(ItemType.SPECIAL).toBe('special');
        });

        it('should have the correct Allergen values', () => {
            expect(Allergen.GLUTEN).toBe('gluten');
            expect(Allergen.DAIRY).toBe('dairy');
            expect(Allergen.EGGS).toBe('eggs');
            expect(Allergen.NUTS).toBe('nuts');
            expect(Allergen.PEANUTS).toBe('peanuts');
            expect(Allergen.SHELLFISH).toBe('shellfish');
            expect(Allergen.FISH).toBe('fish');
            expect(Allergen.SOY).toBe('soy');
            expect(Allergen.WHEAT).toBe('wheat');
        });
    });
});