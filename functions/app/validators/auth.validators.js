// validators.js
function validateRegister(req) {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return "All fields are required";
    }
    return null;
  }
  
  function validateLogin(req) {
    const { email, password } = req.body;
    if (!email || !password) {
      return "All fields are required";
    }
    return null;
  }
  
  function validateRefreshToken(req) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return "Refresh token is required";
    }
    return null;
  }
  
  module.exports = {
    validateRegister,
    validateLogin,
    validateRefreshToken,
  };