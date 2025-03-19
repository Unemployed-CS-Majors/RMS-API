const axios = require("axios");
const { getAuth } = require("firebase-admin/auth");
const { User, Privileges } = require("../models/user.model");
const { db } = require("../config/firebase.config");
const {
  FIREBASE_REFRESH_TOKEN_URL,
  FIREBASE_SIGN_IN_WITH_CUSTOM_TOKEN,
  FIREBASE_SIGN_IN_ENDPOINT,
  isEmulator,
} = require("../config/auth.config");
const { log } = require("firebase-functions/logger");
const { isValidEmail } = require("../validators/auth.validators");
const { logger } = require("../logger/FirebaseLogger");
const EmailService = require("./email.service");

/**
 * AuthService class provides methods for user authentication and management.
 */
class AuthService {
  /**
   * Creates a new user in Firebase Authentication and Firestore.
   * @param {Object} userDetails - The details of the user to create.
   * @param {string} userDetails.firstName - The first name of the user.
   * @param {string} userDetails.lastName - The last name of the user.
   * @param {string} userDetails.email - The email of the user.
   * @param {string} userDetails.password - The password of the user.
   * @param {string} userDetails.phoneNumber - The phone number of the user.
   * @returns {Promise<Object>} The result of the user creation.
   */
  static async createUser({ firstName, lastName, email, password, phoneNumber }) {
    try {
      const userRecord = await getAuth().createUser({
        email,
        emailVerified: false,
        phoneNumber,
        password,
        displayName: `${firstName} ${lastName}`,
        disabled: false,
      });

      const user = new User(
        userRecord.uid,
        firstName,
        lastName,
        email,
        phoneNumber,
        isEmulator ? Privileges.OWNER : Privileges.CUSTOMER
      );
      const actionCodeSettings = {
        url: "https://restaurant-management-sy-1a0cd.web.app/",
      };
      const verificationLink = await getAuth().generateEmailVerificationLink(
        email,
        actionCodeSettings
      );
      await EmailService.sendVerificationEmail(user, verificationLink);

      await db.collection("users").doc(userRecord.uid).set(user.toFirestore());

      return { success: true, uid: userRecord.uid };
    } catch (error) {
      logger.error("Error creating user:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logs in a user using Firebase Authentication.
   * @param {Object} credentials - The login credentials of the user.
   * @param {string} credentials.email - The email of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {Promise<Object>} The result of the login attempt.
   */
  static async loginUser({ email, password }) {
    try {
      const response = await axios.post(FIREBASE_SIGN_IN_ENDPOINT, {
        email,
        password,
        returnSecureToken: true,
      });

      return {
        success: true,
        uid: response.data.localId,
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      logger.error("Error logging in user:", error);
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }

  /**
   * Refreshes a user's Firebase Authentication token.
   * @param {string} refreshToken - The refresh token of the user.
   * @returns {Promise<Object>} The result of the token refresh attempt.
   */
  static async refreshUserToken(refreshToken) {
    try {
      const response = await axios.post(FIREBASE_REFRESH_TOKEN_URL, {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      return {
        success: true,
        idToken: response.data.id_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      logger.error("Error refreshing user token:", error);
      return { success: false, error: error.response ? error.response.data : error.message };
    }
  }

  /**
   * Creates a new employee user in Firebase Authentication and Firestore.
   * @param {Object} userDetails - The details of the employee to create.
   * @param {string} userDetails.firstName - The first name of the employee.
   * @param {string} userDetails.lastName - The last name of the employee.
   * @param {string} userDetails.email - The email of the employee.
   * @param {string} userDetails.password - The password of the employee.
   * @param {string} userDetails.phoneNumber - The phone number of the employee.
   * @returns {Promise<Object>} The reszult of the employee creation.
   */
  static async createEmployee({ firstName, lastName, email, password, phoneNumber }) {
    try {
      const userRecord = await getAuth().createUser({
        email,
        emailVerified: false,
        phoneNumber,
        password,
        displayName: `${firstName} ${lastName}`,
        disabled: false,
      });

      const user = new User(
        userRecord.uid,
        firstName,
        lastName,
        email,
        phoneNumber,
        Privileges.EMPLOYEE
      );
      await db.collection("users").doc(userRecord.uid).set(user.toFirestore());

      return { success: true, uid: userRecord.uid };
    } catch (error) {
      logger.error("Error creating employee:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Creates a new owner user in Firebase Authentication and Firestore.
   * @param {Object} userDetails - The details of the owner to create.
   * @param {string} userDetails.firstName - The first name of the owner.
   * @param {string} userDetails.lastName - The last name of the owner.
   * @param {string} userDetails.email - The email of the owner.
   * @param {string} userDetails.password - The password of the owner.
   * @param {string} userDetails.phoneNumber - The phone number of the owner.
   * @returns {Promise<Object>} The result of the owner creation.
   */
  static async createOwner({ firstName, lastName, email, password, phoneNumber }) {
    try {
      const userRecord = await getAuth().createUser({
        email,
        emailVerified: false,
        phoneNumber,
        password,
        displayName: `${firstName} ${lastName}`,
        disabled: false,
      });

      const user = new User(
        userRecord.uid,
        firstName,
        lastName,
        email,
        phoneNumber,
        Privileges.OWNER
      );
      await db.collection("users").doc(userRecord.uid).set(user.toFirestore());

      return { success: true, uid: userRecord.uid };
    } catch (error) {
      logger.error("Error creating owner:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Signs in a user using a Google ID token from the client.
   * If the user does not exist, creates a new account.
   * Exchanges the custom token for an access (ID) token and refresh token.
   * @param {string} idToken - The ID token from Firebase Authentication (Google sign-in).
   * @returns {Promise<Object>} The result including uid, idToken, and refreshToken.
   */
  static async signInWithGoogle(idToken) {
    try {
      // Verify the client ID token received from the frontend.
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      // Check if a Firestore user document exists.
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) {
        // Extract details from the decoded token.
        const fullName = decodedToken.name || "";
        const names = fullName.split(" ");
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(" ") || "";
        const email = decodedToken.email;
        const phoneNumber = decodedToken.phone_number || null;

        // Create a new user record in Firebase Auth and Firestore.
        const user = new User(
          uid,
          firstName,
          lastName,
          email,
          phoneNumber,
          isEmulator ? Privileges.OWNER : Privileges.CUSTOMER
        );
        await db.collection("users").doc(uid).set(user.toFirestore());
      }

      // Generate a custom token using Firebase Admin SDK.
      const customToken = await getAuth().createCustomToken(uid);

      // Exchange the custom token for an ID token and refresh token using Firebase REST API.
      const signInResponse = await axios.post(FIREBASE_SIGN_IN_WITH_CUSTOM_TOKEN, {
        token: customToken,
        returnSecureToken: true,
      });

      return {
        success: true,
        uid,
        idToken: signInResponse.data.idToken,
        refreshToken: signInResponse.data.refreshToken,
      };
    } catch (error) {
      logger.error("Error signing in with Google:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sends a password reset email to the user.
   * @param {string} email - The email of the user requesting password reset.
   * @returns {Promise<Object>} The result of the password reset attempt.
   */
  static async forgotPassword(email) {
    try {
      const validationError = isValidEmail(email);
      if (validationError) {
        logger.error("Invalid email for password reset:", validationError);
        return { success: false, error: validationError };
      }
      const url = await getAuth().generatePasswordResetLink(email);

      return { success: true, message: "Password reset email sent.", url: url };
    } catch (error) {
      log("Error sending password reset email:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletes a user account from Firebase Authentication and Firestore.
   * @param {string} uid - The UID of the user to delete.
   * @returns {Promise<Object>} The result of the delete attempt.
   */
  static async deleteAccount(uid) {
    try {
      await getAuth().deleteUser(uid);
      await db.collection("users").doc(uid).delete();
      return { success: true, message: "User account deleted successfully." };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = AuthService;
