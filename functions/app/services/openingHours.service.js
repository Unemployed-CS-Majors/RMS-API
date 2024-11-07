const admin = require("firebase-admin");
const { OpeningHours } = require("../models/openingHours.model");

class OpeningHoursService {
  static async getOpeningHoursById(db, openingHoursId) {
    const openingHoursRef = db.collection("opening_hours").doc(openingHoursId);
    const openingHoursDoc = await openingHoursRef.get();
    if (!openingHoursDoc.exists) {
      return null;
    }
    return openingHoursDoc.data();
  }

  static async getAllOpeningHours(db) {
    const snapshot = await db.collection("opening_hours").get();
    const openingHoursList = [];
    snapshot.forEach((doc) => {
      openingHoursList.push(OpeningHours.fromFirestore(doc));
    });
    return openingHoursList;
  }

  static async createOpeningHours(db, openingHoursData) {
    const { day, startTime, endTime } = openingHoursData;

    const openingHoursRef = db.collection("opening_hours");
    const counterRef = db.collection("counters").doc("dayCounter");

    const newOpenningDay = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        throw new Error("Counter document does not exist!");
      }

      const newId = counterDoc.data().count + 1;
      const openingHours = new OpeningHours(newId, day, startTime, endTime);

      transaction.update(counterRef, { count: newId });
      transaction.set(
        openingHoursRef.doc(newId.toString()),
        openingHours.toFirestore()
      );

      return openingHours;
    });
    return newOpenningDay;
  }

  static async updateOpeningHours(db, openingHoursId, openingHoursData) {
    const openingHoursRef = db.collection("opening_hours").doc(openingHoursId);
    await openingHoursRef.update(openingHoursData.toFirestore());
    const updatedOpeningHoursDoc = await openingHoursRef.get();
    return updatedOpeningHoursDoc.data();
  }

  static async deleteOpeningHours(db, openingHoursId) {
    const openingHoursRef = db.collection("opening_hours").doc(openingHoursId);
    return await openingHoursRef.delete();
  }

  static async handleTransaction(db, counterRef, updateData) {
    return db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        throw new Error("Counter document does not exist");
      }
      transaction.update(counterRef, updateData);
    });
  }
}

module.exports = OpeningHoursService;
