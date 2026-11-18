import { Controls } from './Controls.js';

export class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    init(data) {
        this.showRespawn = !!(data && data.showRespawn);
        this.completed = false;
        this.restarting = false;
        this.coinsCollected = 0;
    }

    preload() {
        this.load.tilemapTiledJSON('level2map', 'assets/level2/Level2_25x100.tmj');
        this.load.image('level2tiles', 'assets/level2/monochrome_tilemap_transparent_packed.png');
        this.load.spritesheet('level2sprites', 'assets/level2/monochrome_tilemap_transparent_packed.png', {
            frameWidth: 16, frameHeight: 16
        });
        this.load.audio('level2jump', 'assets/level2/jump.wav');
        this.load.audio('level2coin', 'assets/level2/coin.wav');
        this.load.audio('level2hazard', 'assets/level2/hazard.wav');
    }

    create() {
        this.map = this.make.tilemap({key: 'level2map'});
        const tileset = this.map.addTilesetImage('Kenney_1bit_platformer_transparent_packed', 'level2tiles');
        this.map.createLayer('BackgroundDetails', tileset).setDepth(0);
        this.ground = this.map.createLayer('SolidGround', tileset).setDepth(1);
        this.platforms = this.map.createLayer('OneWayPlatforms', tileset).setDepth(2);
        this.hazards = this.map.createLayer('Hazards', tileset).setDepth(3);
        this.map.createLayer('ForegroundDetails', tileset).setDepth(4);
        this.map.createLayer('player', tileset).setVisible(false);
        this.ground.setCollisionByExclusion([-1]);
        this.platforms.setCollisionByExclusion([-1]);
        this.hazards.setCollisionByExclusion([-1]);

        const playerTile = this.map.findByIndex(241, 0, false, 'player');
        if (!playerTile) {
            throw new Error('Level 2 player tile is missing from the player layer.');
        }
        this.startX = playerTile.pixelX + 8;
        this.startY = playerTile.pixelY + 8;
        this.player = this.physics.add.sprite(this.startX, this.startY, 'level2sprites', playerTile.index - 1);
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
        this.physics.add.overlap(this.player, this.hazards, this.restartFromHazard, (player, tile) => tile.index !== -1, this);
        this.controls = new Controls(this);
        this.jumpHeld = false;
        this.jumpVelocity = Math.sqrt(2 * 850 * 64);

        this.coins = this.physics.add.staticGroup();
        const coinLayer = this.map.getObjectLayer('Collectibles');
        for (const item of coinLayer.objects) {
            const coin = this.coins.create(item.x + 8, item.y - 8, 'level2sprites', item.gid - 1);
            coin.setDepth(7);
            coin.refreshBody();
        }
        this.totalCoins = coinLayer.objects.length;
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        const exitObject = this.map.getObjectLayer('LevelExit').objects[0];
        this.exitZone = this.add.zone(exitObject.x + exitObject.width / 2,
            exitObject.y + exitObject.height / 2, exitObject.width, exitObject.height);
        this.physics.add.existing(this.exitZone, true);
        this.physics.add.overlap(this.player, this.exitZone, this.completeLevel, null, this);

        this.jumpParticles = this.add.particles(0, 0, 'level2sprites', {
            frame: 0, speed: {min: 20, max: 65}, lifespan: 270,
            scale: {start: 0.65, end: 0}, gravityY: 100, emitting: false
        }).setDepth(12);
        this.coinParticles = this.add.particles(0, 0, 'level2sprites', {
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

        if (this.showRespawn) {
            const message = this.add.text(640, 120, 'Hazard! Returned to Level 2 start.', {
                fontFamily: 'monospace', fontSize: '32px', color: '#ffcbcb',
                stroke: '#121925', strokeThickness: 6
            }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
            this.cameras.main.ignore(message);
            this.time.delayedCall(2000, () => message.destroy());
        }
    }

    update() {
        if (this.completed || this.restarting) {
            return;
        }
        if (this.controls.getLeft() && !this.controls.getRight()) {
            this.player.setAccelerationX(-1850);
        } else if (this.controls.getRight() && !this.controls.getLeft()) {
            this.player.setAccelerationX(1850);
        } else {
            this.player.setAccelerationX(0);
        }
        const wantsJump = this.controls.getJump();
        if (wantsJump && !this.jumpHeld && this.player.body.blocked.down) {
            this.player.setVelocityY(-this.jumpVelocity);
            this.jumpParticles.emitParticleAt(this.player.x, this.player.body.bottom, 8);
            this.sound.play('level2jump', {volume: 0.4});
        }
        this.jumpHeld = wantsJump;
    }

    collectCoin(player, coin) {
        if (!coin.active || this.completed || this.restarting) {
            return;
        }
        this.coinsCollected++;
        this.coinDisplay.setText(`Coins: ${this.coinsCollected} / ${this.totalCoins}`);
        this.coinParticles.emitParticleAt(coin.x, coin.y, 10);
        this.sound.play('level2coin', {volume: 0.45});
        coin.disableBody(true, true);
    }

    restartFromHazard() {
        if (this.completed || this.restarting) {
            return;
        }
        this.restarting = true;
        this.sound.play('level2hazard', {volume: 0.45});
        this.scene.restart({showRespawn: true});
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
        const heading = this.add.text(640, 230, 'LEVEL 2 COMPLETE!', {
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
