const admin = require("firebase-admin");
const {db} = require("../config/firebase.config");
class UserService {
  /**
   * Verifies the user by checking the authorization token in the request headers.
   * @param {Object} req - The request object.
   * @param {Object} req.headers - The headers of the request.
   * @param {string} req.headers.authorization - The authorization header containing the Bearer token.
   * @returns {Promise<string>} The UID of the verified user.
   * @throws Will throw an error if the authorization token is missing or invalid.
   */
  static async verifyUser(req) {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      throw new Error("Unauthorized");
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  }
  /**
   * Retrieves a user by their ID from the Firestore database.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Object|null>} The user data if found, otherwise null.
   */
  static async getUser(userId) {
    const userRef = db.collection("users").doc(userId);
    const user = await userRef.get();
    if (!user.exists) {
      return null;
    }
    return user.data();
  }
}

module.exports = UserService;