/**
 * Enum for feature names.
 * @readonly
 * @enum {string}
 */
const FeatureName = Object.freeze({
    ONLINE_RESERVATIONS: 'online_reservations',
    ONLINE_ORDERING: 'online_ordering',
    MENU: 'menu',
    HOME_DELIVERY: 'home_delivery',
    ORDER_PICKUP: 'order_pickup',
    ONLINE_PAYMENT: 'online_payment',
    CASH_PAYMENT: 'cash_payment',
    IN_STORE_PAYMENT: 'in_store_payment',
});

/**
 * Class representing a feature.
 */
class Feature {
    /**
     * Create a feature.
     * @param {FeatureName} name - The name of the feature.
     * @param {boolean} enabled - The status of the feature.
     */
    constructor(name, enabled) {
        this.name = name;
        this.enabled = enabled;
    }

    /**
     * Convert the feature to a Firestore-compatible format.
     * @returns {Object} The Firestore data.
     */
    toFirestore() {
        return {
            name: this.name,
            enabled: Boolean(this.enabled),
        };
    }

    /**
     * Create a feature from a Firestore snapshot.
     * @param {Object} snapshot - The Firestore snapshot.
     * @returns {Feature} The feature instance.
     */
    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Feature(data.name, data.enabled);
    }
}

module.exports = {Feature, FeatureName};