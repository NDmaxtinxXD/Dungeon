import { Renderer } from './Renderer.js'; // Đã import Renderer

export class Stone {
    constructor(x, y, tileSize) {
        this.x = x;
        this.y = y;
        this.size = tileSize - 4;
        this.tileSize = tileSize;
    }

    tryMove(dx, dy, map, allStones) {
        let nextX = this.x + dx;
        let nextY = this.y + dy;
        if (map.isWall(nextX, nextY, this.size, this.size)) return false;
        for (let other of allStones) {
            if (other === this) continue;
            if (this.checkCollision({x: nextX, y: nextY, size: this.size}, other)) return false;
        }
        this.x = nextX;
        this.y = nextY;
        return true;
    }

    checkCollision(r1, r2) {
        return r1.x < r2.x + r2.size && r1.x + r1.size > r2.x && r1.y < r2.y + r2.size && r1.y + r1.size > r2.y;
    }

    // Tự gọi Renderer để vẽ
    draw(ctx) {
        Renderer.drawStone(ctx, this);
    }
}