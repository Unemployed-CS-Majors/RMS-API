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
const testRouter = require('./app/routes/test.router');

const express = require('express')
const app = express()

app.use("/test", testRouter)

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

exports.app = functions.https.onRequest(app);