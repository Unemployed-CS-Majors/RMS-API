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
 *     summary: Retrieve a list of walls
 *     tags: [Walls]
 *     responses:
 *       200:
 *         description: A list of walls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wall'
 */
router.get('/', verifyIdToken, isOwner, WallController.getAllWalls);

/**
 * @swagger
 * /walls/{wallId}:
 *   get:
 *     summary: Retrieve a single wall
 *     tags: [Walls]
 *     parameters:
 *       - in: path
 *         name: wallId
 *         schema:
 *           type: string
 *         required: true
 *         description: The wall ID
 *     responses:
 *       200:
 *         description: A single wall
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wall'
 */
router.get('/:wallId', verifyIdToken, isOwner, WallController.getWall);

/**
 * @swagger
 * /walls:
 *   post:
 *     summary: Create a new wall
 *     tags: [Walls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wall'
 *     responses:
 *       201:
 *         description: The created wall
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wall'
 */
router.post('/', verifyIdToken, isOwner, WallController.createWall);

/**
 * @swagger
 * /walls/{wallId}:
 *   put:
 *     summary: Update an existing wall
 *     tags: [Walls]
 *     parameters:
 *       - in: path
 *         name: wallId
 *         schema:
 *           type: string
 *         required: true
 *         description: The wall ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wall'
 *     responses:
 *       200:
 *         description: The updated wall
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wall'
 */
router.put('/:wallId', verifyIdToken, isOwner, WallController.updateWall);

/**
 * @swagger
 * /walls/{wallId}:
 *   delete:
 *     summary: Delete a wall
 *     tags: [Walls]
 *     parameters:
 *       - in: path
 *         name: wallId
 *         schema:
 *           type: string
 *         required: true
 *         description: The wall ID
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:wallId', verifyIdToken, isOwner, WallController.deleteWall);

module.exports = router;