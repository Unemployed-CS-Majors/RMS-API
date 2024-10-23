const express = require('express');
const router = express.Router();
const TableController = require('../controllers/table.controller');

router.post('/add', TableController.createTable);
router.get('/getAll', TableController.getAllTables);
router.get('/getById', TableController.getTableById);
router.delete('/delete', TableController.deleteTable);
router.patch('/deactivate', TableController.deactivateTable);
router.patch('/activate', TableController.activateTable);

module.exports = router;