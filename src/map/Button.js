import { Renderer } from './Renderer.js'; 

export class Button {
    constructor(row, col, tileSize) {
        this.row = row;
        this.col = col;
        this.tileSize = tileSize;
        this.x = col * tileSize;
        this.y = row * tileSize;
        this.isPressed = false;
    }

    update(stones) {
        this.isPressed = false;
        for (let stone of stones) {
            const sCol = Math.floor((stone.x + stone.size / 2) / this.tileSize);
            const sRow = Math.floor((stone.y + stone.size / 2) / this.tileSize);
            if (sCol === this.col && sRow === this.row) {
                this.isPressed = true;
                break;
            }
        }
    }

    // Tự gọi Renderer để vẽ
    draw(ctx) {
        Renderer.drawButton(ctx, this);
    }
}