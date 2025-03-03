const {createResponse} = require("../utils/response.utils");
const UserService = require("../services/user.service");
const {log} = require("firebase-functions/logger");
const ReservationService = require("../services/reservation.service");

class UserController {
    static async getUser(req, res) {
        try {
            const userId = await UserService.verifyUser(req);

            const user = await UserService.getUser(userId);

            return res.status(200).json(createResponse("success", null, user));
        } catch (error) {
            console.error("Error getting user details", error);
            return res.status(500).json(createResponse("error", error.message));
        }
    }

}

module.exports = UserController;