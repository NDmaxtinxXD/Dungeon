import { BossPhase1 } from './BossPhase1.js';
import { BossPhase2 } from './BossPhase2.js'; 
import { BossPhase3 } from './BossPhase3.js'; 
import { BossTransition } from './BossTransition.js'; 
import { soundManager } from '../SoundManager.js'; 
import { Stomp } from './Skills/Stomp.js';

export class Boss {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        this.width = 200; 
        this.height = 200;
        
        this.hp = 3; 
        this.phaseNumber = 1;
        this.currentPhase = new BossPhase1(this);
        this.transition = new BossTransition(this);
        this.isTransitioning = false;
        this.isStunned = false; 

        // Xoay mặt trái phải
        this.lastX = x;
        this.facingDir = 1; 

        this.image = new Image();
        this.image.src = 'images/Boss.png';

        this.currentFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.15; 
    }

    update(player, engine) {
        const musicTime = (soundManager.bgmPhase2) ? soundManager.bgmPhase2.currentTime : 0;
        
        // 1. Cập nhật hướng nhìn
        if (this.x > this.lastX) this.facingDir = 1;
        else if (this.x < this.lastX) this.facingDir = -1;
        this.lastX = this.x;

        // 2. Logic xử lý Frame (Idle, Stun, và Stomp)
        this.handleAnimationLogic();

        // 3. Logic chuyển Phase 
        if (this.hp <= 0 && this.phaseNumber === 1 && !this.isTransitioning) {
            this.isTransitioning = true; 
            this.transition.start('P1_TO_P2');
        }
        if (this.phaseNumber === 2 && musicTime >= 35 && musicTime < 44 && !this.isTransitioning) {
            this.isTransitioning = true; 
            this.transition.start('P2_TO_P3');
        }

        if (this.isTransitioning) {
            const finished = this.transition.update(engine, musicTime);
            if (finished) {
                this.isTransitioning = false; 
                this.changeToNextPhase(engine);
            }
        } else {
            this.currentPhase.update(player, engine);
        }
    }

    handleAnimationLogic() {
        this.animTimer += this.animSpeed;
        if (this.animTimer < 1) return;
        this.animTimer = 0;

        let minFrame = 0;
        let maxFrame = 8; // Mặc định 8 frame cho Idle (Hàng 1)

        if (this.isStunned) {
            maxFrame = 2; // Hàng Stun (Hàng 3) chỉ có 2 frame
        } 
        // Logic chia 3 frame đầu và 5 frame sau cho STOMP (Hàng 2)
        else if (this.phaseNumber === 2 && this.currentPhase.activeSkill instanceof Stomp) {
            const hasFired = this.currentPhase.skillHasFired;
            
            if (!hasFired) {
                // ĐANG RẶN: Chỉ lặp 3 frame đầu (0, 1, 2)
                minFrame = 0;
                maxFrame = 3;
                if (this.currentFrame >= maxFrame) this.currentFrame = 0;
            } 
        }

        // Chuyển frame
        this.currentFrame++;
        if (this.currentFrame >= maxFrame) {
            this.currentFrame = minFrame;
        }
    }

    changeToNextPhase(engine) {
        this.isStunned = false;
        this.isVulnerable = false;
        this.vx = 0; this.vy = 0;

        if (this.phaseNumber === 1) {
            this.phaseNumber = 2;
            this.hp = 1;
            this.currentPhase = new BossPhase2(this);
            if (engine.uiText) engine.uiText.showTitle("🔥 PHASE 2: JACKPOTTTTT 🔥");
            soundManager.playPhase2();
        } else {
            this.phaseNumber = 3;
            this.currentPhase = new BossPhase3(this, engine.canvas.width, engine.canvas.height);
            if (engine.uiText) engine.uiText.showTitle("💀 PHASE 3: BLACKOUT 💀");
        }
    }

    takeDamage() {
        if (this.isTransitioning || this.hp <= 0) return;
        this.hp--;
    }

    draw(ctx) {
        const musicTime = (soundManager.bgmPhase2) ? soundManager.bgmPhase2.currentTime : 0;
        if (this.isTransitioning) {
            if (this.phaseNumber === 1) this.currentPhase.draw(ctx); 
            this.transition.draw(ctx, musicTime);
        } else {
            this.currentPhase.draw(ctx);
        }

        this.drawBossBody(ctx, musicTime);

        if (!this.isTransitioning && this.hp > 0 && this.phaseNumber < 3) {
            this.drawHPBar(ctx);
        }
    }

    drawBossBody(ctx, musicTime) {
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        ctx.save();
        
        let drawX = this.x; let drawY = this.y;
        if (this.isTransitioning && this.phaseNumber === 2 && musicTime >= 41) {
            drawX += (Math.random() - 0.5) * 15; drawY += (Math.random() - 0.5) * 15;
        }

        const fw = 80; const fh = 80; 
        let sx = this.currentFrame * fw;
        let sy = 0; 

        if (this.isStunned) sy = 2 * fh;
        else if (this.phaseNumber === 2 && this.currentPhase.activeSkill instanceof Stomp) {
            sy = 1 * fh; // Hàng 2 (Attack)
        }

        const finalW = this.width + 80;
        const finalH = this.height + 80;
        const finalX = drawX - 40;
        const finalY = drawY - 40;

        ctx.translate(finalX + finalW / 2, finalY); 
        ctx.scale(this.facingDir, 1);
        ctx.drawImage(this.image, sx, sy, fw, fh, -finalW / 2, 0, finalW, finalH);
        ctx.restore();
    }

    drawHPBar(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y - 20, this.width, 10); 
        ctx.fillStyle = (this.phaseNumber === 1) ? 'red' : 'orange';
        let maxHpPhase = (this.phaseNumber === 1) ? 3 : 1;
        ctx.fillRect(this.x, this.y - 20, (this.width * this.hp) / maxHpPhase, 10);
    }
}