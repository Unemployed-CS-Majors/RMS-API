const admin = require("firebase-admin");
const { createResponse } = require("../utils/responseUtil");
const {
  validateCreateReservation,
  validateTimeFormat,
} = require("../validators/reservation.validators");
const EmailService = require("../services/email.service");
const UserService = require("../services/user.service");
const TableService = require("../services/table.service");
const ReservationService = require("../services/reservation.service");
const { ReservationStatus } = require("../models/reservation.model");
class ReservationController {
  static async createReservation(req, res) {
    const validationError = validateCreateReservation(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }
    try {
      const userId = await UserService.verifyUser(req);
      const { tableId, startTime, endTime, people } = req.body;

      const db = admin.firestore();

      const table = await TableService.getTable(db, String(tableId));
      if (table === null) {
        return res
          .status(404)
          .json(createResponse("error", "Table not found", null));
      }

      if (!table.isActive) {
        return res
          .status(409)
          .json(createResponse("error", "Table is not active", null));
      }

      if (table.seats < people) {
        return res
          .status(409)
          .json(
            createResponse("error", "Table does not have enough seats", null)
          );
      }

      const overlapCheck = await ReservationService.checkForOverlap(
        db,
        (tableId),
        startTime,
        endTime
      );
      if (overlapCheck) {
        return res
          .status(409)
          .json(createResponse("error", "Time slot is already booked", null));
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
        return res
          .status(404)
          .json(createResponse("error", "User not found", null));
      }

      await EmailService.sendReservationConfirmationEmailStatusPending(
        newReservation,
        user
      );

      return res.status(201).json(newReservation);
    } catch (error) {
      console.error("Error creating reservation", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async cancelReservation(req, res) {
    const { reservationId } = req.params;
    if (!reservationId) {
      return res
        .status(400)
        .json(createResponse("error", "Reservation ID is required", null));
    }

    try {
      const db = admin.firestore();

      const reservation = await ReservationService.getReservation(
        db,
        reservationId
      );

      if (reservation === null) {
        return res
          .status(404)
          .json(createResponse("error", "Reservation not found", null));
      }

      const user = await UserService.getUser(db, reservation.userId);

      if (user === null) {
        return res
          .status(404)
          .json(createResponse("error", "User not found", null));
      }

      const updateReservationStatus =
        await ReservationService.updateReservationStatus(
          db,
          reservationId,
          ReservationStatus.CANCELLED
        );

      if (updateReservationStatus) {
        return res
          .status(409)
          .json(createResponse("error", updateReservationStatus, null));
      }

      reservation.status = ReservationStatus.CANCELLED;

      await EmailService.sendReservationConfirmationEmailStatusCancelled(reservation, user);

      return res
        .status(200)
        .json(
          createResponse("success", "Reservation cancelled successfully", null)
        );
    } catch (error) {
      console.error("Error cancelling reservation", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async confirmReservation(req, res) {
    const { reservationId } = req.params;
    if (!reservationId) {
      return res
        .status(400)
        .json(createResponse("error", "Reservation ID is required", null));
    }

    try {
      const db = admin.firestore();

      const reservation = await ReservationService.getReservation(
        db,
        reservationId
      );

      if (reservation === null) {
        return res
          .status(404)
          .json(createResponse("error", "Reservation not found", null));
      }

      const user = await UserService.getUser(db, reservation.userId);

      if (user === null) {
        return res
          .status(404)
          .json(createResponse("error", "User not found", null));
      }

      const updateReservationStatus =
        await ReservationService.updateReservationStatus(
          db,
          reservationId,
          ReservationStatus.CONFIRMED
        );
      if (updateReservationStatus) {
        return res
          .status(409)
          .json(createResponse("error", updateReservationStatus, null));
      }
      reservation.status = ReservationStatus.CONFIRMED;

      await EmailService.sendReservationConfirmationEmailStatusConfirmed(reservation, user);

      return res
        .status(200)
        .json(
          createResponse("success", "Reservation confirmed successfully", null)
        );
    } catch (error) {
      console.error("Error confirming reservation", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async completeReservation(req, res) {
    const { reservationId } = req.params;
    if (!reservationId) {
      return res
        .status(400)
        .json(createResponse("error", "Reservation ID is required", null));
    }

    try {
      const db = admin.firestore();

      const updateReservationStatus =
        await ReservationService.updateReservationStatus(
          db,
          reservationId,
          ReservationStatus.COMPLETED
        );
      if (updateReservationStatus) {
        return res
          .status(409)
          .json(createResponse("error", updateReservationStatus, null));
      }
      
      return res
        .status(200)
        .json(
          createResponse("success", "Reservation completed successfully", null)
        );
    } catch (error) {
      console.error("Error completing reservation", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async rescheduleReservation(req, res) {
    const { reservationId } = req.params;
    const { tableId, startTime, endTime } = req.body;
    if (!reservationId) {
      return res
        .status(400)
        .json(createResponse("error", "Reservation ID is required", null));
    }
    if (!tableId || !startTime || !endTime) {
      return res
        .status(400)
        .json(createResponse("error", "All fields are required", null));
    }

    if (validateTimeFormat(startTime) || validateTimeFormat(endTime)) {
      console.log('Invalid time format' + startTime + ' ' + endTime);
      return res
        .status(400)
        .json(createResponse("error", "Invalid time format", null));
    }

    try {
      const db = admin.firestore();

      const updateReservationStatus =
        await ReservationService.rescheduleReservation(
          db,
          reservationId,
          tableId,
          startTime,
          endTime
        );
      if (updateReservationStatus) {
        return res
          .status(409)
          .json(createResponse("error", updateReservationStatus, null));
      }

      return res
        .status(200)
        .json(
          createResponse(
            "success",
            "Reservation rescheduled successfully",
            null
          )
        );
    } catch (error) {
      console.error("Error rescheduling reservation", error);
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getReservationDetails(req, res) {
    const { reservationId } = req.params;
    if (!reservationId) {
      return res
        .status(400)
        .json(createResponse("error", "Reservation ID is required", null));
    }

    try {
      const db = admin.firestore();

      const reservation = await ReservationService.getReservation(
        db,
        reservationId
      );

      if (reservation === null) {
        return res
          .status(404)
          .json(createResponse("error", "Reservation not found", null));
      }

      return res.status(200).json(createResponse("success", null, reservation));
    } catch (error) {
      console.error("Error getting reservation details", error);
      return res.status(500).json(createResponse("error", error.message));
    }
  }

  static async getReservationsForUser(req, res) {
    try {
      const userId = await UserService.verifyUser(req);
      const db = admin.firestore();
      const reservations = await ReservationService.getReservationsForUser(
        db,
        userId
      );
      return res.status(200).json(createResponse("success", null, reservations));
    } catch (error) {
      console.error("Error getting reservations for user", error);
      return res.status(500).json(createResponse("error", error.message));
    }
  }

  static async getFreeTableForGivenTime(req, res) {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res
        .status(400)
        .json(createResponse("error", "Start and end time are required", null));
    }

    if (validateTimeFormat(startTime) || validateTimeFormat(endTime)) {
      return res
        .status(400)
        .json(createResponse("error", "Invalid time format", null));
    }

    try {
      const db = admin.firestore();

      const allTables = await TableService.getAllTables(db);
      const reservations = await ReservationService.getReservationsForTime(
        db,
        startTime,
        endTime
      );
      const reservedTablesIds = reservations.map((reservation) => reservation.tableId);
      console.log('Reserved tables: ' + reservedTablesIds);
      const tables = allTables.filter((table) => !reservedTablesIds.includes(table.id));
      return res.status(200).json(createResponse("success", null, tables));
    } catch (error) {
      console.error("Error getting free tables for given time", error);
      return res.status(500).json(createResponse("error", error.message));
    }
  }

  static async getAllReservations(req, res) {
    try {
      const db = admin.firestore();
      const reservations = await ReservationService.getAllReservations(db);
      return res.status(200).json(createResponse("success", null, reservations));
    } catch (error) {
      console.error("Error getting all reservations", error);
      return res.status(500).json(createResponse("error", error.message));
    }
  }
}

module.exports = ReservationController;
