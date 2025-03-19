const { createResponse } = require("../utils/response.utils");
const WallService = require("../services/wall.service");
const { validateCreateWall, validateUpdateWall } = require("../validators/wall.validators");
const { logger } = require("../logger/FirebaseLogger");
class WallController {
  /**
   * Retrieves a wall by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The wall details or an error response.
   */
  static async getWall(req, res) {
    try {
      const { wallId } = req.params;

      const wall = await WallService.getWall(wallId);
      if (!wall) {
        return res.status(404).json(createResponse("error", "Wall not found", null));
      }
      return res.status(200).json(createResponse("success", "Wall fetched successfully", wall));
    } catch (error) {
      logger.error("Error getting wall", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  /**
   * Retrieves all walls.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The list of walls or an error response.
   */
  static async getAllWalls(req, res) {
    try {
      const walls = await WallService.getAllWalls();
      return res.status(200).json(createResponse("success", "Walls fetched successfully", walls));
    } catch (error) {
      logger.error("Error getting all walls", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  /**
   * Creates a new wall.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The created wall ID or an error response.
   */
  static async createWall(req, res) {
    const validationError = validateCreateWall(req);
    if (validationError) {
      return res.status(400).json(createResponse("error", validationError, null));
    }

    try {
      const newWallId = await WallService.createWall(req.body);
      return res
        .status(201)
        .json(createResponse("success", "Wall created successfully", { id: newWallId }));
    } catch (error) {
      logger.error("Error creating wall", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  /**
   * Updates a wall.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The updated wall details or an error response.
   */
  static async updateWall(req, res) {
    const { wallId } = req.params;
    const validationError = validateUpdateWall(req);

    if (validationError) {
      return res.status(400).json(createResponse("error", validationError, null));
    }

    try {
      const updatedWall = await WallService.updateWall(wallId, req.body);
      return res
        .status(200)
        .json(createResponse("success", "Wall updated successfully", updatedWall));
    } catch (error) {
      logger.error("Error updating wall", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  /**
   * Deletes a wall.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The success message or an error response.
   */
  static async deleteWall(req, res) {
    const { wallId } = req.params;

    try {
      await WallService.deleteWall(wallId);
      return res.status(200).json(createResponse("success", "Wall deleted successfully", null));
    } catch (error) {
      logger.error("Error deleting wall", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }
}

module.exports = WallController;
