const express = require('express');
const DoorController = require('../controllers/door.controller');
const {isOwner} = require("../middlewares/privilages.middleware");
const {verifyIdToken} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doors
 *   description: Door management
 */

/**
 * @swagger
 * /doors:
 *   get:
 *     summary: Retrieve a list of doors
 *     tags: [Doors]
 *     responses:
 *       200:
 *         description: A list of doors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Door'
 */
router.get('/', verifyIdToken, isOwner, DoorController.getAllDoors);

/**
 * @swagger
 * /doors/{doorId}:
 *   get:
 *     summary: Retrieve a single door
 *     tags: [Doors]
 *     parameters:
 *       - in: path
 *         name: doorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The door ID
 *     responses:
 *       200:
 *         description: A single door
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 */
router.get('/:doorId', verifyIdToken, isOwner, DoorController.getDoor);

/**
 * @swagger
 * /doors:
 *   post:
 *     summary: Create a new door
 *     tags: [Doors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       201:
 *         description: The created door
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 */
router.post('/', verifyIdToken, isOwner, DoorController.createDoor);

/**
 * @swagger
 * /doors/{doorId}:
 *   put:
 *     summary: Update an existing door
 *     tags: [Doors]
 *     parameters:
 *       - in: path
 *         name: doorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The door ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       200:
 *         description: The updated door
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 */
router.put('/:doorId', verifyIdToken, isOwner, DoorController.updateDoor);

/**
 * @swagger
 * /doors/{doorId}:
 *   delete:
 *     summary: Delete a door
 *     tags: [Doors]
 *     parameters:
 *       - in: path
 *         name: doorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The door ID
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:doorId', verifyIdToken, isOwner, DoorController.deleteDoor);

module.exports = router;