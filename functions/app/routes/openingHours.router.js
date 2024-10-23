const express = require("express");
const router = express.Router();
const OpeningHoursController = require("../controllers/openingHours.controller");

// Import middlewares
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");

router.post(
  "/add",
  verifyIdToken,
  isOwner,
  OpeningHoursController.createOpeningHours
);
router.get("/getAll", OpeningHoursController.getAllOpeningHours);
router.get("/getById", OpeningHoursController.getOpeningHoursById);
router.patch(
  "/update",
  verifyIdToken,
  isOwner,
  OpeningHoursController.updateOpeningHours
);

module.exports = router;
