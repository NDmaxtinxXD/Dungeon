// File: Renderer.js

export class Renderer {
    // 1. Hàm chuyên vẽ thanh Cooldown của Dash
    static drawCooldown(ctx, player) {
        let barY = player.y + player.height + 6; 
        let progress = player.dash.getProgress();

        // Nền đen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(player.x, barY, player.width, 4);

        // Thanh tiến độ (Cyan khi đầy, Xám khi đang hồi)
        ctx.fillStyle = progress >= 1 ? 'cyan' : 'gray';
        ctx.fillRect(player.x, barY, player.width * progress, 4);
    }

    // 2. Hàm chuyên vẽ Nhân vật chính
    static drawPlayer(ctx, player) {
        // Đợi ảnh load xong mới vẽ
        if (!player.image.complete || player.image.naturalWidth === 0) return;

        // Vẽ thanh lướt ở dưới chân
        this.drawCooldown(ctx, player);

        // Tính toán khung hình hiện tại đang hiển thị
        let animData = player.animations[player.state][player.direction];
        let frameIndex = animData.startCol + (player.currentFrame % animData.count);

        const sx = frameIndex * player.frameWidth;
        const sy = animData.row * player.frameHeight; 

        // Tọa độ vẽ ra màn hình (căn giữa hitbox)
        const drawX = player.x + (player.width / 2) - (player.drawWidth / 2);
        const drawY = player.y + (player.height / 2) - (player.drawHeight / 2) - 10;

        ctx.save();
        
        // Hiệu ứng bóng ma khi đang lướt (Dash)
        if (player.dash.isActive) {
            ctx.globalAlpha = 0.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'cyan';
        }
        
        ctx.drawImage(
            player.image, 
            sx, sy, player.frameWidth, player.frameHeight,
            drawX, drawY, player.drawWidth, player.drawHeight
        );
        
        ctx.restore();
    }
}