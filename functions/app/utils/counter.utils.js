/**
 * Initializes the counter if it does not already exist.
 * @param {admin.firestore.DocumentReference} counterRef - Reference to the counter document.
 * @returns {Promise<void>} A promise that resolves when the counter is initialized.
 * @throws Will throw an error if there is an issue initializing the counter.
 */
const { db } = require("../config/firebase.config");

const initializeCounter = async (counterRef) => {
  const doc = await counterRef.get();
  if (!doc.exists) {
    await counterRef.set({ count: 0 });
  }
};

const setupCounters = () => {
  const tableCounterRef = db.collection("counters").doc("tableCounter");
  const openingHoursRef = db.collection("counters").doc("dayCounter");

  initializeCounter(tableCounterRef);
  initializeCounter(openingHoursRef);
};

module.exports = { initializeCounter, setupCounters };
