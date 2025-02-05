const functions = require("firebase-functions");
const app = require("./app");

/**
 * Cloud Function to handle HTTP requests and route them to the Express app.
 * @type {functions.HttpsFunction}
 */
exports.app = functions.https.onRequest(app);