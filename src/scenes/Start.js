export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
    }

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x121925);
        this.add.text(640, 160, 'GRAVITY HATES ME', {
            fontFamily: 'monospace', fontSize: '64px', color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(640, 320, 'Press 2 to play Level 2', {
            fontFamily: 'monospace', fontSize: '34px', color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(640, 385, 'Press 1 to play Level 1', {
            fontFamily: 'monospace', fontSize: '23px', color: '#b3c4cf'
        }).setOrigin(0.5);
        this.add.text(640, 475, 'Move: A / D or Left / Right    Jump: W / Up / Space', {
            fontFamily: 'monospace', fontSize: '23px', color: '#ffffff'
        }).setOrigin(0.5);
        this.input.keyboard.on('keydown-TWO', () => this.scene.start('Level2'));
        this.input.keyboard.on('keydown-NUMPAD_TWO', () => this.scene.start('Level2'));
    }
}
