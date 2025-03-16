class Map {
    constructor(mapUrl) {
        this.mapUrl = mapUrl;
    }

    toFirestore() {
        return {
            mapUrl: this.mapUrl
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Map(data.mapUrl);
    }
}

module.exports = {Map};