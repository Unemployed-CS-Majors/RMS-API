const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { isOwner } = require("../middlewares/privilages.middleware");
const { verifyIdToken } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh user token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/refreshToken", AuthController.refreshToken);

/**
 * @swagger
 * /auth/createEmployee:
 *   post:
 *     summary: Create a new employee
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/createEmployee", isOwner, AuthController.createEmployee);

/**
 * @swagger
 * /auth/createOwner:
 *   post:
 *     summary: Create a new owner
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Owner created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/createOwner", isOwner, AuthController.createOwner);

/**
 * @swagger
 * /auth/deleteEmployee/{uid}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID of the employee to delete
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteEmployee/:uid", isOwner, AuthController.deleteEmployee);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Sign in with Google
 *     tags: [Auth]
 *     description: Accepts an ID token from the client after Google sign-in via Firebase Auth.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google sign-in successful
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/google", AuthController.googleAuth);

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Send a password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/forgotPassword", AuthController.forgotPassword);

/**
 * @swagger
 * /auth/deleteAccount:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteAccount", verifyIdToken, AuthController.deleteAccount);

module.exports = router;
