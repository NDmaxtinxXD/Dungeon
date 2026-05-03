export class BulletStorm {
    constructor(boss, canvasWidth, canvasHeight) {
        this.boss = boss;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.bullets = [];
        this.bulletAngleOffset = 0; 
        this.lastBulletTime = 0;
    }

    update(player, engine, musicTime) {
        let now = Date.now();
        let interval = (musicTime >= 59) ? 80 : 150; 
        
        if (now - this.lastBulletTime > interval) {
            let numTires = (musicTime >= 59) ? 12 : 6; 
            this.bulletAngleOffset += 0.2; 

            for (let i = 0; i < numTires; i++) {
                let angle = (i * (Math.PI * 2 / numTires)) + this.bulletAngleOffset;
                
                let speed = 4;
                let wave = 0;
                if (musicTime >= 59) {
                    speed = 6;
                    wave = Math.sin(now / 200) * 2; 
                }

                this.bullets.push({
                    x: this.boss.x + this.boss.width / 2,
                    y: this.boss.y + this.boss.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * (speed + wave),
                    radius: (musicTime >= 59) ? 8 : 6, 
                    color: (musicTime >= 59) ? '#ff0000' : '#ff33aa'
                });
            }
            this.lastBulletTime = now;
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let b = this.bullets[i];
            b.x += b.vx;
            b.y += b.vy;

            if (b.x < -50 || b.x > this.canvasWidth + 50 || b.y < -50 || b.y > this.canvasHeight + 50) {
                this.bullets.splice(i, 1);
                continue;
            }

            let dx = (player.x + player.width/2) - b.x;
            let dy = (player.y + player.height/2) - b.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < b.radius + 10) {
                // ĐÃ SỬA: Thêm check godMode
                if (!player.isInvincible && !player.godMode) {
                    alert("💀 Này hơi khó, cố lên");
                    engine.restartRoom();
                }
            }
        }
    }

    draw(ctx) {
        ctx.save();
        for (let b of this.bullets) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = b.color;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    
    clear() {
        this.bullets = [];
    }
}