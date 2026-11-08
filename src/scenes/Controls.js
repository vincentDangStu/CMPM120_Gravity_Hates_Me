export class Controls {
    constructor(scene) {

        this.scene = scene;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,A,S,D,SPACE');
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
        return this.cursors.space.isDown || this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown;
    }
// How to use inside a scene:
// create() { this.controls = new Controls(this); }
// update() { if (this.controls.getLeft()) { player.moveLeft(); } }
}
