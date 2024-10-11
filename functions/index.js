/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const express = require('express');
const swaggerUi = require("swagger-ui-express");

const testRouter = require('./app/routes/test.router');
const registerRouter = require('./app/routes/register.router');
const authenticate = require('./app/middlewares/auth.middleware');
const admin = require("./app/config/firebase.admin.config");

const app = express()

app.use("/test",authenticate.verifyIdToken, testRouter)
app.use("/auth", registerRouter)
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
const port = 3001;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

exports.app = functions.https.onRequest(app);