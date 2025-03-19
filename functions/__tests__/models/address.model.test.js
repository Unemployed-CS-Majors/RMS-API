// __tests__/models/address.model.test.js
const { Address } = require("../../app/models/address.model");

describe("Address Model", () => {
  const sampleAddressData = {
    street: "123 Main Street",
    city: "Dublin",
    county: "Dublin",
    eircode: "D01 F5P2",
    country: "Ireland",
  };

  describe("Address constructor", () => {
    it("should create a new Address instance with default null values", () => {
      const address = new Address();

      expect(address.street).toBeNull();
      expect(address.city).toBeNull();
      expect(address.county).toBeNull();
      expect(address.eircode).toBeNull();
      expect(address.country).toBeNull();
    });
  });

  describe("toFirestore", () => {
    it("should convert Address instance to Firestore format", () => {
      const address = new Address();

      // Set properties manually
      address.street = sampleAddressData.street;
      address.city = sampleAddressData.city;
      address.county = sampleAddressData.county;
      address.eircode = sampleAddressData.eircode;
      address.country = sampleAddressData.country;

      const firestoreData = address.toFirestore();

      expect(firestoreData).toEqual({
        street: sampleAddressData.street,
        city: sampleAddressData.city,
        county: sampleAddressData.county,
        eircode: sampleAddressData.eircode,
        country: sampleAddressData.country,
      });
    });

    it("should include null values in Firestore data", () => {
      const address = new Address();

      // Only set some properties
      address.street = sampleAddressData.street;
      address.city = sampleAddressData.city;
      // Leave others as null

      const firestoreData = address.toFirestore();

      expect(firestoreData).toEqual({
        street: sampleAddressData.street,
        city: sampleAddressData.city,
        county: null,
        eircode: null,
        country: null,
      });
    });
  });

  describe("fromFirestore", () => {
    it("should create an Address instance from Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          street: sampleAddressData.street,
          city: sampleAddressData.city,
          county: sampleAddressData.county,
          eircode: sampleAddressData.eircode,
          country: sampleAddressData.country,
        }),
      };

      const address = Address.fromFirestore(snapshot);

      expect(address).toBeInstanceOf(Address);
      expect(address.street).toBe(sampleAddressData.street);
      expect(address.city).toBe(sampleAddressData.city);
      expect(address.county).toBe(sampleAddressData.county);
      expect(address.eircode).toBe(sampleAddressData.eircode);
      expect(address.country).toBe(sampleAddressData.country);
    });

    it("should handle missing fields in Firestore snapshot", () => {
      const snapshot = {
        data: () => ({
          street: sampleAddressData.street,
          city: sampleAddressData.city,
          // Missing county, eircode, country
        }),
      };

      const address = Address.fromFirestore(snapshot);

      expect(address).toBeInstanceOf(Address);
      expect(address.street).toBe(sampleAddressData.street);
      expect(address.city).toBe(sampleAddressData.city);
      expect(address.county).toBeUndefined();
      expect(address.eircode).toBeUndefined();
      expect(address.country).toBeUndefined();
    });
  });

  describe("Address usage scenarios", () => {
    it("should support building an address incrementally", () => {
      const address = new Address();

      // Initially all properties are null
      expect(address.street).toBeNull();
      expect(address.city).toBeNull();

      // Set properties incrementally
      address.street = sampleAddressData.street;
      expect(address.street).toBe(sampleAddressData.street);
      expect(address.city).toBeNull(); // Other properties remain null

      address.city = sampleAddressData.city;
      expect(address.city).toBe(sampleAddressData.city);

      address.county = sampleAddressData.county;
      expect(address.county).toBe(sampleAddressData.county);

      // Firestore data reflects current state
      let firestoreData = address.toFirestore();
      expect(firestoreData.street).toBe(sampleAddressData.street);
      expect(firestoreData.city).toBe(sampleAddressData.city);
      expect(firestoreData.county).toBe(sampleAddressData.county);
      expect(firestoreData.eircode).toBeNull();
      expect(firestoreData.country).toBeNull();

      // Complete the address
      address.eircode = sampleAddressData.eircode;
      address.country = sampleAddressData.country;

      firestoreData = address.toFirestore();
      expect(firestoreData).toEqual(sampleAddressData);
    });

    it("should handle empty string values", () => {
      const address = new Address();

      address.street = "";
      address.city = "";
      address.county = "";
      address.eircode = "";
      address.country = "";

      const firestoreData = address.toFirestore();

      // Empty strings should be preserved (not converted to null)
      expect(firestoreData.street).toBe("");
      expect(firestoreData.city).toBe("");
      expect(firestoreData.county).toBe("");
      expect(firestoreData.eircode).toBe("");
      expect(firestoreData.country).toBe("");
    });
  });
});
