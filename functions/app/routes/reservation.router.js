const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservation.controller");
const { verifyIdToken } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /reservations/create:
 *   post:
 *     summary: Create a new reservation
 *     description: Create a new reservation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               partySize:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/create", verifyIdToken, ReservationController.createReservation);

module.exports = router;
