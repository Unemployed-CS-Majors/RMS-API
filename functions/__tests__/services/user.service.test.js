// __tests__/services/user.service.test.js
const UserService = require("../../app/services/user.service");
const { db } = require("../../app/config/firebase.config");
const { User } = require("../../app/models/user.model");
const { mockDocumentSnapshot } = require("../helpers");

jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("retrieves a user by ID successfully", async () => {
      const userData = {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };
      const mockUserRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("user1", userData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockUserRef) });

      const result = await UserService.getUser("user1");

      expect(result).toEqual(User.fromFirestore(mockDocumentSnapshot("user1", userData)));
    });

    it("returns null if user does not exist", async () => {
      const mockUserRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockUserRef) });

      const result = await UserService.getUser("user1");

      expect(result).toBeNull();
    });
  });
});
