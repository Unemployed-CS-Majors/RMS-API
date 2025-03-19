// __tests__/models/reservation.model.test.js
const { Reservation, ReservationStatus } = require("../../app/models/reservation.model");

describe("Reservation Model", () => {
  const sampleReservationData = {
    id: "res123",
    startTime: new Date("2023-11-01T18:00:00Z"),
    endTime: new Date("2023-11-01T20:00:00Z"),
    userId: "user123",
    tableId: "table123",
    people: 4,
    status: ReservationStatus.CONFIRMED,
  };

  describe("Reservation constructor", () => {
    it("should create a new Reservation instance with provided values", () => {
      const reservation = new Reservation(
        sampleReservationData.id,
        sampleReservationData.startTime,
        sampleReservationData.endTime,
        sampleReservationData.userId,
        sampleReservationData.tableId,
        sampleReservationData.people,
        sampleReservationData.status
      );

      expect(reservation.id).toBe(sampleReservationData.id);
      expect(reservation.startTime).toEqual(sampleReservationData.startTime);
      expect(reservation.endTime).toEqual(sampleReservationData.endTime);
      expect(reservation.userId).toBe(sampleReservationData.userId);
      expect(reservation.tableId).toBe(sampleReservationData.tableId);
      expect(reservation.people).toBe(sampleReservationData.people);
      expect(reservation.status).toBe(sampleReservationData.status);
    });
  });

  describe("toFirestore", () => {
    it("should convert Reservation instance to Firestore format with Unix epoch timestamps", () => {
      const reservation = new Reservation(
        sampleReservationData.id,
        sampleReservationData.startTime,
        sampleReservationData.endTime,
        sampleReservationData.userId,
        sampleReservationData.tableId,
        sampleReservationData.people,
        sampleReservationData.status
      );

      const firestoreData = reservation.toFirestore();

      // Convert dates to Unix timestamps for comparison
      const startTimeEpoch = Math.floor(sampleReservationData.startTime.getTime() / 1000);
      const endTimeEpoch = Math.floor(sampleReservationData.endTime.getTime() / 1000);

      expect(firestoreData).toEqual({
        startTime: startTimeEpoch,
        endTime: endTimeEpoch,
        userId: sampleReservationData.userId,
        tableId: sampleReservationData.tableId,
        people: sampleReservationData.people,
        status: sampleReservationData.status,
      });

      // id should not be included in Firestore data
      expect(firestoreData.id).toBeUndefined();
    });
  });

  describe("fromFirestore", () => {
    it("should create a Reservation instance from Firestore snapshot with Unix timestamps", () => {
      // Convert dates to Unix timestamps for Firestore data
      const startTimeEpoch = Math.floor(sampleReservationData.startTime.getTime() / 1000);
      const endTimeEpoch = Math.floor(sampleReservationData.endTime.getTime() / 1000);

      const snapshot = {
        id: sampleReservationData.id,
        data: () => ({
          startTime: startTimeEpoch,
          endTime: endTimeEpoch,
          userId: sampleReservationData.userId,
          tableId: sampleReservationData.tableId,
          people: sampleReservationData.people,
          status: sampleReservationData.status,
        }),
      };

      const reservation = Reservation.fromFirestore(snapshot);

      expect(reservation).toBeInstanceOf(Reservation);
      expect(reservation.id).toBe(sampleReservationData.id);

      // Compare date objects by timestamp
      expect(reservation.startTime.getTime()).toBe(sampleReservationData.startTime.getTime());
      expect(reservation.endTime.getTime()).toBe(sampleReservationData.endTime.getTime());

      expect(reservation.userId).toBe(sampleReservationData.userId);
      expect(reservation.tableId).toBe(sampleReservationData.tableId);
      expect(reservation.people).toBe(sampleReservationData.people);
      expect(reservation.status).toBe(sampleReservationData.status);
    });
  });

  describe("dateToUnixEpoch function", () => {
    it("should convert Date objects to Unix epoch timestamps (seconds)", () => {
      const reservation = new Reservation(
        sampleReservationData.id,
        sampleReservationData.startTime,
        sampleReservationData.endTime,
        sampleReservationData.userId,
        sampleReservationData.tableId,
        sampleReservationData.people,
        sampleReservationData.status
      );

      const firestoreData = reservation.toFirestore();

      // Unix timestamp is seconds since epoch, not milliseconds
      const expectedStartTime = Math.floor(sampleReservationData.startTime.getTime() / 1000);
      const expectedEndTime = Math.floor(sampleReservationData.endTime.getTime() / 1000);

      expect(firestoreData.startTime).toBe(expectedStartTime);
      expect(firestoreData.endTime).toBe(expectedEndTime);
    });
  });

  describe("ReservationStatus enum", () => {
    it("should have the correct reservation status values", () => {
      expect(ReservationStatus.PENDING).toBe("pending");
      expect(ReservationStatus.CONFIRMED).toBe("confirmed");
      expect(ReservationStatus.CANCELLED).toBe("cancelled");
      expect(ReservationStatus.SEATED).toBe("seated");
      expect(ReservationStatus.COMPLETED).toBe("completed");
    });
  });
});
