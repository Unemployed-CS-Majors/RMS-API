const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const testRouter = require("./app/routes/test.router");
const registerRouter = require("./app/routes/register.router");
const app = express();

// Determine if running in emulator or production
const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

if (isEmulator) {
  // Use emulator configuration
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  // Use production configuration
  try {
    admin.initializeApp();
  } catch (error) {
    console.error("Error parsing service account key:", error);
    process.exit(1); // Exit the process with an error code
  }
}

app.use("/test", testRouter);
app.use("/auth", registerRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const port =  3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

exports.app = functions.https.onRequest(app);
