class Address {
    constructor() {
        this.street = null;
        this.city = null;
        this.county = null;
        this.eircode = null;
        this.country = null;
    }

    toFirestore() {
        return {
            street: this.street,
            city: this.city,
            county: this.county,
            eircode: this.eircode,
            country: this.country
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        const address = new Address();
        address.street = data.street;
        address.city = data.city;
        address.county = data.county;
        address.eircode = data.eircode;
        address.country = data.country;
        return address;
    }
}

module.exports = {Address};