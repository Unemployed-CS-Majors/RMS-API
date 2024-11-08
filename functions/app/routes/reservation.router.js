const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservation.controller");
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");
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
router.post('/create', verifyIdToken, ReservationController.createReservation);

/**
 * @swagger
 * /reservations/cancel/{reservationId}:
 *   post:
 *     summary: Cancel a reservation
 *     description: Cancel an existing reservation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: The ID of the reservation to cancel.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.post('/cancel/:reservationId', verifyIdToken, ReservationController.cancelReservation);

/**
 * @swagger
 * /reservations/confirm/{reservationId}:
 *   post:
 *     summary: Confirm a reservation
 *     description: Confirm an existing reservation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: The ID of the reservation to confirm.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation confirmed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.post('/confirm/:reservationId', verifyIdToken, ReservationController.confirmReservation);

/**
 * @swagger
 * /reservations/complete/{reservationId}:
 *   post:
 *     summary: Complete a reservation
 *     description: Complete an existing reservation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: The ID of the reservation to complete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation completed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.post('/complete/:reservationId', verifyIdToken, ReservationController.completeReservation);

/**
 * @swagger
 * /reservations/reschedule/{reservationId}:
 *   post:
 *     summary: Reschedule a reservation
 *     description: Reschedule an existing reservation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: The ID of the reservation to reschedule.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation rescheduled successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.post('/reschedule/:reservationId', verifyIdToken, ReservationController.rescheduleReservation);

/**
 * @swagger
 * /reservations/get/{reservationId}:
 *   get:
 *     summary: Get reservation details
 *     description: Get details of a specific reservation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: The ID of the reservation to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details retrieved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.get('/get/:reservationId', verifyIdToken, ReservationController.getReservationDetails);

/**
 * @swagger
 * /reservations/user
 *   get:
 *     summary: Get reservations for a user
 *     description: Get all reservations for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */router.get('/user', verifyIdToken, ReservationController.getReservationsForUser);

/**
 * @swagger
 * /reservations/free-tables:
 *   post:
 *     summary: Get free tables for a given time
 *     description: Get available tables for a specified time period.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Free tables retrieved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/free-tables', verifyIdToken, ReservationController.getFreeTableForGivenTime);

router.get('/all', verifyIdToken, isOwner, ReservationController.getAllReservations);


module.exports = router;