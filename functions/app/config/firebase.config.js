const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { logger } = require("../logger/FirebaseLogger");
require("dotenv").config();

// Get environment
const nodeEnv = process.env.NODE_ENV || "development";
const isEmulator = process.env.FIREBASE_EMULATOR_HUB;

// Initialize Firebase Admin with default options (uses the same project for both environments)
const app = initializeApp();

// Initialize Firestore with the appropriate database
let db;

if (isEmulator) {
  logger.info("Initializing Firebase Admin in emulator mode");
  db = getFirestore(app);
} else {
  if (nodeEnv === "development") {
    // For development, use a specific database name within the same project
    logger.info("Initializing Firestore with 'develop' database for development");
    db = getFirestore("develop");
  } else {
    // For production, use the default database
    db = getFirestore(app);
  }
}

// Storage is shared between environments since it's the same project
const storage = getStorage(app);

module.exports = { app, db, storage };
