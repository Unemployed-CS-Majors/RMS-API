const AuthService = require("../services/auth.service");
const { validateRegister, validateLogin, validateRefreshToken } = require("../validators/auth.validators");
const { createResponse } = require("../utils/response.utils");

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

    }

    static async deleteEmployee(req, res) {

    }
}

module.exports = AuthController;
