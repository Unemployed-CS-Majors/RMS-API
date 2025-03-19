// __tests__/services/restaurantConfig.service.test.js
const RestaurantConfigService = require("../../app/services/restaurantConfig.service");
const { db } = require("../../app/config/firebase.config");
const { PhoneNumber } = require("../../app/models/phoneNumber.model");
const { Email } = require("../../app/models/email.model");
const { Address } = require("../../app/models/address.model");
const { Map } = require("../../app/models/map.model");
const { Feature } = require("../../app/models/feature.model");
const { mockDocumentSnapshot } = require("../helpers");

jest.mock("../../app/config/firebase.config", () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe("RestaurantConfigService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addPhoneNumber", () => {
    it("adds a phone number successfully", async () => {
      const phoneNumber = "123-456-7890";
      const mockPhoneNumberRef = { set: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockPhoneNumberRef) });

      await RestaurantConfigService.addPhoneNumber(phoneNumber);

      expect(mockPhoneNumberRef.set).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("updatePhoneNumber", () => {
    it("updates a phone number successfully", async () => {
      const phoneNumber = "123-456-7890";
      const mockPhoneNumberRef = { update: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockPhoneNumberRef) });

      await RestaurantConfigService.updatePhoneNumber(phoneNumber);

      expect(mockPhoneNumberRef.update).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("deletePhoneNumber", () => {
    it("deletes a phone number successfully", async () => {
      const mockPhoneNumberRef = { delete: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockPhoneNumberRef) });

      await RestaurantConfigService.deletePhoneNumber();

      expect(mockPhoneNumberRef.delete).toHaveBeenCalled();
    });
  });

  describe("getPhoneNumber", () => {
    it("retrieves a phone number successfully", async () => {
      const phoneNumberData = { number: "123-456-7890" };
      const mockPhoneNumberRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("phoneNumber", phoneNumberData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockPhoneNumberRef) });

      const result = await RestaurantConfigService.getPhoneNumber();

      expect(result).toEqual(
        PhoneNumber.fromFirestore(mockDocumentSnapshot("phoneNumber", phoneNumberData))
      );
    });

    it("returns null if phone number does not exist", async () => {
      const mockPhoneNumberRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockPhoneNumberRef) });

      const result = await RestaurantConfigService.getPhoneNumber();

      expect(result).toBeNull();
    });
  });

  describe("addEmail", () => {
    it("adds an email successfully", async () => {
      const email = "test@example.com";
      const mockEmailRef = { set: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockEmailRef) });

      await RestaurantConfigService.addEmail(email);

      expect(mockEmailRef.set).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("updateEmail", () => {
    it("updates an email successfully", async () => {
      const email = "test@example.com";
      const mockEmailRef = { update: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockEmailRef) });

      await RestaurantConfigService.updateEmail(email);

      expect(mockEmailRef.update).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("deleteEmail", () => {
    it("deletes an email successfully", async () => {
      const mockEmailRef = { delete: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockEmailRef) });

      await RestaurantConfigService.deleteEmail();

      expect(mockEmailRef.delete).toHaveBeenCalled();
    });
  });

  describe("getEmail", () => {
    it("retrieves an email successfully", async () => {
      const emailData = { address: "test@example.com" };
      const mockEmailRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("email", emailData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockEmailRef) });

      const result = await RestaurantConfigService.getEmail();

      expect(result).toEqual(Email.fromFirestore(mockDocumentSnapshot("email", emailData)));
    });

    it("returns null if email does not exist", async () => {
      const mockEmailRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockEmailRef) });

      const result = await RestaurantConfigService.getEmail();

      expect(result).toBeNull();
    });
  });

  describe("addAddress", () => {
    it("adds an address successfully", async () => {
      const addressData = {
        street: "123 Main St",
        city: "Anytown",
        county: "Anycounty",
        eircode: "12345",
        country: "Anyland",
      };
      const mockAddressRef = { set: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockAddressRef) });

      await RestaurantConfigService.addAddress(
        addressData.street,
        addressData.city,
        addressData.county,
        addressData.eircode,
        addressData.country
      );

      expect(mockAddressRef.set).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("updateAddress", () => {
    it("updates an address successfully", async () => {
      const addressData = {
        street: "123 Main St",
        city: "Anytown",
        county: "Anycounty",
        eircode: "12345",
        country: "Anyland",
      };
      const mockAddressRef = { update: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockAddressRef) });

      await RestaurantConfigService.updateAddress(
        addressData.street,
        addressData.city,
        addressData.county,
        addressData.eircode,
        addressData.country
      );

      expect(mockAddressRef.update).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("deleteAddress", () => {
    it("deletes an address successfully", async () => {
      const mockAddressRef = { delete: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockAddressRef) });

      await RestaurantConfigService.deleteAddress();

      expect(mockAddressRef.delete).toHaveBeenCalled();
    });
  });

  describe("getAddress", () => {
    it("retrieves an address successfully", async () => {
      const addressData = {
        street: "123 Main St",
        city: "Anytown",
        county: "Anycounty",
        eircode: "12345",
        country: "Anyland",
      };
      const mockAddressRef = {
        get: jest.fn().mockResolvedValue(mockDocumentSnapshot("address", addressData)),
      };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockAddressRef) });

      const result = await RestaurantConfigService.getAddress();

      expect(result).toEqual(Address.fromFirestore(mockDocumentSnapshot("address", addressData)));
    });

    it("returns null if address does not exist", async () => {
      const mockAddressRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockAddressRef) });

      const result = await RestaurantConfigService.getAddress();

      expect(result).toBeNull();
    });
  });

  describe("addMap", () => {
    it("adds a map successfully", async () => {
      const mapUrl = "https://example.com/map";
      const mockMapRef = { set: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockMapRef) });

      await RestaurantConfigService.addMap(mapUrl);

      expect(mockMapRef.set).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("updateMap", () => {
    it("updates a map successfully", async () => {
      const mapUrl = "https://example.com/map";
      const mockMapRef = { update: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockMapRef) });

      await RestaurantConfigService.updateMap(mapUrl);

      expect(mockMapRef.update).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("deleteMap", () => {
    it("deletes a map successfully", async () => {
      const mockMapRef = { delete: jest.fn().mockResolvedValue({}) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockMapRef) });

      await RestaurantConfigService.deleteMap();

      expect(mockMapRef.delete).toHaveBeenCalled();
    });
  });

  describe("getMap", () => {
    it("retrieves a map successfully", async () => {
      const mapData = { mapUrl: "https://example.com/map" };
      const mockMapRef = { get: jest.fn().mockResolvedValue(mockDocumentSnapshot("map", mapData)) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockMapRef) });

      const result = await RestaurantConfigService.getMap();

      expect(result).toEqual(Map.fromFirestore(mockDocumentSnapshot("map", mapData)));
    });

    it("returns null if map does not exist", async () => {
      const mockMapRef = { get: jest.fn().mockResolvedValue({ exists: false }) };
      db.collection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockMapRef) });

      const result = await RestaurantConfigService.getMap();

      expect(result).toBeNull();
    });
  });

  describe("getRestaurantConfig", () => {
    it("retrieves the complete restaurant configuration successfully", async () => {
      const phoneNumberData = { number: "123-456-7890" };
      const emailData = { address: "test@example.com" };
      const addressData = {
        street: "123 Main St",
        city: "Anytown",
        county: "Anycounty",
        eircode: "12345",
        country: "Anyland",
      };
      const mapData = { mapUrl: "https://example.com/map" };
      const featuresData = [{ name: "feature1", enabled: true }];

      jest
        .spyOn(RestaurantConfigService, "getPhoneNumber")
        .mockResolvedValue(
          PhoneNumber.fromFirestore(mockDocumentSnapshot("phoneNumber", phoneNumberData))
        );
      jest
        .spyOn(RestaurantConfigService, "getEmail")
        .mockResolvedValue(Email.fromFirestore(mockDocumentSnapshot("email", emailData)));
      jest
        .spyOn(RestaurantConfigService, "getAddress")
        .mockResolvedValue(Address.fromFirestore(mockDocumentSnapshot("address", addressData)));
      jest
        .spyOn(RestaurantConfigService, "getMap")
        .mockResolvedValue(Map.fromFirestore(mockDocumentSnapshot("map", mapData)));
      jest
        .spyOn(RestaurantConfigService, "getAllFeatures")
        .mockResolvedValue(
          featuresData.map((f) => Feature.fromFirestore(mockDocumentSnapshot(f.name, f)))
        );

      const result = await RestaurantConfigService.getRestaurantConfig();

      expect(result).toEqual({
        phoneNumber: PhoneNumber.fromFirestore(
          mockDocumentSnapshot("phoneNumber", phoneNumberData)
        ),
        email: Email.fromFirestore(mockDocumentSnapshot("email", emailData)),
        address: Address.fromFirestore(mockDocumentSnapshot("address", addressData)),
        map: Map.fromFirestore(mockDocumentSnapshot("map", mapData)),
        features: featuresData.map((f) => Feature.fromFirestore(mockDocumentSnapshot(f.name, f))),
      });
    });
  });
});
