const admin = require("firebase-admin");
const { createResponse } = require("../utils/responseUtil");
const { validateCreateTable } = require("../validators/table.validators");
const TableService = require("../services/table.service");

class TableController {
  static async getTable(req, res) {
    try {
      const { tableId } = req.params;
      const db = admin.firestore();
      const table = await TableService.getTable(db, tableId);
      if (!table) {
        return res.status(404).json(createResponse("error", "Table not found", null));
      }
      return res.status(200).json(createResponse("success", "Table fetched successfully", table));
    } catch (error) {
      console.error("Error getting table", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getAllTables(req, res) {
    try {
      const db = admin.firestore();
      const tables = await TableService.getAllTables(db);
      return res.status(200).json(createResponse("success", "Tables fetched successfully", tables));
    } catch (error) {
      console.error("Error getting all tables", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async createTable(req, res) {
    const validationError = validateCreateTable(req);
    if (validationError) {
      return res.status(400).json(createResponse("error", validationError, null));
    }

    try {
      const db = admin.firestore();
      const tableData = req.body;
      const newTable = await TableService.createTable(db, tableData);
      return res.status(201).json(createResponse("success", "Table created successfully", { id: newTable }));
    } catch (error) {
      console.error("Error creating table", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async updateTable(req, res) {
    try {
      const { tableId } = req.params;
      const db = admin.firestore();
      const tableData = req.body;
      const updatedTable = await TableService.updateTable(db, tableId, tableData);
      return res.status(200).json(createResponse("success", "Table updated successfully", updatedTable));
    } catch (error) {
      console.error("Error updating table", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deleteTable(req, res) {
    try {
      const { tableId } = req.params;
      const db = admin.firestore();
      await TableService.deleteTable(db, tableId);
      return res.status(200).json(createResponse("success", "Table deleted successfully", null));
    } catch (error) {
      console.error("Error deleting table", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deactivateTable(req, res) {
    try {
      const { tableId } = req.params;
      const db = admin.firestore();
      const tableData = { isActive: false };
      const updatedTable = await TableService.updateTable(db, tableId, tableData);
      return res.status(200).json(createResponse("success", "Table deactivated successfully", updatedTable));
    } catch (error) {
      console.error("Error deactivating table", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async activateTable(req, res) {
    try {
      const { tableId } = req.params;
      const db = admin.firestore();
      const tableData = { isActive: true };
      const updatedTable = await TableService.updateTable(db, tableId, tableData);
      return res.status(200).json(createResponse("success", "Table activated successfully", updatedTable));
    } catch (error) {
      console.error("Error activating table", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }
}

module.exports = TableController;