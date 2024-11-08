const axios = require("axios");
const { Reservation } = require("../models/reservation.model");
const { User } = require("../models/user.model");
const functions = require('firebase-functions');

class EmailService {
  // Function to send an email
  static async sendReservationConfirmationEmailStatusPending(reservation, user) {
    if (!(reservation instanceof Reservation)) {
      console.error("Invalid reservation object");
    }

    if (!(user instanceof User)) {
      console.error("Invalid user object");
    }
    
    const data = {
      from: {
        email: "MS_Ib5H7R@trial-yzkq34058q0gd796.mlsender.net"
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
      template_id: "0r83ql3km9v4zw1j",
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
            "Authorization": `Bearer ${functions.config().rms.mailersend_api_key}`
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

  static async sendReservationConfirmationEmailStatusConfirmed(reservation, user) {
    if (!(reservation instanceof Reservation)) {
      console.error("Invalid reservation object");
    }

    if (!(user instanceof User)) {
      console.error("Invalid user object");
    }
    
    const data = {
      from: {
        email: "MS_Ib5H7R@trial-yzkq34058q0gd796.mlsender.net"
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
      template_id: "jy7zpl9q3j045vx6",
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
            "Authorization": `Bearer ${functions.config().rms.mailersend_api_key}`
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

  static async sendReservationConfirmationEmailStatusCancelled(reservation, user) {
    if (!(reservation instanceof Reservation)) {
      console.error("Invalid reservation object");
    }

    if (!(user instanceof User)) {
      console.error("Invalid user object");
    }
    
    const data = {
      from: {
        email: "MS_Ib5H7R@trial-yzkq34058q0gd796.mlsender.net"
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
      template_id: "o65qngk5vxogwr12",
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
            "Authorization": `Bearer ${functions.config().rms.mailersend_api_key}`
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