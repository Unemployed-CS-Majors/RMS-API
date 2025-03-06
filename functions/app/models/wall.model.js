class Wall {
    constructor(id, x1, y1, x2, y2) {
        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    toFirestore() {
        return {
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Wall(
            snapshot.id,
            data.x1,
            data.y1,
            data.x2,
            data.y2
        );
    }
}

module.exports = {Wall};