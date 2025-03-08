const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservation.controller");
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");
/**
 * @swagger
 * /reservation/create:
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
 *               tableId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 description: ISO 8601 date-time string
 *               endTime:
 *                 type: string
 *                 description: ISO 8601 date-time string
 *               people:
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
 * /reservation/cancel/{reservationId}:
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
 * /reservation/confirm/{reservationId}:
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
 * /reservation/complete/{reservationId}:
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
 * /reservation/reschedule/{reservationId}:
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
 * /reservation/get/{reservationId}:
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
 * /reservation/user
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
 */
router.get('/user', verifyIdToken, ReservationController.getReservationsForUser);

/**
 * @swagger
 * /reservation/user/upcoming:
 *   get:
 *     summary: Get upcoming reservations for a user
 *     description: Get all upcoming reservations for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upcoming reservations retrieved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get('/user/upcoming', verifyIdToken, ReservationController.getUpcomingReservationsForUser);

/**
 * @swagger
 * /reservation/free-tables:
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
 *               startTime:
 *                 type: string
 *                 description: ISO 8601 date-time string
 *               endTime:
 *                 type: string
 *                 description: ISO 8601 date-time string
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

router.get('/:status', verifyIdToken, isOwner, ReservationController.getReservationByStatus);


module.exports = router;