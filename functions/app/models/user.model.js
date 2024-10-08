class User {
    constructor(uid, firstName, lastName, email, phoneNumber) {
      this.uid = uid;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.phoneNumber = phoneNumber;
    }
  
    toFirestore() {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
      };
    }
  
    static fromFirestore(snapshot) {
      const data = snapshot.data();
      return new User(snapshot.id, data.firstName, data.lastName, data.email, data.phoneNumber);
    }
  }
  
  module.exports = User;