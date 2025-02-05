const Day = Object.freeze({
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
    SATURDAY: 'saturday',
    SUNDAY: 'sunday',
});

class OpeningHours {
    /**
     * Creates an instance of OpeningHours.
     * @param {string} dayId - The ID of the day.
     * @param {string} day - The day of the week.
     * @param {string} startTime - The start time of the opening hours.
     * @param {string} endTime - The end time of the opening hours.
     */
    constructor(dayId, day, startTime, endTime) {
        this.dayId = dayId;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    /**
     * Convert instance to Firestore-compatible format.
     * @returns {Object} Firestore data.
     */
    toFirestore() {
        return {
            dayId: this.dayId,
            day: this.day,
            startTime: this.startTime,
            endTime: this.endTime,
        };
    }

    /**
     * Populate instance from Firestore snapshot.
     * @param {Object} snapshot - Firestore snapshot.
     * @returns {OpeningHours} OpeningHours instance.
     */
    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new OpeningHours(
            data.dayId,
            data.day,
            data.startTime,
            data.endTime
        );
    }
}

module.exports = { OpeningHours, Day };