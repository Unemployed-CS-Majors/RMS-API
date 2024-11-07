const { isISO8601 } = require('validator');

function isValidISODateTime(dateTime) {
    return isISO8601(dateTime);
  }
  
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

    if(people <= 0) {
        return "People must be greater than 0";
    }

    return null;
}

module.exports = {
    validateCreateReservation
};