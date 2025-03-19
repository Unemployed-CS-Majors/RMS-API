// Load environment variables
require("dotenv").config();

const { onRequest } = require("firebase-functions/v2/https");
const app = require("./app");

/**
 * Development environment function
 */
exports.apiDev = onRequest((req, res) => {
  return app(req, res);
});

/**
 * Production environment function
 */
exports.api = onRequest((req, res) => {
  return app(req, res);
});
