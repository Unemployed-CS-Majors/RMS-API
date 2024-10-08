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
const registerRouter = require('./app/routes/register.router');
const express = require('express')
const admin = require('firebase-admin')
var serviceAccount = require("./firebase-admin-secret.json");
const app = express()


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use("/test", testRouter)
app.use("/auth", registerRouter)

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
const port = 3004;

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

exports.app = functions.https.onRequest(app);