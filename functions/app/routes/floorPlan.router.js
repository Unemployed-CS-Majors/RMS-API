const express = require('express');
const FloorPlanController = require('../controllers/floorPlan.controller');

const router = express.Router();

/**
 * @swagger
 * /floorPlan:
 *   get:
 *     summary: Retrieve the floor plan
 *     tags:
 *       - FloorPlan
 *     responses:
 *       200:
 *         description: The floor plan details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tables:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Table'
 *                 doors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Door'
 *                 walls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wall'
 *                 windows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Window'
 *       500:
 *         description: Internal server error
 */
router.get('/', FloorPlanController.getFloorPlan);

module.exports = router;