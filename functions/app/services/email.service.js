const axios = require("axios");
const {Reservation} = require("../models/reservation.model");
const {User} = require("../models/user.model");
const functions = require('firebase-functions');

// Define template IDs as constants
const TEMPLATE_ID_PENDING = "351ndgwooon4zqx8";
const TEMPLATE_ID_CONFIRMED = "z3m5jgr111d4dpyo";
const TEMPLATE_ID_CANCELLED = "neqvygm555j40p7w";
class EmailService {
    /**
     * Sends a reservation confirmation email with status pending.
     * @param {Reservation} reservation - The reservation object.
     * @param {User} user - The user object.
     * @returns {Promise<Object>} The response data from the email service.
     * @throws Will throw an error if the email sending fails.
     */
    static async sendReservationConfirmationEmailStatusPending(reservation, user) {
        if (!(reservation instanceof Reservation)) {
            console.error("Invalid reservation object");
        }

        if (!(user instanceof User)) {
            console.error("Invalid user object");
        }

        const data = {
            from: {
                email: "MS_s542EN@trial-neqvygmp3k5g0p7w.mlsender.net"
            },
            to: [
                {
                    email: user.email
                }
            ],
            personalization: [
                {
                    email: user.email,
                    data: {
                        name: user.firstName,
                        table: reservation.tableId,
                        location: "Galway", // TODO: Add location
                        start_date: reservation.startTime.toDateString(),
                        start_time: reservation.startTime.toTimeString(),
                        restaurant_name: "RMS", // TODO: Add restaurant name
                        reservation_id: reservation.id,
                        reservation_status: reservation.status
                    }
                }
            ],
            template_id: TEMPLATE_ID_PENDING,
            subject: `Reservation ${reservation.id}`
        };

        try {
            const response = await axios.post(
                "https://api.mailersend.com/v1/email",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Authorization": `Bearer ${process.env.MAILER_SEND_API_KEY}`
                    }
                }
            );
            console.log("Email sent successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error sending email:", error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /**
     * Sends a reservation confirmation email with status confirmed.
     * @param {Reservation} reservation - The reservation object.
     * @param {User} user - The user object.
     * @returns {Promise<Object>} The response data from the email service.
     * @throws Will throw an error if the email sending fails.
     */
    static async sendReservationConfirmationEmailStatusConfirmed(reservation, user) {
        if (!(reservation instanceof Reservation)) {
            console.error("Invalid reservation object");
        }

        if (!(user instanceof User)) {
            console.error("Invalid user object");
        }

        const data = {
            from: {
                email: "MS_s542EN@trial-neqvygmp3k5g0p7w.mlsender.net"
            },
            to: [
                {
                    email: user.email
                }
            ],
            personalization: [
                {
                    email: user.email,
                    data: {
                        name: user.firstName,
                        table: reservation.tableId,
                        location: "Galway", // TODO: Add location
                        start_date: reservation.startTime.toDateString(),
                        start_time: reservation.startTime.toTimeString(),
                        restaurant_name: "RMS", // TODO: Add restaurant name
                        reservation_id: reservation.id,
                        reservation_status: reservation.status
                    }
                }
            ],
            template_id: TEMPLATE_ID_CONFIRMED,
            subject: `Reservation ${reservation.id}`
        };

        try {
            const response = await axios.post(
                "https://api.mailersend.com/v1/email",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Authorization": `Bearer ${process.env.MAILER_SEND_API_KEY}`
                    }
                }
            );
            console.log("Email sent successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error sending email:", error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /**
     * Sends a reservation confirmation email with status cancelled.
     * @param {Reservation} reservation - The reservation object.
     * @param {User} user - The user object.
     * @returns {Promise<Object>} The response data from the email service.
     * @throws Will throw an error if the email sending fails.
     */
    static async sendReservationConfirmationEmailStatusCancelled(reservation, user) {
        if (!(reservation instanceof Reservation)) {
            console.error("Invalid reservation object");
        }

        if (!(user instanceof User)) {
            console.error("Invalid user object");
        }

        const data = {
            from: {
                email: "MS_s542EN@trial-neqvygmp3k5g0p7w.mlsender.net"
            },
            to: [
                {
                    email: user.email
                }
            ],
            personalization: [
                {
                    email: user.email,
                    data: {
                        name: user.firstName,
                        table: reservation.tableId,
                        location: "Galway", // TODO: Add location
                        start_date: reservation.startTime.toDateString(),
                        start_time: reservation.startTime.toTimeString(),
                        restaurant_name: "RMS", // TODO: Add restaurant name
                        reservation_id: reservation.id,
                        reservation_status: reservation.status
                    }
                }
            ],
            template_id: TEMPLATE_ID_CANCELLED,
            subject: `Reservation ${reservation.id}`
        };

        try {
            const response = await axios.post(
                "https://api.mailersend.com/v1/email",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Authorization": `Bearer ${process.env.MAILER_SEND_API_KEY}`
                    }
                }
            );
            console.log("Email sent successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error sending email:", error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = EmailService;