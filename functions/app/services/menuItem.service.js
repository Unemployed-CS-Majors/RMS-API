const {db, storage, admin} = require('../config/firebase.config');
const {MenuItem} = require('../models/menuItem.model');
const {v4: uuidv4} = require('uuid');

class MenuItemService {
    static async uploadImage(file) {
        if (!file) return null;

        const filename = `${uuidv4()}_${file.originalname}`;
        const filePath = `menu-items/${filename}`;

        const fileRef = storage.bucket().file(filePath);

        await fileRef.save(file.buffer, {
            metadata: {
                contentType: file.mimetype
            }
        });

        await fileRef.makePublic();

        return `https://storage.googleapis.com/${storage.bucket().name}/${filePath}`;
    }

    static async deleteImage(imageUrl) {
        if (!imageUrl) return;

        try {
            const filePathMatch = imageUrl.match(/menu-items\/.+/);
            if (!filePathMatch) return;

            const filePath = filePathMatch[0];
            const fileRef = storage.bucket().file(filePath);

            const [exists] = await fileRef.exists();
            if (exists) {
                await fileRef.delete();
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }

    static async createMenuItem(data, file) {
        try {
            const menuItem = MenuItem.fromRequestBody(data);

            if (file) {
                menuItem.imageUrl = await this.uploadImage(file);
            }

            const firestoreData = menuItem.toFirestore(admin);
            const docRef = await db.collection('menuItems').add(firestoreData);

            const doc = await docRef.get();

            return MenuItem.fromFirestore(doc);
        } catch (error) {
            console.error('Error in createMenuItem service:', error);
            throw error;
        }
    }

    static async getAllMenuItems() {
        try {
            const snapshot = await db.collection('menuItems').get();
            return snapshot.docs.map(doc => MenuItem.fromFirestore(doc));
        } catch (error) {
            console.error('Error in getAllMenuItems service:', error);
            throw error;
        }
    }

    static async getMenuItemById(id) {
        try {
            const docRef = db.collection('menuItems').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Menu item not found');
            }

            return MenuItem.fromFirestore(doc);
        } catch (error) {
            console.error('Error in getMenuItemById service:', error);
            throw error;
        }
    }

    static async updateMenuItem(id, data, file) {
        try {
            const docRef = db.collection('menuItems').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Menu item not found');
            }

            const currentMenuItem = MenuItem.fromFirestore(doc);

            const updatedMenuItem = new MenuItem(
                id,
                data.name || currentMenuItem.name,
                data.description || currentMenuItem.description,
                data.price ? parseFloat(data.price) : currentMenuItem.price,
                data.type || currentMenuItem.type,
                data.calories ? parseInt(data.calories) : currentMenuItem.calories,
                data.avgWaitTime ? parseInt(data.avgWaitTime) : currentMenuItem.avgWaitTime,
                data.allergens ? (typeof data.allergens === 'string' ? JSON.parse(data.allergens) : data.allergens) : currentMenuItem.allergens,
                currentMenuItem.imageUrl,
                currentMenuItem.createdAt
            );

            if (file) {
                updatedMenuItem.imageUrl = await this.uploadImage(file);

                if (currentMenuItem.imageUrl) {
                    await this.deleteImage(currentMenuItem.imageUrl);
                }
            }

            await docRef.update(updatedMenuItem.toFirestore(admin));

            const updatedDoc = await docRef.get();

            return MenuItem.fromFirestore(updatedDoc);
        } catch (error) {
            console.error('Error in updateMenuItem service:', error);
            throw error;
        }
    }

    static async deleteMenuItem(id) {
        try {
            const docRef = db.collection('menuItems').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Menu item not found');
            }

            const menuItem = MenuItem.fromFirestore(doc);

            if (menuItem.imageUrl) {
                await this.deleteImage(menuItem.imageUrl);
            }

            await docRef.delete();

            return {message: 'Menu item successfully deleted'};
        } catch (error) {
            console.error('Error in deleteMenuItem service:', error);
            throw error;
        }
    }
}

module.exports = MenuItemService;