const {Wall} = require("../models/wall.model");

const {db} = require("../config/firebase.config");

class WallService {
    /**
     * Retrieves a wall by its ID.
     * @param {string} wallId - The ID of the wall.
     * @returns {Promise<Wall|null>} The wall if found, otherwise null.
     */
    static async getWall(wallId) {
        const wallRef = db.collection("walls").doc(wallId);
        const wallDoc = await wallRef.get();
        if (!wallDoc.exists) {
            return null;
        }
        return Wall.fromFirestore(wallDoc);
    }

    /**
     * Retrieves all walls.
     * @returns {Promise<Wall[]>} A list of all walls.
     */
    static async getAllWalls() {
        const wallsRef = db.collection("walls");
        const snapshot = await wallsRef.get();
        const walls = [];
        snapshot.forEach(doc => {
            walls.push(Wall.fromFirestore(doc));
        });
        return walls;
    }

    /**
     * Creates a new wall.
     * @param {Object} wallData - The data for the new wall.
     * @param {number} wallData.length - The length of the wall.
     * @param {number} wallData.height - The height of the wall.
     * @returns {Promise<number>} The ID of the newly created wall.
     * @throws Will throw an error if the counter document does not exist.
     */
    static async createWall(wallData) {
        const {x1,y1,x2,y2} = wallData;
        const wallRef = db.collection("walls");
        const counterRef = db.collection('counters').doc('wallCounter');

        const newWall = await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            if (!counterDoc.exists) {
                throw new Error("Counter document does not exist!");
            }

            const newId = counterDoc.data().count + 1;
            const wall = new Wall(newId, x1,y1,x2,y2);
            transaction.update(counterRef, {count: newId});
            transaction.set(wallRef.doc(newId.toString()), wall.toFirestore());

            return wall;
        });

        return newWall.id;
    }

    /**
     * Updates a wall by its ID.
     * @param {string} wallId - The ID of the wall.
     * @param {Object} wallData - The data to update the wall with.
     * @returns {Promise<Wall>} A promise that resolves when the wall is updated.
     */
    static async updateWall(wallId, wallData) {
        const wallRef = db.collection("walls").doc(wallId);
        await wallRef.update(wallData);
        const updatedWallDoc = await wallRef.get();
        return Wall.fromFirestore(updatedWallDoc);
    }

    /**
     * Deletes a wall by its ID.
     * @param {string} wallId - The ID of the wall.
     * @returns {Promise<void>} A promise that resolves when the wall is deleted.
     */
    static async deleteWall(wallId) {
        const wallRef = db.collection("walls").doc(wallId);
        await wallRef.delete();
    }
}

module.exports = WallService;