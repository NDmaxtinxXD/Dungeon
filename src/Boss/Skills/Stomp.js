export class Stomp {
    constructor(boss) {
        this.boss = boss;
        this.state = 'AIRBORNE';
        
        this.beatInterval = 1200;    
        this.lockTime = 400;         
        this.stompDuration = 50;     
        this.stompRadius = 120; 
        this.shadowFollowSpeed = 0.18; 

        this.lastBeat = Date.now();
        this.shadowX = boss.x;
        this.shadowY = boss.y;
    }

    update(player, engine) {
        let now = Date.now();
        let timeSinceLastBeat = now - this.lastBeat;

        if (this.state === 'AIRBORNE') {
            if (timeSinceLastBeat < (this.beatInterval - this.lockTime)) {
                let dx = player.x - this.shadowX;
                let dy = player.y - this.shadowY;
                this.shadowX += dx * this.shadowFollowSpeed; 
                this.shadowY += dy * this.shadowFollowSpeed;
            }

            if (timeSinceLastBeat > this.beatInterval) {
                this.state = 'STOMPING';
                this.lastBeat = now;
                
                this.boss.x = this.shadowX;
                this.boss.y = this.shadowY;

                if (engine.triggerShake) engine.triggerShake(300, 20);
                
                if (this.checkCollision(this.boss, player)) {
                    alert("💀 BẠN ĐÃ NHÓT!");
                    engine.restartRoom();
                }
            }
        } else if (this.state === 'STOMPING') {
            if (now - this.lastBeat > this.stompDuration) {
                this.state = 'AIRBORNE';
                this.lastBeat = now; 
            }
        }
    }

    checkCollision(boss, player) {
        if (player.isInvincible || player.godMode) return false;
        let centerX = this.shadowX + 30;
        let centerY = this.shadowY + 30;
        let closestX = Math.max(player.x, Math.min(centerX, player.x + player.width));
        let closestY = Math.max(player.y, Math.min(centerY, player.y + player.height));
        let distanceX = centerX - closestX;
        let distanceY = centerY - closestY;
        let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (this.stompRadius * this.stompRadius);
    }

    draw(ctx) {
        let now = Date.now();
        let timeSinceLastBeat = now - this.lastBeat;

        if (this.state === 'AIRBORNE') {
            ctx.save();
            let isLocked = timeSinceLastBeat >= (this.beatInterval - this.lockTime);
            
            ctx.fillStyle = isLocked ? 'rgba(255, 0, 0, 0.6)' : 'rgba(255, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(this.shadowX + 30, this.shadowY + 30, this.stompRadius, 0, Math.PI * 2);
            ctx.fill();
            
            let progress = Math.min(timeSinceLastBeat / this.beatInterval, 1);
            ctx.strokeStyle = isLocked ? 'red' : 'yellow';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.shadowX + 30, this.shadowY + 30, (this.stompRadius + 100) * (1 - progress), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.fillStyle = '#ff4d4d';
            ctx.beginPath();
            ctx.arc(this.boss.x + 30, this.boss.y + 30, this.stompRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(this.boss.x + 30, this.boss.y + 30, this.stompRadius + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}