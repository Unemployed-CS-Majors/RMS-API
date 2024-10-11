const admin = require('firebase-admin');
const { createResponse } = require("../utils/responseUtil");

const verifyIdToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json(createResponse("error", error.message, null));
  }
};
  module.exports = {
    verifyIdToken,
  };