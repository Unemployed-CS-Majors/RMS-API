const {Table} = require("../models/table.model");

const {db} = require("../config/firebase.config");

class TableService {
    /**
     * Retrieves a table by its ID.
     * @param {string} tableId - The ID of the table.
     * @returns {Promise<Table|null>} The table if found, otherwise null.
     */
    static async getTable(tableId) {
        const tableRef = db.collection("tables").doc(tableId);
        const tableDoc = await tableRef.get();
        if (!tableDoc.exists) {
            return null;
        }
        return Table.fromFirestore(tableDoc);
    }

    /**
     * Retrieves all tables.
     * @returns {Promise<Table[]>} A list of all tables.
     */
    static async getAllTables() {
        const tablesRef = db.collection("tables");
        const snapshot = await tablesRef.get();
        const tables = [];
        snapshot.forEach(doc => {
            tables.push(Table.fromFirestore(doc));
        });
        return tables;
    }

    static async getTablesWithMinSeats(seats) {
        const tablesRef = db.collection("tables");
        const snapshot = await tablesRef.where("seats", ">=", seats).get();
        const tables = [];
        snapshot.forEach(doc => {
            tables.push(Table.fromFirestore(doc));
        });
        return tables;
    }

    /**
     * Creates a new table.
     * @param {Object} tableData - The data for the new table.
     * @param {number} tableData.seats - The number of seats at the table.
     * @param {boolean} tableData.nextToWindow - Whether the table is next to a window.
     * @returns {Promise<number>} The ID of the newly created table.
     * @throws Will throw an error if the counter document does not exist.
     */
    static async createTable(tableData) {
        const {seats, nextToWindow, x,y,rotation,type} = tableData;
        const tableRef = db.collection("tables");
        const counterRef = db.collection('counters').doc('tableCounter');

        const newTable = await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            if (!counterDoc.exists) {
                throw new Error("Counter document does not exist!");
            }

            const newId = counterDoc.data().count + 1;
            const table = new Table(newId, seats, nextToWindow, true,x,y,rotation,type);

            transaction.update(counterRef, {count: newId});
            transaction.set(tableRef.doc(newId.toString()), table.toFirestore());

            return table;
        });
        return newTable.id;
    }

    /**
     * Updates an existing table.
     * @param {string} tableId - The ID of the table.
     * @param {Object} tableData - The updated table data.
     * @returns {Promise<Table>} The updated table.
     */
    static async updateTable(tableId, tableData) {
        const tableRef = db.collection("tables").doc(tableId);
        await tableRef.update(tableData);
        const updatedTableDoc = await tableRef.get();
        return Table.fromFirestore(updatedTableDoc);
    }

    /**
     * Deletes a table by its ID.
     * @param {string} tableId - The ID of the table.
     * @returns {Promise<void>} A promise that resolves when the table is deleted.
     */
    static async deleteTable(tableId) {
        const tableRef = db.collection("tables").doc(tableId);
        await tableRef.delete();
    }
}

module.exports = TableService;