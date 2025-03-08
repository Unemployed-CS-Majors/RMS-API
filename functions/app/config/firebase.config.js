const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const {getStorage} = require("firebase-admin/storage");
// Initialize Firebase Admin
const app = initializeApp();
const db = getFirestore(app);
const storage = getStorage(app);
module.exports = { app, db, storage };