export class Dash {
    constructor(boss) {
        this.boss = boss; 
        this.state = 'IDLE';
        this.timer = Date.now();
        this.targetDx = 0;
        this.targetDy = 0;
        this.chargeSpeed = 25;
    }

    update(player, engine) {
        let now = Date.now();
        let timeInState = now - this.timer;

        switch(this.state) {
            case 'IDLE':
                this.boss.isStunned = false; 
                if (timeInState > 1000) {
                    this.state = 'AIMING';
                    this.timer = now;
                    this.lockTarget(player);
                }
                break;

            case 'AIMING':
                if (timeInState > 1000) {
                    this.state = 'CHARGING';
                    this.timer = now;
                }
                break;

            case 'CHARGING':
                this.boss.x += this.targetDx;
                this.boss.y += this.targetDy;

                if (this.checkCollision(this.boss, player)) {
                    // ĐÃ SỬA: Thêm check godMode
                    if (player.isInvincible || player.godMode) return false;
                    if (engine.triggerShake) engine.triggerShake(500, 20); 
                    this.state = 'IDLE'; 
                    alert("💀 BẠN ĐÃ BỊ BOSS HÚC BAY!");
                    engine.restartRoom(); 
                    return; 
                }

                if (engine.map.isWall(this.boss.x, this.boss.y, this.boss.width, this.boss.height)) {
                    this.state = 'STUNNED';
                    this.timer = now;
                    this.boss.isStunned = true; 
                    if (engine.triggerShake) engine.triggerShake(400, 12); 
                }

                engine.stones.forEach((stone, index) => {
                    if (this.checkCollision(this.boss, {x: stone.x, y: stone.y, width: stone.size, height: stone.size})) {
                        this.boss.hp--; 
                        engine.stones.splice(index, 1); 
                        this.state = 'STUNNED';
                        this.timer = now;
                        this.boss.isStunned = true; 
                        if (engine.triggerShake) engine.triggerShake(500, 15);
                    }
                });
                break;

            case 'STUNNED':
                if (timeInState > 1000) {
                    this.state = 'IDLE';
                    this.boss.isStunned = false; 
                }
                break;
        }
    }

    lockTarget(player) {
        let pCenterX = player.x + player.width / 2;
        let pCenterY = player.y + player.height / 2;
        let bCenterX = this.boss.x + this.boss.width / 2;
        let bCenterY = this.boss.y + this.boss.height / 2;

        let angle = Math.atan2(pCenterY - bCenterY, pCenterX - bCenterX);
        this.targetDx = Math.cos(angle) * this.chargeSpeed;
        this.targetDy = Math.sin(angle) * this.chargeSpeed;
    }

    checkCollision(r1, r2) {
        return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
    }

    draw(ctx) {
        let timeInState = Date.now() - this.timer;
        let bCenterX = this.boss.x + this.boss.width / 2;
        let bCenterY = this.boss.y + this.boss.height / 2;

        if (this.state === 'AIMING') {
            ctx.save();
            let progress = Math.min(timeInState / 1500, 1); 
            let blinkRate = 150 - (progress * 100); 
            let isVisible = Math.floor(Date.now() / blinkRate) % 2 === 0;

            if (isVisible) {
                ctx.strokeStyle = `rgba(255, 0, 0, ${0.4 + progress * 0.6})`;
                ctx.lineWidth = 5 + (progress * 8); 
                ctx.beginPath();
                ctx.moveTo(bCenterX, bCenterY);
                ctx.lineTo(bCenterX + this.targetDx * 200, bCenterY + this.targetDy * 200); 
                ctx.stroke();
            }
            ctx.restore();
        }
    }
}