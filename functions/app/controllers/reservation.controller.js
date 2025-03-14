const {createResponse} = require("../utils/response.utils");
const {
    validateCreateReservation, validateTimeFormat, validateSeats,
} = require("../validators/reservation.validators");
const EmailService = require("../services/email.service");
const UserService = require("../services/user.service");
const TableService = require("../services/table.service");
const ReservationService = require("../services/reservation.service");
const {ReservationStatus} = require("../models/reservation.model");
const userService = require("../services/user.service");
const OpeningHoursService = require("../services/openingHours.service");
const {logger} = require("../logger/FirebaseLogger");
const {OpeningHours} = require("../models/openingHours.model");
/**
 * Controller for handling reservation-related operations.
 */
class ReservationController {
    /**
     * Creates a new reservation.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The created reservation or an error response.
     */
    static async createReservation(req, res) {
        const validationError = validateCreateReservation(req);
        if (validationError) {
            return res
                .status(400)
                .json(createResponse("error", validationError, null));
        }
        try {
            const userId = await UserService.verifyUser(req);
            const {tableId, startTime, endTime, people} = req.body;

            const table = await TableService.getTable(String(tableId));
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
                    .json(createResponse("error", "Table does not have enough seats", null));
            }

            const overlapCheck = await ReservationService.checkForOverlap((tableId), startTime, endTime);
            if (overlapCheck) {
                return res
                    .status(409)
                    .json(createResponse("error", "Time slot is already booked", null));
            }


            const date = new Date(startTime);

            const openingHours = await OpeningHoursService.getOpeningHoursById(date.getDay().toString());

            if (startTime < openingHours.startTime || endTime > openingHours.endTime) {
                return res
                    .status(409)
                    .json(createResponse("error", "Time slot is not within opening hours", null));
            }

            const newReservation = await ReservationService.createReservationRecord(userId, tableId, startTime, endTime, people);

            const user = await UserService.getUser(userId);
            if (user === null) {
                return res
                    .status(404)
                    .json(createResponse("error", "User not found", null));
            }
            try {
                await EmailService.sendReservationConfirmationEmailStatusPending(newReservation, user);
            }catch (e) {
                logger.error("Error sending email", e);
            }

            return res.status(201).json(newReservation);
        } catch (error) {
            logger.error("Error creating reservation", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Cancels an existing reservation.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The cancellation result or an error response.
     */
    static async cancelReservation(req, res) {
        const {reservationId} = req.params;
        if (!reservationId) {
            return res
                .status(400)
                .json(createResponse("error", "Reservation ID is required", null));
        }

        try {
            const reservation = await ReservationService.getReservation(reservationId);

            if (reservation === null) {
                return res
                    .status(404)
                    .json(createResponse("error", "Reservation not found", null));
            }

            const user = await UserService.getUser(reservation.userId);

            if (user === null) {
                return res
                    .status(404)
                    .json(createResponse("error", "User not found", null));
            }

            const updateReservationStatus = await ReservationService.updateReservationStatus(reservationId, ReservationStatus.CANCELLED);

            if (updateReservationStatus) {
                return res
                    .status(409)
                    .json(createResponse("error", updateReservationStatus, null));
            }

            reservation.status = ReservationStatus.CANCELLED;

            try {
                await EmailService.sendReservationConfirmationEmailStatusCancelled(reservation, user);
            }   catch (e) {
                logger.error("Error sending email", e);
            }

            return res
                .status(200)
                .json(createResponse("success", "Reservation cancelled successfully", null));
        } catch (error) {
            logger.error("Error cancelling reservation", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Confirms an existing reservation.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The confirmation result or an error response.
     */
    static async confirmReservation(req, res) {
        const {reservationId} = req.params;
        if (!reservationId) {
            return res
                .status(400)
                .json(createResponse("error", "Reservation ID is required", null));
        }

        try {
            const reservation = await ReservationService.getReservation(reservationId);

            if (reservation === null) {
                return res
                    .status(404)
                    .json(createResponse("error", "Reservation not found", null));
            }

            const user = await UserService.getUser(reservation.userId);

            if (user === null) {
                return res
                    .status(404)
                    .json(createResponse("error", "User not found", null));
            }

            const updateReservationStatus = await ReservationService.updateReservationStatus(reservationId, ReservationStatus.CONFIRMED);
            if (updateReservationStatus) {
                return res
                    .status(409)
                    .json(createResponse("error", updateReservationStatus, null));
            }
            reservation.status = ReservationStatus.CONFIRMED;

            try {
                await EmailService.sendReservationConfirmationEmailStatusConfirmed(reservation, user);
            }  catch (e) {
                logger.error('Error sending email: ',e);
            }

            return res
                .status(200)
                .json(createResponse("success", "Reservation confirmed successfully", null));
        } catch (error) {
            logger.error("Error confirming reservation", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Marks an existing reservation as completed.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The completion result or an error response.
     */
    static async completeReservation(req, res) {
        const {reservationId} = req.params;
        if (!reservationId) {
            return res
                .status(400)
                .json(createResponse("error", "Reservation ID is required", null));
        }

        try {
            const updateReservationStatus = await ReservationService.updateReservationStatus(reservationId, ReservationStatus.COMPLETED);
            if (updateReservationStatus) {
                return res
                    .status(409)
                    .json(createResponse("error", updateReservationStatus, null));
            }

            return res
                .status(200)
                .json(createResponse("success", "Reservation completed successfully", null));
        } catch (error) {
            logger.error("Error completing reservation", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Reschedules an existing reservation.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The rescheduling result or an error response.
     */
    static async rescheduleReservation(req, res) {
        const {reservationId} = req.params;
        const {tableId, startTime, endTime} = req.body;
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
            logger.error('Invalid time format' + startTime + ' ' + endTime, null);
            return res
                .status(400)
                .json(createResponse("error", "Invalid time format", null));
        }

        try {
            const updateReservationStatus = await ReservationService.rescheduleReservation(reservationId, tableId, startTime, endTime);
            if (updateReservationStatus) {
                return res
                    .status(409)
                    .json(createResponse("error", updateReservationStatus, null));
            }

            return res
                .status(200)
                .json(createResponse("success", "Reservation rescheduled successfully", null));
        } catch (error) {
            logger.error("Error rescheduling reservation", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Retrieves the details of a specific reservation.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The reservation details or an error response.
     */
    static async getReservationDetails(req, res) {
        const {reservationId} = req.params;
        if (!reservationId) {
            return res
                .status(400)
                .json(createResponse("error", "Reservation ID is required", null));
        }

        try {
            const reservation = await ReservationService.getReservation(reservationId);

            if (reservation === null) {
                return res
                    .status(404)
                    .json(createResponse("error", "Reservation not found", null));
            }

            return res.status(200).json(createResponse("success", null, reservation));
        } catch (error) {
            logger.error("Error getting reservation details", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    /**
     * Retrieves all reservations for a specific user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The user's reservations or an error response.
     */
    static async getReservationsForUser(req, res) {
        try {
            const userId = await UserService.verifyUser(req);

            const reservations = await ReservationService.getReservationsForUser(userId);
            return res.status(200).json(createResponse("success", null, reservations));
        } catch (error) {
            logger.error("Error getting reservations for user", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    static async getUpcomingReservationsForUser(req, res) {
        try {
            const userId = await UserService.verifyUser(req);

            const  reservation = await ReservationService.getUpcomingReservationsForUser(userId);
            return res.status(200).json(createResponse("success", null, reservation));
        } catch (e) {
            logger.error("Error getting upcoming reservations for user", e);
            return res.status(500).json(createResponse("error", e.message));
        }
    }

    /**
     * Retrieves all free tables for a given time period.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} The free tables or an error response.
     */
    static async getFreeTableForGivenTime(req, res) {
        const {startTime, endTime,seats} = req.body;
        if (!startTime || !endTime || !seats) {
            return res
                .status(400)
                .json(createResponse("error", "Start and end time are required", null));
        }

        if (validateTimeFormat(startTime) || validateTimeFormat(endTime)) {
            return res
                .status(400)
                .json(createResponse("error", "Invalid time format", null));
        }

        if (validateSeats(seats)) {
            return res
                .status(400)
                .json(createResponse("error", "Invalid seats", null));
        }

        try {
            const allTables = await TableService.getTablesWithMinSeats(seats);
            const reservations = await ReservationService.getReservationsForTime(startTime, endTime);
            const reservedTablesIds = reservations.map((reservation) => reservation.tableId);
            const tables = allTables.filter((table) => !reservedTablesIds.includes(table.id));
            return res.status(200).json(createResponse("success", null, tables));
        } catch (error) {
            logger.error("Error getting free tables for given time", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    /**
     * Retrieves all reservations.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object>} All reservations or an error response.
     */
    static async getAllReservations(req, res) {
        try {
            const reservations = await ReservationService.getAllReservations();
            const reservationsWithUser = [];
            for (const reservation of reservations) {
                const user = await userService.getUser(reservation.userId);
                reservation.fullName = user.firstName + ' ' + user.lastName;
                reservation.email = user.email;
                reservation.phoneNumber = user.phoneNumber;
                reservationsWithUser.push(reservation);
            }

            return res.status(200).json(createResponse("success", null, reservationsWithUser));
        } catch (error) {
            logger.error("Error getting all reservations", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    static async getReservationByStatus(req, res) {
        const {status} = req.params;
        if (!status) {
            return res
                .status(400)
                .json(createResponse("error", "Status is required", null));
        }

        try {
            const reservations = await ReservationService.getReservationByStatus(status);
            const reservationsWithUser = [];
            for (const reservation of reservations) {
                const user = await userService.getUser(reservation.userId);
                reservation.fullName = user.firstName + ' ' + user.lastName;
                reservation.email = user.email;
                reservation.phoneNumber = user.phoneNumber;
                reservationsWithUser.push(reservation);
            }

            return res.status(200).json(createResponse("success", null, reservationsWithUser));
        } catch (error) {
            logger.error("Error getting reservations by status", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }
}

module.exports = ReservationController;