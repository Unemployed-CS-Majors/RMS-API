const menuItemService = require("../services/menuItem.service");
const { MenuItem, ItemType, Allergen } = require("../models/menuItem.model");
const { validateMenuItem } = require("../validators/menuItem.validators");
const { logger } = require("../logger/FirebaseLogger");
const { createResponse } = require("../utils/response.utils");

class MenuItemController {
  static async createMenuItem(req, res) {
    try {
      const menuItemData = MenuItem.fromRequestBody(req.body);
      logger.info("menuItemData", menuItemData);
      logger.info("menuItemData", req.body);

      const validationResult = validateMenuItem(menuItemData);
      if (!validationResult.isValid) {
        return res
          .status(400)
          .json(createResponse("error", "Validation failed", validationResult.errors));
      }

      logger.info("createMenuItem: req.body: ", req.form);
      const menuItem = await menuItemService.createMenuItem(req.body, req.file);

      res.status(201).json(createResponse("success", "Menu item created successfully", menuItem));
    } catch (error) {
      console.error("Error in createMenuItem controller:", error);
      res.status(500).json(createResponse("error", "Failed to create menu item", error.message));
    }
  }

  static async getAllMenuItems(req, res) {
    try {
      const { type, allergen } = req.query;
      let menuItems = await menuItemService.getAllMenuItems();

      if (type && Object.values(ItemType).includes(type)) {
        menuItems = menuItems.filter((item) => item.type === type);
      }

      if (allergen && Object.values(Allergen).includes(allergen)) {
        menuItems = menuItems.filter((item) => item.allergens && item.allergens.includes(allergen));
      }

      res
        .status(200)
        .json(createResponse("success", "Menu items retrieved successfully", menuItems));
    } catch (error) {
      console.error("Error in getAllMenuItems controller:", error);
      res.status(500).json(createResponse("error", "Failed to retrieve menu items", error.message));
    }
  }

  static async getMenuItemById(req, res) {
    try {
      const menuItem = await menuItemService.getMenuItemById(req.params.id);
      res.status(200).json(createResponse("success", "Menu item retrieved successfully", menuItem));
    } catch (error) {
      console.error("Error in getMenuItemById controller:", error);

      if (error.message === "Menu item not found") {
        return res.status(404).json(createResponse("error", "Menu item not found"));
      }

      res.status(500).json(createResponse("error", "Failed to retrieve menu item", error.message));
    }
  }

  static async updateMenuItem(req, res) {
    try {
      const currentMenuItem = await menuItemService.getMenuItemById(req.params.id);

      const updatedData = {
        name: req.body.name || currentMenuItem.name,
        description: req.body.description || currentMenuItem.description,
        price: req.body.price ? parseFloat(req.body.price) : currentMenuItem.price,
        type: req.body.type || currentMenuItem.type,
        calories: req.body.calories ? parseInt(req.body.calories) : currentMenuItem.calories,
        avgWaitTime: req.body.avgWaitTime
          ? parseInt(req.body.avgWaitTime)
          : currentMenuItem.avgWaitTime,
        allergens: req.body.allergens
          ? typeof req.body.allergens === "string"
            ? JSON.parse(req.body.allergens)
            : req.body.allergens
          : currentMenuItem.allergens,
      };

      const validationResult = validateMenuItem(updatedData);
      if (!validationResult.isValid) {
        return res
          .status(400)
          .json(createResponse("error", "Validation failed", validationResult.errors));
      }

      const updatedMenuItem = await menuItemService.updateMenuItem(
        req.params.id,
        req.body,
        req.file
      );

      res
        .status(200)
        .json(createResponse("success", "Menu item updated successfully", updatedMenuItem));
    } catch (error) {
      console.error("Error in updateMenuItem controller:", error);

      if (error.message === "Menu item not found") {
        return res.status(404).json(createResponse("error", "Menu item not found"));
      }

      res.status(500).json(createResponse("error", "Failed to update menu item", error.message));
    }
  }

  static async deleteMenuItem(req, res) {
    try {
      const result = await menuItemService.deleteMenuItem(req.params.id);
      res.status(200).json(createResponse("success", result.message));
    } catch (error) {
      console.error("Error in deleteMenuItem controller:", error);

      if (error.message === "Menu item not found") {
        return res.status(404).json(createResponse("error", "Menu item not found"));
      }

      res.status(500).json(createResponse("error", "Failed to delete menu item", error.message));
    }
  }

  static async getEnumValues(req, res) {
    try {
      res.status(200).json(
        createResponse("success", "Enum values retrieved successfully", {
          itemTypes: Object.entries(ItemType).map(([key, value]) => ({
            key,
            value,
          })),
          allergens: Object.entries(Allergen).map(([key, value]) => ({
            key,
            value,
          })),
        })
      );
    } catch (error) {
      console.error("Error in getEnumValues controller:", error);
      res
        .status(500)
        .json(createResponse("error", "Failed to retrieve enum values", error.message));
    }
  }
}

module.exports = MenuItemController;
