const axios = require("axios");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { getAuth } = require("firebase-admin/auth");
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} = require("../validators/auth.validators");
const authApiUrl = require("../config/auth.config");
const { User, Privileges } = require("../models/user.model");
const { createResponse } = require("../utils/responseUtil");
const {
  FIREBASE_REFRESH_TOKEN_URL,
  FIREBASE_SIGNIN_ENDPOINT,
} = require("../config/auth.config");

class AuthController {
  static register(req, res) {
    const validationError = validateRegister(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }

    const { firstName, lastName, email, password, phoneNumber } = req.body;

    getAuth()
      .createUser({
        email: email,
        emailVerified: false,
        phoneNumber: phoneNumber,
        password: password,
        displayName: firstName + " " + lastName,
        disabled: false,
      })
      .then((userRecord) => {
        const db = admin.firestore();
        const user = new User(
          userRecord.uid,
          firstName,
          lastName,
          email,
          phoneNumber,
          Privileges.CUSTOMER
        );
        return db
          .collection("users")
          .doc(userRecord.uid)
          .set(user.toFirestore())
          .then(() => {
            console.log(
              "Successfully created new user and saved details in Firestore:",
              userRecord.uid
            );
            res
              .status(201)
              .json(
                createResponse("success", "User registered successfully", {
                  uid: userRecord.uid,
                })
              );
          });
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
        res.status(500).json(createResponse("error", error.message, null));
      });
  }

  static login(req, res) {
    const validationError = validateLogin(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }

    const { email, password } = req.body;
    const signInEndpoint = FIREBASE_SIGNIN_ENDPOINT;

    const data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    axios
      .post(signInEndpoint, data)
      .then((response) => {
        res.status(200).json(
          createResponse("success", "User logged in successfully", {
            uid: response.data.localId,
            idToken: response.data.idToken,
            refreshToken: response.data.refreshToken,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        res.status(500).json(createResponse("error", error.message, null));
      });
  }

  static refreshToken(req, res) {
    const validationError = validateRefreshToken(req);
    if (validationError) {
      return res
        .status(400)
        .json(createResponse("error", validationError, null));
    }

    const { refreshToken } = req.body;
    const refreshTokenUrl = FIREBASE_REFRESH_TOKEN_URL;

    const data = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    axios
      .post(refreshTokenUrl, data)
      .then((response) => {
        res.status(200).json(
          createResponse("success", "Token refreshed successfully", {
            idToken: response.data.id_token,
            refreshToken: response.data.refresh_token,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        res.status(500).json(createResponse("error", error.message, null));
      });
  }
}

module.exports = AuthController;
