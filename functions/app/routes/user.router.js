const express = require('express');
const UserController = require('../controllers/user.controller');
const {verifyIdToken} = require("../middlewares/auth.middleware");
const {isOwner} = require("../middlewares/privilages.middleware");

const router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve user information
 *     description: Retrieve the details of the authenticated user.
 *     security:
 *       - bearerAuth: []
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
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyIdToken, UserController.getUser);

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users. Only accessible by owners.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
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
 *                   email:
 *                     type: string
 *                   privileges:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/all', verifyIdToken, isOwner, UserController.getAllUsers);

/**
 * @swagger
 * /user/privileged:
 *   get:
 *     summary: Retrieve all privileged users
 *     description: Retrieve a list of all privileged users. Only accessible by owners.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of privileged users
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
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/privileged', verifyIdToken, isOwner, UserController.getAllPrivilegedUsers);

/**
 * @swagger
 * /user/{userId}/privilege:
 *   put:
 *     summary: Change user privilege
 *     description: Change the privilege level of a user. Only accessible by owners.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose privilege is to be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privilege:
 *                 type: string
 *                 description: The new privilege level
 *     responses:
 *       200:
 *         description: Privilege changed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put('/:userId/privilege', verifyIdToken, isOwner, UserController.changePrivilege);

module.exports = router;