import { soundManager } from '../SoundManager.js';
import { BulletStorm } from './Skills/BulletStorm.js'; // Import kỹ năng vào

export class BossPhase3 {
    constructor(boss, canvasWidth, canvasHeight) {
        this.boss = boss;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.boss.x = this.canvasWidth / 2 - this.boss.width / 2;
        this.boss.y = this.canvasHeight / 2 - this.boss.height / 2;

        // Khởi tạo Skill
        this.bulletStorm = new BulletStorm(this.boss, canvasWidth, canvasHeight);
        this.isDefeated = false;
    }

    update(player, engine) {
        if (this.isDefeated) return;
        let musicTime = soundManager.bgmPhase2.currentTime;

        // 🏆 1p15s: KẾT THÚC
        if (musicTime >= 74) {
            this.isDefeated = true;
            this.bulletStorm.clear(); // Xóa sạch đạn
            if (engine.triggerShake) engine.triggerShake(1500, 25);
            setTimeout(() => { alert("🎉 VICTORY!"); engine.restartRoom(); }, 2000);
            return;
        }

        // Ủy quyền bắn đạn cho file BulletStorm
        this.bulletStorm.update(player, engine, musicTime);
    }

    draw(ctx) {
        if (this.isDefeated) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            return;
        }

        let musicTime = soundManager.bgmPhase2.currentTime;

        // 1. VẼ NỀN (Hiệu ứng theo nhạc)
        if (musicTime >= 59) {
            let flash = Math.sin(Date.now() / 50) * 0.2;
            ctx.fillStyle = `rgba(150, 0, 0, ${0.7 + flash})`;
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        }
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // 2. VẼ SKILL ĐẠN
        this.bulletStorm.draw(ctx);

        
    }
}