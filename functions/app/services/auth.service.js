const axios = require("axios");
const { getAuth } = require("firebase-admin/auth");
const { User, Privileges } = require("../models/user.model");
const { db } = require("../config/firebase.config");
const { FIREBASE_REFRESH_TOKEN_URL, FIREBASE_SIGN_IN_ENDPOINT, isEmulator } = require("../config/auth.config");

class AuthService {
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

            const user = new User(userRecord.uid, firstName, lastName, email, phoneNumber, isEmulator ? Privileges.OWNER : Privileges.CUSTOMER);
            await db.collection("users").doc(userRecord.uid).set(user.toFirestore());

            return { success: true, uid: userRecord.uid };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

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
            return { success: false, error: error.response ? error.response.data : error.message };
        }
    }

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
            return { success: false, error: error.response ? error.response.data : error.message };
        }
    }

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

            const user = new User(userRecord.uid, firstName, lastName, email, phoneNumber, Privileges.EMPLOYEE);
            await db.collection("users").doc(userRecord.uid).set(user.toFirestore());

            return { success: true, uid: userRecord.uid };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

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

            const user = new User(userRecord.uid, firstName, lastName, email, phoneNumber, Privileges.OWNER);
            await db.collection("users").doc(userRecord.uid).set(user.toFirestore());

            return { success: true, uid: userRecord.uid };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = AuthService;