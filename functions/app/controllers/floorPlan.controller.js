const {createResponse} = require("../utils/response.utils");
const DoorService = require("../services/door.service");
const WallService = require("../services/wall.service");
const WindowService = require("../services/window.service");
const TableService = require("../services/table.service");

class FloorPlanController {
    static async getFloorPlan(req, res) {
        try {

            const tables = await TableService.getAllTables();

            const doors = await DoorService.getAllDoors();

            const walls = await WallService.getAllWalls();

            const windows = await WindowService.getAllWindows();

            const floorPlan = {
                tables: tables,
                doors: doors,
                walls: walls,
                windows: windows
            };

            return res.status(200).json(createResponse("success", "Floor plan fetched successfully", floorPlan));

        } catch (e) {
            console.error("Error getting floor plan", e);
            return res.status(500).json(createResponse("error", e.message, null));
        }
    }
}

module.exports = FloorPlanController;