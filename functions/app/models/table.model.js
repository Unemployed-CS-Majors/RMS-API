/**
 * Represents a Table.
 * @class
 */
class Table {
    /**
     * Creates an instance of Table.
     * @param {number} id - The unique identifier for the table.
     * @param {number} seats - The number of seats at the table.
     * @param {boolean} nextToWindow - Indicates if the table is next to a window.
     * @param {boolean} isActive - Indicates if the table is active.
     */
    constructor(id, seats, nextToWindow, isActive) {
        /** @type {number} */
        this.id = id;
        /** @type {number} */
        this.seats = seats;
        /** @type {boolean} */
        this.nextToWindow = nextToWindow;
        this.isActive = isActive;
    }

    /**
     * Converts the Table instance to a Firestore-compatible object.
     * @returns {Object} The Firestore-compatible object.
     */
    toFirestore() {
        return {
            id: this.id,
            seats: this.seats,
            nextToWindow: this.nextToWindow,
            isActive: true
        };
    }

    /**
     * Creates a Table instance from a Firestore snapshot.
     * @param {Object} snapshot - The Firestore snapshot.
     * @returns {Table} The Table instance.
     */
    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Table(
            data.id,
            data.seats,
            data.nextToWindow,
            data.isActive
        );
    }
}

module.exports = { Table };