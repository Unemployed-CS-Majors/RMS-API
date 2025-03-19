// __tests__/controllers/auth.controller.test.js
const AuthController = require("../../app/controllers/auth.controller");
const AuthService = require("../../app/services/auth.service");
const UserService = require("../../app/services/user.service");
const EmailService = require("../../app/services/email.service");
const { mockRequest, mockResponse } = require("../helpers");

// Mock the services
jest.mock("../../app/services/auth.service");
jest.mock("../../app/services/user.service");
jest.mock("../../app/services/email.service");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if validation fails", async () => {
      // Setup invalid request with missing fields
      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          // Missing email, password, phoneNumber
        },
      });
      const res = mockResponse();

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
        }),
      );
      expect(AuthService.createUser).not.toHaveBeenCalled();
    });

    it("should return 201 on successful registration", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          phoneNumber: "+1234567890",
        },
      });
      const res = mockResponse();

      // Mock successful user creation
      AuthService.createUser.mockResolvedValue({
        success: true,
        uid: "user123",
      });

      await AuthController.register(req, res);

      expect(AuthService.createUser).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phoneNumber: "+1234567890",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: { uid: "user123" },
        }),
      );
    });

    it("should return 500 if user creation fails", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          phoneNumber: "+1234567890",
        },
      });
      const res = mockResponse();

      // Mock failed user creation
      AuthService.createUser.mockResolvedValue({
        success: false,
        error: "Failed to create user",
      });

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to create user",
        }),
      );
    });
  });

  describe("login", () => {
    it("should return 400 if validation fails", async () => {
      // Setup invalid request with missing password
      const req = mockRequest({
        body: {
          email: "john.doe@example.com",
          // Missing password
        },
      });
      const res = mockResponse();

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
        }),
      );
      expect(AuthService.loginUser).not.toHaveBeenCalled();
    });

    it("should return 200 on successful login", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          email: "john.doe@example.com",
          password: "password123",
        },
      });
      const res = mockResponse();

      // Mock successful login
      AuthService.loginUser.mockResolvedValue({
        success: true,
        uid: "user123",
        idToken: "token123",
        refreshToken: "refresh123",
      });

      await AuthController.login(req, res);

      expect(AuthService.loginUser).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: {
            uid: "user123",
            idToken: "token123",
            refreshToken: "refresh123",
          },
        }),
      );
    });

    it("should return 500 if login fails", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          email: "john.doe@example.com",
          password: "password123",
        },
      });
      const res = mockResponse();

      // Mock failed login
      AuthService.loginUser.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Invalid credentials",
        }),
      );
    });
  });

  describe("refreshToken", () => {
    it("should return 400 if validation fails", async () => {
      // Setup invalid request with missing refresh token
      const req = mockRequest({
        body: {},
      });
      const res = mockResponse();

      await AuthController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
        }),
      );
      expect(AuthService.refreshUserToken).not.toHaveBeenCalled();
    });

    it("should return 200 on successful token refresh", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          refreshToken: "refresh123",
        },
      });
      const res = mockResponse();

      // Mock successful token refresh
      AuthService.refreshUserToken.mockResolvedValue({
        success: true,
        idToken: "newToken123",
        refreshToken: "newRefresh123",
      });

      await AuthController.refreshToken(req, res);

      expect(AuthService.refreshUserToken).toHaveBeenCalledWith("refresh123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: {
            idToken: "newToken123",
            refreshToken: "newRefresh123",
          },
        }),
      );
    });

    it("should return 500 if token refresh fails", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          refreshToken: "refresh123",
        },
      });
      const res = mockResponse();

      // Mock failed token refresh
      AuthService.refreshUserToken.mockResolvedValue({
        success: false,
        error: "Invalid refresh token",
      });

      await AuthController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Invalid refresh token",
        }),
      );
    });
  });

  describe("forgotPassword", () => {
    it("should return 400 if email is missing", async () => {
      // Setup invalid request with missing email
      const req = mockRequest({
        body: {},
      });
      const res = mockResponse();

      await AuthController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
        }),
      );
      expect(AuthService.forgotPassword).not.toHaveBeenCalled();
    });

    it("should return 200 and send reset email on success", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          email: "john.doe@example.com",
        },
      });
      const res = mockResponse();

      // Mock successful password reset
      const resetResult = {
        success: true,
        message: "Password reset email sent.",
        url: "https://reset-password.example.com/token123",
      };

      const mockUser = {
        uid: "user123",
        email: "john.doe@example.com",
        firstName: "John",
      };

      AuthService.forgotPassword.mockResolvedValue(resetResult);
      UserService.getUserByEmail.mockResolvedValue(mockUser);
      EmailService.sendPasswordResetEmail.mockResolvedValue({});

      await AuthController.forgotPassword(req, res);

      expect(AuthService.forgotPassword).toHaveBeenCalledWith("john.doe@example.com");
      expect(UserService.getUserByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith(mockUser, resetResult);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Password reset email sent",
        }),
      );
    });

    it("should return 500 if password reset fails", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          email: "john.doe@example.com",
        },
      });
      const res = mockResponse();

      // Mock failed password reset
      AuthService.forgotPassword.mockResolvedValue({
        success: false,
        error: "User not found",
      });

      await AuthController.forgotPassword(req, res);

      expect(AuthService.forgotPassword).toHaveBeenCalledWith("john.doe@example.com");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "User not found",
        }),
      );
    });
  });

  describe("googleAuth", () => {
    it("should return 400 if ID token is missing", async () => {
      // Setup invalid request with missing ID token
      const req = mockRequest({
        body: {},
      });
      const res = mockResponse();

      await AuthController.googleAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "ID token is required",
        }),
      );
      expect(AuthService.signInWithGoogle).not.toHaveBeenCalled();
    });

    it("should return 200 on successful Google auth", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          idToken: "google-id-token-123",
        },
      });
      const res = mockResponse();

      // Mock successful Google sign-in
      AuthService.signInWithGoogle.mockResolvedValue({
        success: true,
        uid: "user123",
        idToken: "firebase-id-token-123",
        refreshToken: "refresh-token-123",
      });

      await AuthController.googleAuth(req, res);

      expect(AuthService.signInWithGoogle).toHaveBeenCalledWith("google-id-token-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Google sign-in successful",
          data: {
            uid: "user123",
            idToken: "firebase-id-token-123",
            refreshToken: "refresh-token-123",
          },
        }),
      );
    });

    it("should return 500 if Google auth fails", async () => {
      // Setup valid request
      const req = mockRequest({
        body: {
          idToken: "google-id-token-123",
        },
      });
      const res = mockResponse();

      // Mock failed Google sign-in
      AuthService.signInWithGoogle.mockResolvedValue({
        success: false,
        error: "Invalid token",
      });

      await AuthController.googleAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Invalid token",
        }),
      );
    });
  });

  describe("deleteAccount", () => {
    it("should return 200 on successful account deletion", async () => {
      // Setup request
      const req = mockRequest();
      const res = mockResponse();

      // Mock successful verification and deletion
      UserService.verifyUser.mockResolvedValue("user123");
      AuthService.deleteAccount.mockResolvedValue({
        success: true,
        message: "User account deleted successfully.",
      });

      await AuthController.deleteAccount(req, res);

      expect(UserService.verifyUser).toHaveBeenCalledWith(req);
      expect(AuthService.deleteAccount).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Account deleted successfully",
        }),
      );
    });

    it("should return 500 if account deletion fails", async () => {
      // Setup request
      const req = mockRequest();
      const res = mockResponse();

      // Mock verification failure
      const error = new Error("Unauthorized");
      UserService.verifyUser.mockRejectedValue(error);

      await AuthController.deleteAccount(req, res);

      expect(UserService.verifyUser).toHaveBeenCalledWith(req);
      expect(AuthService.deleteAccount).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Unauthorized",
        }),
      );
    });
  });
});
