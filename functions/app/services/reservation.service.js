const admin = require("firebase-admin");
const { Reservation, ReservationStatus } = require("../models/reservation.model");

class ReservationService {
  static async checkForOverlap(db, tableId, startTime, endTime) {
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

  static async createReservationRecord(db, userId, tableId, startTime, endTime, people) {
    const reservationRef = db.collection("reservations");
    const newReservation = new Reservation(
      null,
      new Date(startTime),
      new Date(endTime),
      userId,
      tableId,
      people,
      ReservationStatus.PENDING
    );
    const docRef = await reservationRef.add(newReservation.toFirestore());
    await docRef.update({ id: docRef.id });
    newReservation.id = docRef.id;
    return newReservation;
  }

  static async updateReservationStatus(db, reservationId, status) {
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

    await reservationRef.update({ status: status });
  }

  static async getReservation(db, reservationId) {
    const reservationRef = db.collection("reservations").doc(reservationId);
    const reservation = await reservationRef.get();

    if (!reservation.exists) {
      return null;
    }

    return Reservation.fromFirestore(reservation);
  }

  static async rescheduleReservation(db, reservationId, tableId, startTime, endTime) {
    const reservation = await ReservationService.getReservation(db, reservationId);
    const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
    const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);
    if (reservation === null) {
      return "Reservation not found";
    }

    const overlapError = await ReservationService.checkForOverlap(
      db,
      tableId,
      startTime,
      endTime
    );

    if (overlapError) {
      return overlapError;
    }

    await db.collection("reservations").doc(reservationId).update({
      startTime: startEpoch,
      endTime: endEpoch,
      tableId: tableId
    });
  }

  static async getReservationsForUser(db, userId) {
    const reservationsRef = db.collection("reservations");
    const query = await reservationsRef.where("userId", "==", userId).get();
    const reservations = [];

    query.forEach((doc) => {
      reservations.push(Reservation.fromFirestore(doc));
    });

    return reservations;
  }

  static async getReservationsForTime(db, startTime, endTime) {
    const reservationsRef = db.collection("reservations");
    const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
    const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

    const query = await reservationsRef
      .where("startTime", ">=", startEpoch)
      .where("endTime", "<=", endEpoch)
      .get();

    const reservations = [];
    console.log(query);
    query.forEach((doc) => {
      reservations.push(Reservation.fromFirestore(doc));
    });

    return reservations;
  }

  static async getAllReservations(db) {
    const reservationsRef = db.collection("reservations");
    const query = await reservationsRef.get();
    const reservations = [];

    query.forEach((doc) => {
      reservations.push(Reservation.fromFirestore(doc));
    });

    return reservations;
  }
}

module.exports = ReservationService;