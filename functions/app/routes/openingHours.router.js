const express = require("express");
const router = express.Router();
const OpeningHoursController = require("../controllers/openingHours.controller");

// Import middlewares
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");

/**
 * @swagger
 * tags:
 *   name: Opening Hours
 *   description: Opening hours management
 */

/**
 * @swagger
 * /opening-hours/{id}:
 *   get:
 *     summary: Retrieve opening hours by ID
 *     tags: [Opening Hours]
 *     description: Retrieve the opening hours for a specific ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the opening hours to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 openingHours:
 *                   type: string
 *       404:
 *         description: Opening hours not found
 */
router.get("/:id", OpeningHoursController.getOpeningHoursById);

/**
 * @swagger
 * /opening-hours:
 *   get:
 *     summary: Retrieve all opening hours
 *     tags: [Opening Hours]
 *     description: Retrieve all opening hours.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   openingHours:
 *                     type: string
 */
router.get("/", OpeningHoursController.getAllOpeningHours);

/**
 * @swagger
 * /opening-hours:
 *   post:
 *     summary: Create new opening hours
 *     tags: [Opening Hours]
 *     description: Create new opening hours.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Opening hours created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", verifyIdToken, isOwner, OpeningHoursController.createOpeningHours);

/**
 * @swagger
 * /opening-hours/{id}:
 *   put:
 *     summary: Update opening hours
 *     tags: [Opening Hours]
 *     description: Update existing opening hours.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the opening hours to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Opening hours updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Opening hours not found
 */
router.put("/:id", verifyIdToken, isOwner, OpeningHoursController.updateOpeningHours);

/**
 * @swagger
 * /opening-hours/{id}:
 *   delete:
 *     summary: Delete opening hours
 *     tags: [Opening Hours]
 *     description: Delete existing opening hours.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the opening hours to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opening hours deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Opening hours not found
 */
router.delete("/:id", verifyIdToken, isOwner, OpeningHoursController.deleteOpeningHours);

module.exports = router;
