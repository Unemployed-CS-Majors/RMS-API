// __tests__/services/email.service.test.js
const EmailService = require("../../app/services/email.service");
const { User } = require("../../app/models/user.model");
const { Reservation } = require("../../app/models/reservation.model");
const { Order } = require("../../app/models/order.model");
const mailjet = require("node-mailjet");

jest.mock("node-mailjet");
jest.mock("../../app/logger/FirebaseLogger");

describe("Email Service", () => {
  let mockUser;
  let mockReservation;
  let mockOrder;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1234567890",
    });

    mockReservation = new Reservation({
      id: "res123",
      userId: "user123",
      tableId: "table1",
      startTime: new Date(),
      endTime: new Date(),
      status: "confirmed",
    });

    mockOrder = new Order({
      id: "order123",
      userId: "user123",
      items: [],
      total: 100,
      deliveryMethod: "HOME_DELIVERY",
      deliveryAddress: {
        country: "Ireland",
        eircode: "D01",
        county: "Dublin",
        city: "Dublin",
        street: "Main St",
      },
      estimatedDeliveryTime: new Date(),
      createdAt: new Date(),
    });

    mailjet.apiConnect.mockReturnValue({
      post: jest.fn().mockReturnValue({
        request: jest.fn().mockResolvedValue({ body: { success: true } }),
      }),
    });
  });

  describe("sendReservationEmail", () => {
    it("throws error for invalid reservation status", async () => {
      await expect(
        EmailService.sendReservationEmail(mockReservation, mockUser, "invalid"),
      ).rejects.toThrow("Invalid reservation status: invalid");
    });
  });

  describe("sendVerificationEmail", () => {
    it("sends verification email successfully", async () => {
      const result = await EmailService.sendVerificationEmail(
        mockUser,
        "https://example.com/verify",
      );
      expect(result.body.success).toBe(true);
    });
  });

  describe("sendPasswordResetEmail", () => {
    it("sends password reset email successfully", async () => {
      const result = await EmailService.sendPasswordResetEmail(
        mockUser,
        "https://example.com/reset",
      );
      expect(result.body.success).toBe(true);
    });
  });

  describe("sendOrderPlacedEmail", () => {
    it("sends order placed email successfully", async () => {
      const result = await EmailService.sendOrderPlacedEmail(mockUser, mockOrder);
      expect(result.body.success).toBe(true);
    });
  });

  describe("sendOrderBeingPreparedEmail", () => {
    it("sends order being prepared email successfully", async () => {
      const result = await EmailService.sendOrderBeingPreparedEmail(mockUser, mockOrder);
      expect(result.body.success).toBe(true);
    });
  });
});
