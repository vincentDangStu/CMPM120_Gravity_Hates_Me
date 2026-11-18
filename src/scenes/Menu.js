export class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');
    }

    create() {
        const x = 490;
        const y = 300;

        this.add.rectangle(640, 360, 1280, 720, 0x121925);
        this.add.text(640, 160, 'Level Selection', {
            fontFamily: 'monospace', fontSize: '64px', color: '#ffffff'
        }).setOrigin(0.5);

        const backButton = this.add.text(200, 50, 'Back to Title Screen', {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#544f4f9f'
        }).setOrigin(0.5).setInteractive();
        
        const backButtonBorder = this.add.rectangle(
            backButton.x,
            backButton.y,
            backButton.width + 20,
            backButton.height + 20,
            0x858383,
            0.5
        );

        const level1Button = this.add.text(0, 0, 'Level 1', 
        {
            fontFamily: 'monospace', 
            fontSize: '48px', 
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#544f4f9f'
        }).setOrigin(0.5).setInteractive();
        const level1Border = this.add.rectangle(
            level1Button.x, 
            level1Button.y, 
            level1Button.width + 20, 
            level1Button.height + 20, 
            0x858383, 
            0.5
        );
        const level2Button = this.add.text(300, 0, 'Level 2', 
        {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#544f4f9f'
        }).setOrigin(0.5).setInteractive();
        const level2Border = this.add.rectangle(
            level2Button.x, 
            level2Button.y, 
            level2Button.width + 20, 
            level2Button.height + 20, 
            0x858383, 
            0.5
        );
       
        const button = this.add.container(x, y, [level1Button, level1Border, level2Button, level2Border]);

        this.add.text(640, 420, 'Controls:', {
            fontFamily: 'monospace', fontSize: '32px', color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(640, 475, 'Move: A / D or Left / Right    Jump: Space', {
            fontFamily: 'monospace', fontSize: '23px', color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(640, 520, 'Interact/Climb: W / Up    Drop: S / Down', {
            fontFamily: 'monospace', fontSize: '23px', color: '#ffffff'
        }).setOrigin(0.5);

        backButton.on('pointerover', () => {
            backButton.setStyle({ backgroundColor: '#bebebe9f' });
        });
        backButton.on('pointerout', () => {
            backButton.setStyle({ backgroundColor: '#544f4f9f' });
        });
        backButton.on('pointerdown', () => {
            this.scene.start('Title');
        });

        level1Button.on('pointerover', () => {
            level1Button.setStyle({ backgroundColor: '#bebebe9f' });
        });
        level1Button.on('pointerout', () => {
            level1Button.setStyle({ backgroundColor: '#544f4f9f' });
        });
        level1Button.on('pointerdown', () => {
            this.scene.start('Level1');
        });

        level2Button.on('pointerover', () => {
            level2Button.setStyle({ backgroundColor: '#bebebe9f' });
        });
        level2Button.on('pointerout', () => {
            level2Button.setStyle({ backgroundColor: '#544f4f9f' });
        });
        level2Button.on('pointerdown', () => {
            this.scene.start('Level2');
        });
    }

    
}
