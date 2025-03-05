const express = require("express");
const cors = require('cors');

const authRouter = require("./app/routes/auth.router");
const tableRouter = require("./app/routes/table.router");
const openingHoursRouter = require("./app/routes/openingHours.router");
const reservationRouter = require("./app/routes/reservation.router");
const userRouter = require("./app/routes/user.router");
const windowRouter = require("./app/routes/window.router");
const wallRouter = require("./app/routes/wall.router");
const doorRouter = require("./app/routes/door.router");
const floorPlanRouter = require("./app/routes/floorPlan.router");


const {setupCounters} = require("./app/utils/counter.utils");

const app = express();
app.use(cors());
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
 * Use the user router for handling user-related routes.
 */
app.use("/user", userRouter);

app.use("/windows", windowRouter);
app.use("/walls", wallRouter);
app.use("/doors", doorRouter);
app.use("/floorPlan", floorPlanRouter);

/**
 * Middleware to handle 404 errors for undefined routes.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.use((req, res) => {
    res.status(404).json({error: "Endpoint not found"});
});

/**
 * Setup counters for the application.
 */
setupCounters();

module.exports = app;