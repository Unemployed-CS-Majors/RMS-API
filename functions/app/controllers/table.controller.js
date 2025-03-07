const {createResponse} = require("../utils/response.utils");
const {validateCreateTable} = require("../validators/table.validators");
const TableService = require("../services/table.service");
const {logger} = require("firebase-functions");

class TableController {
    /**
     * Retrieves a table by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The table details or an error response.
     */
    static async getTable(req, res) {
        try {
            const {tableId} = req.params;
            
            const table = await TableService.getTable(tableId);
            if (!table) {
                return res.status(404).json(createResponse("error", "Table not found", null));
            }
            return res.status(200).json(createResponse("success", "Table fetched successfully", table));
        } catch (error) {
            logger.error("Error getting table", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Retrieves all tables.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The list of tables or an error response.
     */
    static async getAllTables(req, res) {
        try {
            
            const tables = await TableService.getAllTables();
            return res.status(200).json(createResponse("success", "Tables fetched successfully", tables));
        } catch (error) {
            logger.error("Error getting all tables", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Creates a new table.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The created table ID or an error response.
     */
    static async createTable(req, res) {
        const validationError = validateCreateTable(req);
        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        try {
            const tableData = req.body;
            const newTable = await TableService.createTable(tableData);
            return res.status(201).json(createResponse("success", "Table created successfully", {id: newTable}));
        } catch (error) {
            logger.error("Error creating table", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Updates an existing table.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The updated table or an error response.
     */
    static async updateTable(req, res) {
        try {
            const {tableId} = req.params;
            const tableData = req.body;
            const updatedTable = await TableService.updateTable(tableId, tableData);
            return res.status(200).json(createResponse("success", "Table updated successfully", updatedTable));
        } catch (error) {
            logger.error("Error updating table", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Deletes a table by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} A success message or an error response.
     */
    static async deleteTable(req, res) {
        try {
            const {tableId} = req.params;
            
            await TableService.deleteTable(tableId);
            return res.status(200).json(createResponse("success", "Table deleted successfully", null));
        } catch (error) {
            logger.error("Error deleting table", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Deactivates a table by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The deactivated table or an error response.
     */
    static async deactivateTable(req, res) {
        try {
            const {tableId} = req.params;
            
            const tableData = {isActive: false};
            const updatedTable = await TableService.updateTable(tableId, tableData);
            return res.status(200).json(createResponse("success", "Table deactivated successfully", updatedTable));
        } catch (error) {
            logger.error("Error deactivating table", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Activates a table by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The activated table or an error response.
     */
    static async activateTable(req, res) {
        try {
            const {tableId} = req.params;
            
            const tableData = {isActive: true};
            const updatedTable = await TableService.updateTable(tableId, tableData);
            return res.status(200).json(createResponse("success", "Table activated successfully", updatedTable));
        } catch (error) {
            logger.error("Error activating table", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }
}

module.exports = TableController;