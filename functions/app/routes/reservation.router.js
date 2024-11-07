const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservation.controller");
const { verifyIdToken } = require("../middlewares/auth.middleware");

router.post("/create", verifyIdToken, ReservationController.createReservation);

module.exports = router;
