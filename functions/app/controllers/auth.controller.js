const AuthService = require("../services/auth.service");
const { validateRegister, validateLogin, validateRefreshToken } = require("../validators/auth.validators");
const { createResponse } = require("../utils/response.utils");
const {Privileges} = require("../models/user.model");
const {changePrivilege} = require("../services/user.service");
const {log} = require("firebase-functions/logger");
const UserService = require("../services/user.service");
const emailService = require("../services/email.service");
class AuthController {
    static async register(req, res) {
        const validationError = validateRegister(req);
        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        const { firstName, lastName, email, password, phoneNumber } = req.body;
        const result = await AuthService.createUser({ firstName, lastName, email, password, phoneNumber });

        if (result.success) {
            res.status(201).json(createResponse("success", "User registered successfully", { uid: result.uid }));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async login(req, res) {
        const validationError = validateLogin(req);
        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        const { email, password } = req.body;
        const result = await AuthService.loginUser({ email, password });

        if (result.success) {
            res.status(200).json(createResponse("success", "User logged in successfully", {
                uid: result.uid,
                idToken: result.idToken,
                refreshToken: result.refreshToken,
            }));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async refreshToken(req, res) {
        const validationError = validateRefreshToken(req);
        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        const { refreshToken } = req.body;
        const result = await AuthService.refreshUserToken(refreshToken);

        if (result.success) {
            res.status(200).json(createResponse("success", "Token refreshed successfully", {
                idToken: result.idToken,
                refreshToken: result.refreshToken,
            }));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async createEmployee(req, res) {
        const validationError = validateRegister(req);
        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        const { firstName, lastName, email, password, phoneNumber } = req.body;
        const result = await AuthService.createEmployee({ firstName, lastName, email, password, phoneNumber });

        if (result.success) {
            res.status(201).json(createResponse("success", "Employee created successfully", { uid: result.uid }));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async createOwner(req, res) {
        const validationError = validateRegister(req);
        if (validationError) {
            return res.status(400).json(createResponse("error", validationError, null));
        }

        const { firstName, lastName, email, password, phoneNumber } = req.body;
        const result = await AuthService.createOwner({ firstName, lastName, email, password, phoneNumber });

        if (result.success) {
            res.status(201).json(createResponse("success", "Owner created successfully", { uid: result.uid }));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async deleteEmployee(req, res) {
        const { uid } = req.params;

        try {
            await changePrivilege(uid, Privileges.CUSTOMER);
            return res.status(200).json(createResponse("success", "Employee deleted successfully", null));
        } catch (error) {
            console.error("Error deleting employee", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }

    /**
     * Handles Google sign-in.
     * Expects a JSON body with the Firebase ID token obtained from the client.
     * Verifies the token, creates the user record if necessary, exchanges the custom token for tokens,
     * and returns the access (ID) token and refresh token.
     */
    static async googleAuth(req, res) {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json(createResponse("error", "ID token is required", null));
        }
        log("Google ID token:", idToken);
        const result = await AuthService.signInWithGoogle(idToken);
        if (result.success) {
            res.status(200).json(createResponse("success", "Google sign-in successful", {
                uid: result.uid,
                idToken: result.idToken,
                refreshToken: result.refreshToken,
            }));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async forgotPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json(createResponse("error", "Email is required", null));
        }
        const result = await AuthService.forgotPassword(email);
        if (result.success) {
            res.status(200).json(createResponse("success", "Password reset email sent", null));
        } else {
            res.status(500).json(createResponse("error", result.error, null));
        }
    }

    static async deleteAccount(req, res) {
        try {
            const userId = await UserService.verifyUser(req);
            await AuthService.deleteAccount(userId);
            return res.status(200).json(createResponse("success", "Account deleted successfully", null));
        } catch (error) {
            console.error("Error deleting account", error);
            return res.status(500).json(createResponse("error", error.message, null));
        }
    }
}

module.exports = AuthController;
