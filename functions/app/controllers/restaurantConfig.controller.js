const { createResponse } = require("../utils/response.utils");
const RestaurantConfigService = require("../services/restaurantConfig.service");

class RestaurantConfigController {
  static async addPhoneNumber(req, res) {
    try {
      const { phoneNumber } = req.body;
      await RestaurantConfigService.addPhoneNumber(phoneNumber);
      return res
        .status(201)
        .json(createResponse("success", "Phone number added successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async updatePhoneNumber(req, res) {
    try {
      const { phoneNumber } = req.body;
      await RestaurantConfigService.updatePhoneNumber(phoneNumber);
      return res
        .status(200)
        .json(createResponse("success", "Phone number updated successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deletePhoneNumber(req, res) {
    try {
      await RestaurantConfigService.deletePhoneNumber();
      return res
        .status(200)
        .json(createResponse("success", "Phone number deleted successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getPhoneNumber(req, res) {
    try {
      const phoneNumber = await RestaurantConfigService.getPhoneNumber();
      return res
        .status(200)
        .json(createResponse("success", "Phone number fetched successfully", phoneNumber));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async addEmail(req, res) {
    try {
      const { email } = req.body;
      await RestaurantConfigService.addEmail(email);
      return res.status(201).json(createResponse("success", "Email added successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async updateEmail(req, res) {
    try {
      const { email } = req.body;
      await RestaurantConfigService.updateEmail(email);
      return res.status(200).json(createResponse("success", "Email updated successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deleteEmail(req, res) {
    try {
      await RestaurantConfigService.deleteEmail();
      return res.status(200).json(createResponse("success", "Email deleted successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getEmail(req, res) {
    try {
      const email = await RestaurantConfigService.getEmail();
      return res.status(200).json(createResponse("success", "Email fetched successfully", email));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async addAddress(req, res) {
    try {
      const { street, city, county, eircode, country } = req.body;
      await RestaurantConfigService.addAddress(street, city, county, eircode, country);
      return res.status(201).json(createResponse("success", "Address added successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async updateAddress(req, res) {
    try {
      const { street, city, county, eircode, country } = req.body;
      await RestaurantConfigService.updateAddress(street, city, county, eircode, country);
      return res.status(200).json(createResponse("success", "Address updated successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deleteAddress(req, res) {
    try {
      await RestaurantConfigService.deleteAddress();
      return res.status(200).json(createResponse("success", "Address deleted successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getAddress(req, res) {
    try {
      const address = await RestaurantConfigService.getAddress();
      return res
        .status(200)
        .json(createResponse("success", "Address fetched successfully", address));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async addMap(req, res) {
    try {
      const { mapIFrame } = req.body;
      const srcMatch = mapIFrame.match(/src="([^"]+)"/);
      const mapUrl = srcMatch ? srcMatch[1] : null;
      if (!mapUrl) {
        return res.status(400).json(createResponse("error", "Invalid map iframe", null));
      }
      await RestaurantConfigService.addMap(mapUrl);
      return res.status(201).json(createResponse("success", "Map added successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async updateMap(req, res) {
    try {
      const { mapIFrame } = req.body;
      const srcMatch = mapIFrame.match(/src="([^"]+)"/);
      const mapUrl = srcMatch ? srcMatch[1] : null;
      if (!mapUrl) {
        return res.status(400).json(createResponse("error", "Invalid map iframe", null));
      }
      await RestaurantConfigService.updateMap(mapUrl);
      return res.status(200).json(createResponse("success", "Map updated successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getMap(req, res) {
    try {
      const map = await RestaurantConfigService.getMap();
      return res.status(200).json(createResponse("success", "Map fetched successfully", map));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deleteMap(req, res) {
    try {
      await RestaurantConfigService.deleteMap();
      return res.status(200).json(createResponse("success", "Map deleted successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async addFeature(req, res) {
    try {
      const { name, enabled } = req.body;
      await RestaurantConfigService.addFeature(name, enabled);
      return res.status(201).json(createResponse("success", "Feature added successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async updateFeature(req, res) {
    try {
      const { name, enabled } = req.body;
      await RestaurantConfigService.updateFeature(name, enabled);
      return res.status(200).json(createResponse("success", "Feature updated successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getFeature(req, res) {
    try {
      const { name } = req.params;
      const feature = await RestaurantConfigService.getFeature(name);
      return res
        .status(200)
        .json(createResponse("success", "Feature fetched successfully", feature));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async deleteFeature(req, res) {
    try {
      const { name } = req.params;
      await RestaurantConfigService.deleteFeature(name);
      return res.status(200).json(createResponse("success", "Feature deleted successfully", null));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getAllFeatures(req, res) {
    try {
      const features = await RestaurantConfigService.getAllFeatures();
      return res
        .status(200)
        .json(createResponse("success", "Features fetched successfully", features));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }

  static async getRestaurantConfig(req, res) {
    try {
      const config = await RestaurantConfigService.getRestaurantConfig();
      return res
        .status(200)
        .json(createResponse("success", "Restaurant config fetched successfully", config));
    } catch (error) {
      return res.status(500).json(createResponse("error", error.message, null));
    }
  }
}

module.exports = RestaurantConfigController;
