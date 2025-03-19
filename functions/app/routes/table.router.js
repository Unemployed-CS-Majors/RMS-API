const express = require("express");
const TableController = require("../controllers/table.controller");
const { isOwner } = require("../middlewares/privilages.middleware");
const { verifyIdToken } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Retrieve a list of all tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: A list of tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 *       500:
 *         description: Internal server error
 */
router.get("/", TableController.getAllTables);

/**
 * @swagger
 * /tables/{tableId}:
 *   get:
 *     summary: Retrieve a table by ID
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the table to retrieve
 *     responses:
 *       200:
 *         description: The table details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table not found
 *       500:
 *         description: Internal server error
 */
router.get("/:tableId", TableController.getTable);

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Create a new table
 *     security:
 *       - bearerAuth: []
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
 *         description: Table created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created table
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyIdToken, isOwner, TableController.createTable);

/**
 * @swagger
 * /tables/{tableId}:
 *   put:
 *     summary: Update a table by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the table to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: Table updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Table not found
 *       500:
 *         description: Internal server error
 */
router.put("/:tableId", verifyIdToken, isOwner, TableController.updateTable);

/**
 * @swagger
 * /tables/{tableId}:
 *   delete:
 *     summary: Delete a table by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the table to delete
 *     responses:
 *       200:
 *         description: Table deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Table not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:tableId", verifyIdToken, isOwner, TableController.deleteTable);

/**
 * @swagger
 * /tables/deactivate/{tableId}:
 *   patch:
 *     summary: Deactivate a table by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the table to deactivate
 *     responses:
 *       200:
 *         description: Table deactivated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Table not found
 *       500:
 *         description: Internal server error
 */
router.patch("/deactivate/:tableId", verifyIdToken, isOwner, TableController.deactivateTable);

/**
 * @swagger
 * /tables/activate/{tableId}:
 *   patch:
 *     summary: Activate a table by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the table to activate
 *     responses:
 *       200:
 *         description: Table activated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Table not found
 *       500:
 *         description: Internal server error
 */
router.patch("/activate/:tableId", verifyIdToken, isOwner, TableController.activateTable);

module.exports = router;
