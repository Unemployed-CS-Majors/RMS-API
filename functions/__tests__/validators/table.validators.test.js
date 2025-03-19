// __tests__/validators/table.validators.test.js
const { validateCreateTable } = require("../../app/validators/table.validators");

describe("Table Validators", () => {
  describe("validateCreateTable", () => {
    it("should validate valid table data", () => {
      const req = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };

      expect(validateCreateTable(req)).toBeNull();
    });

    it("should reject when required fields are missing", () => {
      // Missing seats
      const req1 = {
        body: {
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req1)).toBe("All fields are required");

      // Missing nextToWindow
      const req2 = {
        body: {
          seats: 4,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req2)).toBe("All fields are required");

      // Missing x
      const req3 = {
        body: {
          seats: 4,
          nextToWindow: true,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req3)).toBe("All fields are required");

      // Missing y
      const req4 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req4)).toBe("All fields are required");

      // Missing rotation
      const req5 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req5)).toBe("All fields are required");

      // Missing type
      const req6 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req6)).toBe("All fields are required");

      // Missing tableNum
      const req7 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
        },
      };
      expect(validateCreateTable(req7)).toBe("All fields are required");

      // Empty body
      const req8 = {
        body: {},
      };
      expect(validateCreateTable(req8)).toBe("All fields are required");
    });

    it("should reject when seats is not an integer", () => {
      // Non-integer seats
      const req1 = {
        body: {
          seats: 4.5, // Not an integer
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req1)).toBe("Seats must be an integer");

      // Seats as string
      const req2 = {
        body: {
          seats: "4", // String, not number
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req2)).toBe("Seats must be an integer");
    });

    it("should reject when nextToWindow is not a boolean", () => {
      // nextToWindow as number
      const req1 = {
        body: {
          seats: 4,
          nextToWindow: 1, // Number, not boolean
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req1)).toBe("z to window must be a boolean");

      // nextToWindow as string
      const req2 = {
        body: {
          seats: 4,
          nextToWindow: "true", // String, not boolean
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req2)).toBe("z to window must be a boolean");
    });

    it("should reject when x, y, or rotation is not an integer", () => {
      // Non-integer x
      const req1 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100.5, // Not an integer
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req1)).toBe("x must be an integer");

      // Non-integer y
      const req2 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200.5, // Not an integer
          rotation: 0,
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req2)).toBe("y must be an integer");

      // Non-integer rotation
      const req3 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 45.5, // Not an integer
          type: "square",
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req3)).toBe("rotation must be an integer");
    });

    it("should reject when type is not a string", () => {
      // Type as number
      const req1 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: 1, // Number, not string
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req1)).toBe("type must be a string");

      // Type as boolean
      const req2 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: true, // Boolean, not string
          tableNum: 42,
        },
      };
      expect(validateCreateTable(req2)).toBe("type must be a string");
    });

    it("should reject when tableNum is not an integer", () => {
      // Non-integer tableNum
      const req1 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: 42.5, // Not an integer
        },
      };
      expect(validateCreateTable(req1)).toBe("tableNum must be an integer");

      // tableNum as string
      const req2 = {
        body: {
          seats: 4,
          nextToWindow: true,
          x: 100,
          y: 200,
          rotation: 0,
          type: "square",
          tableNum: "42", // String, not number
        },
      };
      expect(validateCreateTable(req2)).toBe("tableNum must be an integer");
    });

    it("should handle negative and zero values correctly", () => {
      // All fields with valid types but potentially problematic values
      const req = {
        body: {
          seats: 0, // Zero seats
          nextToWindow: false,
          x: -100, // Negative x
          y: -200, // Negative y
          rotation: -45, // Negative rotation
          type: "", // Empty string type
          tableNum: 0, // Zero tableNum
        },
      };

      // The current implementation only validates types, not specific value ranges
      // The validator should still pass this because all field types are correct
      expect(validateCreateTable(req)).toBeNull();
    });
  });
});
