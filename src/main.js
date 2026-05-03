import { GameEngine } from './GameEngine/GameEngine.js';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const game = new GameEngine(canvas, ctx);
game.render();