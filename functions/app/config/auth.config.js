const isEmulator = process.env.FIREBASE_EMULATOR_HUB ? true : false;
const functions = require('firebase-functions');

var signInUrl = isEmulator 
  ? "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test"
  : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + functions.config().rms.client_auth_api_key_auth;

var refreshTokenUrl = isEmulator 
  ? "http://localhost:9099/securetoken.googleapis.com/v1/token?key=test"
  : "https://securetoken.googleapis.com/v1/token?key=" + functions.config().rms.client_auth_api_key_auth;

module.exports = {
    FIREBASE_SIGNIN_ENDPOINT: signInUrl,
    FIREBASE_REFRESH_TOKEN_URL: refreshTokenUrl,
};