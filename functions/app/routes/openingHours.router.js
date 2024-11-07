const express = require("express");
const router = express.Router();
const OpeningHoursController = require("../controllers/openingHours.controller");

// Import middlewares
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");

/**
 * @swagger
 * /opening-hours/{id}:
 *   get:
 *     summary: Retrieve opening hours by ID
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
router.get("/", OpeningHoursController.getAllOpeningHours);
router.post(
  "/",
  verifyIdToken,
  isOwner,
  OpeningHoursController.createOpeningHours
);
router.put(
  "/:id",
  verifyIdToken,
  isOwner,
  OpeningHoursController.updateOpeningHours
);
router.delete(
  "/:id",
  verifyIdToken,
  isOwner,
  OpeningHoursController.deleteOpeningHours
);
module.exports = router;
