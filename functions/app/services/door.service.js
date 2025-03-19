const { Door } = require("../models/door.model");

const { db } = require("../config/firebase.config");

class DoorService {
  /**
   * Retrieves a door by its ID.
   * @param {string} doorId - The ID of the door.
   * @returns {Promise<Door|null>} The door if found, otherwise null.
   */
  static async getDoor(doorId) {
    const doorRef = db.collection("doors").doc(doorId);
    const doorDoc = await doorRef.get();
    if (!doorDoc.exists) {
      return null;
    }
    return Door.fromFirestore(doorDoc);
  }

  /**
   * Retrieves all doors.
   * @returns {Promise<Door[]>} A list of all doors.
   */
  static async getAllDoors() {
    const doorsRef = db.collection("doors");
    const snapshot = await doorsRef.get();
    const doors = [];
    snapshot.forEach((doc) => {
      doors.push(Door.fromFirestore(doc));
    });
    return doors;
  }

  /**
   * Creates a new door.
   * @param {Object} doorData - The data for the new door.
   * @param {string} doorData.location - The location of the door.
   * @param {boolean} doorData.isAutomatic - Whether the door is automatic.
   * @returns {Promise<number>} The ID of the newly created door.
   * @throws Will throw an error if the counter document does not exist.
   */
  static async createDoor(doorData) {
    const doorRef = db.collection("doors");
    const counterRef = db.collection("counters").doc("doorCounter");

    const newDoor = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        throw new Error("Counter document does not exist!");
      }

      const newId = counterDoc.data().count + 1;
      const door = new Door(
        newId,
        doorData.x,
        doorData.y,
        doorData.width,
        doorData.height,
        doorData.rotation,
      );

      transaction.update(counterRef, { count: newId });
      transaction.set(doorRef.doc(newId.toString()), door.toFirestore());

      return door;
    });

    return newDoor.id;
  }

  /**
   * Updates a door.
   * @param {string} doorId - The ID of the door.
   * @param {Object} doorData - The updated data for the door.
   * @param {string} doorData.location - The location of the door.
   * @param {boolean} doorData.isAutomatic - Whether the door is automatic.
   * @returns {Promise<void>} A promise that resolves when the door is updated.
   */
  static async updateDoor(doorId, doorData) {
    const doorRef = db.collection("doors").doc(doorId);
    await doorRef.update(doorData);
    const updatedDoorDoc = await doorRef.get();
    return Door.fromFirestore(updatedDoorDoc);
  }

  /**
   * Deletes a door by its ID.
   * @param {string} doorId - The ID of the door.
   * @returns {Promise<void>} A promise that resolves when the door is deleted.
   */
  static async deleteDoor(doorId) {
    const doorRef = db.collection("doors").doc(doorId);
    await doorRef.delete();
  }
}

module.exports = DoorService;
