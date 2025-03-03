const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyIdToken } = require("../middlewares/auth.middleware");

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

module.exports = router;