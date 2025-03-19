// __tests__/controllers/openingHours.controller.test.js
const OpeningHoursController = require("../../app/controllers/openingHours.controller");
const OpeningHoursService = require("../../app/services/openingHours.service");
const { mockRequest, mockResponse } = require("../helpers");

jest.mock("../../app/services/openingHours.service");
jest.mock("../../app/logger/FirebaseLogger");

describe("OpeningHours Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOpeningHoursById", () => {
    it("retrieves opening hours by ID successfully", async () => {
      const req = mockRequest({ params: { id: "hours1" } });
      const res = mockResponse();
      const mockOpeningHours = { id: "hours1", day: "Monday", open: "09:00", close: "17:00" };

      OpeningHoursService.getOpeningHoursById.mockResolvedValue(mockOpeningHours);

      await OpeningHoursController.getOpeningHoursById(req, res);

      expect(OpeningHoursService.getOpeningHoursById).toHaveBeenCalledWith("hours1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Opening hours fetched successfully",
          data: mockOpeningHours,
        }),
      );
    });
  });
});
