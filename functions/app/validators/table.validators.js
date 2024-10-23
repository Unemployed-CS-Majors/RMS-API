/**
 * Validates the request to create a table.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.seats - The number of seats at the table.
 * @param {boolean} req.body.nextToWindow - Indicates if the table is next to a window.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateCreateTable(req) {
    const { seats, nextToWindow } = req.body;

    if (seats === undefined || nextToWindow === undefined) {
        return "All fields are required";
    }

    if (!Number.isInteger(seats)) {
        return "Seats must be an integer";
    }

    if (typeof nextToWindow !== 'boolean') {
        return "Next to window must be a boolean";
    }

    return null;
}

module.exports = {
    validateCreateTable
};