const express = require('express');
const RestaurantConfigController = require('../controllers/restaurantConfig.controller');
const {isOwner} = require("../middlewares/privilages.middleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurant Configuration
 *   description: API for managing restaurant configuration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneNumber:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Restaurant phone number
 *       example:
 *         phoneNumber: "+353 1 234 5678"
 *     Email:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: Restaurant email address
 *       example:
 *         email: "contact@restaurant.com"
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - county
 *         - eircode
 *         - country
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City
 *         county:
 *           type: string
 *           description: County
 *         eircode:
 *           type: string
 *           description: Eircode (Irish postal code)
 *         country:
 *           type: string
 *           description: Country
 *       example:
 *         street: "123 Main Street"
 *         city: "Dublin"
 *         county: "Dublin"
 *         eircode: "D01 AB12"
 *         country: "Ireland"
 *     Map:
 *       type: object
 *       required:
 *         - mapIFrame
 *       properties:
 *         mapIFrame:
 *           type: string
 *           description: Google Maps iframe HTML
 *       example:
 *         mapIFrame: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!..."></iframe>'
 *     RestaurantConfig:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           $ref: '#/components/schemas/PhoneNumber'
 *         email:
 *           $ref: '#/components/schemas/Email'
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         map:
 *           $ref: '#/components/schemas/Map'
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *         message:
 *           type: string
 *         data:
 *           type: object
 */

/**
 * @swagger
 * /api/restaurant/phone-number:
 *   post:
 *     summary: Add restaurant phone number
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneNumber'
 *     responses:
 *       201:
 *         description: Phone number added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.post('/phone-number', isOwner, RestaurantConfigController.addPhoneNumber);

/**
 * @swagger
 * /api/restaurant/phone-number:
 *   put:
 *     summary: Update restaurant phone number
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneNumber'
 *     responses:
 *       200:
 *         description: Phone number updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.put('/phone-number', isOwner, RestaurantConfigController.updatePhoneNumber);

/**
 * @swagger
 * /api/restaurant/phone-number:
 *   delete:
 *     summary: Delete restaurant phone number
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Phone number deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.delete('/phone-number', isOwner, RestaurantConfigController.deletePhoneNumber);

/**
 * @swagger
 * /api/restaurant/phone-number:
 *   get:
 *     summary: Get restaurant phone number
 *     tags: [Restaurant Configuration]
 *     responses:
 *       200:
 *         description: Phone number fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Phone number fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/PhoneNumber'
 *       500:
 *         description: Server error
 */
router.get('/phone-number', RestaurantConfigController.getPhoneNumber);

/**
 * @swagger
 * /api/restaurant/email:
 *   post:
 *     summary: Add restaurant email
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Email'
 *     responses:
 *       201:
 *         description: Email added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.post('/email', isOwner, RestaurantConfigController.addEmail);

/**
 * @swagger
 * /api/restaurant/email:
 *   put:
 *     summary: Update restaurant email
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Email'
 *     responses:
 *       200:
 *         description: Email updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.put('/email', isOwner, RestaurantConfigController.updateEmail);

/**
 * @swagger
 * /api/restaurant/email:
 *   delete:
 *     summary: Delete restaurant email
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.delete('/email', isOwner, RestaurantConfigController.deleteEmail);

/**
 * @swagger
 * /api/restaurant/email:
 *   get:
 *     summary: Get restaurant email
 *     tags: [Restaurant Configuration]
 *     responses:
 *       200:
 *         description: Email fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Email fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Email'
 *       500:
 *         description: Server error
 */
router.get('/email', RestaurantConfigController.getEmail);

/**
 * @swagger
 * /api/restaurant/address:
 *   post:
 *     summary: Add restaurant address
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.post('/address', isOwner, RestaurantConfigController.addAddress);

/**
 * @swagger
 * /api/restaurant/address:
 *   put:
 *     summary: Update restaurant address
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.put('/address', isOwner, RestaurantConfigController.updateAddress);

/**
 * @swagger
 * /api/restaurant/address:
 *   delete:
 *     summary: Delete restaurant address
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.delete('/address', isOwner, RestaurantConfigController.deleteAddress);

/**
 * @swagger
 * /api/restaurant/address:
 *   get:
 *     summary: Get restaurant address
 *     tags: [Restaurant Configuration]
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Address fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       500:
 *         description: Server error
 */
router.get('/address', RestaurantConfigController.getAddress);

/**
 * @swagger
 * /api/restaurant/map:
 *   post:
 *     summary: Add restaurant map
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Map'
 *     responses:
 *       201:
 *         description: Map added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid map iframe
 *       500:
 *         description: Server error
 */
router.post('/map', isOwner, RestaurantConfigController.addMap);

/**
 * @swagger
 * /api/restaurant/map:
 *   put:
 *     summary: Update restaurant map
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Map'
 *     responses:
 *       200:
 *         description: Map updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid map iframe
 *       500:
 *         description: Server error
 */
router.put('/map', isOwner, RestaurantConfigController.updateMap);

/**
 * @swagger
 * /api/restaurant/map:
 *   delete:
 *     summary: Delete restaurant map
 *     tags: [Restaurant Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Map deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 */
router.delete('/map', isOwner, RestaurantConfigController.deleteMap);

/**
 * @swagger
 * /api/restaurant/map:
 *   get:
 *     summary: Get restaurant map
 *     tags: [Restaurant Configuration]
 *     responses:
 *       200:
 *         description: Map fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Map fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Map'
 *       500:
 *         description: Server error
 */
router.get('/map', RestaurantConfigController.getMap);

/**
 * @swagger
 * /api/restaurant/feature:
 *   post:
 *     summary: Add a new feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Feature added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feature added successfully
 *       500:
 *         description: Server error
 */
router.post('/feature', isOwner, RestaurantConfigController.addFeature);

/**
 * @swagger
 * /api/restaurant/feature:
 *   put:
 *     summary: Update an existing feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Feature updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feature updated successfully
 *       500:
 *         description: Server error
 */
router.put('/feature', isOwner, RestaurantConfigController.updateFeature);

/**
 * @swagger
 * /api/restaurant/feature/{name}:
 *   get:
 *     summary: Get a feature by name
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the feature
 *     responses:
 *       200:
 *         description: Feature fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feature fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     enabled:
 *                       type: boolean
 *       500:
 *         description: Server error
 */
router.get('/feature/:name', RestaurantConfigController.getFeature);

/**
 * @swagger
 * /api/restaurant/feature/{name}:
 *   delete:
 *     summary: Delete a feature by name
 *     tags: [Features]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the feature
 *     responses:
 *       200:
 *         description: Feature deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feature deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/feature/:name', isOwner, RestaurantConfigController.deleteFeature);

/**
 * @swagger
 * /api/restaurant/features:
 *   get:
 *     summary: Get all features
 *     tags: [Features]
 *     responses:
 *       200:
 *         description: Features fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Features fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       enabled:
 *                         type: boolean
 *       500:
 *         description: Server error
 */
router.get('/features', RestaurantConfigController.getAllFeatures);

/**
 * @swagger
 * /api/restaurant/config:
 *   get:
 *     summary: Get all restaurant configuration
 *     tags: [Restaurant Configuration]
 *     responses:
 *       200:
 *         description: Restaurant configuration fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Restaurant config fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/RestaurantConfig'
 *       500:
 *         description: Server error
 */
router.get('/config', RestaurantConfigController.getRestaurantConfig);

module.exports = router;