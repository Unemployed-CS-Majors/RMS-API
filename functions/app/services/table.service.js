const admin = require("firebase-admin");
const { Table } = require("../models/table.model");

class TableService {
  static async getTable(db, tableId) {
    const tableRef = db.collection("tables").doc(tableId);
    const tableDoc = await tableRef.get();
    if (!tableDoc.exists) {
      return null;
    }
    return Table.fromFirestore(tableDoc);
  }

  static async getAllTables(db) {
    const tablesRef = db.collection("tables");
    const snapshot = await tablesRef.get();
    const tables = [];
    snapshot.forEach(doc => {
      tables.push(Table.fromFirestore(doc));
    });
    return tables;
  }

  static async createTable(db, tableData) {
    const { seats, nextToWindow } = tableData;
    const tableRef = db.collection("tables");
    const counterRef = db.collection('counters').doc('tableCounter');

    const newTable = await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists) {
          throw new Error("Counter document does not exist!");
        }

        const newId = counterDoc.data().count + 1;
        const table = new Table(newId, seats, nextToWindow);

        transaction.update(counterRef, { count: newId });
        transaction.set(tableRef.doc(newId.toString()), table.toFirestore());

        return table;
      });
    return newTable.id;
  }

  static async updateTable(db, tableId, tableData) {
    const tableRef = db.collection("tables").doc(tableId);
    await tableRef.update(tableData);
    const updatedTableDoc = await tableRef.get();
    return Table.fromFirestore(updatedTableDoc);
  }

  static async deleteTable(db, tableId) {
    const tableRef = db.collection("tables").doc(tableId);
    await tableRef.delete();
  }
}

module.exports = TableService;