const {db} = require('../config/firebase.config');
const {Feature, FeatureName} = require('../models/feature.model');
const {logger} = require('../logger/FirebaseLogger');

const initializeFeatures = async () => {
    const featuresRef = db.collection('restaurantConfig').doc('features').collection('features');

    for (const name of Object.values(FeatureName)) {
        const featureDoc = await featuresRef.doc(name).get();
        if (!featureDoc.exists) {
            const feature = new Feature(name, false); // Assuming features are disabled by default
            await featuresRef.doc(name).set(feature.toFirestore());
            logger.info(`Feature ${name} added successfully`);
        } else {
            logger.info(`Feature ${name} already exists`);
        }
    }
};

module.exports = initializeFeatures;