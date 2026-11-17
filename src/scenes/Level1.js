import { Controls } from './Controls.js';
export class Level1 extends Phaser.Scene {

    constructor() {
        super('Level1');
    }

    init(data) {
        this.completed = false;
        this.restarting = false;
        this.coinsCollected = 0;
    }

    preload() {
        this.load.tilemapTiledJSON('level1map', 'assets/level1/level1map.tmj');
        this.load.image('level1tiles', 'assets/level1/monochrome_tilemap_transparent_packed.png');
        this.load.spritesheet('level1sprites', 'assets/level1/monochrome_tilemap_transparent_packed.png', {
            frameWidth: 16, frameHeight: 16
        });

        this.load.audio('jumpSFX', 'assets/level1/jump.wav');
        this.load.audio('coinSFX', 'assets/level1/coin.wav');
    }

    create() {
        this.map = this.make.tilemap({key: 'level1map'});
        const tileset = this.map.addTilesetImage('Kenney_1bit_platformer_transparent_packed', 'level1tiles');
        this.map.createLayer('background', tileset).setDepth(0);
        this.ground = this.map.createLayer('terrain', tileset).setDepth(1);
        this.platforms = this.map.createLayer('platforms', tileset).setDepth(2);
        this.ladders = this.physics.add.staticGroup();
        this.map.createLayer('decorations', tileset).setDepth(4);
        this.map.createLayer('player', tileset).setVisible(false);
        this.ground.setCollisionByExclusion([-1]);
        this.platforms.setCollisionByExclusion([-1]);

        const playerTile = this.map.findByIndex(241, 0, false, 'player');
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
        this.player.acceleration = 1850;
        this.player.climbSpeed = 150;
        this.player.isClimbing = false;
        this.player.onLadder = false;

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platforms, null, (player, tile) => {
            return player.body.velocity.y >= 0 && player.body.prev.y + player.body.height <= tile.getTop() + 5;
        });

        this.physics.add.overlap(this.player, this.ladders, () => {this.player.onLadder = true;}, null, this);
        this.jumpHeld = false;
        this.jumpVelocity = Math.sqrt(2 * 850 * 64);
        this.controls = new Controls(this);
        this.last_time = 0;


        const ladderTiles = this.map.getObjectLayer('ladders').objects;
        for (const ladderTile of ladderTiles) {
            const ladder = this.ladders.create(ladderTile.x + 8, ladderTile.y - 8, 'level1sprites', ladderTile.gid - 1);
            ladder.setSize(ladderTile.width, ladderTile.height);
            ladder.setDepth(3);
        }

        this.coins = this.physics.add.staticGroup();
        const coinLayer = this.map.getObjectLayer('collectibles');
        for (const item of coinLayer.objects) {
            const coin = this.coins.create(item.x + 8, item.y - 8, 'level1sprites', item.gid - 1);
            coin.setDepth(7);
            coin.refreshBody();
        }
        this.totalCoins = coinLayer.objects.length;
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        
        this.jumpParticles = this.add.particles(0, 0, 'level1sprites', {
            frame: 0, speed: {min: 20, max: 65}, lifespan: 270,
            scale: {start: 0.65, end: 0}, gravityY: 100, emitting: false
        }).setDepth(12);
        this.coinParticles = this.add.particles(0, 0, 'level1sprites', {
            frame: 2, speed: {min: 35, max: 110}, lifespan: 350,
            scale: {start: 0.85, end: 0}, gravityY: 70, emitting: false
        }).setDepth(12);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(3.2);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
        this.cameras.main.setBackgroundColor('#121925');
        this.uiCamera = this.cameras.add(0, 0, 1280, 720);
        this.uiCamera.ignore(this.children.list.slice());

        this.coinDisplay = this.add.text(28, 25, `Coins: 0 / ${this.totalCoins}`, {
            fontFamily: 'monospace', fontSize: '32px', color: '#ffffff',
            stroke: '#121925', strokeThickness: 5
        }).setScrollFactor(0).setDepth(100);
        this.cameras.main.ignore(this.coinDisplay);
        this.helpDisplay = this.add.text(760, 30, 'R: Restart    M: Menu', {
            fontFamily: 'monospace', fontSize: '22px', color: '#ffffff',
            stroke: '#121925', strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);
        this.cameras.main.ignore(this.helpDisplay);
        this.input.keyboard.on('keydown-R', () => this.scene.restart());
        this.input.keyboard.on('keydown-M', () => this.scene.start('Start'));
    }

    collectCoin(player, coin) {
        if (!coin.active || this.completed || this.restarting) {
            return;
        }
        this.coinsCollected++;
        this.coinDisplay.setText(`Coins: ${this.coinsCollected} / ${this.totalCoins}`);
        this.coinParticles.emitParticleAt(coin.x, coin.y, 10);
        this.sound.play('coinSFX', {volume: 0.45});
        coin.disableBody(true, true);
    }

    update() {
        const wantsJump = this.controls.getJump();
        if (this.controls.getLeft() && !this.controls.getRight()) 
        {
            this.player.setAccelerationX(-this.player.acceleration);
        } else if (this.controls.getRight() && !this.controls.getLeft()) 
        {
            this.player.setAccelerationX(this.player.acceleration);
        } else 
        {
            this.player.setAccelerationX(0);
        }
        
        if (this.player.onLadder && (this.controls.getUp() || this.controls.getDown()))
        {
            this.player.isClimbing = true;
        } else {
            this.player.isClimbing = false;
            this.player.body.setAllowGravity(true);
        }

        if (this.player.isClimbing)
        {
            this.player.body.setAllowGravity(false);
            if (this.controls.getUp()) 
            {
                this.player.setVelocityY(-this.player.climbSpeed);
            } else if (this.controls.getDown()) 
            {
                this.player.setVelocityY(this.player.climbSpeed);
            } else {
                this.player.setVelocityY(0);
            }
        } else {
            this.player.body.setAllowGravity(true);
            this.player.isClimbing = false;
        }

        if (wantsJump && !this.jumpHeld && this.player.body.blocked.down) 
        {
            this.player.setVelocityY(-this.jumpVelocity);
            this.jumpParticles.emitParticleAt(this.player.x, this.player.body.bottom, 8);
            this.sound.play('jumpSFX', {volume: 0.4});
        }
        this.jumpHeld = wantsJump;
        this.player.onLadder = false;
    }

    completeLevel() {
        if (this.completed || this.restarting) {
            return;
        }
        this.completed = true;
        this.player.setAcceleration(0, 0);
        this.player.setVelocity(0, 0);
        this.physics.pause();
        const overlay = this.add.rectangle(640, 360, 1280, 720, 0x121925, 0.92)
            .setScrollFactor(0).setDepth(150);
        this.cameras.main.ignore(overlay);
        const heading = this.add.text(640, 230, 'LEVEL 1 COMPLETE!', {
            fontFamily: 'monospace', fontSize: '62px', color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(151);
        this.cameras.main.ignore(heading);
        const result = this.add.text(640, 345, `Coins collected: ${this.coinsCollected} / ${this.totalCoins}`, {
            fontFamily: 'monospace', fontSize: '40px', color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(151);
        this.cameras.main.ignore(result);
        const options = this.add.text(640, 475, 'Press R to replay or M for menu', {
            fontFamily: 'monospace', fontSize: '28px', color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(151);
        this.cameras.main.ignore(options);
    }
}
