const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

// Import routers
const testRouter = require("./app/routes/test.router");
const authRouter = require("./app/routes/auth.router");
const tableRouter = require("./app/routes/table.router");
const openingHoursRouter = require("./app/routes/openingHours.router");

// Import middlewares
const authenticate = require("./app/middlewares/auth.middleware");
const { isOwner } = require("./app/middlewares/privilages.middleware");

// Import configurations
const admin = require("./app/config/firebase.admin.config");

// Import utilities
const { initializeCounter } = require("./app/utils/counterUtil");

// Initialize Express app
const app = express();

app.use("/test", authenticate.verifyIdToken, isOwner, testRouter);
app.use("/auth", authRouter);
app.use("/table", tableRouter);
app.use("/openingHours", openingHoursRouter);
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
const db = admin.firestore();
const tableCounterRef = db.collection("counters").doc("tableCounter");
const openingHoursRef = db.collection("counters").doc("dayCounter");
initializeCounter(tableCounterRef);
initializeCounter(openingHoursRef);

const port = 3004;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

exports.app = functions.https.onRequest(app);
