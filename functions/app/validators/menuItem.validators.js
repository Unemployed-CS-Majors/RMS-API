// validators/menuItemValidators.js - Validation functions for menu items
const { ItemType, Allergen } = require('../models/menuItem.model');

/**
 * Validates a menu item's name
 * @param {string} name - The menu item name
 * @returns {Object} Validation result with isValid flag and error message
 */
const validateName = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
            isValid: false,
            error: 'Name is required and must be a non-empty string'
        };
    }

    if (name.length > 100) {
        return {
            isValid: false,
            error: 'Name must be 100 characters or less'
        };
    }

    return { isValid: true };
};

const validateDescription = (description) => {

    return { isValid: true };
}

/**
 * Validates a menu item's price
 * @param {number|string} price - The menu item price
 * @returns {Object} Validation result with isValid flag and error message
 */
const validatePrice = (price) => {
    const priceNum = parseFloat(price);

    if (price === undefined || price === null || isNaN(priceNum)) {
        return {
            isValid: false,
            error: 'Price is required and must be a number'
        };
    }

    if (priceNum < 0) {
        return {
            isValid: false,
            error: 'Price must be a positive number'
        };
    }

    if (priceNum > 10000) {
        return {
            isValid: false,
            error: 'Price is unreasonably high'
        };
    }

    return { isValid: true };
};

/**
 * Validates a menu item's type
 * @param {string} type - The menu item type
 * @returns {Object} Validation result with isValid flag and error message
 */
const validateType = (type) => {
    if (!type || typeof type !== 'string') {
        return {
            isValid: false,
            error: 'Type is required and must be a string'
        };
    }

    if (!Object.values(ItemType).includes(type)) {
        return {
            isValid: false,
            error: `Type must be one of: ${Object.values(ItemType).join(', ')}`
        };
    }

    return { isValid: true };
};

/**
 * Validates a menu item's calories
 * @param {number|string|null} calories - The menu item calories
 * @returns {Object} Validation result with isValid flag and error message
 */
const validateCalories = (calories) => {
    // Calories are optional
    if (calories === null || calories === undefined || calories === '') {
        return { isValid: true };
    }

    const caloriesNum = parseInt(calories);

    if (isNaN(caloriesNum)) {
        return {
            isValid: false,
            error: 'Calories must be a number'
        };
    }

    if (caloriesNum < 0) {
        return {
            isValid: false,
            error: 'Calories cannot be negative'
        };
    }

    if (caloriesNum > 10000) {
        return {
            isValid: false,
            error: 'Calories value is unreasonably high'
        };
    }

    return { isValid: true };
};

/**
 * Validates a menu item's average wait time
 * @param {number|string|null} avgWaitTime - The menu item average wait time
 * @returns {Object} Validation result with isValid flag and error message
 */
const validateAvgWaitTime = (avgWaitTime) => {
    // Average wait time is optional
    if (avgWaitTime === null || avgWaitTime === undefined || avgWaitTime === '') {
        return { isValid: true };
    }

    const avgWaitTimeNum = parseInt(avgWaitTime);

    if (isNaN(avgWaitTimeNum)) {
        return {
            isValid: false,
            error: 'Average wait time must be a number'
        };
    }

    if (avgWaitTimeNum < 0) {
        return {
            isValid: false,
            error: 'Average wait time cannot be negative'
        };
    }

    if (avgWaitTimeNum > 180) {
        return {
            isValid: false,
            error: 'Average wait time cannot exceed 180 minutes (3 hours)'
        };
    }

    return { isValid: true };
};

/**
 * Validates a menu item's allergens
 * @param {Array|string|null} allergens - The menu item allergens
 * @returns {Object} Validation result with isValid flag and error message
 */
const validateAllergens = (allergens) => {
    // Allergens are optional
    if (allergens === null || allergens === undefined || allergens === '') {
        return { isValid: true };
    }

    // Parse JSON string if needed
    let allergenArray;
    if (typeof allergens === 'string') {
        try {
            allergenArray = JSON.parse(allergens);
        } catch (error) {
            return {
                isValid: false,
                error: 'Allergens must be a valid JSON array'
            };
        }
    } else {
        allergenArray = allergens;
    }

    // Validate array
    if (!Array.isArray(allergenArray)) {
        return {
            isValid: false,
            error: 'Allergens must be an array'
        };
    }

    // Check if all values are valid allergens
    const invalidAllergens = allergenArray.filter(
        allergen => !Object.values(Allergen).includes(allergen)
    );

    if (invalidAllergens.length > 0) {
        return {
            isValid: false,
            error: `Invalid allergens: ${invalidAllergens.join(', ')}. Valid options are: ${Object.values(Allergen).join(', ')}`
        };
    }

    return { isValid: true };
};

/**
 * Validates an entire menu item
 * @param {Object} menuItem - The menu item to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
const validateMenuItem = (menuItem) => {
    const errors = [];

    // Validate required fields
    const nameValidation = validateName(menuItem.name);
    if (!nameValidation.isValid) errors.push(nameValidation.error);

    const descriptionValidation = validateDescription(menuItem.description);
    if (!descriptionValidation.isValid) errors.push(descriptionValidation.error);

    const priceValidation = validatePrice(menuItem.price);
    if (!priceValidation.isValid) errors.push(priceValidation.error);

    const typeValidation = validateType(menuItem.type);
    if (!typeValidation.isValid) errors.push(typeValidation.error);

    // Validate optional fields
    const caloriesValidation = validateCalories(menuItem.calories);
    if (!caloriesValidation.isValid) errors.push(caloriesValidation.error);

    const avgWaitTimeValidation = validateAvgWaitTime(menuItem.avgWaitTime);
    if (!avgWaitTimeValidation.isValid) errors.push(avgWaitTimeValidation.error);

    const allergensValidation = validateAllergens(menuItem.allergens);
    if (!allergensValidation.isValid) errors.push(allergensValidation.error);

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateName,
    validateDescription,
    validatePrice,
    validateType,
    validateCalories,
    validateAvgWaitTime,
    validateAllergens,
    validateMenuItem
};