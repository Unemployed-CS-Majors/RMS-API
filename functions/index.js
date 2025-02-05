const {onRequest} = require("firebase-functions/v2/https");
const app = require("./app");

/**
 * Cloud Function to handle HTTP requests and route them to the Express app.
 */
exports.app = onRequest(app);