const isEmulator = process.env.FIREBASE_EMULATOR_HUB ? true : false;
const {config} = require("firebase-functions");
/**
 * Determines the sign-in URL based on whether the Firebase emulator is being used.
 * @type {string}
 */
let signInUrl = isEmulator
    ? "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test"
    : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + process.env.CLIENT_AUTH_API_KEY;

let signInWithCustomToken = isEmulator
    ? "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=test":
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=` + process.env.CLIENT_AUTH_API_KEY;

/**
 * Determines the refresh token URL based on whether the Firebase emulator is being used.
 * @type {string}
 */
let refreshTokenUrl = isEmulator
    ? "http://localhost:9099/securetoken.googleapis.com/v1/token?key=test"
    : "https://securetoken.googleapis.com/v1/token?key=" + process.env.CLIENT_AUTH_API_KEY;


module.exports = {
    /**
     * The endpoint for Firebase sign-in.
     * @type {string}
     */
    FIREBASE_SIGN_IN_ENDPOINT: signInUrl,
    FIREBASE_SIGN_IN_WITH_CUSTOM_TOKEN: signInWithCustomToken,
    /**
     * The endpoint for Firebase refresh token.
     * @type {string}
     */
    FIREBASE_REFRESH_TOKEN_URL: refreshTokenUrl,
    isEmulator
};