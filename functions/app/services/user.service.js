const admin = require("firebase-admin");

class UserService {
  static async verifyUser(req) {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      throw new Error("Unauthorized");
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  }

  static async getUser(db, userId) {
    const userRef = db.collection("users").doc(userId);
    const user = await userRef.get();
    if (!user.exists) {
      return null;
    }
    return user.data();
  }
}

module.exports = UserService;