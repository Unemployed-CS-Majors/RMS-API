const admin = require("firebase-admin");
const { createResponse } = require("../utils/responseUtil");
const { validateCreateReservation } = require("../validators/reservation.validators");
const EmailService = require("../services/email.service");
const UserService = require("../services/user.service");
const TableService = require("../services/table.service");
const ReservationService = require("../services/reservation.service");

class ReservationController {
  static async createReservation(req, res) {
    const validationError = validateCreateReservation(req);
    if (validationError) {
      return res.status(400).json(createResponse("error", validationError, null));
    }
    try {
      const userId = await UserService.verifyUser(req);
      const { tableId, startTime, endTime, people } = req.body;

      const db = admin.firestore();

      const table = await TableService.getTable(db, tableId);
      if (table === null) {
        return res.status(404).json(createResponse("error", "Table not found", null));
      }

      if (!table.isActive) {
        return res.status(409).json(createResponse("error", "Table is not active", null));
      }

      if (table.seats < people) {
        return res.status(409).json(createResponse("error", "Table does not have enough seats", null));
      }

      const overlapCheck = await ReservationService.checkForOverlap(db, tableId, startTime, endTime);
      if (overlapCheck) {
        return res.status(409).json(createResponse("error", "Time slot is already booked", null));
      }

      const newReservation = await ReservationService.createReservationRecord(
        db,
        userId,
        tableId,
        startTime,
        endTime,
        people
      );

      const user = await UserService.getUser(db, userId);
      if (user === null) {
        return res.status(404).json(createResponse("error", "User not found", null));
      }
      await EmailService.sendReservationConfirmationEmail(newReservation, user);

      return res.status(201).json(newReservation);
    } catch (error) {
      console.error("Error creating reservation", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }
}

module.exports = ReservationController;