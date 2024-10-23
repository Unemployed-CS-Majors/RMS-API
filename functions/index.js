const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const express = require('express');
const swaggerUi = require('swagger-ui-express');

// Import routers
const testRouter = require('./app/routes/test.router');
const registerRouter = require('./app/routes/register.router');
const tableRouter = require('./app/routes/table.router');

// Import middlewares
const authenticate = require('./app/middlewares/auth.middleware');
const { isOwner } = require('./app/middlewares/privilages.middleware');

// Import configurations
const admin = require('./app/config/firebase.admin.config');

// Import utilities
const { initializeCounter } = require('./app/utils/counterUtil');

// Initialize Express app
const app = express();

app.use("/test",authenticate.verifyIdToken, isOwner, testRouter)
app.use("/auth", registerRouter)
app.use("/table", tableRouter)

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
const db = admin.firestore();
const counterRef = db.collection('counters').doc('tableCounter');
initializeCounter(counterRef);

const port = 3004;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

exports.app = functions.https.onRequest(app);