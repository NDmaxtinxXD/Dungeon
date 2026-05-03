import { GameMap } from '../map/Map.js';
import { Player } from '../Player/Player.js';
import { Menu } from '../Menu.js'; 
import { GameUI } from '../GameUI.js'; 
import { InputManager } from '../InputManager.js';
import { LevelBuilder } from '../LevelBuilder.js';
import { soundManager } from '../SoundManager.js'; 
import { GameTransition } from './GameTransition.js';
import { GameRenderer } from './GameRenderer.js';

export class GameEngine {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameState = 'START_MENU'; 

        this.map = new GameMap();
        this.player = new Player(0, 0);
        
        this.stones = [];
        this.buttons = [];
        this.ghosts = []; 
        this.boss = null; 
        
        this.currentRoomIndex = 0;
        this.isTransitioning = false; 
        this.shakeEndTime = 0;
        this.shakeIntensity = 0;

        this.menu = new Menu(canvas.width);
        this.uiText = new GameUI();
        this.input = new InputManager(this);

        this.transitionMgr = new GameTransition(this);
        this.renderer = new GameRenderer(this);
    }

    triggerShake(duration = 300, intensity = 8) {
        this.shakeEndTime = Date.now() + duration;
        this.shakeIntensity = intensity;
    }

    startGame() {
        this.gameState = 'PLAYING';
        soundManager.playMainBGM(); 
        this.loadRoom(0);
    }

    loadRoom(index) {
        LevelBuilder.load(index, this);
    }

    restartRoom() {
        this.transitionMgr.play("🔄 Đang nạp lại màn chơi...", "#ff5555", 300, () => this.loadRoom(this.currentRoomIndex));
    }

    skipRoom() {
        this.transitionMgr.play("⏭ Đang bỏ qua màn chơi...", "#ffdd00", 500, () => this.loadRoom(++this.currentRoomIndex));
    }

    nextRoom() {
        this.transitionMgr.play("Đang bước vào phòng tiếp theo...", "#fff", 1000, () => this.loadRoom(++this.currentRoomIndex));
    }

    update() {
        if (this.gameState === 'START_MENU' || this.isTransitioning) return;

        this.player.update(this.input.keys, this.map, this.stones);
        this.buttons.forEach(btn => btn.update(this.stones)); 
        this.uiText.update();

        this.ghosts.forEach(ghost => {
            ghost.update(this.player);
            if (ghost.checkCollision(this.player) && !this.player.godMode) {
                alert("Dễ vậy cũng thua thì chịu -))");
                this.restartRoom();
            }
        });

        if (this.boss) this.boss.update(this.player, this);

        if (this.buttons.length > 0 && this.buttons.every(btn => btn.isPressed) && !this.map.gatesOpened) {
            this.map.openGates();
        }

        const pCol = Math.floor((this.player.x + this.player.width / 2) / this.map.tileSize);
        const pRow = Math.floor((this.player.y + this.player.height / 2) / this.map.tileSize);
        
        if (this.map.grid[pRow] && this.map.grid[pRow][pCol] === 4) {
            this.nextRoom();
        }
    }

    draw() {
        this.renderer.draw();
    }

    render() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.render());
    }
}