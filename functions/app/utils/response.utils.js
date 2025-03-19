/**
 * Creates a response object.
 * @param {string} status - The status code of the response.
 * @param {string|null} message - The message of the response.
 * @param {Object|null} [data=null] - The data to include in the response (optional).
 * @returns {Object} The response object.
 */
const createResponse = (status, message, data = null) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = {
  createResponse,
};
