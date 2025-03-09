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
 *     summary: Retrieve a list of all doors
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Doors
 *     responses:
 *       200:
 *         description: A list of doors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Door'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', verifyIdToken, isOwner, DoorController.getAllDoors);

/**
 * @swagger
 * /doors/{doorId}:
 *   get:
 *     summary: Retrieve a door by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Doors
 *     parameters:
 *       - in: path
 *         name: doorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the door to retrieve
 *     responses:
 *       200:
 *         description: The door details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Door not found
 */
router.get('/:doorId', verifyIdToken, isOwner, DoorController.getDoor);

/**
 * @swagger
 * /doors:
 *   post:
 *     summary: Create a new door
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Doors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       201:
 *         description: Door created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created door
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', verifyIdToken, isOwner, DoorController.createDoor);

/**
 * @swagger
 * /doors/{doorId}:
 *   put:
 *     summary: Update a door by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Doors
 *     parameters:
 *       - in: path
 *         name: doorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the door to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Door'
 *     responses:
 *       200:
 *         description: Door updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Door not found
 */
router.put('/:doorId', verifyIdToken, isOwner, DoorController.updateDoor);

/**
 * @swagger
 * /doors/{doorId}:
 *   delete:
 *     summary: Delete a door by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Doors
 *     parameters:
 *       - in: path
 *         name: doorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the door to delete
 *     responses:
 *       200:
 *         description: Door deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Door not found
 */
router.delete('/:doorId', verifyIdToken, isOwner, DoorController.deleteDoor);

module.exports = router;