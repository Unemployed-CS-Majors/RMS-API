
class Email {
  constructor(email) {
    this.email = email;
  }

  toFirestore() {
    return {
      email: this.email
    };
  }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Email(data.email);
    }
}

module.exports = {Email};