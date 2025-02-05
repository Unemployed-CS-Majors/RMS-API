const isEmulator = process.env.FIREBASE_EMULATOR_HUB ? true : false;
const functions = require('firebase-functions');

/**
 * Determines the sign-in URL based on whether the Firebase emulator is being used.
 * @type {string}
 */
let signInUrl = isEmulator
    ? "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test"
    : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + functions.config().rms.client_auth_api_key_auth;

/**
 * Determines the refresh token URL based on whether the Firebase emulator is being used.
 * @type {string}
 */
let refreshTokenUrl = isEmulator
    ? "http://localhost:9099/securetoken.googleapis.com/v1/token?key=test"
    : "https://securetoken.googleapis.com/v1/token?key=" + functions.config().rms.client_auth_api_key_auth;

module.exports = {
    /**
     * The endpoint for Firebase sign-in.
     * @type {string}
     */
    FIREBASE_SIGNIN_ENDPOINT: signInUrl,

    /**
     * The endpoint for Firebase refresh token.
     * @type {string}
     */
    FIREBASE_REFRESH_TOKEN_URL: refreshTokenUrl,
};