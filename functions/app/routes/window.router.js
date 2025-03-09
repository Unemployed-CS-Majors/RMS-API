const express = require('express');
const WindowController = require('../controllers/window.controller');
const {isOwner} = require("../middlewares/privilages.middleware");
const {verifyIdToken} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Windows
 *   description: Window management
 */

/**
 * @swagger
 * /windows:
 *   get:
 *     summary: Retrieve a list of all windows
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Windows
 *     responses:
 *       200:
 *         description: A list of windows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Window'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', verifyIdToken, isOwner, WindowController.getAllWindows);

/**
 * @swagger
 * /windows/{windowId}:
 *   get:
 *     summary: Retrieve a window by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Windows
 *     parameters:
 *       - in: path
 *         name: windowId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the window to retrieve
 *     responses:
 *       200:
 *         description: The window details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Window'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Window not found
 */
router.get('/:windowId', verifyIdToken, isOwner, WindowController.getWindow);

/**
 * @swagger
 * /windows:
 *   post:
 *     summary: Create a new window
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Windows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Window'
 *     responses:
 *       201:
 *         description: Window created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created window
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', verifyIdToken, isOwner, WindowController.createWindow);

/**
 * @swagger
 * /windows/{windowId}:
 *   put:
 *     summary: Update a window by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Windows
 *     parameters:
 *       - in: path
 *         name: windowId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the window to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Window'
 *     responses:
 *       200:
 *         description: Window updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Window'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Window not found
 */
router.put('/:windowId', verifyIdToken, isOwner, WindowController.updateWindow);

/**
 * @swagger
 * /windows/{windowId}:
 *   delete:
 *     summary: Delete a window by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Windows
 *     parameters:
 *       - in: path
 *         name: windowId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the window to delete
 *     responses:
 *       200:
 *         description: Window deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Window not found
 */
router.delete('/:windowId', verifyIdToken, isOwner, WindowController.deleteWindow);

module.exports = router;