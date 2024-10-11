const Privileges = Object.freeze({
  CUSTOMER: 'customer',
  OWNER: 'owner',
  EMPLOYEE: 'employee'
});

class User {
  constructor(uid, firstName, lastName, email, phoneNumber, privileges) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.privileges = privileges;
  }

  toFirestore() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      privileges: this.privileges
    };
  }

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