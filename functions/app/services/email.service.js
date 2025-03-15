const axios = require("axios");
const {Reservation} = require("../models/reservation.model");
const {User} = require("../models/user.model");
const {logger} = require("../logger/FirebaseLogger");
const {Order} = require("../models/order.model");

require('dotenv').config();

const MAILJET_PUBLIC_KEY = process.env.MAILJET_PUBLIC_KEY;
const MAILJET_PRIVATE_KEY = process.env.MAILJET_PRIVATE_KEY;

if (!MAILJET_PUBLIC_KEY || !MAILJET_PRIVATE_KEY) {
    logger.error("Mailjet API keys are missing. Please set MAILJET_PUBLIC_KEY and MAILJET_PRIVATE_KEY environment variables.");
}

const mailjet = MAILJET_PUBLIC_KEY && MAILJET_PRIVATE_KEY ?
    require('node-mailjet').apiConnect(MAILJET_PUBLIC_KEY, MAILJET_PRIVATE_KEY) :
    null;

// Template IDs
const TEMPLATES = {
    RESERVATION_PENDING: 6807058,
    RESERVATION_CONFIRMED: 6808232,
    RESERVATION_CANCELLED: 6808215,
    VERIFY_EMAIL: 6808358,
    RESET_PASSWORD: 6808278,
    ORDER_PLACED: 6808290,
    PAYMENT_RECEIVED: 6808321,
    ORDER_PREPARING: 6808329,
    ORDER_ON_WAY: 6808342,
    ORDER_PICKUP_READY: 6808342, // Note: Same template as ORDER_ON_WAY
};

// Email constants
const FROM_EMAIL = "noreply@bushive.app";
const FROM_NAME = "RMS";
const DEFAULT_RESTAURANT_NAME = "RMS";

class EmailService {
    /**
     * Validates required objects before sending email
     * @param {User} user - The user object
     * @param {Object} additionalObj - Another object to validate (Reservation or Order)
     * @param {String} additionalObjType - Type of the additional object ('Reservation' or 'Order')
     * @private
     */
    static _validateObjects(user, additionalObj = null, additionalObjType = null) {
        if (!(user instanceof User)) {
            throw new Error("Invalid user object");
        }

        if (additionalObj) {
            const expectedClass = additionalObjType === 'Reservation' ? Reservation : Order;
            if (!(additionalObj instanceof expectedClass)) {
                throw new Error(`Invalid ${additionalObjType.toLowerCase()} object`);
            }
        }
    }

    /**
     * Common method to send emails using Mailjet
     * @param {User} user - The user object
     * @param {Number} templateId - Template ID to use
     * @param {String} subject - Email subject
     * @param {Object} variables - Template variables
     * @returns {Promise<Object>} Mailjet API response
     * @private
     */
    static async _sendEmail(user, templateId, subject, variables) {
        if (!mailjet) {
            logger.error("Mailjet is not configured properly");
            throw new Error("Email service is not configured");
        }

        try {
            const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages": [
                        {
                            "From": {
                                "Email": FROM_EMAIL,
                                "Name": FROM_NAME
                            },
                            "To": [
                                {
                                    "Email": user.email,
                                    "Name": user.firstName
                                }
                            ],
                            "TemplateID": templateId,
                            "TemplateLanguage": true,
                            "Subject": subject,
                            "Variables": variables
                        }
                    ]
                });

            return request
                .then((result) => {
                    logger.info("Email sent successfully:", result.body);
                    return result;
                })
                .catch((err) => {
                    logger.error("Error sending email:", err);
                    throw err;
                });
        } catch (error) {
            logger.error("Error sending email:", error);
            throw error;
        }
    }

    /**
     * Creates reservation email variables
     * @param {Reservation} reservation - The reservation object
     * @param {User} user - The user object
     * @returns {Object} Template variables
     * @private
     */
    static _createReservationVariables(reservation, user) {
        return {
            contact_phone: user.phoneNumber,
            contact_email: user.email,
            manage_url: "undefined", // TODO: Add proper URL
            reservation_status: reservation.status,
            reservation_id: reservation.id,
            table: reservation.tableId,
            location: "Galway", // TODO: Add proper location
            start_time: reservation.startTime.toTimeString(),
            start_date: reservation.startTime.toDateString(),
            name: user.firstName,
            restaurant_name: DEFAULT_RESTAURANT_NAME
        };
    }

    /**
     * Sends a reservation confirmation email with specified status
     * @param {Reservation} reservation - The reservation object
     * @param {User} user - The user object
     * @param {String} status - Reservation status ('pending', 'confirmed', 'cancelled')
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendReservationEmail(reservation, user, status) {
        this._validateObjects(user, reservation, 'Reservation');

        const templateMap = {
            'pending': {
                templateId: TEMPLATES.RESERVATION_PENDING,
                subject: "Your reservation was confirmed"
            },
            'confirmed': {
                templateId: TEMPLATES.RESERVATION_CONFIRMED,
                subject: "Your reservation is confirmed"
            },
            'cancelled': {
                templateId: TEMPLATES.RESERVATION_CANCELLED,
                subject: "Your reservation has been cancelled"
            }
        };

        if (!templateMap[status]) {
            throw new Error(`Invalid reservation status: ${status}`);
        }

        const { templateId, subject } = templateMap[status];
        const variables = this._createReservationVariables(reservation, user);

        return this._sendEmail(user, templateId, subject, variables);
    }

    /**
     * Sends a verification email
     * @param {User} user - The user object
     * @param {String} verificationLink - Link for email verification
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendVerificationEmail(user, verificationLink) {
        this._validateObjects(user);

        const variables = {
            email: user.email,
            website_url: "rms.ie", // TODO: Add proper URL
            contact_email: "rms@rms.ie",
            verification_link: verificationLink,
            name: user.firstName,
            restaurant_name: DEFAULT_RESTAURANT_NAME
        };

        return this._sendEmail(
            user,
            TEMPLATES.VERIFY_EMAIL,
            "Verify Your email address",
            variables
        );
    }

    /**
     * Sends a password reset email
     * @param {User} user - The user object
     * @param {String} resetLink - Link for password reset
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendPasswordResetEmail(user, resetLink) {
        this._validateObjects(user);

        const variables = {
            email: user.email,
            website_url: "", // TODO: Add website URL
            contact_email: "undefined", // TODO: Add contact email
            reset_link: resetLink,
            name: user.firstName,
            restaurant_name: DEFAULT_RESTAURANT_NAME
        };

        return this._sendEmail(
            user,
            TEMPLATES.RESET_PASSWORD,
            "Password Reset Request",
            variables
        );
    }

    /**
     * Creates order email common variables
     * @param {User} user - The user object
     * @param {Order} order - The order object
     * @returns {Object} Common template variables for order emails
     * @private
     */
    static _createOrderBaseVariables(user, order) {
        return {
            contact_phone: "+353 123456789", // TODO: Add contact phone
            contact_email: "test@test.pl", // TODO: Add contact email
            track_order_url: "https://google.com", // TODO: Add track order URL
            delivery_time: (new Date(order?.estimatedDeliveryTime || 0))?.toTimeString() || "N/A"  ,
            order_id: order?.id || "N/A",
            name: user?.firstName|| "N/A",
            restaurant_name: DEFAULT_RESTAURANT_NAME
        };
    }

    /**
     * Sends an order placed confirmation email
     * @param {User} user - The user object
     * @param {Order} order - The order object
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendOrderPlacedEmail(user, order) {
        this._validateObjects(user, order, 'Order');

        const variables = {
            ...this._createOrderBaseVariables(user, order),
            delivery_method_formatted: (order?.deliveryMethod || "N/A").replace("_", " "),
            country: order?.deliveryAddress?.country || "N/A",
            eircode: order?.deliveryAddress?.eircode || "N/A",
            county: order?.deliveryAddress?.county || "N/A",
            city: order?.deliveryAddress?.city || "N/A",
            street: order?.deliveryAddress?.street || "N/A",
            total: order?.total || "N/A",
            delivery_fee: order?.deliveryFee || "N/A",
            tax: order?.tax || "N/A",
            subtotal: order?.subtotal || "N/A",
            order_items: order?.items || "",
            order_date: (new Date(order?.createdAt || 0)).toDateString(),
            delivery_method: order?.deliveryMethod || "N/A",
        };

        return this._sendEmail(
            user,
            TEMPLATES.ORDER_PLACED,
            "Order confirmation",
            variables
        );
    }

    /**
     * Sends payment received confirmation email
     * @param {User} user - The user object
     * @param {Order} order - The order object
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendOrderPaymentReceivedEmail(user, order) {
        this._validateObjects(user, order, 'Order');

        const variables = {
            ...this._createOrderBaseVariables(user, order),
            payment_method: order.paymentMethod,
            total: order.total,
            order_date: order.date.toDateString()
        };

        return this._sendEmail(
            user,
            TEMPLATES.PAYMENT_RECEIVED,
            "We have received your payment",
            variables
        );
    }

    /**
     * Sends order being prepared email
     * @param {User} user - The user object
     * @param {Order} order - The order object
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendOrderBeingPreparedEmail(user, order) {
        this._validateObjects(user, order, 'Order');

        const variables = {
            ...this._createOrderBaseVariables(user, order),
            next_status_description: "ready for delivery",
            items_summary: "undefined" // TODO: Generate summary
        };

        return this._sendEmail(
            user,
            TEMPLATES.ORDER_PREPARING,
            "Your order is being prepared",
            variables
        );
    }

    /**
     * Sends order on the way email
     * @param {User} user - The user object
     * @param {Order} order - The order object
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendOrderIsOnTheWayEmail(user, order) {
        this._validateObjects(user, order, 'Order');

        const variables = {
            ...this._createOrderBaseVariables(user, order),
            customer_phone: user.phoneNumber,
            country: order.deliveryAddress.country,
            eircode: order.deliveryAddress.eircode,
            county: order.deliveryAddress.county,
            city: order.deliveryAddress.city,
            street: order.deliveryAddress.street
        };

        return this._sendEmail(
            user,
            TEMPLATES.ORDER_ON_WAY,
            "Your order is on the way",
            variables
        );
    }

    /**
     * Sends order ready for pickup email
     * @param {User} user - The user object
     * @param {Order} order - The order object
     * @returns {Promise<Object>} The response data from the email service
     */
    static async sendOrderReadyForPickupEmail(user, order) {
        this._validateObjects(user, order, 'Order');

        const variables = {
            ...this._createOrderBaseVariables(user, order),
            customer_phone: user.phoneNumber,
            eircode: order.deliveryAddress.eircode,
            county: order.deliveryAddress.county,
            city: order.deliveryAddress.city,
            street: order.deliveryAddress.street
        };

        return this._sendEmail(
            user,
            TEMPLATES.ORDER_PICKUP_READY,
            "Your order is ready for pickup",
            variables
        );
    }

    // Legacy methods for backward compatibility
    static async sendReservationConfirmationEmailStatusPending(reservation, user) {
        return this.sendReservationEmail(reservation, user, 'pending');
    }

    static async sendReservationConfirmationEmailStatusConfirmed(reservation, user) {
        return this.sendReservationEmail(reservation, user, 'confirmed');
    }

    static async sendReservationConfirmationEmailStatusCancelled(reservation, user) {
        return this.sendReservationEmail(reservation, user, 'cancelled');
    }
}

module.exports = EmailService;