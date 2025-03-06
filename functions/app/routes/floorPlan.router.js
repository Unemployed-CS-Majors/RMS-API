const express = require('express');
const FloorPlanController = require('../controllers/floorPlan.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FloorPlans
 *   description: Floor plan management
 */

/**
 * @swagger
 * /floorPlans:
 *   get:
 *     summary: Retrieve the floor plan
 *     tags: [FloorPlans]
 *     responses:
 *       200:
 *         description: The floor plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The floor plan ID
 *                 name:
 *                   type: string
 *                   description: The name of the floor plan
 *                 layout:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tableId:
 *                         type: string
 *                         description: The table ID
 *                       position:
 *                         type: object
 *                         properties:
 *                           x:
 *                             type: number
 *                             description: The x-coordinate
 *                           y:
 *                             type: number
 *                             description: The y-coordinate
 */
router.get('/', FloorPlanController.getFloorPlan);

module.exports = router;