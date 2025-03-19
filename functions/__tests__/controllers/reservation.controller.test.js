// __tests__/controllers/reservation.controller.test.js
const ReservationController = require("../../app/controllers/reservation.controller");
const ReservationService = require("../../app/services/reservation.service");
const UserService = require("../../app/services/user.service");
const { mockRequest, mockResponse } = require("../helpers");
const { logger } = require("../../app/logger/FirebaseLogger");

jest.mock("../../app/services/reservation.service");
jest.mock("../../app/services/user.service");
jest.mock("../../app/services/table.service");
jest.mock("../../app/services/email.service");
jest.mock("../../app/services/openingHours.service");
jest.mock("../../app/logger/FirebaseLogger");

describe("Reservation Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("cancelReservation", () => {
    it("cancels a reservation successfully", async () => {
      const req = mockRequest({ params: { reservationId: "reservation1" } });
      const res = mockResponse();
      const mockReservation = { id: "reservation1", userId: "user1", status: "CONFIRMED" };
      const mockUser = { id: "user1" };

      ReservationService.getReservation.mockResolvedValue(mockReservation);
      UserService.getUser.mockResolvedValue(mockUser);
      ReservationService.updateReservationStatus.mockResolvedValue(null);

      await ReservationController.cancelReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Reservation cancelled successfully",
        }),
      );
    });

    it("returns 400 if reservation ID is missing", async () => {
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      await ReservationController.cancelReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "error", message: "Reservation ID is required" }),
      );
    });

    it("returns 404 if reservation not found", async () => {
      const req = mockRequest({ params: { reservationId: "reservation1" } });
      const res = mockResponse();

      ReservationService.getReservation.mockResolvedValue(null);

      await ReservationController.cancelReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "error", message: "Reservation not found" }),
      );
    });

    it("returns 404 if user not found", async () => {
      const req = mockRequest({ params: { reservationId: "reservation1" } });
      const res = mockResponse();
      const mockReservation = { id: "reservation1", userId: "user1" };

      ReservationService.getReservation.mockResolvedValue(mockReservation);
      UserService.getUser.mockResolvedValue(null);

      await ReservationController.cancelReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "error", message: "User not found" }),
      );
    });

    it("handles errors and returns 500 status", async () => {
      const req = mockRequest({ params: { reservationId: "reservation1" } });
      const res = mockResponse();
      const error = new Error("Database error");

      ReservationService.getReservation.mockRejectedValue(error);

      await ReservationController.cancelReservation(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error cancelling reservation", error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "error", message: "Database error" }),
      );
    });
  });
});
