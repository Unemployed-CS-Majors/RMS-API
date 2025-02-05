/**
 * Validates the opening hours request.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.day - The day of the week.
 * @param {string} req.body.startTime - The start time of the opening hours.
 * @param {string} req.body.endTime - The end time of the opening hours.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateOpeningHours(req) {
    const { day, startTime, endTime } = req.body;
    if (!day) {
        return "All fields are required";
    }
    if (startTime && endTime) {
        if (startTime >= endTime) {
            return "Start time must be before end time";
        }
    }
    return null;
}

module.exports = { validateOpeningHours };