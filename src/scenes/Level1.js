import { Controls } from './Controls.js';
export class Level1 extends Phaser.Scene {

    constructor() {
        super('Level1');
    }

    preload() {
        this.load.tilemapTiledJSON('level1map', 'assets/level1/level1map.tmj');
        this.load.image('level1tiles', 'assets/level1/monochrome_tilemap.png');
        this.load.spritesheet('level1sprites', 'assets/level1/monochrome_tilemap.png', {
            frameWidth: 16, frameHeight: 16
        });

        // this.load.audio('jumpSFX', 'assets/level2/jump.wav');
        // this.load.audio('coinSFX', 'assets/level2/coin.wav');
        // this.load.audio('hazardSFX', 'assets/level2/hazard.wav');
    }

    create() {
        this.map = this.make.tilemap({key: 'level1map'});
        const tileset = this.map.addTilesetImage('monochrome_tilemap', 'level1tiles');
        this.map.createLayer('background', tileset).setDepth(0);
        this.ground = this.map.createLayer('terrain', tileset).setDepth(1);
        this.platforms = this.map.createLayer('platforms', tileset).setDepth(2);
        this.ladders = this.map.createLayer('ladders', tileset).setDepth(3);
        this.map.createLayer('decorations', tileset).setDepth(4);
        this.map.createLayer('player', tileset).setVisible(false);
        this.ground.setCollisionByExclusion([-1]);
        this.platforms.setCollisionByExclusion([-1]);
        this.ladders.setCollisionByExclusion([-1]);

        const playerTile = this.map.findByIndex(240, 0, false, 'player');
        if (!playerTile) {
            throw new Error('Level 1 player tile is missing from the player layer.');
        }
        this.startX = playerTile.pixelX + 8;
        this.startY = playerTile.pixelY + 8;
        this.player = this.physics.add.sprite(this.startX, this.startY, 'level1sprites', playerTile.index - 1);
        this.player.setDepth(10);
        this.player.body.setSize(12, 14).setOffset(2, 2);
        this.player.setGravityY(550);
        this.player.setMaxVelocity(140, 550);
        this.player.setDragX(2500);
        this.player.setCollideWorldBounds(true);
        this.player.setData('health', 1);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platforms, null, (player, tile) => {
            return player.body.velocity.y >= 0 && player.body.prev.y + player.body.height <= tile.getTop() + 5;
        });

        this.jumpHeld = false;
        this.jumpVelocity = Math.sqrt(2 * 850 * 64);
        this.controls = new Controls(this);
        this.last_time = 0;

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(3.2);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
        this.cameras.main.setBackgroundColor('#121925');
        this.uiCamera = this.cameras.add(0, 0, 1280, 720);
        this.uiCamera.ignore(this.children.list.slice());
    }

    update(time) {
        const wantsJump = this.controls.getJump();
        if (this.controls.getLeft() && !this.controls.getRight()) 
        {
            this.player.setAccelerationX(-1850);
        } else if (this.controls.getRight() && !this.controls.getLeft()) 
        {
            this.player.setAccelerationX(1850);
        } else 
        {
            this.player.setAccelerationX(0);
        }


        if (wantsJump && !this.jumpHeld && this.player.body.blocked.down) 
        {
            this.player.setVelocityY(-this.jumpVelocity);
            this.jumpParticles.emitParticleAt(this.player.x, this.player.body.bottom, 8);
            // this.sound.play('jumpSFX', {volume: 0.4});
        }
        this.jumpHeld = wantsJump;
    }
    
}
