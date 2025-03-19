/**
 * Validates the registration request.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.firstName - The first name of the user.
 * @param {string} req.body.lastName - The last name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.phoneNumber - The phone number of the user.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateRegister(req) {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return "All fields are required";
  }
  return null;
}

/**
 * Validates the login request.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateLogin(req) {
  const { email, password } = req.body;
  if (!email || !password) {
    return "All fields are required";
  }
  return null;
}

/**
 * Validates the refresh token request.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.refreshToken - The refresh token.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateRefreshToken(req) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return "Refresh token is required";
  }
  return null;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  isValidEmail,
};
