const { createResponse } = require("../utils/response.utils");
const { validateOpeningHours } = require("../validators/openingHours.validators");
const OpeningHoursService = require("../services/openingHours.service");
const { OpeningHours } = require("../models/openingHours.model");

class OpeningHoursController {
  /**
   * Retrieves opening hours by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The opening hours or an error response.
   */
  static async getOpeningHoursById(req, res) {
    const { id } = req.params;
    try {
      const openingHours = await OpeningHoursService.getOpeningHoursById(id);
      return res
          .status(200)
          .json(createResponse("success", "Opening hours fetched successfully", openingHours));
    } catch (error) {
      console.error("Error fetching opening hours:", error);
      return res
          .status(500)
          .json(createResponse("error", "Internal Server Error", null));
    }
  }

  /**
   * Retrieves all opening hours.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The list of opening hours or an error response.
   */
  static async getAllOpeningHours(req, res) {
    try {
      const openingHoursList = await OpeningHoursService.getAllOpeningHours();
      return res
          .status(200)
          .json(createResponse("success", "Opening hours fetched successfully", openingHoursList));
    } catch (error) {
      console.error("Error fetching opening hours:", error);
      return res
          .status(500)
          .json(createResponse("error", "Internal Server Error", null));
    }
  }

  /**
   * Creates new opening hours.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The created opening hours or an error response.
   */
  static async createOpeningHours(req, res) {
    const validationError = validateOpeningHours(req);
    if (validationError) {
      return res
          .status(400)
          .json(createResponse("error", validationError, null));
    }

    try {
      const newOpeningHours = await OpeningHoursService.createOpeningHours(req.body);
      return res
          .status(201)
          .json(createResponse("success", "Opening hours created successfully", newOpeningHours));
    } catch (error) {
      console.error("Error creating opening hours:", error);
      return res
          .status(500)
          .json(createResponse("error", "Internal Server Error", null));
    }
  }

  /**
   * Updates existing opening hours.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The updated opening hours or an error response.
   */
  static async updateOpeningHours(req, res) {
    const validationError = validateOpeningHours(req);
    if (validationError) {
      return res
          .status(400)
          .json(createResponse("error", validationError, null));
    }
    const { day, startTime, endTime } = req.body;
    const { id } = req.params;
    try {
      const newOpeningHours = new OpeningHours(id, day, startTime, endTime);
      const updatedOpeningHours = await OpeningHoursService.updateOpeningHours(id, newOpeningHours);
      return res
          .status(200)
          .json(createResponse("success", "Opening hours updated successfully", updatedOpeningHours));
    } catch (error) {
      console.error("Error updating opening hours:", error);
      return res
          .status(500)
          .json(createResponse("error", "Internal Server Error", null));
    }
  }

  /**
   * Deletes opening hours by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} A success message or an error response.
   */
  static async deleteOpeningHours(req, res) {
    const { id } = req.params;
    try {
      await OpeningHoursService.deleteOpeningHours(id);
      return res
          .status(200)
          .json(createResponse("success", "Opening hours deleted successfully", null));
    } catch (error) {
      console.error("Error deleting opening hours:", error);
      return res
          .status(500)
          .json(createResponse("error", "Internal Server Error", null));
    }
  }
}

module.exports = OpeningHoursController;