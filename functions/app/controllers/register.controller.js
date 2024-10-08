const { getAuth } = require("firebase-admin/auth");
const { createResponse } = require("../utils/responseUtil");
const admin = require('firebase-admin');
const User = require('../models/user.model');

class RegisterController {
  static register(req, res) {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res
        .status(400)
        .json(createResponse("error", "All fields are required", null));
    }

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
        // Save user details in Firestore
        const db = admin.firestore();
        const user = new User(userRecord.uid, firstName, lastName, email, phoneNumber);
        return db.collection('users').doc(userRecord.uid).set(user.toFirestore()).then(() => {
          console.log("Successfully created new user and saved details in Firestore:", userRecord.uid);
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
        res
          .status(500)
          .json(createResponse("error", error.message, null));
      });
  }
}

module.exports = RegisterController;