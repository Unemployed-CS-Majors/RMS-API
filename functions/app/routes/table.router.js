const express = require('express');
const TableController = require('../controllers/table.controller');
const { isOwner } = require("../middlewares/privilages.middleware");
const { verifyIdToken } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Retrieve all tables
 *     description: Retrieve a list of all tables.
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
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', TableController.getAllTables);

/**
 * @swagger
 * /tables/{tableId}:
 *   get:
 *     summary: Retrieve a table by ID
 *     description: Retrieve the details of a specific table by ID.
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: The ID of the table to retrieve.
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
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Table not found
 */
router.get('/:tableId', TableController.getTable);

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Create a new table
 *     description: Create a new table.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Table created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', verifyIdToken, isOwner, TableController.createTable);

/**
 * @swagger
 * /tables/{tableId}:
 *   put:
 *     summary: Update a table
 *     description: Update the details of an existing table.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: The ID of the table to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Table updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Table not found
 */
router.put('/:tableId', verifyIdToken, isOwner, TableController.updateTable);

/**
 * @swagger
 * /tables/{tableId}:
 *   delete:
 *     summary: Delete a table
 *     description: Delete an existing table.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: The ID of the table to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deleted successfully
 *       404:
 *         description: Table not found
 */
router.delete('/:tableId', verifyIdToken, isOwner, TableController.deleteTable);

/**
 * @swagger
 * /tables/deactivate/{tableId}:
 *   patch:
 *     summary: Deactivate a table
 *     description: Deactivate an existing table.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: The ID of the table to deactivate.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deactivated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Table not found
 */
router.patch("/deactivate/:tableId", verifyIdToken, isOwner, TableController.deactivateTable);

/**
 * @swagger
 * /tables/activate/{tableId}:
 *   patch:
 *     summary: Activate a table
 *     description: Activate an existing table.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         description: The ID of the table to activate.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table activated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Table not found
 */
router.patch("/activate/:tableId", verifyIdToken, isOwner, TableController.activateTable);

module.exports = router;