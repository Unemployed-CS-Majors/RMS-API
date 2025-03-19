const { createResponse } = require("../utils/response.utils");
const { Privileges } = require("../models/user.model");
const { getAuth } = require("firebase-admin/auth");
const { db } = require("../config/firebase.config");

/**
 * Middleware to check if the user is an owner.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} The result of the owner check process.
 */
const isOwner = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    if (!decodedToken.uid) {
      return res.status(403).json(createResponse("error", "Forbidden", null));
    }

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json(createResponse("error", "Forbidden. User does not exist", null));
    }

    const user = userDoc.data();
    if (user.privileges !== Privileges.OWNER) {
      return res.status(403).json(createResponse("error", "Forbidden. User is not an owner", null));
    }

    next();
  } catch (error) {
    return res.status(500).json(createResponse("error", error.message, null));
  }
};

/**
 * Middleware to check if the user is an employee.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} The result of the employee check process.
 */
const isEmployee = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    if (!decodedToken.uid) {
      return res.status(403).json(createResponse("error", "Forbidden", null));
    }

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json(createResponse("error", "Forbidden. User does not exist", null));
    }

    const user = userDoc.data();
    if (user.privileges !== Privileges.EMPLOYEE && user.privileges !== Privileges.OWNER) {
      return res
        .status(403)
        .json(createResponse("error", "Forbidden. User is not an employee", null));
    }

    next();
  } catch (error) {
    return res.status(500).json(createResponse("error", error.message, null));
  }
};

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
  isEmployee,
};
