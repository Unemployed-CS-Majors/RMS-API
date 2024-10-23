// utils/counterUtils.js

/**
 * Initializes the counter if it does not already exist.
 * @param {Object} counterRef - Reference to the counter document.
 */
async function initializeCounter(counterRef) {
  try {
    const counterDoc = await counterRef.get();
    if (counterDoc.exists) {
      console.log("Counter already exists");
    } else {
      await counterRef.set({ count: 0 });
      console.log("Counter initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing counter:", error);
  }
}

module.exports = {
  initializeCounter,
};
