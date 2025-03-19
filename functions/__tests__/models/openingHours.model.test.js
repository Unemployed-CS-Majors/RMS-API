// __tests__/models/openingHours.model.test.js
const { OpeningHours, Day } = require("../../app/models/openingHours.model");

describe("OpeningHours Model", () => {
  const sampleOpeningHoursData = {
    dayId: "1",
    day: Day.MONDAY,
    startTime: "09:00",
    endTime: "17:00",
  };

  describe("OpeningHours constructor", () => {
    it("should create a new OpeningHours instance with provided values", () => {
      const openingHours = new OpeningHours(
        sampleOpeningHoursData.dayId,
        sampleOpeningHoursData.day,
        sampleOpeningHoursData.startTime,
        sampleOpeningHoursData.endTime
      );

      expect(openingHours.dayId).toBe(sampleOpeningHoursData.dayId);
      expect(openingHours.day).toBe(sampleOpeningHoursData.day);
      expect(openingHours.startTime).toBe(sampleOpeningHoursData.startTime);
      expect(openingHours.endTime).toBe(sampleOpeningHoursData.endTime);
    });
  });

  describe("toFirestore", () => {
    it("should convert OpeningHours instance to Firestore format", () => {
      const openingHours = new OpeningHours(
        sampleOpeningHoursData.dayId,
        sampleOpeningHoursData.day,
        sampleOpeningHoursData.startTime,
        sampleOpeningHoursData.endTime
      );

      const firestoreData = openingHours.toFirestore();

      expect(firestoreData).toEqual({
        dayId: sampleOpeningHoursData.dayId,
        day: sampleOpeningHoursData.day,
        startTime: sampleOpeningHoursData.startTime,
        endTime: sampleOpeningHoursData.endTime,
      });
    });
  });

  describe("fromFirestore", () => {
    it("should create an OpeningHours instance from Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          dayId: sampleOpeningHoursData.dayId,
          day: sampleOpeningHoursData.day,
          startTime: sampleOpeningHoursData.startTime,
          endTime: sampleOpeningHoursData.endTime,
        }),
      };

      const openingHours = OpeningHours.fromFirestore(snapshot);

      expect(openingHours).toBeInstanceOf(OpeningHours);
      expect(openingHours.dayId).toBe(sampleOpeningHoursData.dayId);
      expect(openingHours.day).toBe(sampleOpeningHoursData.day);
      expect(openingHours.startTime).toBe(sampleOpeningHoursData.startTime);
      expect(openingHours.endTime).toBe(sampleOpeningHoursData.endTime);
    });
  });

  describe("Day enum", () => {
    it("should have the correct day values", () => {
      expect(Day.MONDAY).toBe("monday");
      expect(Day.TUESDAY).toBe("tuesday");
      expect(Day.WEDNESDAY).toBe("wednesday");
      expect(Day.THURSDAY).toBe("thursday");
      expect(Day.FRIDAY).toBe("friday");
      expect(Day.SATURDAY).toBe("saturday");
      expect(Day.SUNDAY).toBe("sunday");
    });
  });

  describe("OpeningHours variations", () => {
    it("should handle different time formats", () => {
      // Test with 24-hour time format
      const openingHours1 = new OpeningHours("1", Day.MONDAY, "09:00", "21:00");
      expect(openingHours1.startTime).toBe("09:00");
      expect(openingHours1.endTime).toBe("21:00");

      // Test with 12-hour time format strings (will be stored as-is)
      const openingHours2 = new OpeningHours("2", Day.TUESDAY, "9:00 AM", "9:00 PM");
      expect(openingHours2.startTime).toBe("9:00 AM");
      expect(openingHours2.endTime).toBe("9:00 PM");
    });

    it("should handle special cases like closed days", () => {
      const closedDay = new OpeningHours("7", Day.SUNDAY, "CLOSED", "CLOSED");

      expect(closedDay.day).toBe(Day.SUNDAY);
      expect(closedDay.startTime).toBe("CLOSED");
      expect(closedDay.endTime).toBe("CLOSED");

      const firestoreData = closedDay.toFirestore();
      expect(firestoreData.startTime).toBe("CLOSED");
      expect(firestoreData.endTime).toBe("CLOSED");
    });
  });
});
