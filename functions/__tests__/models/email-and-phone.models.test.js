// __tests__/models/email-and-phone.models.test.js
const { Email } = require("../../app/models/email.model");
const { PhoneNumber } = require("../../app/models/phoneNumber.model");

describe("Email Model", () => {
  describe("Email constructor", () => {
    it("should create a new Email instance with provided value", () => {
      const email = new Email("test@example.com");
      expect(email.email).toBe("test@example.com");
    });
  });

  describe("toFirestore", () => {
    it("should convert Email instance to Firestore format", () => {
      const email = new Email("test@example.com");
      const firestoreData = email.toFirestore();

      expect(firestoreData).toEqual({
        email: "test@example.com",
      });
    });
  });

  describe("fromFirestore", () => {
    it("should create an Email instance from Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          email: "test@example.com",
        }),
      };

      const email = Email.fromFirestore(snapshot);

      expect(email).toBeInstanceOf(Email);
      expect(email.email).toBe("test@example.com");
    });

    it("should handle missing email field in Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          // Missing email field
        }),
      };

      const email = Email.fromFirestore(snapshot);

      expect(email).toBeInstanceOf(Email);
      expect(email.email).toBeUndefined();
    });
  });

  describe("Email usage scenarios", () => {
    it("should handle different email formats", () => {
      // Test with different email formats
      const email1 = new Email("simple@example.com");
      expect(email1.email).toBe("simple@example.com");

      const email2 = new Email("user.name+tag@example.co.uk");
      expect(email2.email).toBe("user.name+tag@example.co.uk");

      const email3 = new Email("");
      expect(email3.email).toBe("");
    });
  });
});

describe("PhoneNumber Model", () => {
  describe("PhoneNumber constructor", () => {
    it("should create a new PhoneNumber instance with provided value", () => {
      const phoneNumber = new PhoneNumber("+353 1 234 5678");
      expect(phoneNumber.phoneNumber).toBe("+353 1 234 5678");
    });
  });

  describe("toFirestore", () => {
    it("should convert PhoneNumber instance to Firestore format", () => {
      const phoneNumber = new PhoneNumber("+353 1 234 5678");
      const firestoreData = phoneNumber.toFirestore();

      expect(firestoreData).toEqual({
        phoneNumber: "+353 1 234 5678",
      });
    });
  });

  describe("fromFirestore", () => {
    it("should create a PhoneNumber instance from Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          phoneNumber: "+353 1 234 5678",
        }),
      };

      const phoneNumber = PhoneNumber.fromFirestore(snapshot);

      expect(phoneNumber).toBeInstanceOf(PhoneNumber);
      expect(phoneNumber.phoneNumber).toBe("+353 1 234 5678");
    });

    it("should handle missing phoneNumber field in Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          // Missing phoneNumber field
        }),
      };

      const phoneNumber = PhoneNumber.fromFirestore(snapshot);

      expect(phoneNumber).toBeInstanceOf(PhoneNumber);
      expect(phoneNumber.phoneNumber).toBeUndefined();
    });
  });

  describe("PhoneNumber usage scenarios", () => {
    it("should handle different phone number formats", () => {
      // Test with different phone number formats
      const phone1 = new PhoneNumber("+1234567890");
      expect(phone1.phoneNumber).toBe("+1234567890");

      const phone2 = new PhoneNumber("(01) 234-5678");
      expect(phone2.phoneNumber).toBe("(01) 234-5678");

      const phone3 = new PhoneNumber("");
      expect(phone3.phoneNumber).toBe("");
    });
  });
});
