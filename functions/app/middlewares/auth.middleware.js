const { getAuth } = require("firebase-admin/auth");
const { createResponse } = require("../utils/response.utils");

/**
 * Middleware to verify Firebase ID token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} The result of the token verification process.
 */
const verifyIdToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json(createResponse("error", error.message, null));
  }
};

module.exports = {
  /**
   * Middleware to verify Firebase ID token.
   * @type {Function}
   */
  verifyIdToken,
};
