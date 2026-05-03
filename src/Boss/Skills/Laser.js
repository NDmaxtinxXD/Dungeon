export class Laser {
    constructor() {
        this.lasers = []; 
        this.startTime = Date.now(); 
        this.lastSpawn = 0; 
    }

    update(player, engine) {
        let now = Date.now();
        let phaseTime = now - this.startTime; 

        let spawnInterval = 2500; 
        let allowDiagonal = false;
        let laserCount = 0;

        if (phaseTime < 6000) { 
            spawnInterval = 2500; 
            laserCount = 4;       
            allowDiagonal = false; 
        } 
        else if (phaseTime < 21000) { 
            spawnInterval = 1500; 
            laserCount = 6;       
            allowDiagonal = true;  
        } 
        else if (phaseTime <= 36000) { 
            spawnInterval = 800;   
            laserCount = 8;       
            allowDiagonal = true;
        } 
        else {
            laserCount = 0; 
        }

        if (laserCount > 0 && now - this.lastSpawn > spawnInterval) {
            for (let i = 0; i < laserCount; i++) {
                this.spawnRandomLaser(engine.canvas, allowDiagonal);
            }
            this.lastSpawn = now;
        }

        let didShake = false; 
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            let l = this.lasers[i];
            let elapsed = now - l.timer;

            if (l.state === 'WARNING') {
                if (elapsed > 1200) { 
                    l.state = 'ACTIVE';
                    l.timer = now;
                    if (!didShake && engine.triggerShake) {
                        engine.triggerShake(150, 6);
                        didShake = true;
                    }
                }
            } else if (l.state === 'ACTIVE') {
                if (this.checkCollision(l, player)) {
                    alert("💀 BẠN ĐÃ NHÓT!");
                    engine.restartRoom();
                }

                if (elapsed > 350) { 
                    this.lasers.splice(i, 1);
                }
            }
        }
    }

    spawnRandomLaser(canvas, allowDiagonal) {
        let angles = [0, Math.PI / 2]; 
        
        if (allowDiagonal) {
            angles.push(Math.PI / 4, -Math.PI / 4); 
        }
        
        let angle = angles[Math.floor(Math.random() * angles.length)];
        
        let px = Math.random() * canvas.width;
        let py = Math.random() * canvas.height;

        this.lasers.push({
            x: px,
            y: py,
            angle: angle,
            state: 'WARNING',
            timer: Date.now()
        });
    }

    checkCollision(l, player) {
        if (player.isInvincible || player.godMode) return false;
        let cx = player.x + player.width / 2;
        let cy = player.y + player.height / 2;

        let distance = Math.abs(
            (cx - l.x) * Math.sin(l.angle) - (cy - l.y) * Math.cos(l.angle)
        );

        let hitRadius = 18; 
        return distance < hitRadius;
    }
    draw(ctx, canvas) {
        let now = Date.now();

        this.lasers.forEach(l => {
            let elapsed = now - l.timer;
            ctx.save();

            let dx = Math.cos(l.angle);
            let dy = Math.sin(l.angle);
            let length = 2500; 
            let startX = l.x - dx * length;
            let startY = l.y - dy * length;
            let endX = l.x + dx * length;
            let endY = l.y + dy * length;

            if (l.state === 'WARNING') {
                let progress = Math.min(elapsed / 1200, 1); 
                
                let blinkRate = Math.max(30, 200 - progress * 170); 
                let isVisible = Math.floor(now / blinkRate) % 2 === 0;

                if (isVisible || progress > 0.8) {
                    ctx.strokeStyle = `rgba(255, 50, 50, ${0.4 + progress * 0.6})`;
                    ctx.lineWidth = 1 + progress * 3; 
                    ctx.setLineDash([15 + progress * 20, 10]); 
                    ctx.lineDashOffset = -now / 10; 
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }

                ctx.setLineDash([]);
                ctx.strokeStyle = `rgba(255, 0, 0, ${0.1 + progress * 0.3})`;
                ctx.lineWidth = 1;
                let offset = 18; 
                
                ctx.beginPath();
                ctx.moveTo(startX - dy * offset, startY + dx * offset);
                ctx.lineTo(endX - dy * offset, endY + dx * offset);
                ctx.moveTo(startX + dy * offset, startY - dx * offset);
                ctx.lineTo(endX + dy * offset, endY - dx * offset);
                ctx.stroke();

            } else if (l.state === 'ACTIVE') {
                let progress = Math.min(elapsed / 350, 1);
                let intensity = 1 - Math.pow(progress, 2); 

                ctx.globalCompositeOperation = 'source-over'; 

                ctx.shadowBlur = 20 * intensity;
                ctx.shadowColor = 'red';
                ctx.strokeStyle = `rgba(255, 0, 0, ${intensity})`;
                ctx.lineWidth = 35 * intensity;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                ctx.shadowBlur = 0; 
                ctx.strokeStyle = `rgba(0, 0, 0, ${intensity})`;
                ctx.lineWidth = 22 * intensity;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
                ctx.lineWidth = 4 * intensity;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            
            ctx.restore();
        });
    }
}