const { logger } = require("../logger/FirebaseLogger");
const { PhoneNumber } = require("../models/phoneNumber.model");
const { Email } = require("../models/email.model");
const { Address } = require("../models/address.model");
const { Map } = require("../models/map.model");
const { db } = require("../config/firebase.config");
const { Feature } = require("../models/feature.model");

class RestaurantConfigService {
  static async addPhoneNumber(phoneNumber) {
    const phoneNumberRef = db.collection("restaurantConfig").doc("phoneNumber");
    const phone = new PhoneNumber(phoneNumber);
    await phoneNumberRef.set(phone.toFirestore());
    logger.info("Phone number added successfully");
  }

  static async updatePhoneNumber(phoneNumber) {
    const phoneNumberRef = db.collection("restaurantConfig").doc("phoneNumber");
    const phone = new PhoneNumber(phoneNumber);
    await phoneNumberRef.update(phone.toFirestore());
    logger.info("Phone number updated successfully");
  }

  static async deletePhoneNumber() {
    const phoneNumberRef = db.collection("restaurantConfig").doc("phoneNumber");
    await phoneNumberRef.delete();
    logger.info("Phone number deleted successfully");
  }

  static async getPhoneNumber() {
    const phoneNumberRef = db.collection("restaurantConfig").doc("phoneNumber");
    const snapshot = await phoneNumberRef.get();
    if (!snapshot.exists) {
      logger.error("Phone number not found");
      return null;
    }
    return PhoneNumber.fromFirestore(snapshot);
  }

  static async addEmail(email) {
    const emailRef = db.collection("restaurantConfig").doc("email");
    const mail = new Email(email);
    await emailRef.set(mail.toFirestore());
    logger.info("Email added successfully");
  }

  static async updateEmail(email) {
    const emailRef = db.collection("restaurantConfig").doc("email");
    const mail = new Email(email);
    await emailRef.update(mail.toFirestore());
    logger.info("Email updated successfully");
  }

  static async deleteEmail() {
    const emailRef = db.collection("restaurantConfig").doc("email");
    await emailRef.delete();
    logger.info("Email deleted successfully");
  }

  static async getEmail() {
    const emailRef = db.collection("restaurantConfig").doc("email");
    const snapshot = await emailRef.get();
    if (!snapshot.exists) {
      logger.error("Email not found");
      return null;
    }
    return Email.fromFirestore(snapshot);
  }

  static async addAddress(street, city, county, eircode, country) {
    const addressRef = db.collection("restaurantConfig").doc("address");
    const addr = new Address();
    addr.street = street;
    addr.city = city;
    addr.county = county;
    addr.eircode = eircode;
    addr.country = country;
    await addressRef.set(addr.toFirestore());
    logger.info("Address added successfully");
  }

  static async updateAddress(street, city, county, eircode, country) {
    const addressRef = db.collection("restaurantConfig").doc("address");
    const addr = new Address();
    addr.street = street;
    addr.city = city;
    addr.county = county;
    addr.eircode = eircode;
    addr.country = country;
    await addressRef.update(addr.toFirestore());
    logger.info("Address updated successfully");
  }

  static async deleteAddress() {
    const addressRef = db.collection("restaurantConfig").doc("address");
    await addressRef.delete();
    logger.info("Address deleted successfully");
  }

  static async getAddress() {
    const addressRef = db.collection("restaurantConfig").doc("address");
    const snapshot = await addressRef.get();
    if (!snapshot.exists) {
      logger.error("Address not found");
      return null;
    }
    return Address.fromFirestore(snapshot);
  }

  static async addMap(mapUrl) {
    const mapRef = db.collection("restaurantConfig").doc("map");
    const m = new Map();
    m.mapUrl = mapUrl;
    await mapRef.set(m.toFirestore());
    logger.info("Map added successfully");
  }

  static async updateMap(mapUrl) {
    const mapRef = db.collection("restaurantConfig").doc("map");
    const m = new Map();
    m.mapUrl = mapUrl;
    await mapRef.update(m.toFirestore());
    logger.info("Map updated successfully");
  }

  static async deleteMap() {
    const mapRef = db.collection("restaurantConfig").doc("map");
    await mapRef.delete();
    logger.info("Map deleted successfully");
  }

  static async getMap() {
    const mapRef = db.collection("restaurantConfig").doc("map");
    const snapshot = await mapRef.get();
    if (!snapshot.exists) {
      logger.error("Map not found");
      return null;
    }
    return Map.fromFirestore(snapshot);
  }

  static async getRestaurantConfig() {
    const phoneNumber = await this.getPhoneNumber();
    const email = await this.getEmail();
    const address = await this.getAddress();
    const map = await this.getMap();
    const features = await this.getAllFeatures();
    return { phoneNumber, email, address, map, features };
  }

  static async addFeature(name, enabled) {
    const featureRef = db
      .collection("restaurantConfig")
      .doc("features")
      .collection("features")
      .doc(name);
    const feature = new Feature(name, enabled);
    await featureRef.set(feature.toFirestore());
    logger.info("Feature added successfully");
  }

  static async updateFeature(name, enabled) {
    const featureRef = db
      .collection("restaurantConfig")
      .doc("features")
      .collection("features")
      .doc(name);
    const feature = new Feature(name, enabled);
    await featureRef.update(feature.toFirestore());
    logger.info("Feature updated successfully");
  }

  static async deleteFeature(name) {
    const featureRef = db
      .collection("restaurantConfig")
      .doc("features")
      .collection("features")
      .doc(name);
    await featureRef.delete();
    logger.info("Feature deleted successfully");
  }

  static async getFeature(name) {
    const featureRef = db
      .collection("restaurantConfig")
      .doc("features")
      .collection("features")
      .doc(name);
    const snapshot = await featureRef.get();
    if (!snapshot.exists) {
      logger.error("Feature not found");
      return null;
    }
    return Feature.fromFirestore(snapshot);
  }

  static async getAllFeatures() {
    const featuresRef = db.collection("restaurantConfig").doc("features").collection("features");
    const snapshot = await featuresRef.get();
    const features = [];
    snapshot.forEach((doc) => {
      features.push(Feature.fromFirestore(doc));
    });
    return features;
  }
}

module.exports = RestaurantConfigService;
