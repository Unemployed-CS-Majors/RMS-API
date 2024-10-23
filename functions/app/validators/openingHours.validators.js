function validateOpeningHours(req) {
    const { day, startTime, endTime } = req.body;
        if (!day) {
      return "All fields are required";
    }
    if(startTime && endTime) {
    if (startTime >= endTime) {
      return "Start time must be before end time";
    }
    }
    return null;
}

module.exports = { validateOpeningHours };