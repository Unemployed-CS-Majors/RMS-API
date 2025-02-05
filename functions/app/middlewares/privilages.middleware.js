const {createResponse} = require("../utils/response.utils");
const admin = require("firebase-admin");
const {Privileges} = require("../models/user.model");

/**
 * Middleware to check if the user is an owner.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} The result of the owner check process.
 */
const isOwner = (req, res, next) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
        return res.status(401).json({error: "Unauthorized"});
    }

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            if (decodedToken.uid === "") {
                return res.status(403).json(createResponse("error", "Forbidden", null));
            }
            const db = admin.firestore();
            db.collection("users")
                .doc(decodedToken.uid)
                .get()
                .then((doc) => {
                    if (!doc.exists) {
                        return res.status(403).json(createResponse("error", "Forbidden. User does not exist", null));
                    }
                    const user = doc.data();
                    if (user.privileges !== Privileges.OWNER) {
                        return res.status(403).json(createResponse("error", "Forbidden User is not owner", null));
                    }
                    next();
                })
                .catch((error) => {
                    return res.status(500).json(createResponse("error", error.message, null));
                });
        });
}

/**
 * Middleware to check if the user is an employee.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} The result of the employee check process.
 */
const isEmployee = (req, res, next) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
        return res.status(401).json({error: "Unauthorized"});
    }

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            if (decodedToken.uid === "") {
                return res.status(403).json(createResponse("error", "Forbidden", null));
            }
            const db = admin.firestore();
            db.collection("users")
                .doc(decodedToken.uid)
                .get()
                .then((doc) => {
                    if (!doc.exists) {
                        return res.status(403).json(createResponse("error", "Forbidden. User is not employee", null));
                    }
                    const user = doc.data();
                    if (user.privileges !== Privileges.EMPLOYEE && user.role !== Privileges.OWNER) {
                        return res.status(403).json(createResponse("error", "Forbidden User is not employee", null));
                    }
                    next();
                })
                .catch((error) => {
                    return res.status(500).json(createResponse("error", error.message, null));
                });
        });
}

module.exports = {
    /**
     * Middleware to check if the user is an owner.
     * @type {Function}
     */
    isOwner,
    /**
     * Middleware to check if the user is an employee.
     * @type {Function}
     */
    isEmployee
};