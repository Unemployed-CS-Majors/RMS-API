const express = require("express");
const router = express.Router();
const OpeningHoursController = require("../controllers/openingHours.controller");

// Import middlewares
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");

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
