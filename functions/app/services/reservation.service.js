const admin = require("firebase-admin");
const { Reservation, ReservationStatus } = require("../models/reservation.model");

class ReservationService {
  static async checkForOverlap(db, tableId, startTime, endTime) {
    const reservationsRef = db.collection("reservations");
    const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
    const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

    const query = await reservationsRef
      .where("tableId", "==", tableId)
      .where("startTime", "<=", endEpoch)
      .where("endTime", ">=", startEpoch)
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
}

module.exports = ReservationService;