const {createResponse} = require("../utils/response.utils");
const UserService = require("../services/user.service");
const {logger} = require("../logger/FirebaseLogger");

class UserController {
    static async getUser(req, res) {
        try {
            const userId = await UserService.verifyUser(req);

            const user = await UserService.getUser(userId);

            return res.status(200).json(createResponse("success", null, user));
        } catch (error) {
            logger.error("Error getting user details", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(createResponse("success", null, users));
        } catch (error) {
            logger.error("Error getting all users", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    static async getAllPrivilegedUsers(req, res) {
        try {
            const users = await UserService.getAllPrivilegedUsers();
            return res.status(200).json(createResponse("success", null, users));
        } catch (error) {
            logger.error("Error getting all privileged users", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

    static async changePrivilege(req, res) {
        try {
            const userId = req.params.userId;
            const privilege = req.body.privilege;

            await UserService.changePrivilege(userId, privilege);

            return res.status(200).json(createResponse("success", "Privilege updated successfully"));
        } catch (error) {
            logger.error("Error changing user privilege", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }
}

module.exports = UserController;