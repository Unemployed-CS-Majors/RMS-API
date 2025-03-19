// __tests__/validators/menuItem.validators.test.js
const {
  validateName,
  validateDescription,
  validatePrice,
  validateType,
  validateCalories,
  validateAvgWaitTime,
  validateAllergens,
  validateMenuItem,
} = require("../../app/validators/menuItem.validators");
const { ItemType, Allergen } = require("../../app/models/menuItem.model");

describe("MenuItem Validators", () => {
  describe("validateName", () => {
    it("should validate a valid menu item name", () => {
      expect(validateName("Margherita Pizza")).toEqual({ isValid: true });
      expect(validateName("Spaghetti Carbonara")).toEqual({ isValid: true });
      expect(validateName("Caesar Salad")).toEqual({ isValid: true });
    });

    it("should reject invalid menu item names", () => {
      // Empty name
      expect(validateName("")).toEqual({
        isValid: false,
        error: "Name is required and must be a non-empty string",
      });

      // Null name
      expect(validateName(null)).toEqual({
        isValid: false,
        error: "Name is required and must be a non-empty string",
      });

      // Undefined name
      expect(validateName(undefined)).toEqual({
        isValid: false,
        error: "Name is required and must be a non-empty string",
      });

      // Non-string name
      expect(validateName(123)).toEqual({
        isValid: false,
        error: "Name is required and must be a non-empty string",
      });

      // Just whitespace
      expect(validateName("   ")).toEqual({
        isValid: false,
        error: "Name is required and must be a non-empty string",
      });

      // Too long name (over 100 characters)
      const longName = "A".repeat(101);
      expect(validateName(longName)).toEqual({
        isValid: false,
        error: "Name must be 100 characters or less",
      });
    });
  });

  describe("validateDescription", () => {
    // The current implementation returns isValid: true regardless of input
    it("should validate any description", () => {
      expect(validateDescription("Delicious pizza with tomato sauce and mozzarella")).toEqual({
        isValid: true,
      });
      expect(validateDescription("")).toEqual({ isValid: true });
      expect(validateDescription(null)).toEqual({ isValid: true });
      expect(validateDescription(undefined)).toEqual({ isValid: true });
    });
  });

  describe("validatePrice", () => {
    it("should validate valid prices", () => {
      // Integer price
      expect(validatePrice(10)).toEqual({ isValid: true });

      // Decimal price
      expect(validatePrice(12.99)).toEqual({ isValid: true });

      // String that can be parsed as a number
      expect(validatePrice("15.50")).toEqual({ isValid: true });

      // Zero price (free item)
      expect(validatePrice(0)).toEqual({ isValid: true });

      // Very low price
      expect(validatePrice(0.01)).toEqual({ isValid: true });
    });

    it("should reject invalid prices", () => {
      // Negative price
      expect(validatePrice(-10)).toEqual({
        isValid: false,
        error: "Price must be a positive number",
      });

      // Non-numeric string
      expect(validatePrice("abc")).toEqual({
        isValid: false,
        error: "Price is required and must be a number",
      });

      // Null price
      expect(validatePrice(null)).toEqual({
        isValid: false,
        error: "Price is required and must be a number",
      });

      // Undefined price
      expect(validatePrice(undefined)).toEqual({
        isValid: false,
        error: "Price is required and must be a number",
      });

      // Unreasonably high price
      expect(validatePrice(20000)).toEqual({
        isValid: false,
        error: "Price is unreasonably high",
      });
    });
  });

  describe("validateType", () => {
    it("should validate valid menu item types", () => {
      // Test all enum values
      expect(validateType(ItemType.APPETIZER)).toEqual({ isValid: true });
      expect(validateType(ItemType.MAIN)).toEqual({ isValid: true });
      expect(validateType(ItemType.DESSERT)).toEqual({ isValid: true });
      expect(validateType(ItemType.BEVERAGE)).toEqual({ isValid: true });
      expect(validateType(ItemType.SIDE)).toEqual({ isValid: true });
      expect(validateType(ItemType.SPECIAL)).toEqual({ isValid: true });
    });

    it("should reject invalid menu item types", () => {
      // Invalid type string
      expect(validateType("invalid_type")).toEqual({
        isValid: false,
        error: `Type must be one of: ${Object.values(ItemType).join(", ")}`,
      });

      // Empty string
      expect(validateType("")).toEqual({
        isValid: false,
        error: "Type is required and must be a string",
      });

      // Null
      expect(validateType(null)).toEqual({
        isValid: false,
        error: "Type is required and must be a string",
      });

      // Undefined
      expect(validateType(undefined)).toEqual({
        isValid: false,
        error: "Type is required and must be a string",
      });

      // Non-string value
      expect(validateType(123)).toEqual({
        isValid: false,
        error: "Type is required and must be a string",
      });
    });
  });

  describe("validateCalories", () => {
    it("should validate valid calorie values", () => {
      // Integer calories
      expect(validateCalories(500)).toEqual({ isValid: true });

      // String that can be parsed as a number
      expect(validateCalories("750")).toEqual({ isValid: true });

      // Zero calories
      expect(validateCalories(0)).toEqual({ isValid: true });

      // Optional field - null is valid
      expect(validateCalories(null)).toEqual({ isValid: true });

      // Optional field - undefined is valid
      expect(validateCalories(undefined)).toEqual({ isValid: true });

      // Optional field - empty string is valid
      expect(validateCalories("")).toEqual({ isValid: true });
    });

    it("should reject invalid calorie values", () => {
      // Negative calories
      expect(validateCalories(-100)).toEqual({
        isValid: false,
        error: "Calories cannot be negative",
      });

      // Non-numeric string
      expect(validateCalories("abc")).toEqual({
        isValid: false,
        error: "Calories must be a number",
      });

      // Unreasonably high calories
      expect(validateCalories(15000)).toEqual({
        isValid: false,
        error: "Calories value is unreasonably high",
      });
    });
  });

  describe("validateAvgWaitTime", () => {
    it("should validate valid average wait time values", () => {
      // Integer minutes
      expect(validateAvgWaitTime(15)).toEqual({ isValid: true });

      // String that can be parsed as a number
      expect(validateAvgWaitTime("30")).toEqual({ isValid: true });

      // Zero wait time (immediately available)
      expect(validateAvgWaitTime(0)).toEqual({ isValid: true });

      // Optional field - null is valid
      expect(validateAvgWaitTime(null)).toEqual({ isValid: true });

      // Optional field - undefined is valid
      expect(validateAvgWaitTime(undefined)).toEqual({ isValid: true });

      // Optional field - empty string is valid
      expect(validateAvgWaitTime("")).toEqual({ isValid: true });
    });

    it("should reject invalid average wait time values", () => {
      // Negative wait time
      expect(validateAvgWaitTime(-10)).toEqual({
        isValid: false,
        error: "Average wait time cannot be negative",
      });

      // Non-numeric string
      expect(validateAvgWaitTime("abc")).toEqual({
        isValid: false,
        error: "Average wait time must be a number",
      });

      // Unreasonably high wait time (over 3 hours)
      expect(validateAvgWaitTime(200)).toEqual({
        isValid: false,
        error: "Average wait time cannot exceed 180 minutes (3 hours)",
      });
    });
  });

  describe("validateAllergens", () => {
    it("should validate valid allergen arrays", () => {
      // Array of valid allergens
      expect(validateAllergens([Allergen.GLUTEN, Allergen.DAIRY])).toEqual({ isValid: true });

      // Empty array (no allergens)
      expect(validateAllergens([])).toEqual({ isValid: true });

      // JSON string of valid allergens
      expect(validateAllergens(JSON.stringify([Allergen.NUTS, Allergen.PEANUTS]))).toEqual({
        isValid: true,
      });

      // Optional field - null is valid
      expect(validateAllergens(null)).toEqual({ isValid: true });

      // Optional field - undefined is valid
      expect(validateAllergens(undefined)).toEqual({ isValid: true });

      // Optional field - empty string is valid
      expect(validateAllergens("")).toEqual({ isValid: true });
    });

    it("should reject invalid allergen values", () => {
      // Array with invalid allergen
      expect(validateAllergens([Allergen.GLUTEN, "invalid_allergen"])).toEqual({
        isValid: false,
        error: `Invalid allergens: invalid_allergen. Valid options are: ${Object.values(Allergen).join(", ")}`,
      });

      // Non-array, non-string value
      expect(validateAllergens(123)).toEqual({
        isValid: false,
        error: "Allergens must be an array",
      });

      // Invalid JSON string
      expect(validateAllergens('{"invalid json"}')).toEqual({
        isValid: false,
        error: "Allergens must be a valid JSON array",
      });
    });
  });

  describe("validateMenuItem", () => {
    it("should validate a valid menu item", () => {
      const menuItem = {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce and mozzarella",
        price: 12.99,
        type: ItemType.MAIN,
        calories: 800,
        avgWaitTime: 15,
        allergens: [Allergen.GLUTEN, Allergen.DAIRY],
      };

      const result = validateMenuItem(menuItem);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should validate a menu item with only required fields", () => {
      const menuItem = {
        name: "Caesar Salad",
        description: "Fresh salad with Caesar dressing",
        price: 8.99,
        type: ItemType.APPETIZER,
        // No optional fields
      };

      const result = validateMenuItem(menuItem);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should collect all validation errors for an invalid menu item", () => {
      const menuItem = {
        name: "", // Invalid: empty name
        description: "Description is valid",
        price: -5, // Invalid: negative price
        type: "invalid_type", // Invalid: not in enum
        calories: -100, // Invalid: negative calories
        avgWaitTime: 200, // Invalid: too long
        allergens: ["invalid_allergen"], // Invalid: not in enum
      };

      const result = validateMenuItem(menuItem);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(6); // One error for each invalid field

      // Check that the correct errors are present (without worrying about order)
      expect(result.errors).toContain("Name is required and must be a non-empty string");
      expect(result.errors).toContain("Price must be a positive number");
      expect(result.errors).toContain(`Type must be one of: ${Object.values(ItemType).join(", ")}`);
      expect(result.errors).toContain("Calories cannot be negative");
      expect(result.errors).toContain("Average wait time cannot exceed 180 minutes (3 hours)");
      expect(result.errors).toContain(
        `Invalid allergens: invalid_allergen. Valid options are: ${Object.values(Allergen).join(", ")}`
      );
    });
  });
});
