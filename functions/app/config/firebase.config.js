const admin = require("firebase-admin");

if (admin.apps.length === 0) {
    admin.initializeApp();
}

/** @type {import('firebase-admin').firestore.Firestore} */
const db = admin.firestore();

module.exports = { admin, db };
