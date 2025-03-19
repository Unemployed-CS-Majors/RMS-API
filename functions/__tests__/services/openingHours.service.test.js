// __tests__/services/openingHours.service.test.js
const OpeningHoursService = require("../../app/services/openingHours.service");
const { db } = require("../../app/config/firebase.config");
const { OpeningHours } = require("../../app/models/openingHours.model");
const { mockFirestoreCollection, mockDocumentSnapshot } = require("../helpers");

jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
    runTransaction: jest.fn(),
  },
}));

describe("OpeningHours Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOpeningHoursById", () => {
    it("retrieves opening hours by ID", async () => {
      const mockOpeningHours = { id: "1", day: "Monday", startTime: "09:00", endTime: "17:00" };
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockOpeningHours)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await OpeningHoursService.getOpeningHoursById("1");

      expect(result).toEqual(
        OpeningHours.fromFirestore(mockDocumentSnapshot("1", mockOpeningHours))
      );
    });

    it("returns null if the opening hours do not exist", async () => {
      const mockDocRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await OpeningHoursService.getOpeningHoursById("1");

      expect(result).toBeNull();
    });
  });

  describe("getAllOpeningHours", () => {
    it("retrieves all opening hours", async () => {
      const mockOpeningHours = [
        { id: "1", day: "Monday", startTime: "09:00", endTime: "17:00" },
        { id: "2", day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      ];
      const mockSnapshot = mockFirestoreCollection(mockOpeningHours);
      db.collection.mockReturnValue({ get: mockSnapshot.mockGet });

      const result = await OpeningHoursService.getAllOpeningHours();

      expect(result.length).toEqual(2);
    });
  });

  describe("createOpeningHours", () => {
    it("creates new opening hours and increments the counter", async () => {
      const mockCounterDoc = { exists: true, data: () => ({ count: 1 }) };
      const mockCounterRef = {
        get: jest.fn().mockResolvedValue(mockCounterDoc),
        update: jest.fn(),
      };
      const mockOpeningHoursRef = { doc: jest.fn().mockReturnValue({ set: jest.fn() }) };
      db.collection.mockImplementation((collection) => {
        if (collection === "counters") return { doc: jest.fn().mockReturnValue(mockCounterRef) };
        if (collection === "opening_hours") return mockOpeningHoursRef;
      });

      db.runTransaction.mockImplementation(async (transactionFn) => {
        const transaction = {
          get: jest.fn().mockResolvedValue(mockCounterDoc),
          update: jest.fn(),
          set: jest.fn(),
        };
        return transactionFn(transaction);
      });

      const openingHoursData = { day: "Monday", startTime: "09:00", endTime: "17:00" };
      const result = await OpeningHoursService.createOpeningHours(openingHoursData);

      expect(result).toEqual(new OpeningHours(2, "Monday", "09:00", "17:00"));
    });

    it("throws an error if the counter document does not exist", async () => {
      const mockCounterDoc = { exists: false };
      const mockCounterRef = { get: jest.fn().mockResolvedValue(mockCounterDoc) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockCounterRef) });

      db.runTransaction.mockImplementation(async (transactionFn) => {
        const transaction = {
          get: jest.fn().mockResolvedValue(mockCounterDoc),
          update: jest.fn(),
          set: jest.fn(),
        };
        return transactionFn(transaction);
      });

      await expect(
        OpeningHoursService.createOpeningHours({
          day: "Monday",
          startTime: "09:00",
          endTime: "17:00",
        })
      ).rejects.toThrow("Counter document does not exist!");
    });
  });

  describe("updateOpeningHours", () => {
    it("updates existing opening hours", async () => {
      const mockOpeningHours = { day: "Monday", startTime: "09:00", endTime: "17:00" };
      const mockDocRef = {
        update: jest.fn(),
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("1", mockOpeningHours)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      const result = await OpeningHoursService.updateOpeningHours(
        "1",
        new OpeningHours("1", "Monday", "09:00", "17:00")
      );

      expect(result).toEqual(mockOpeningHours);
    });
  });

  describe("deleteOpeningHours", () => {
    it("deletes opening hours by ID", async () => {
      const mockDocRef = { delete: jest.fn() };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDocRef) });

      await OpeningHoursService.deleteOpeningHours("1");

      expect(mockDocRef.delete).toHaveBeenCalled();
    });
  });
});
