export class Controls extends Phaser.Scene {
    constructor(scene) {

        this.scene = scene;

        this.arrowKeys = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('W,A,S,D');
    }

    getLeft() {
        return this.cursors.left.isDown || this.wasd.A.isDown;
    }

    getRight() {
        return this.cursors.right.isDown || this.wasd.D.isDown;
    }

    getUp() {
        return this.cursors.up.isDown || this.wasd.W.isDown;
    }

    getDown() {
        return this.cursors.down.isDown || this.wasd.S.isDown;
    }

    getJump() {
        return this.cursors.up.space.isDown;
    }
// How to use inside a scene:
// create() { this.controls = new Controls(this); }
// update() { if (this.controls.getLeft()) { player.moveLeft(); } }
}