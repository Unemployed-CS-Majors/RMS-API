// functions/app.js
const express = require("express");
const cors = require("cors");

const authRouter = require("./app/routes/auth.router");
const tableRouter = require("./app/routes/table.router");
const openingHoursRouter = require("./app/routes/openingHours.router");
const reservationRouter = require("./app/routes/reservation.router");
const userRouter = require("./app/routes/user.router");
const windowRouter = require("./app/routes/window.router");
const wallRouter = require("./app/routes/wall.router");
const doorRouter = require("./app/routes/door.router");
const floorPlanRouter = require("./app/routes/floorPlan.router");
const menuItemRouter = require("./app/routes/menuItem.router");
const paymentRouter = require("./app/routes/payment.router");
const orderRouter = require("./app/routes/order.router");
const restaurantConfigRouter = require("./app/routes/restaurantConfig.router");
const analyticsRouter = require("./app/routes/analytics.router");
const { logger, LogLevel } = require("./app/logger/FirebaseLogger");
const { metricsMiddleware } = require("./app/config/prometheus.config");
const { setupCounters } = require("./app/utils/counter.utils");
const initializeFeatures = require("./app/utils/initializeFeatures.util");

const isEmulator = process.env.FIREBASE_EMULATOR_HUB;
require("dotenv").config();
const app = express();

app.use(logger.httpMiddleware());

if (!isEmulator) {
  logger.info("Running in emulator mode. Setting log level to DEBUG.");
  logger.setLogLevel(LogLevel.DEBUG);
}

app.use(cors());

app.use(metricsMiddleware);

app.use("/auth", authRouter);
app.use("/table", tableRouter);
app.use("/openingHours", openingHoursRouter);
app.use("/reservation", reservationRouter);
app.use("/user", userRouter);
app.use("/windows", windowRouter);
app.use("/walls", wallRouter);
app.use("/doors", doorRouter);
app.use("/floorPlan", floorPlanRouter);
app.use("/menu-items", menuItemRouter);
app.use("/order", orderRouter);
app.use("/payments", paymentRouter);
app.use("/restaurant", restaurantConfigRouter);
app.use("/analytics", analyticsRouter);
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

setupCounters();
initializeFeatures();

module.exports = app;
