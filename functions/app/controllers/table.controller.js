const admin = require("firebase-admin");
const { Table } = require("../models/table.model");
const { createResponse } = require("../utils/responseUtil");
const { validateCreateTable } = require("../validators/table.validators");

class TableController {
  static async createTable(req, res) {
    const validationError = validateCreateTable(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }
    const { seats, nextToWindow } = req.body;

    const db = admin.firestore();
    const tableRef = db.collection('tables');
    const counterRef = db.collection('counters').doc('tableCounter');

    try {
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

      return res
        .status(201)
        .json(createResponse("success", "Table created successfully", { id: newTable.id }));
    } catch (error) {
      console.error("Error creating table:", error);
      return res
        .status(500)
        .json(createResponse("error", "Internal Server Error", null));
    }
  }

  static async getAllTables(req, res) {
    const db = admin.firestore();

    try {
      const snapshot = await db.collection('tables').get();
      const tables = snapshot.docs.map(doc => Table.fromFirestore(doc));
      return res
        .status(200)
        .json(createResponse("success", "Tables fetched successfully", tables));
    } catch (error) {
      console.error("Error fetching tables:", error);
      return res
        .status(500)
        .json(createResponse("error", "Internal Server Error", null));
    }
  }

  static async getTableById(req, res) {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json(createResponse("error", "Table ID is required", null));
    }

    const db = admin.firestore();
    const tableRef = db.collection('tables').doc(id);

    try {
      const tableDoc = await tableRef.get();
      if (!tableDoc.exists) {
        return res
          .status(404)
          .json(createResponse("error", "Table not found", null));
      }

      const table = Table.fromFirestore(tableDoc);
      return res
        .status(200)
        .json(createResponse("success", "Table fetched successfully", table));
    } catch (error) {
      console.error("Error fetching table:", error);
      return res
        .status(500)
        .json(createResponse("error", "Internal Server Error", null));
    }
  }

  static async deleteTable(req, res) {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json(createResponse("error", "Table ID is required", null));
    }

    const db = admin.firestore();
    const tableRef = db.collection('tables').doc(id);

    try {
      const tableDoc = await tableRef.get();
      if (!tableDoc.exists) {
        return res
          .status(404)
          .json(createResponse("error", "Table not found", null));
      }

      await tableRef.delete();
      return res
        .status(200)
        .json(createResponse("success", "Table deleted successfully", null));
    } catch (error) {
      console.error("Error deleting table:", error);
      return res
        .status(500)
        .json(createResponse("error", "Internal Server Error", null));
    }
  }

  static async deactivateTable(req, res) {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json(createResponse("error", "Table ID is required", null));
    }

    const db = admin.firestore();
    const tableRef = db.collection('tables').doc(id);

    try {
      const tableDoc = await tableRef.get();
      if (!tableDoc.exists) {
        return res
          .status(404)
          .json(createResponse("error", "Table not found", null));
      }

      await tableRef.update({ isActive: false });
      return res
        .status(200)
        .json(createResponse("success", "Table deactivated successfully", null));
    } catch (error) {
      console.error("Error deactivating table:", error);
      return res
        .status(500)
        .json(createResponse("error", "Internal Server Error", null));
    }
  }

  static async activateTable(req, res) {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json(createResponse("error", "Table ID is required", null));
    }

    const db = admin.firestore();
    const tableRef = db.collection('tables').doc(id);

    try {
      const tableDoc = await tableRef.get();
      if (!tableDoc.exists) {
        return res
          .status(404)
          .json(createResponse("error", "Table not found", null));
      }

      await tableRef.update({ isActive: true });
      return res
        .status(200)
        .json(createResponse("success", "Table activated successfully", null));
    } catch (error) {
      console.error("Error activating table:", error);
      return res
        .status(500)
        .json(createResponse("error", "Internal Server Error", null));
    }
  }
}

module.exports = TableController;