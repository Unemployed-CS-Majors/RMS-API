/**
 * Enum for reservation statuses.
 * @readonly
 * @enum {string}
 */
const ReservationStatus = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  SEATED: 'seated',
  COMPLETED: 'completed'
});

/**
 * Class representing a reservation.
 */
class Reservation {
  /**
   * Create a reservation.
   * @param {string} id - The reservation ID.
   * @param {Date} startTime - The start time of the reservation.
   * @param {Date} endTime - The end time of the reservation.
   * @param {string} userId - The user ID who made the reservation.
   * @param {string} tableId - The table ID for the reservation.
   * @param {number} people - The number of people for the reservation.
   * @param {string} status - The status of the reservation.
   */
  constructor(id, startTime, endTime, userId, tableId, people, status) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.userId = userId;
    this.tableId = tableId;
    this.people = people;
    this.status = status;
  }

  /**
   * Convert the reservation to a Firestore-compatible format.
   * @returns {Object} The Firestore-compatible representation of the reservation.
   */
  toFirestore() {
    return {
      startTime: dateToUnixEpoch(this.startTime),
      endTime: dateToUnixEpoch(this.endTime),
      userId: this.userId,
      tableId: this.tableId,
      people: this.people,
      status: this.status
    };
  }

  /**
   * Create a Reservation instance from a Firestore snapshot.
   * @param {Object} snapshot - The Firestore snapshot.
   * @returns {Reservation} The Reservation instance.
   */
  static fromFirestore(snapshot) {
    const data = snapshot.data();
    return new Reservation(
        snapshot.id,
        new Date(data.startTime * 1000),
        new Date(data.endTime * 1000),
        data.userId,
        data.tableId,
        data.people,
        data.status
    );
  }
}

/**
 * Convert a Date object to a Unix epoch timestamp.
 * @param {Date} date - The date to convert.
 * @returns {number} The Unix epoch timestamp.
 */
function dateToUnixEpoch(date) {
  return Math.floor(date.getTime() / 1000);
}

module.exports = { Reservation, ReservationStatus };