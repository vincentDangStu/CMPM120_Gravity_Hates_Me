import { Start } from './scenes/Start.js';
import { Level1 } from './scenes/Level1.js';
import { Level2 } from './scenes/Level2.js';

const config = {
    type: Phaser.AUTO,
    title: 'Gravity Hates Me',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#121925',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    pixelArt: true,
    scene: [
        Start, Level1, Level2
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
