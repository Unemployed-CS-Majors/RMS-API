const admin = require("firebase-admin");
const { OpeningHours } = require("../models/openingHours.model");
const { db } = require("../config/firebase.config");
class OpeningHoursService {
  /**
   * Retrieves opening hours by ID.
   * @param {string} openingHoursId - The ID of the opening hours document.
   * @returns {Promise<Object|null>} The opening hours data or null if not found.
   */
  static async getOpeningHoursById(openingHoursId) {
    const openingHoursRef = db.collection("opening_hours").doc(openingHoursId);
    const openingHoursDoc = await openingHoursRef.get();
    if (!openingHoursDoc.exists) {
      return null;
    }
    return openingHoursDoc.data();
  }

  /**
   * Retrieves all opening hours.
   
   * @returns {Promise<OpeningHours[]>} A list of all opening hours.
   */
  static async getAllOpeningHours() {
    const snapshot = await db.collection("opening_hours").get();
    const openingHoursList = [];
    snapshot.forEach((doc) => {
      openingHoursList.push(OpeningHours.fromFirestore(doc));
    });
    return openingHoursList;
  }

  /**
   * Creates new opening hours.
   * @param {Object} openingHoursData - The data for the new opening hours.
   * @param {string} openingHoursData.day - The day of the week.
   * @param {string} openingHoursData.startTime - The start time.
   * @param {string} openingHoursData.endTime - The end time.
   * @returns {Promise<OpeningHours>} The newly created opening hours.
   * @throws Will throw an error if the counter document does not exist.
   */
  static async createOpeningHours(openingHoursData) {
    const { day, startTime, endTime } = openingHoursData;

    const openingHoursRef = db.collection("opening_hours");
    const counterRef = db.collection("counters").doc("dayCounter");

    return await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        throw new Error("Counter document does not exist!");
      }

      const newId = counterDoc.data().count + 1;
      const openingHours = new OpeningHours(newId, day, startTime, endTime);

      transaction.update(counterRef, {count: newId});
      transaction.set(
          openingHoursRef.doc(newId.toString()),
          openingHours.toFirestore()
      );

      return openingHours;
    });
  }

  /**
   * Updates existing opening hours.
   * @param {string} openingHoursId - The ID of the opening hours document.
   * @param {OpeningHours} openingHoursData - The updated opening hours data.
   * @returns {Promise<Object>} The updated opening hours data.
   */
  static async updateOpeningHours(openingHoursId, openingHoursData) {
    const openingHoursRef = db.collection("opening_hours").doc(openingHoursId);
    await openingHoursRef.update(openingHoursData.toFirestore());
    const updatedOpeningHoursDoc = await openingHoursRef.get();
    return updatedOpeningHoursDoc.data();
  }

  /**
   * Deletes opening hours by ID.
   * @param {string} openingHoursId - The ID of the opening hours document.
   * @returns {Promise<FirebaseFirestore.WriteResult>} A promise that resolves when the document is deleted.
   */
  static async deleteOpeningHours(openingHoursId) {
    const openingHoursRef = db.collection("opening_hours").doc(openingHoursId);
    return await openingHoursRef.delete();
  }

  /**
   * Handles a Firestore transaction.
   * @param {admin.firestore.DocumentReference} counterRef - The reference to the counter document.
   * @param {Object} updateData - The data to update in the transaction.
   * @returns {Promise<void>} A promise that resolves when the transaction is complete.
   * @throws Will throw an error if the counter document does not exist.
   */
  static async handleTransaction(counterRef, updateData) {
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