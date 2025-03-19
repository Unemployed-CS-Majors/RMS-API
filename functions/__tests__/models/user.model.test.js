// __tests__/models/user.model.test.js
const { User, Privileges } = require("../../app/models/user.model");

describe("User Model", () => {
  const sampleUserData = {
    id: "user123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    privileges: Privileges.CUSTOMER,
  };

  describe("User constructor", () => {
    it("should create a new User instance with provided values", () => {
      const user = new User(
        sampleUserData.id,
        sampleUserData.firstName,
        sampleUserData.lastName,
        sampleUserData.email,
        sampleUserData.phoneNumber,
        sampleUserData.privileges,
      );

      expect(user.uid).toBe(sampleUserData.id);
      expect(user.firstName).toBe(sampleUserData.firstName);
      expect(user.lastName).toBe(sampleUserData.lastName);
      expect(user.email).toBe(sampleUserData.email);
      expect(user.phoneNumber).toBe(sampleUserData.phoneNumber);
      expect(user.privileges).toBe(sampleUserData.privileges);
    });
  });

  describe("toFirestore", () => {
    it("should convert User instance to Firestore format", () => {
      const user = new User(
        sampleUserData.id,
        sampleUserData.firstName,
        sampleUserData.lastName,
        sampleUserData.email,
        sampleUserData.phoneNumber,
        sampleUserData.privileges,
      );

      const firestoreData = user.toFirestore();

      expect(firestoreData).toEqual({
        firstName: sampleUserData.firstName,
        lastName: sampleUserData.lastName,
        email: sampleUserData.email,
        phoneNumber: sampleUserData.phoneNumber,
        privileges: sampleUserData.privileges,
      });

      // uid should not be included in Firestore data
      expect(firestoreData.uid).toBeUndefined();
    });
  });

  describe("fromFirestore", () => {
    it("should create a User instance from Firestore snapshot", () => {
      const snapshot = {
        id: sampleUserData.id,
        data: () => ({
          firstName: sampleUserData.firstName,
          lastName: sampleUserData.lastName,
          email: sampleUserData.email,
          phoneNumber: sampleUserData.phoneNumber,
          privileges: sampleUserData.privileges,
        }),
      };

      const user = User.fromFirestore(snapshot);

      expect(user).toBeInstanceOf(User);
      expect(user.uid).toBe(sampleUserData.id);
      expect(user.firstName).toBe(sampleUserData.firstName);
      expect(user.lastName).toBe(sampleUserData.lastName);
      expect(user.email).toBe(sampleUserData.email);
      expect(user.phoneNumber).toBe(sampleUserData.phoneNumber);
      expect(user.privileges).toBe(sampleUserData.privileges);
    });
  });

  describe("Privileges enum", () => {
    it("should have the correct privilege values", () => {
      expect(Privileges.CUSTOMER).toBe("customer");
      expect(Privileges.OWNER).toBe("owner");
      expect(Privileges.EMPLOYEE).toBe("employee");
    });
  });
});
