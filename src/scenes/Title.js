export class Title extends Phaser.Scene {

    constructor() {
        super('Title');
    }

    create() {
        const x = 490;
        const y = 300;

        this.add.rectangle(640, 360, 1280, 720, 0x121925);
        this.add.text(640, 160, 'GRAVITY HATES ME', {
            fontFamily: 'monospace', fontSize: '64px', color: '#ffffff'
        }).setOrigin(0.5);

        const startButton = this.add.text(640, 350, 'Start Game', 
        {
            fontFamily: 'monospace', 
            fontSize: '48px', 
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#544f4f9f'
        }).setOrigin(0.5).setInteractive();
        const startBorder = this.add.rectangle(
            startButton.x, 
            startButton.y, 
            startButton.width + 20, 
            startButton.height + 20, 
            0x858383, 
            0.5
        );
       

        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#bebebe9f' });
        });
        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#544f4f9f' });
        });
        startButton.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }

    
}
