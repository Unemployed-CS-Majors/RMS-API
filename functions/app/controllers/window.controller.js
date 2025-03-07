const {createResponse} = require("../utils/response.utils");
const WindowService = require("../services/window.service");
const {validateCreateWindow, validateUpdateWall} = require("../validators/window.validators");
const {logger} = require("../logger/FirebaseLogger");

class WindowController {
    /**
     * Retrieves a window by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The window details or an error response.
     */
    static async getWindow(req, res) {
        try {
            const {windowId} = req.params;

            const window = await WindowService.getWindow(windowId);
            if (!window) {
                return res.status(404).json(createResponse("error", "Window not found", null));
            }
            return res.status(200).json(createResponse("success", "Window fetched successfully", window));
        } catch (error) {
            logger.error("Error getting window", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Retrieves all windows.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The list of windows or an error response.
     */
    static async getAllWindows(req, res) {
        try {
            const windows = await WindowService.getAllWindows();
            return res.status(200).json(createResponse("success", "Windows fetched successfully", windows));
        } catch (error) {
            logger.error("Error getting all windows", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Creates a new window.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The created window ID or an error response.
     */
    static async createWindow(req, res) {
        const validationError = validateCreateWindow(req);

        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        try {
            const newWindowId = await WindowService.createWindow(req.body);
            return res.status(201).json(createResponse("success", "Window created successfully", {id: newWindowId}));
        } catch (error) {
            logger.error("Error creating window", error);
        }
    }

    /**
     * Updates a window.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The updated window details or an error response.
     */
    static async updateWindow(req, res) {
        const {windowId} = req.params;
        const validationError = validateUpdateWall(req);

        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        try {
            const updatedWindow = await WindowService.updateWindow(windowId, req.body);
            return res.status(200).json(createResponse("success", "Window updated successfully", updatedWindow));
        } catch (error) {
            logger.error("Error updating window", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Deletes a window.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The success message or an error response.
     */
    static async deleteWindow(req, res) {
        const {windowId} = req.params;

        try {
            const result = await WindowService.deleteWindow(windowId);
            if (!result) {
                return res.status(404).json(createResponse("error", "Window not found", null));
            }
            return res.status(200).json(createResponse("success", "Window deleted successfully", null));
        } catch (error) {
            logger.error("Error deleting window", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }
}

module.exports = WindowController;