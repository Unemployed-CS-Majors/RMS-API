class PhoneNumber {
    constructor(phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    toFirestore() {
        return {
            phoneNumber: this.phoneNumber
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new PhoneNumber(data.phoneNumber);
    }
}

module.exports = {PhoneNumber};