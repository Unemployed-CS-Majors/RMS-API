// __tests__/models/door.model.test.js
const { Door } = require("../../app/models/door.model");

describe("Door Model", () => {
  const sampleDoorData = {
    id: "door123",
    x: 150,
    y: 100,
    width: 40,
    height: 10,
    rotation: 90,
  };

  describe("Door constructor", () => {
    it("should create a new Door instance with provided values", () => {
      const door = new Door(
        sampleDoorData.id,
        sampleDoorData.x,
        sampleDoorData.y,
        sampleDoorData.width,
        sampleDoorData.height,
        sampleDoorData.rotation
      );

      expect(door.id).toBe(sampleDoorData.id);
      expect(door.x).toBe(sampleDoorData.x);
      expect(door.y).toBe(sampleDoorData.y);
      expect(door.width).toBe(sampleDoorData.width);
      expect(door.height).toBe(sampleDoorData.height);
      expect(door.rotation).toBe(sampleDoorData.rotation);
    });
  });

  describe("toFirestore", () => {
    it("should convert Door instance to Firestore format", () => {
      const door = new Door(
        sampleDoorData.id,
        sampleDoorData.x,
        sampleDoorData.y,
        sampleDoorData.width,
        sampleDoorData.height,
        sampleDoorData.rotation
      );

      const firestoreData = door.toFirestore();

      expect(firestoreData).toEqual({
        x: sampleDoorData.x,
        y: sampleDoorData.y,
        width: sampleDoorData.width,
        height: sampleDoorData.height,
        rotation: sampleDoorData.rotation,
      });

      // id should not be included in Firestore data
      expect(firestoreData.id).toBeUndefined();
    });
  });

  describe("fromFirestore", () => {
    it("should create a Door instance from Firestore snapshot", () => {
      const snapshot = {
        id: sampleDoorData.id,
        data: () => ({
          x: sampleDoorData.x,
          y: sampleDoorData.y,
          width: sampleDoorData.width,
          height: sampleDoorData.height,
          rotation: sampleDoorData.rotation,
        }),
      };

      const door = Door.fromFirestore(snapshot);

      expect(door).toBeInstanceOf(Door);
      expect(door.id).toBe(sampleDoorData.id);
      expect(door.x).toBe(sampleDoorData.x);
      expect(door.y).toBe(sampleDoorData.y);
      expect(door.width).toBe(sampleDoorData.width);
      expect(door.height).toBe(sampleDoorData.height);
      expect(door.rotation).toBe(sampleDoorData.rotation);
    });
  });

  describe("Door properties handling", () => {
    it("should handle zero values", () => {
      const door = new Door("door0", 0, 0, 0, 0, 0);

      expect(door.x).toBe(0);
      expect(door.y).toBe(0);
      expect(door.width).toBe(0);
      expect(door.height).toBe(0);
      expect(door.rotation).toBe(0);

      const firestoreData = door.toFirestore();
      expect(firestoreData.x).toBe(0);
      expect(firestoreData.y).toBe(0);
      expect(firestoreData.width).toBe(0);
      expect(firestoreData.height).toBe(0);
      expect(firestoreData.rotation).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const door = new Door("door-neg", -10, -20, 30, 10, 270);

      expect(door.x).toBe(-10);
      expect(door.y).toBe(-20);
      expect(door.width).toBe(30);
      expect(door.height).toBe(10);
      expect(door.rotation).toBe(270);

      const firestoreData = door.toFirestore();
      expect(firestoreData.x).toBe(-10);
      expect(firestoreData.y).toBe(-20);
      expect(firestoreData.width).toBe(30);
      expect(firestoreData.height).toBe(10);
      expect(firestoreData.rotation).toBe(270);
    });

    it("should handle various rotation values", () => {
      // Test with common rotation angles
      const door0 = new Door("door-0", 100, 100, 30, 10, 0);
      expect(door0.rotation).toBe(0);

      const door90 = new Door("door-90", 100, 100, 30, 10, 90);
      expect(door90.rotation).toBe(90);

      const door180 = new Door("door-180", 100, 100, 30, 10, 180);
      expect(door180.rotation).toBe(180);

      const door270 = new Door("door-270", 100, 100, 30, 10, 270);
      expect(door270.rotation).toBe(270);

      // Test with arbitrary rotation value
      const door45 = new Door("door-45", 100, 100, 30, 10, 45);
      expect(door45.rotation).toBe(45);
    });
  });
});
