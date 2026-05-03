import { Dash } from './Dash.js';
import { Renderer } from './Renderer.js'; 

const DIRECTION = { DOWN: 0, RIGHT: 2, UP: 3, LEFT: 1 };
const STATE = { IDLE: 'idle', WALK: 'walk' };

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24; 
        this.height = 24;
        this.normalSpeed = 4; 
        this.pushSpeed = 1; 

        this.dash = new Dash(); 

        this.image = new Image();
        this.image.src = 'images/Player.png'; 

        this.frameWidth = 24; 
        this.frameHeight = 24; 
        this.drawWidth = 48; 
        this.drawHeight = 48;

        this.currentFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 150; 
        this.lastTime = Date.now();

        this.direction = DIRECTION.DOWN;
        this.state = STATE.IDLE;

        this.animations = {
            [STATE.WALK]: [

                { row: 0, startCol: 16, count: 6 }, // [0] ĐI XUỐNG: Cắt 6 khung từ cột 16 (16->21)
                { row: 0, startCol: 22, count: 6 }, // [1] ĐI PHẢI: Cắt 6 khung từ cột 22 (22->27)
                { row: 0, startCol: 28, count: 6 }, // [2] ĐI LÊN: Cắt 6 khung từ cột 28 (28->33)
                { row: 0, startCol: 34, count: 6 }  // [3] ĐI TRÁI: Cắt 6 khung từ cột 34 (34->39)
            ],
            [STATE.IDLE]: [
                { row: 0, startCol: 0, count: 4 },  // [0] ĐỨNG XUỐNG: Cắt 4 khung từ cột 0 (0->3)
                { row: 0, startCol: 4, count: 4 },  // [1] ĐỨNG PHẢI: Cắt 4 khung từ cột 4 (4->7)
                { row: 0, startCol: 8, count: 4 },  // [2] ĐỨNG LÊN: Cắt 4 khung từ cột 8 (8->11)
                { row: 0, startCol: 12, count: 4 }  // [3] ĐỨNG TRÁI: Cắt 4 khung từ cột 12 (12->15)
            ]
        };
        this.godMode = false; // Chuyển thành true để bất tử, false để chơi bình thường
    }

    update(keys, map, stones) {
        this.dash.update();

        let dx = 0;
        let dy = 0;

        // Ưu tiên hướng bấm sau cùng 
        if (keys['ArrowLeft'] || keys['KeyA']) {
            dx = -1;
            this.direction = DIRECTION.LEFT;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            dx = 1;
            this.direction = DIRECTION.RIGHT;
        } else if (keys['ArrowUp'] || keys['KeyW']) {
            dy = -1;
            this.direction = DIRECTION.UP;
        } else if (keys['ArrowDown'] || keys['KeyS']) {
            dy = 1;
            this.direction = DIRECTION.DOWN;
        }

        this.dash.tryActivate(keys, dx, dy);

        let finalDx = this.dash.isActive ? this.dash.dx : dx;
        let finalDy = this.dash.isActive ? this.dash.dy : dy;
        let speed = this.dash.isActive ? this.dash.speed : this.normalSpeed;

        // Cập nhật trạng thái Animation
        if (finalDx !== 0 || finalDy !== 0) {
            this.state = STATE.WALK;
        } else {
            if (this.state !== STATE.IDLE) {
                this.state = STATE.IDLE;
                this.currentFrame = 0;
            }
        }

        // Đếm khung hình
        let now = Date.now();
        let delta = now - this.lastTime;
        this.lastTime = now;
        this.animTimer += delta;
        if (this.animTimer > this.animSpeed) {
            this.currentFrame++;
            this.animTimer = 0;
        }

        if (finalDx === 0 && finalDy === 0) return;

        let nextX = this.x + finalDx * speed;
        let nextY = this.y + finalDy * speed;

        this.handleCollisions(nextX, nextY, finalDx, finalDy, map, stones);
    }

    handleCollisions(nextX, nextY, dx, dy, map, stones) {
        let hitStone = stones.find(s => this.checkStone(nextX, nextY, s));

        if (hitStone) {
            if (this.dash.isActive) this.dash.isActive = false; 
            let moveX = dx * this.pushSpeed;
            let moveY = dy * this.pushSpeed;
            if (hitStone.tryMove(moveX, moveY, map, stones)) {
                this.x += moveX;
                this.y += moveY;
            }
        } else {
            if (!map.isWall(nextX, nextY, this.width, this.height)) {
                this.x = nextX;
                this.y = nextY;
            } else {
                if (this.dash.isActive) this.dash.isActive = false; 
            }
        }
    }

    checkStone(nx, ny, stone) {
        return nx < stone.x + stone.size && nx + this.width > stone.x &&
               ny < stone.y + stone.size && ny + this.height > stone.y;
    }

    draw(ctx) {
        Renderer.drawPlayer(ctx, this);
    }
}