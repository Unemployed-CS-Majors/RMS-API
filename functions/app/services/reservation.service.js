const {Reservation, ReservationStatus} = require("../models/reservation.model");
const {db} = require("../config/firebase.config");
const WebSocket = require("ws");
let wss;
class ReservationService {
    /**
     * Checks for overlapping reservations for a given table and time range.
     * @param {string} tableId - The ID of the table.
     * @param {Date} startTime - The start time of the reservation.
     * @param {Date} endTime - The end time of the reservation.
     * @returns {Promise<string|null>} A message if there is an overlap, otherwise null.
     */
    static async checkForOverlap(tableId, startTime, endTime) {
        const reservationsRef = db.collection("reservations");
        const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
        const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

        const query = await reservationsRef
            .where("tableId", "==", tableId)
            .where("startTime", "<", endEpoch)
            .where("endTime", ">", startEpoch)
            .where("status", "in", [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.COMPLETED])
            .get();

        if (!query.empty) {
            return "Time slot is already booked";
        }
        return null;
    }

    /**
     * Creates a new reservation record.
     * @param {string} userId - The ID of the user making the reservation.
     * @param {string} tableId - The ID of the table.
     * @param {Date} startTime - The start time of the reservation.
     * @param {Date} endTime - The end time of the reservation.
     * @param {number} people - The number of people for the reservation.
     * @returns {Promise<Reservation>} The newly created reservation.
     */
    static async createReservationRecord(userId, tableId, startTime, endTime, people) {
        const reservationRef = db.collection("reservations");
        const newReservation = new Reservation(null, new Date(startTime), new Date(endTime), userId, tableId, people, ReservationStatus.PENDING);
        const docRef = await reservationRef.add(newReservation.toFirestore());
        await docRef.update({id: docRef.id});
        newReservation.id = docRef.id;
        return newReservation;
    }

    /**
     * Updates the status of an existing reservation.
     * @param {string} reservationId - The ID of the reservation.
     * @param {string} status - The new status of the reservation.
     * @returns {Promise<string|void>} A message if there is an error, otherwise void.
     */
    static async updateReservationStatus(reservationId, status) {
        const reservationRef = db.collection("reservations").doc(reservationId);
        const reservation = await reservationRef.get();

        if (!Object.values(ReservationStatus).includes(status)) {
            return "Invalid status";
        }

        if (!reservation.exists) {
            return "Reservation not found";
        }

        if (reservation.data().status === status) {
            return "Reservation is already in that status";
        }

        await reservationRef.update({status: status});
    }

    /**
     * Retrieves a reservation by its ID.
     * @param {string} reservationId - The ID of the reservation.
     * @returns {Promise<Reservation|null>} The reservation if found, otherwise null.
     */
    static async getReservation(reservationId) {
        const reservationRef = db.collection("reservations").doc(reservationId);
        const reservation = await reservationRef.get();

        if (!reservation.exists) {
            return null;
        }

        return Reservation.fromFirestore(reservation);
    }

    /**
     * Reschedules an existing reservation.
     * @param {string} reservationId - The ID of the reservation.
     * @param {string} tableId - The ID of the table.
     * @param {Date} startTime - The new start time of the reservation.
     * @param {Date} endTime - The new end time of the reservation.
     * @returns {Promise<string|void>} A message if there is an error, otherwise void.
     */
    static async rescheduleReservation(reservationId, tableId, startTime, endTime) {
        const reservation = await ReservationService.getReservation(reservationId);
        const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
        const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);
        if (reservation === null) {
            return "Reservation not found";
        }

        const overlapError = await ReservationService.checkForOverlap(tableId, startTime, endTime);

        if (overlapError) {
            return overlapError;
        }

        await db.collection("reservations").doc(reservationId).update({
            startTime: startEpoch, endTime: endEpoch, tableId: tableId
        });
    }

    /**
     * Retrieves all reservations for a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Reservation[]>} A list of reservations for the user.
     */
    static async getReservationsForUser(userId) {
        const reservationsRef = db.collection("reservations");
        const query = await reservationsRef.where("userId", "==", userId).get();
        const reservations = [];

        query.forEach((doc) => {
            reservations.push(Reservation.fromFirestore(doc));
        });

        return reservations;
    }

    /**
     * Retrieves all reservations within a specific time range.
     * @param {Date} startTime - The start time of the range.
     * @param {Date} endTime - The end time of the range.
     * @returns {Promise<Reservation[]>} A list of reservations within the time range.
     */
    static async getReservationsForTime(startTime, endTime) {
        const reservationsRef = db.collection("reservations");
        const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
        const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

        const query = await reservationsRef
            .where("startTime", "<", endEpoch)
            .where("endTime", ">", startEpoch)
            .get();

        const reservations = [];
        query.forEach((doc) => {
            reservations.push(Reservation.fromFirestore(doc));
        });
        return reservations;
    }

    /**
     * Retrieves all reservations.
     * @returns {Promise<Reservation[]>} A list of all reservations.
     */
    static async getAllReservations() {
        const reservationsRef = db.collection("reservations");
        const query = await reservationsRef.get();
        const reservations = [];

        query.forEach((doc) => {
            reservations.push(Reservation.fromFirestore(doc));
        });

        return reservations;
    }

    static async getReservationByStatus(status) {
        const reservationsRef = db.collection("reservations");
        const query = await reservationsRef.where("status", "==", status).get();
        const reservations = [];

        query.forEach((doc) => {
            reservations.push(Reservation.fromFirestore(doc));
        });

        return reservations;
    }
}

module.exports = ReservationService;