const {Window} = require("../models/window.model");

const {db} = require("../config/firebase.config");


class WindowService {
    /**
     * Retrieves a window by its ID.
     * @param {string} windowId - The ID of the window.
     * @returns {Promise<Window|null>} The window if found, otherwise null.
     */
    static async getWindow(windowId) {
        const windowRef = db.collection("windows").doc(windowId);
        const windowDoc = await windowRef.get();
        if (!windowDoc.exists) {
            return null;
        }
        return Window.fromFirestore(windowDoc);
    }

    /**
     * Retrieves all windows.
     * @returns {Promise<Window[]>} A list of all windows.
     */
    static async getAllWindows() {
        const windowsRef = db.collection("windows");
        const snapshot = await windowsRef.get();
        const windows = [];
        snapshot.forEach(doc => {
            windows.push(Window.fromFirestore(doc));
        });
        return windows;
    }

    /**
     * Creates a new window.
     * @param {Object} windowData - The data for the new window.
     * @param {number} windowData.width - The width of the window.
     * @param {number} windowData.height - The height of the window.
     * @returns {Promise<number>} The ID of the newly created window.
     * @throws Will throw an error if the counter document does not exist.
     */
    static async createWindow(windowData) {
        const windowRef = db.collection("windows");
        const counterRef = db.collection('counters').doc('windowCounter');

        const newWindow = await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            if (!counterDoc.exists) {
                throw new Error("Counter document does not exist!");
            }

            const newId = counterDoc.data().count + 1;

            const window = new Window(newId, windowData.x, windowData.y, windowData.width, windowData.height, windowData.rotation);

            transaction.update(counterRef, {count: newId});
            transaction.set(windowRef.doc(newId.toString()), window.toFirestore());

            return window;
        });

        return newWindow.id;
    }

    /**
     * Updates a window.
     * @param {string} windowId - The ID of the window.
     * @param {Object} windowData - The data to update the window with.
     * @returns {Promise<Window>}
     */
    static async updateWindow(windowId, windowData) {
        const windowRef = db.collection("windows").doc(windowId);
        await windowRef.update(windowData);
        const updatedWindow = await windowRef.get();
        return Window.fromFirestore(updatedWindow);
    }

    /**
     * Deletes a window by its ID.
     * @param {string} windowId - The ID of the window.
     * @returns {Promise<void>}
     */
    static async deleteWindow(windowId) {
        const windowRef = db.collection("windows").doc(windowId);
        await windowRef.delete();
    }
}

module.exports = WindowService;