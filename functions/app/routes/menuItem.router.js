const express = require('express');
const router = express.Router();
const busboyMiddleware = require("../middlewares/busboy.middleware");
const {isOwner} = require("../middlewares/privilages.middleware");
const {verifyIdToken} = require("../middlewares/auth.middleware");
const MenuItemController = require("../controllers/menuItem.controller");

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new menu item
 *     tags: [MenuItem]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *               calories:
 *                 type: number
 *               avgWaitTime:
 *                 type: number
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create menu item
 */
router.post('/', verifyIdToken, isOwner, busboyMiddleware, MenuItemController.createMenuItem);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all menu items
 *     tags: [MenuItem]
 *     responses:
 *       200:
 *         description: Menu items retrieved successfully
 *       500:
 *         description: Failed to retrieve menu items
 */
router.get('/', MenuItemController.getAllMenuItems);

/**
 * @swagger
 * /enums:
 *   get:
 *     summary: Get enum values
 *     tags: [MenuItem]
 *     responses:
 *       200:
 *         description: Enum values retrieved successfully
 *       500:
 *         description: Failed to retrieve enum values
 */
router.get('/enums', MenuItemController.getEnumValues);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags: [MenuItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item retrieved successfully
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Failed to retrieve menu item
 */
router.get('/:id', MenuItemController.getMenuItemById);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [MenuItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *               calories:
 *                 type: number
 *               avgWaitTime:
 *                 type: number
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Failed to update menu item
 */
router.put('/:id', verifyIdToken, isOwner, busboyMiddleware, MenuItemController.updateMenuItem);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [MenuItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Failed to delete menu item
 */
router.delete('/:id', verifyIdToken, isOwner, MenuItemController.deleteMenuItem);

module.exports = router;