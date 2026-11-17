export class Controls {
    constructor(scene) {

        this.scene = scene;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('W,A,S,D');
    }

    getLeft() {
        return this.cursors.left.isDown || this.wasdKeys.A.isDown;
    }

    getRight() {
        return this.cursors.right.isDown || this.wasdKeys.D.isDown;
    }

    getUp() {
        return this.cursors.up.isDown || this.wasdKeys.W.isDown;
    }

    getDown() {
        return this.cursors.down.isDown || this.wasdKeys.S.isDown;
    }

    getJump() {
        return this.cursors.space.isDown;
    }
// How to use inside a scene:
// create() { this.controls = new Controls(this); }
// update() { if (this.controls.getLeft()) { player.moveLeft(); } }
}