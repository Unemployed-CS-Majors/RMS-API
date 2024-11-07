const admin = require("firebase-admin");
const { createResponse } = require("../utils/responseUtil");
const { validateOpeningHours } = require("../validators/openingHours.validators");
const OpeningHoursService = require("../services/openingHours.service");
const { OpeningHours } = require("../models/openingHours.model");

class OpeningHoursController {
  static async getOpeningHoursById(req, res) {
    const { id } = req.params;
    const db = admin.firestore();
    try {
      const openingHours = await OpeningHoursService.getOpeningHoursById(db, id);
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

  static async getAllOpeningHours(req, res) {
    const db = admin.firestore();
    try {
      const openingHoursList = await OpeningHoursService.getAllOpeningHours(db);
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

  static async createOpeningHours(req, res) {
    const validationError = validateOpeningHours(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }
    const { day, startTime, endTime } = req.body;
    const db = admin.firestore();
    try {
      const newOpeningHours = await OpeningHoursService.createOpeningHours(db, req.body);
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

  static async updateOpeningHours(req, res) {
    const validationError = validateOpeningHours(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }
    const { day, startTime, endTime } = req.body;
    const { id } = req.params;
    const db = admin.firestore();
    try {
      const newOpeningHours = new OpeningHours(id, day, startTime, endTime);
      const updatedOpeningHours = await OpeningHoursService.updateOpeningHours(db, id, newOpeningHours);
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

  static async deleteOpeningHours(req, res) {
    const { id } = req.params;
    const db = admin.firestore();
    try {
      await OpeningHoursService.deleteOpeningHours(db, id);
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