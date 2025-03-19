// functions/app/config/auth.config.js
const { logger } = require("../logger/FirebaseLogger");
require("dotenv").config();

const isEmulator = process.env.FIREBASE_EMULATOR_HUB ? true : false;
const nodeEnv = process.env.NODE_ENV || "development";
// Use the same API key for both environments
const apiKey = process.env.CLIENT_AUTH_API_KEY;

if (!apiKey && !isEmulator) {
  logger.error("No CLIENT_AUTH_API_KEY found");
}

logger.info(`Configuring auth for ${nodeEnv} environment${isEmulator ? " (emulator mode)" : ""}`);

/**
 * Determines the sign-in URL based on whether the Firebase emulator is being used.
 * @type {string}
 */
const signInUrl = isEmulator
  ? "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test"
  : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + apiKey;

const signInWithCustomToken = isEmulator
  ? "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=test"
  : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=" + apiKey;

/**
 * Determines the refresh token URL based on whether the Firebase emulator is being used.
 * @type {string}
 */
const refreshTokenUrl = isEmulator
  ? "http://localhost:9099/securetoken.googleapis.com/v1/token?key=test"
  : "https://securetoken.googleapis.com/v1/token?key=" + apiKey;

module.exports = {
  /**
   * The environment the auth configuration is running in
   * @type {string}
   */
  ENVIRONMENT: nodeEnv,

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
  isEmulator,
};
