const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
const app = initializeApp();
const db = getFirestore(app);

module.exports = { app, db };