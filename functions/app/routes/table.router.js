const express = require("express");
const router = express.Router();
const TableController = require("../controllers/table.controller");
// Import middlewares
const { verifyIdToken } = require("../middlewares/auth.middleware");
const { isOwner } = require("../middlewares/privilages.middleware");

router.post("/add", verifyIdToken, isOwner, TableController.createTable);
router.get("/getAll", TableController.getAllTables);
router.get("/getById", TableController.getTableById);
router.delete("/delete", verifyIdToken, isOwner, TableController.deleteTable);
router.patch(
  "/deactivate",
  verifyIdToken,
  isOwner,
  TableController.deactivateTable
);
router.patch(
  "/activate",
  verifyIdToken,
  isOwner,
  TableController.activateTable
);

module.exports = router;
