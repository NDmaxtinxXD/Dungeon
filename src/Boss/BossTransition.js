import { soundManager } from '../SoundManager.js';

export class BossTransition {
    constructor(boss) {
        this.boss = boss;
        this.startTime = 0;
        this.type = null; 
    }

    start(type) {
        this.type = type;
        this.startTime = Date.now();
    }

    update(engine, musicTime) {
        const targetX = engine.canvas.width / 2 - this.boss.width / 2;
        const targetY = engine.canvas.height / 2 - this.boss.height / 2;

        if (this.type === 'P1_TO_P2') {
            this.boss.x += (targetX - this.boss.x) * 0.05;
            this.boss.y += (targetY - this.boss.y) * 0.05;

            // Rung lắc nhẹ lúc tụ sét, rung bần bật lúc cột năng lượng giáng xuống
            let elapsed = Date.now() - this.startTime;
            if (elapsed > 4000 && elapsed < 5200 && engine.triggerShake) {
                engine.triggerShake(50, 2);
            } else if (elapsed >= 5200 && elapsed < 6000 && engine.triggerShake) {
                engine.triggerShake(150, 12);
            }

            if (Date.now() - this.startTime >= 6000) return true; 
        } 
        else if (this.type === 'P2_TO_P3') {
            this.boss.x += (targetX - this.boss.x) * 0.05;
            this.boss.y += (targetY - this.boss.y) * 0.05;
            if (musicTime >= 41 && engine.triggerShake) engine.triggerShake(100, 4);
            if (musicTime >= 44) return true; 
        }
        return false;
    }

    draw(ctx, musicTime) {
        let text = "";
        let isShouting = false;
        let elapsed = Date.now() - this.startTime;
        let bCenterX = this.boss.x + this.boss.width/2;
        let bCenterY = this.boss.y + this.boss.height/2;

        if (this.type === 'P1_TO_P2') {
            if (elapsed < 2000) text = "Khá lắm con giời...";
            else if (elapsed < 4000) text = "Nhưng trò chơi bây giờ...";
            else { 
                text = "MỚI THỰC SỰ BẮT ĐẦU!!!"; 
                isShouting = true; 
            }

            // ==========================================
            // HIỆU ỨNG: VÒNG XOÁY VÀ CỘT NĂNG LƯỢNG HƯ KHÔNG
            // ==========================================
            if (elapsed > 3000 && elapsed < 6000) {
                let p = (elapsed - 3000) / 3000; // Tiến trình 0 -> 1
                
                // 1. Ép màn hình tối đen dần (Tạo cảm giác ngột ngạt)
                ctx.fillStyle = `rgba(15, 0, 25, ${Math.min(p * 2, 0.85)})`; // Đen ám tím sẫm
                ctx.fillRect(-1000, -1000, 4000, 4000);

                // 2. Vòng xoáy Hắc Ám quay cuồng sau lưng Boss
                ctx.save();
                ctx.translate(bCenterX, bCenterY);
                ctx.rotate(-elapsed / 100); // Quay điên cuồng ngược chiều kim đồng hồ
                
                let vortexRadius = 50 + p * 150;
                let vGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, vortexRadius);
                vGrad.addColorStop(0, '#000000');          // Lõi đen kịt
                vGrad.addColorStop(0.5, '#330066');        // Tím thẫm
                vGrad.addColorStop(1, 'rgba(26, 0, 51, 0)'); // Tan vào bóng tối
                
                ctx.fillStyle = vGrad;
                ctx.beginPath();
                ctx.arc(0, 0, vortexRadius, 0, Math.PI * 2);
                ctx.fill();

                // Vẽ các lưỡi dao bóng tối hút vào tâm
                for(let i = 0; i < 8; i++) {
                    ctx.rotate((Math.PI * 2) / 8);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(vortexRadius * 1.2, 15);
                    ctx.lineTo(vortexRadius * 1.2, -15);
                    ctx.fillStyle = `rgba(15, 0, 30, ${0.9 - p * 0.4})`;
                    ctx.fill();
                }
                ctx.restore();

                // 3. Tia sét ma quái (Dark Violet) liên tục giáng vào Boss
                if (elapsed < 5200 && Math.random() > 0.4) {
                    ctx.beginPath();
                    let startX = bCenterX + (Math.random() - 0.5) * 600;
                    let startY = bCenterY + (Math.random() - 0.5) * 600;
                    ctx.moveTo(startX, startY);
                    
                    // Tạo đường sét ziczac
                    let midX = (startX + bCenterX)/2 + (Math.random()-0.5)*80;
                    let midY = (startY + bCenterY)/2 + (Math.random()-0.5)*80;
                    ctx.lineTo(midX, midY);
                    ctx.lineTo(bCenterX, bCenterY);
                    
                    ctx.strokeStyle = '#8a2be2'; // Tím electric chói
                    ctx.lineWidth = 2 + Math.random() * 4;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#4b0082'; // Viền tím dạ quang
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // 4. BÙNG NỔ: Cột Năng Lượng Ma Quỷ (5.2s - 6s)
                if (elapsed >= 5200) {
                    let blastP = (elapsed - 5200) / 800; // Tiến trình vụ nổ 0 -> 1
                    
                    // Sóng xung kích quét mặt đất
                    ctx.beginPath();
                    ctx.arc(bCenterX, bCenterY, blastP * 800, 0, Math.PI * 2);
                    ctx.lineWidth = 25 * (1 - blastP);
                    ctx.strokeStyle = '#4b0082'; // Tím Indigo
                    ctx.stroke();

                    // CỘT SÁNG XUYÊN THỦNG TRỜI ĐẤT
                    let beamWidth = Math.sin(blastP * Math.PI) * 120; // Nở to ra rồi thu hẹp lại
                    let beamGrad = ctx.createLinearGradient(bCenterX - beamWidth, 0, bCenterX + beamWidth, 0);
                    beamGrad.addColorStop(0, 'rgba(0,0,0,0)');
                    beamGrad.addColorStop(0.2, 'rgba(30, 0, 50, 0.9)'); // Rìa đen sậm
                    beamGrad.addColorStop(0.5, '#7a00cc');             // Lõi tím cực sáng
                    beamGrad.addColorStop(0.8, 'rgba(30, 0, 50, 0.9)'); 
                    beamGrad.addColorStop(1, 'rgba(0,0,0,0)');

                    ctx.fillStyle = beamGrad;
                    // Vẽ một cột hình chữ nhật cao tít từ trên xuống dưới
                    ctx.fillRect(bCenterX - beamWidth, -1000, beamWidth * 2, 4000);
                }
            }
        } 
        else if (this.type === 'P2_TO_P3') {
            // (Giữ nguyên logic Phase 3 cũ)
            if (musicTime >= 35 && musicTime < 38) text = "Khá khen cho sự kiên trì của ngươi...";
            else if (musicTime >= 38 && musicTime < 41) text = "Nhưng trò chơi vờn chuột kết thúc tại đây!";
            else if (musicTime >= 41) { 
                text = "TẬN HƯỞNG BÓNG TỐI ĐI!!!"; 
                isShouting = true; 
                let darkProgress = Math.min((musicTime - 41) / 3, 1); 
                ctx.fillStyle = `rgba(0, 0, 0, ${darkProgress * 0.95})`;
                ctx.fillRect(-1000, -1000, 4000, 4000); 

                let auraRadius = 80 + Math.sin(Date.now() / 150) * 15; 
                let gradient = ctx.createRadialGradient(bCenterX, bCenterY, 20, bCenterX, bCenterY, auraRadius);
                gradient.addColorStop(0, `rgba(200, 0, 0, ${0.7 - darkProgress * 0.2})`);
                gradient.addColorStop(1, 'rgba(50, 0, 0, 0)');
                ctx.beginPath();
                ctx.arc(bCenterX, bCenterY, auraRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        // ==========================================
        // VẼ CÂU THOẠI (HIỆU ỨNG CHỮ CUỒNG NỘ CHÓT LỌT)
        // ==========================================
        if (text) {
            let textX = bCenterX;
            let textY = this.boss.y - 50; 
            ctx.save();
            ctx.textAlign = "center";
            
            if (isShouting && this.type === 'P1_TO_P2' && elapsed > 5000) {
                // Cuối Phase 1, chữ rung giật điên đảo, to dần lên và đổi sang màu đỏ máu
                textX += (Math.random() - 0.5) * 15;
                textY += (Math.random() - 0.5) * 15;
                let scale = 1 + Math.min((elapsed - 5000) / 1000, 0.5); // To lên 1.5 lần
                ctx.font = `bold ${30 * scale}px Arial`; 
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ff0000';
                ctx.fillStyle = '#ff1a1a';
            } else {
                ctx.font = isShouting ? "bold 30px Arial" : "bold 18px Arial";
                ctx.fillStyle = isShouting ? "#ff3333" : "white";
                ctx.shadowBlur = 0;
            }

            ctx.strokeStyle = "black"; 
            ctx.lineWidth = 4;
            ctx.strokeText(text, textX, textY);
            ctx.fillText(text, textX, textY);
            ctx.restore();
        }
    }
}