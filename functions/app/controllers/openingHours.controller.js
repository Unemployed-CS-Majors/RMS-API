const admin = require("firebase-admin");
const { OpeningHours } = require("../models/openingHours.model");
const { createResponse } = require("../utils/responseUtil");
const { validateOpeningHours } = require("../validators/openingHours.validators");

class OpeningHoursController {
    static async createOpeningHours(req, res) {
        const validationError = validateOpeningHours(req);
        if (validationError) {
            return res
              .status(400)
              .json(createResponse("error", validationError, null));
          }
        const { day, startTime, endTime } = req.body;
        
        const db = admin.firestore();
        const openingHoursRef = db.collection('opening_hours');
        const counterRef = db.collection('counters').doc('dayCounter');
        try {
            const newOpenningDay = await db.runTransaction(async (transaction) => {
                const counterDoc = await transaction.get(counterRef);
                if (!counterDoc.exists) {
                  throw new Error("Counter document does not exist!");
                }
        
                const newId = counterDoc.data().count + 1;
                const openingHours = new OpeningHours(newId, day, startTime, endTime);
        
                transaction.update(counterRef, { count: newId });
                transaction.set(openingHoursRef.doc(newId.toString()), openingHours.toFirestore());
        
                return openingHours;
              });

            return res
            .status(201)
            .json(createResponse("success", "Opening hours created successfully", { id: newOpenningDay.id }));
        } catch(error) {
            console.error("Error creating table:", error);
            return res
              .status(500)
              .json(createResponse("error", "Internal Server Error", null));
        }
    }

    static async getAllOpeningHours(req, res) {
        const db = admin.firestore();
        try {
            const snapshot = await db.collection('opening_hours').get();
            const openingHours = snapshot.docs.map(doc => OpeningHours.fromFirestore(doc));
            return res
              .status(200)
              .json(createResponse("success", "Opening hours fetched successfully", openingHours));
        } catch (error) {
            console.error("Error fetching tables:", error);
            return res
              .status(500)
              .json(createResponse("error", "Internal Server Error", null));
        }
    }

    static async getOpeningHoursById(req, res) {
        const { id } = req.params;
        const db = admin.firestore();
        try {
            const snapshot = await db.collection('opening_hours').doc(id).get();
            if (!snapshot.exists) {
                return res
                  .status(404)
                  .json(createResponse("error", "Opening hours not found", null));
            }
            const openingHours = OpeningHours.fromFirestore(snapshot);
            return res
              .status(200)
              .json(createResponse("success", "Opening hours fetched successfully", openingHours));
        } catch (error) {
            console.error("Error fetching tables:", error);
            return res
              .status(500)
              .json(createResponse("error", "Internal Server Error", null));
        }
    }

    static async updateOpeningHours(req, res) {
        const validationError = validateOpeningHours(req);
        if (validationError) {
            return res
              .status(400)
              .json(createResponse("error", validationError, null));
          }
        const { day, startTime, endTime } = req.body;
        const { id } = req.params;
        const db = admin.firestore();
        const openingHoursRef = db.collection('opening_hours').doc(id);
        try {
            const openingHours = new OpeningHours(id, day, startTime, endTime);
            await openingHoursRef.set(openingHours.toFirestore(), { merge: true });
            return res
              .status(200)
              .json(createResponse("success", "Opening hours updated successfully", null));
        } catch (error) {
            console.error("Error updating opening hours:", error);
            return res
              .status(500)
              .json(createResponse("error", "Internal Server Error", null));
        }
    }
}

module.exports = OpeningHoursController;