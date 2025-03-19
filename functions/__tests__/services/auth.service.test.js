// __tests__/services/auth.service.test.js
const AuthService = require("../../app/services/auth.service");
const { getAuth } = require("firebase-admin/auth");
const { db } = require("../../app/config/firebase.config");
const { User, Privileges } = require("../../app/models/user.model");
const axios = require("axios");
const EmailService = require("../../app/services/email.service");

// Mock Firebase Admin Auth and Axios
jest.mock("firebase-admin/auth");
jest.mock("axios");
jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
  isEmulator: false,
}));
jest.mock("../../app/services/email.service");

describe("Auth Service", () => {
  let mockUserRef;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup common mocks
    mockUserRef = {
      set: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "+1234567890",
          privileges: Privileges.CUSTOMER,
        }),
        id: "user123",
      }),
      delete: jest.fn().mockResolvedValue({}),
    };

    const mockCollectionRef = {
      doc: jest.fn().mockReturnValue(mockUserRef),
    };

    db.collection.mockReturnValue(mockCollectionRef);
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      // Mock data
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phoneNumber: "+1234567890",
      };

      const mockUserRecord = {
        uid: "user123",
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        displayName: `${userData.firstName} ${userData.lastName}`,
      };

      // Mock Firebase Auth
      getAuth().createUser.mockResolvedValue(mockUserRecord);
      getAuth().generateEmailVerificationLink.mockResolvedValue("https://example.com/verify");

      // Call the service
      const result = await AuthService.createUser(userData);

      // Assertions
      expect(getAuth().createUser).toHaveBeenCalledWith({
        email: userData.email,
        emailVerified: false,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`,
        disabled: false,
      });

      expect(getAuth().generateEmailVerificationLink).toHaveBeenCalledWith(
        userData.email,
        expect.any(Object),
      );

      expect(EmailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(User),
        "https://example.com/verify",
      );

      expect(db.collection).toHaveBeenCalledWith("users");
      expect(mockUserRef.set).toHaveBeenCalled();

      expect(result).toEqual({
        success: true,
        uid: "user123",
      });
    });

    it("should handle errors during user creation", async () => {
      // Mock data
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phoneNumber: "+1234567890",
      };

      // Mock Firebase Auth to throw error
      const error = new Error("Email already exists");
      getAuth().createUser.mockRejectedValue(error);

      // Call the service
      const result = await AuthService.createUser(userData);

      // Assertions
      expect(getAuth().createUser).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        error: "Email already exists",
      });
      expect(mockUserRef.set).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should login a user successfully", async () => {
      // Mock data
      const credentials = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const mockResponse = {
        data: {
          localId: "user123",
          idToken: "id-token-123",
          refreshToken: "refresh-token-123",
        },
      };

      // Mock Axios
      axios.post.mockResolvedValue(mockResponse);

      // Call the service
      const result = await AuthService.loginUser(credentials);

      // Assertions
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][1]).toEqual({
        email: credentials.email,
        password: credentials.password,
        returnSecureToken: true,
      });

      expect(result).toEqual({
        success: true,
        uid: "user123",
        idToken: "id-token-123",
        refreshToken: "refresh-token-123",
      });
    });

    it("should handle login errors", async () => {
      // Mock data
      const credentials = {
        email: "john.doe@example.com",
        password: "wrong-password",
      };

      // Mock Axios to throw error
      const error = {
        response: {
          data: {
            error: {
              message: "INVALID_PASSWORD",
            },
          },
        },
      };
      axios.post.mockRejectedValue(error);

      // Call the service
      const result = await AuthService.loginUser(credentials);

      // Assertions
      expect(axios.post).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        error: error.response.data,
      });
    });
  });

  describe("refreshUserToken", () => {
    it("should refresh a user token successfully", async () => {
      // Mock data
      const refreshToken = "refresh-token-123";

      const mockResponse = {
        data: {
          id_token: "new-id-token-123",
          refresh_token: "new-refresh-token-123",
        },
      };

      // Mock Axios
      axios.post.mockResolvedValue(mockResponse);

      // Call the service
      const result = await AuthService.refreshUserToken(refreshToken);

      // Assertions
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post.mock.calls[0][1]).toEqual({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      expect(result).toEqual({
        success: true,
        idToken: "new-id-token-123",
        refreshToken: "new-refresh-token-123",
      });
    });

    it("should handle token refresh errors", async () => {
      // Mock data
      const refreshToken = "invalid-refresh-token";

      // Mock Axios to throw error
      const error = {
        response: {
          data: {
            error: {
              message: "INVALID_REFRESH_TOKEN",
            },
          },
        },
      };
      axios.post.mockRejectedValue(error);

      // Call the service
      const result = await AuthService.refreshUserToken(refreshToken);

      // Assertions
      expect(axios.post).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        error: error.response.data,
      });
    });
  });

  describe("signInWithGoogle", () => {
    it("should sign in with Google successfully for existing user", async () => {
      // Mock data
      const idToken = "google-id-token-123";
      const decodedToken = {
        uid: "user123",
        email: "john.doe@example.com",
        name: "John Doe",
      };

      // Mock Firebase Auth
      getAuth().verifyIdToken.mockResolvedValue(decodedToken);
      getAuth().createCustomToken.mockResolvedValue("custom-token-123");

      // Mock Axios for token exchange
      axios.post.mockResolvedValue({
        data: {
          idToken: "firebase-id-token-123",
          refreshToken: "firebase-refresh-token-123",
        },
      });

      // Call the service
      const result = await AuthService.signInWithGoogle(idToken);

      // Assertions
      expect(getAuth().verifyIdToken).toHaveBeenCalledWith(idToken);
      expect(getAuth().createCustomToken).toHaveBeenCalledWith("user123");
      expect(axios.post).toHaveBeenCalled();

      expect(result).toEqual({
        success: true,
        uid: "user123",
        idToken: "firebase-id-token-123",
        refreshToken: "firebase-refresh-token-123",
      });
    });

    it("should create a new user when signing in with Google for first time", async () => {
      // Mock data
      const idToken = "google-id-token-123";
      const decodedToken = {
        uid: "new-user-123",
        email: "new.user@example.com",
        name: "New User",
      };

      // Mock user document to not exist
      mockUserRef.get.mockResolvedValueOnce({ exists: false });

      // Mock Firebase Auth
      getAuth().verifyIdToken.mockResolvedValue(decodedToken);
      getAuth().createCustomToken.mockResolvedValue("custom-token-123");

      // Mock Axios for token exchange
      axios.post.mockResolvedValue({
        data: {
          idToken: "firebase-id-token-123",
          refreshToken: "firebase-refresh-token-123",
        },
      });

      // Call the service
      const result = await AuthService.signInWithGoogle(idToken);

      // Assertions
      expect(getAuth().verifyIdToken).toHaveBeenCalledWith(idToken);
      expect(mockUserRef.set).toHaveBeenCalled();
      expect(getAuth().createCustomToken).toHaveBeenCalledWith("new-user-123");
      expect(axios.post).toHaveBeenCalled();

      expect(result).toEqual({
        success: true,
        uid: "new-user-123",
        idToken: "firebase-id-token-123",
        refreshToken: "firebase-refresh-token-123",
      });
    });

    it("should handle Google sign-in errors", async () => {
      // Mock data
      const idToken = "invalid-google-id-token";

      // Mock Firebase Auth to throw error
      const error = new Error("Invalid token");
      getAuth().verifyIdToken.mockRejectedValue(error);

      // Call the service
      const result = await AuthService.signInWithGoogle(idToken);

      // Assertions
      expect(getAuth().verifyIdToken).toHaveBeenCalledWith(idToken);
      expect(result).toEqual({
        success: false,
        error: "Invalid token",
      });
    });
  });

  describe("deleteAccount", () => {
    it("should delete a user account successfully", async () => {
      // Mock data
      const uid = "user123";

      // Mock Firebase Auth
      getAuth().deleteUser.mockResolvedValue({});

      // Call the service
      const result = await AuthService.deleteAccount(uid);

      // Assertions
      expect(getAuth().deleteUser).toHaveBeenCalledWith(uid);
      expect(mockUserRef.delete).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: "User account deleted successfully.",
      });
    });

    it("should handle errors during account deletion", async () => {
      // Mock data
      const uid = "invalid-user-123";

      // Mock Firebase Auth to throw error
      const error = new Error("User not found");
      getAuth().deleteUser.mockRejectedValue(error);

      // Call the service
      const result = await AuthService.deleteAccount(uid);

      // Assertions
      expect(getAuth().deleteUser).toHaveBeenCalledWith(uid);
      expect(result).toEqual({
        success: false,
        error: "User not found",
      });
    });
  });
});
