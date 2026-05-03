export class Dash {
    constructor() {
        this.speed = 12;
        this.duration = 100;
        this.cooldown = 800;
        this.lastTime = 0;
        this.isActive = false;
        this.dx = 0;
        this.dy = 0;
    }

    update() {
        if (this.isActive && Date.now() - this.lastTime > this.duration) {
            this.isActive = false;
        }
    }

    tryActivate(keys, currentDx, currentDy) {
        let now = Date.now();
        if (keys['Space'] && !this.isActive && (now - this.lastTime > this.cooldown)) {
            if (currentDx !== 0 || currentDy !== 0) {
                this.isActive = true;
                this.lastTime = now;
                this.dx = currentDx;
                this.dy = currentDy;
            }
        }
    }

    getProgress() {
        return Math.min((Date.now() - this.lastTime) / this.cooldown, 1);
    }
}