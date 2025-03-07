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
     * @param x
     * @param y
     */
    constructor(id, seats, nextToWindow, isActive, x, y, rotation,type, tabeleNum) {
        /** @type {number} */
        this.id = id;
        /** @type {number} */
        this.seats = seats;
        /** @type {boolean} */
        this.nextToWindow = nextToWindow;
        /** @type {boolean} */
        this.isActive = isActive;
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
        /** @type {number} */
        this.rotation = rotation;
        /** @type {string} */
        this.type = type
        /** @type {number} */
        this.tabeleNum = tabeleNum
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
            isActive: this.isActive,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            type: this.type,
            tableNum: this.tabeleNum
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
            data.isActive,
            data.x,
            data.y,
            data.rotation,
            data.type,
            data.tableNum
        );
    }
}

module.exports = {Table};