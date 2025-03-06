const {createResponse} = require("../utils/response.utils");
const DoorService = require("../services/door.service");
const {validateCreateDoor,validateUpdateDoor} = require("../validators/door.validators");

class DoorController {
    /**
     * Retrieves a door by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The door details or an error response.
     */
    static async getDoor(req, res) {
        try {
            const {doorId} = req.params;

            const door = await DoorService.getDoor(doorId);
            if (!door) {
                return res.status(404).json(createResponse("error", "Door not found", null));
            }
            return res.status(200).json(createResponse("success", "Door fetched successfully", door));
        } catch (error) {
            console.error("Error getting door", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Retrieves all doors.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The list of doors or an error response.
     */
    static async getAllDoors(req, res) {
        try {
            const doors = await DoorService.getAllDoors();
            return res.status(200).json(createResponse("success", "Doors fetched successfully", doors));
        } catch (error) {
            console.error("Error getting all doors", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Creates a new door.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The created door ID or an error response.
     */
    static async createDoor(req, res) {
        const validationError = validateCreateDoor(req);

        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        try {
            const newDoorId = await DoorService.createDoor(req.body);
            return res.status(201).json(createResponse("success", "Door created successfully", {id: newDoorId}));
        } catch (error) {
            console.error("Error creating door", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Updates a door.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The updated door details or an error response.
     */
    static async updateDoor(req, res) {
        const {doorId} = req.params;
        const validationError = validateUpdateDoor(req);

        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        try {
            const updatedDoor = await DoorService.updateDoor(doorId, req.body);
            if (!updatedDoor) {
                return res.status(404).json(createResponse("error", "Door not found", null));
            }
            return res.status(200).json(createResponse("success", "Door updated successfully", updatedDoor));
        } catch (error) {
            console.error("Error updating door", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Deletes a door.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The result of the delete operation.
     */
    static async deleteDoor(req, res) {
        const {doorId} = req.params;

        try {
            await DoorService.deleteDoor(doorId);
            return res.status(200).json(createResponse("success", "Door deleted successfully", null));
        } catch (error) {
            console.error("Error deleting door", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }
}

module.exports = DoorController;