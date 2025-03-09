const express = require('express');
const WallController = require('../controllers/wall.controller');
const {isOwner} = require("../middlewares/privilages.middleware");
const {verifyIdToken} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Walls
 *   description: Wall management
 */

/**
 * @swagger
 * /walls:
 *   get:
 *     summary: Retrieve a list of all walls
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Walls
 *     responses:
 *       200:
 *         description: A list of walls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wall'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', verifyIdToken, isOwner, WallController.getAllWalls);

/**
 * @swagger
 * /walls/{wallId}:
 *   get:
 *     summary: Retrieve a wall by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Walls
 *     parameters:
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wall to retrieve
 *     responses:
 *       200:
 *         description: The wall details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wall'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Wall not found
 */
router.get('/:wallId', verifyIdToken, isOwner, WallController.getWall);

/**
 * @swagger
 * /walls:
 *   post:
 *     summary: Create a new wall
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Walls
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wall'
 *     responses:
 *       201:
 *         description: Wall created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created wall
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', verifyIdToken, isOwner, WallController.createWall);

/**
 * @swagger
 * /walls/{wallId}:
 *   put:
 *     summary: Update a wall by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Walls
 *     parameters:
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wall to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wall'
 *     responses:
 *       200:
 *         description: Wall updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wall'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Wall not found
 */
router.put('/:wallId', verifyIdToken, isOwner, WallController.updateWall);

/**
 * @swagger
 * /walls/{wallId}:
 *   delete:
 *     summary: Delete a wall by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Walls
 *     parameters:
 *       - in: path
 *         name: wallId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wall to delete
 *     responses:
 *       200:
 *         description: Wall deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Wall not found
 */
router.delete('/:wallId', verifyIdToken, isOwner, WallController.deleteWall);

module.exports = router;