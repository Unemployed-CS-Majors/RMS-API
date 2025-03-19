// __tests__/validators/reservation.validators.test.js
const {
  validateCreateReservation,
  validateTimeFormat,
  validateSeats,
} = require("../../app/validators/reservation.validators");

describe("Reservation Validators", () => {
  describe("validateCreateReservation", () => {
    it("should validate valid reservation data", () => {
      const req = {
        body: {
          startTime: "2023-12-01T18:00:00Z", // ISO 8601 format
          endTime: "2023-12-01T20:00:00Z", // ISO 8601 format
          tableId: 1,
          people: 4,
        },
      };

      expect(validateCreateReservation(req)).toBeNull();
    });

    it("should reject when required fields are missing", () => {
      // Missing startTime
      const req1 = {
        body: {
          endTime: "2023-12-01T20:00:00Z",
          tableId: 1,
          people: 4,
        },
      };
      expect(validateCreateReservation(req1)).toBe("All fields are required");

      // Missing endTime
      const req2 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          tableId: 1,
          people: 4,
        },
      };
      expect(validateCreateReservation(req2)).toBe("All fields are required");

      // Missing tableId
      const req3 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "2023-12-01T20:00:00Z",
          people: 4,
        },
      };
      expect(validateCreateReservation(req3)).toBe("All fields are required");

      // Missing people
      const req4 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "2023-12-01T20:00:00Z",
          tableId: 1,
        },
      };
      expect(validateCreateReservation(req4)).toBe("All fields are required");

      // Empty body
      const req5 = {
        body: {},
      };
      expect(validateCreateReservation(req5)).toBe("All fields are required");
    });

    it("should reject when time format is invalid", () => {
      // Invalid startTime format
      const req1 = {
        body: {
          startTime: "01/12/2023 18:00", // Not ISO 8601
          endTime: "2023-12-01T20:00:00Z",
          tableId: 1,
          people: 4,
        },
      };
      expect(validateCreateReservation(req1)).toBe(
        "Start and end time must be valid ISO 8601 date-time strings",
      );

      // Invalid endTime format
      const req2 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "December 1, 2023 8:00 PM", // Not ISO 8601
          tableId: 1,
          people: 4,
        },
      };
      expect(validateCreateReservation(req2)).toBe(
        "Start and end time must be valid ISO 8601 date-time strings",
      );
    });

    it("should reject when people is not an integer or less than 1", () => {
      // People as string
      const req2 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "2023-12-01T20:00:00Z",
          tableId: 1,
          people: "4", // String, not number
        },
      };
      expect(validateCreateReservation(req2)).toBe("People must be an integer");

      // Negative people
      const req4 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "2023-12-01T20:00:00Z",
          tableId: 1,
          people: -2, // Negative
        },
      };
      expect(validateCreateReservation(req4)).toBe("People must be greater than 0");
    });

    it("should reject when tableId is not an integer", () => {
      // Non-integer tableId
      const req1 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "2023-12-01T20:00:00Z",
          tableId: 1.5, // Not an integer
          people: 4,
        },
      };
      expect(validateCreateReservation(req1)).toBe("Table ID must be an integer");

      // tableId as string
      const req2 = {
        body: {
          startTime: "2023-12-01T18:00:00Z",
          endTime: "2023-12-01T20:00:00Z",
          tableId: "table1", // String, not number
          people: 4,
        },
      };
      expect(validateCreateReservation(req2)).toBe("Table ID must be an integer");
    });
  });

  describe("validateTimeFormat", () => {
    it("should validate valid ISO 8601 time format", () => {
      // Standard ISO 8601 format
      expect(validateTimeFormat("2023-12-01T18:00:00Z")).toBeNull();

      // ISO 8601 with milliseconds
      expect(validateTimeFormat("2023-12-01T18:00:00.123Z")).toBeNull();

      // ISO 8601 with timezone offset
      expect(validateTimeFormat("2023-12-01T18:00:00+01:00")).toBeNull();

      // ISO 8601 date only (YYYY-MM-DD) should also be valid
      expect(validateTimeFormat("2023-12-01")).toBeNull();
    });

    it("should reject when time format is invalid or missing", () => {
      // Empty string
      expect(validateTimeFormat("")).toBe("Time is required");

      // Null
      expect(validateTimeFormat(null)).toBe("Time is required");

      // Undefined
      expect(validateTimeFormat(undefined)).toBe("Time is required");

      // Non-ISO 8601 format
      expect(validateTimeFormat("01/12/2023 18:00")).toBe(
        "Time must be a valid ISO 8601 date-time string",
      );

      // Invalid date
      expect(validateTimeFormat("2023-13-01T18:00:00Z")).toBe(
        "Time must be a valid ISO 8601 date-time string",
      );
    });
  });

  describe("validateSeats", () => {
    it("should validate valid seat numbers", () => {
      // Positive integer
      expect(validateSeats(4)).toBeNull();

      // Minimum valid value (1)
      expect(validateSeats(1)).toBeNull();

      // Large number
      expect(validateSeats(20)).toBeNull();
    });

    it("should reject invalid seat numbers", () => {
      // Non-integer
      expect(validateSeats(2.5)).toBe("Seats must be an integer");

      // String
      expect(validateSeats("4")).toBe("Seats must be an integer");

      // Zero
      expect(validateSeats(0)).toBe("Seats must be greater than 0");

      // Negative
      expect(validateSeats(-2)).toBe("Seats must be greater than 0");

      // Not a number
      expect(validateSeats(NaN)).toBe("Seats must be an integer");

      // Object
      expect(validateSeats({})).toBe("Seats must be an integer");

      // Array
      expect(validateSeats([4])).toBe("Seats must be an integer");
    });
  });
});
