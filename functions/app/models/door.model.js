class Door {
    constructor(id, x, y, width, height, rotation) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }

    toFirestore() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rotation: this.rotation
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Door(
            snapshot.id,
            data.x,
            data.y,
            data.width,
            data.height,
            data.rotation
        );
    }
}

module.exports = {Door};