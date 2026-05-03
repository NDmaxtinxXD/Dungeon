export class GameUI {
    constructor() {
        this.titleText = "";
        this.alpha = 0;       // Độ mờ của chữ (từ 0 đến 1)
        this.fadeSpeed = 0.015; // Tốc độ mờ dần
        this.displayTime = 2.5; // Tổng thời gian hiển thị (bao gồm cả lúc bắt đầu mờ)
    }

    // Hàm để kích hoạt hiển thị một dòng chữ mới
    showTitle(text) {
        this.titleText = text;
        this.alpha = this.displayTime; 
    }

    // Hàm cập nhật trạng thái mờ dần
    update() {
        if (this.alpha > 0) {
            this.alpha -= this.fadeSpeed;
        }
    }

    // Hàm vẽ chữ lên màn hình
    draw(ctx, canvasWidth) {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = Math.min(this.alpha, 1);
        
        ctx.fillStyle = "#FFD700"; 
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        
        // Hiệu ứng đổ bóng
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Vẽ chữ ở 1/4 phía trên màn hình
        ctx.fillText(this.titleText, canvasWidth / 2, 180);
        
        ctx.restore();
    }
}