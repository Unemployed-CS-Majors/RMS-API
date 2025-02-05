const express = require("express");

const authRouter = require("./app/routes/auth.router");
const tableRouter = require("./app/routes/table.router");
const openingHoursRouter = require("./app/routes/openingHours.router");
const reservationRouter = require("./app/routes/reservation.router");

const { setupCounters } = require("./app/utils/counter.utils");

const app = express();

/**
 * Use the authentication router for handling authentication-related routes.
 */
app.use("/auth", authRouter);

/**
 * Use the table router for handling table-related routes.
 */
app.use("/table", tableRouter);

/**
 * Use the opening hours router for handling opening hours-related routes.
 */
app.use("/openingHours", openingHoursRouter);

/**
 * Use the reservation router for handling reservation-related routes.
 */
app.use("/reservation", reservationRouter);

/**
 * Middleware to handle 404 errors for undefined routes.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

/**
 * Setup counters for the application.
 */
setupCounters();

module.exports = app;