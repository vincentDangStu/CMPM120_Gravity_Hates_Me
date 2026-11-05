import { Controls } from './Controls.js';
export class Level2 extends Phaser.Scene {

    constructor() {
        super('Level2');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');

    }

    create() {
        this.background = this.add.sprite(640, 320, 'background');
        this.controls = new Controls(this);
        this.last_time = 0;
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
        if (this.controls.getLeft()) 
        {
            this.player.x -= this.player.speed * dt;
        }
        if (this.controls.getRight())
        {
            this.player.x += this.player.speed * dt;
        }
        if (this.controls.getJump())
        {
            this.player.y -= this.player.jumpSpeed * dt;
        }
    }
    
}
