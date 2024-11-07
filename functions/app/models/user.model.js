/**
 * Enum for user privileges.
 * @readonly
 * @enum {string}
 */
const Privileges = Object.freeze({
  CUSTOMER: 'customer',
  OWNER: 'owner',
  EMPLOYEE: 'employee'
});

/**
 * Represents a User.
 * @class
 */
class User {
  /**
   * Creates an instance of User.
   * @param {string} uid - The unique identifier for the user.
   * @param {string} firstName - The first name of the user.
   * @param {string} lastName - The last name of the user.
   * @param {string} email - The email address of the user.
   * @param {string} phoneNumber - The phone number of the user.
   * @param {Privileges} privileges - The privileges of the user.
   */
  constructor(uid, firstName, lastName, email, phoneNumber, privileges) {
    /** @type {string} */
    this.uid = uid;
    /** @type {string} */
    this.firstName = firstName;
    /** @type {string} */
    this.lastName = lastName;
    /** @type {string} */
    this.email = email;
    /** @type {string} */
    this.phoneNumber = phoneNumber;
    /** @type {Privileges} */
    this.privileges = privileges;
  }

  /**
   * Converts the User instance to a Firestore-compatible object.
   * @returns {Object} The Firestore-compatible object.
   */
  toFirestore() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      privileges: this.privileges
    };
  }

  /**
   * Creates a User instance from a Firestore snapshot.
   * @param {Object} snapshot - The Firestore snapshot.
   * @returns {User} The User instance.
   */
  static fromFirestore(snapshot) {
    const data = snapshot.data();
    return new User(
      snapshot.id,
      data.firstName,
      data.lastName,
      data.email,
      data.phoneNumber,
      data.privileges
    );
  }
}

module.exports = { User, Privileges };