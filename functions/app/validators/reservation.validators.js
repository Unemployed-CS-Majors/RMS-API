const { isISO8601 } = require('validator');

/**
 * Checks if the given date-time string is a valid ISO 8601 format.
 * @param {string} dateTime - The date-time string to validate.
 * @returns {boolean} True if the date-time string is valid ISO 8601, otherwise false.
 */
function isValidISODateTime(dateTime) {
    return isISO8601(dateTime);
}

/**
 * Validates the create reservation request.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.startTime - The start time of the reservation.
 * @param {string} req.body.endTime - The end time of the reservation.
 * @param {number} req.body.tableId - The ID of the table.
 * @param {number} req.body.people - The number of people for the reservation.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateCreateReservation(req) {
    const { startTime, endTime, tableId, people } = req.body;

    if(!startTime || !endTime || !tableId || !people) {
        return "All fields are required";
    }

    if(!isValidISODateTime(startTime) || !isValidISODateTime(endTime)) {
        return "Start and end time must be valid ISO 8601 date-time strings";
    }

    if(!Number.isInteger(people)) {
        return "People must be an integer";
    }

    if(!Number.isInteger(tableId)) {
        return "Table ID must be an integer";
    }

    if(people <= 0) {
        return "People must be greater than 0";
    }

    return null;
}

/**
 * Validates the time format.
 * @param {string} time - The time string to validate.
 * @returns {string|null} An error message if validation fails, otherwise null.
 */
function validateTimeFormat(time) {
    if(!time){
        return "Time is required";
    }

    if(!isValidISODateTime(time)){
        return "Time must be a valid ISO 8601 date-time string";
    }

    return null;
}

function validateSeats(seats){
    if(!Number.isInteger(seats)){
        return "Seats must be an integer";
    }

    if(seats <= 0){
        return "Seats must be greater than 0";
    }

    return null;
}

module.exports = {
    validateCreateReservation,
    validateTimeFormat,
    validateSeats
};