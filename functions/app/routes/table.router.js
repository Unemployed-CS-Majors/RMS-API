const express = require('express');
const TableController = require('../controllers/table.controller');
const { isOwner } = require("../middlewares/privilages.middleware");
const { verifyIdToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get('/', TableController.getAllTables);
router.get('/:tableId', TableController.getTable);
router.post('/', TableController.createTable);
router.put('/:tableId', TableController.updateTable);
router.delete('/:tableId', TableController.deleteTable);
router.patch("/deactivate/:tableId", verifyIdToken, isOwner, TableController.deactivateTable);
router.patch("/activate/:tableId", verifyIdToken, isOwner, TableController.activateTable);

module.exports = router;