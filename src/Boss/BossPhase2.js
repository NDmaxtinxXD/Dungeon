import { soundManager } from '../SoundManager.js';
import { Laser } from './Skills/Laser.js';
import { Dash } from './Skills/Dash.js';
import { Stomp } from './Skills/Stomp.js';

export class BossPhase2 {
    constructor(boss) {
        this.boss = boss;
        this.laserSkill = new Laser(); 
        
        // Quản lý chiêu thức
        this.activeSkill = null; 
        this.lastSkillTime = 0;
        
        // Cờ (flag) cực kỳ quan trọng để chống "khựng"
        this.skillHasFired = false; 
    }

    update(player, engine) {
        let musicTime = soundManager.bgmPhase2.currentTime;
        
        // LUÔN LUÔN CHẠY LASER 
        if (musicTime >= 1 && musicTime <= 36) {
            this.laserSkill.update(player, engine);
        }

        //Đảm bảo chạy hết hoạt ảnh
        
        if (this.activeSkill) {
            this.activeSkill.update(player, engine);
            
            // 1. Kiểm tra Dash
            if (this.activeSkill instanceof Dash) {
                // Đánh dấu là Boss đã bắt đầu phi thân hoặc tông trúng tường
                if (this.activeSkill.state === 'CHARGING' || this.activeSkill.state === 'STUNNED') {
                    this.skillHasFired = true; 
                }
                // Chỉ dọn chiêu khi Dash đã lướt xong, hết choáng và trở về lại IDLE
                if (this.activeSkill.state === 'IDLE' && this.skillHasFired) {
                    this.clearSkill(musicTime);
                }
            } 
            // 2. Kiểm tra Stomp
            else if (this.activeSkill instanceof Stomp) {
                // Đánh dấu là Boss đã chạm đất dậm nổ
                if (this.activeSkill.state === 'STOMPING') {
                    this.skillHasFired = true;
                }
                // Chỉ dọn chiêu khi nổ xong và Boss nảy lên lại trạng thái AIRBORNE
                if (this.activeSkill.state === 'AIRBORNE' && this.skillHasFired) {
                    this.clearSkill(musicTime);
                }
            }
        }
        // TUNG CHIÊU MỚI THEO NHẠC
        // Chỉ tung chiêu mới khi rảnh tay (activeSkill === null)
        if (!this.activeSkill) {
            
            // 🟡 Khúc 2: Khó - Chỉ dùng Stomp ép góc (6s - 21s)
            if (musicTime >= 6 && musicTime < 21) {
                // Nghỉ 1.2s sau đòn trước rồi mới dậm tiếp
                if (musicTime - this.lastSkillTime >= 1.2) {
                    this.activateNewSkill('STOMP');
                }
            }
            
            // 🔴 Khúc 3: Cực Khó - Dash và Stomp luân phiên (21s - 36s)
            else if (musicTime >= 21 && musicTime <= 36) {
                // Thời gian nghỉ rút ngắn còn 0.8s (Dồn dập hơn)
                if (musicTime - this.lastSkillTime >= 0.8) {
                    let randomSkill = Math.random() > 0.5 ? 'DASH' : 'STOMP';
                    this.activateNewSkill(randomSkill);
                }
            }
        }
    }

    // --- HÀM TIỆN ÍCH ---

    activateNewSkill(skillName) {
        this.skillHasFired = false; // Reset cờ nhận diện đòn đánh
        
        if (skillName === 'DASH') {
            this.activeSkill = new Dash(this.boss);
        } else {
            this.activeSkill = new Stomp(this.boss);
        }
    }

    clearSkill(musicTime) {
        this.activeSkill = null; // Xóa chiêu hiện tại
        this.lastSkillTime = musicTime; // Đặt mốc thời gian để bắt đầu tính thời gian nghỉ (cooldown)
    }

    draw(ctx) {
        // Vẽ Laser dưới cùng
        this.laserSkill.draw(ctx, ctx.canvas);

        // Vẽ hiệu ứng của chiêu thức
        if (this.activeSkill) {
            this.activeSkill.draw(ctx);
        }

        
    }
}