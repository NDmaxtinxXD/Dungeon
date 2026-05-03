import { Room1 } from './Room1.js';
import { Room2 } from './Room2.js';
import { Room3 } from './Room3.js';
import { Renderer } from './Renderer.js'; 

export const ROOMS = [Room1, Room2, Room3];

export class GameMap {
    constructor() {
        this.tileSize = 32;
        this.grid = [];
        this.gatesOpened = false;
    }

    loadLevelGrid(index) {
        this.grid = JSON.parse(JSON.stringify(ROOMS[index].grid));
        this.gatesOpened = false;
    }

    openGates() {
        this.gatesOpened = true;
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c] === 3) {
                    this.grid[r][c] = 4;
                }
            }
        }
    }

    isWall(x, y, w, h) {
        const padding = 4;
        const corners = [{x:x+padding,y:y+padding},{x:x+w-padding,y:y+padding},{x:x+padding,y:y+h-padding},{x:x+w-padding,y:y+h-padding}];
        for (let p of corners) {
            let c = Math.floor(p.x/this.tileSize), r = Math.floor(p.y/this.tileSize);
            if (this.grid[r] && (this.grid[r][c] === 1 || this.grid[r][c] === 3)) return true;
        }
        return false;
    }

    // Tự gọi Renderer để vẽ
    draw(ctx) {
        Renderer.drawMap(ctx, this);
    }
}