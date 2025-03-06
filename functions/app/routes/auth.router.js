const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const {isOwner} = require("../middlewares/privilages.middleware");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// Initialize Passport middleware
router.use(passport.initialize());

// Configure Passport to use the Google strategy.
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,            // Set in your environment
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,    // Set in your environment
        callbackURL: "/auth/google/callback"               // Google will redirect to this URL after consent
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let userRecord;
            try {
                // Try to fetch the user by their Google email
                userRecord = await getAuth().getUserByEmail(profile.emails[0].value);
            } catch (error) {
                // If the user doesn't exist, create a new Firebase user.
                userRecord = await getAuth().createUser({
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    emailVerified: true,
                });
                // Create a corresponding Firestore document.
                const user = new User(
                    userRecord.uid,
                    profile.name.givenName,
                    profile.name.familyName,
                    profile.emails[0].value,
                    null, // No phone number available from Google profile.
                    Privileges.CUSTOMER  // Or set a default role as needed.
                );
                await db.collection("users").doc(userRecord.uid).set(user.toFirestore());
            }
            return done(null, userRecord);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize and deserialize user (for session management if needed)
passport.serializeUser((user, done) => {
    done(null, user.uid);
});
passport.deserializeUser(async (uid, done) => {
    try {
        const userRecord = await getAuth().getUser(uid);
        done(null, userRecord);
    } catch (err) {
        done(err);
    }
});

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
router.post('/register', AuthController.register);

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
router.post('/login', AuthController.login);

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
router.post('/refreshToken', AuthController.refreshToken);

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
router.post('/createEmployee', isOwner, AuthController.createEmployee);

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
router.post('/createOwner', isOwner, AuthController.createOwner);

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
router.delete('/deleteEmployee/:uid', isOwner, AuthController.deleteEmployee);

module.exports = router;