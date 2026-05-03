export class GameRenderer {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.canvas = engine.canvas;
    }

    draw() {
        let e = this.engine;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        
        // Hiệu ứng rung màn hình
        if (Date.now() < e.shakeEndTime) {
            let dx = (Math.random() - 0.5) * e.shakeIntensity;
            let dy = (Math.random() - 0.5) * e.shakeIntensity;
            this.ctx.translate(dx, dy);
        }

        if (e.gameState === 'START_MENU') {
            this.drawStartMenu();
        } else if (e.gameState === 'PLAYING') {
            e.map.draw(this.ctx);
            e.buttons.forEach(btn => btn.draw(this.ctx));
            e.stones.forEach(stone => stone.draw(this.ctx));
            e.ghosts.forEach(ghost => ghost.draw(this.ctx));
            
            if (e.boss) e.boss.draw(this.ctx);

            e.player.draw(this.ctx); 
            e.uiText.draw(this.ctx, this.canvas.width);
            e.menu.draw(this.ctx);
        }

        this.ctx.restore();
    }

    drawStartMenu() {
        this.ctx.fillStyle = "#111"; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = "#FFD700"; 
        this.ctx.font = "bold 60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("DUNGEON ESCAPE", this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "bold 24px Arial";
            this.ctx.fillText("Nhấn [ENTER] hoặc Click chuột để bắt đầu", this.canvas.width / 2, this.canvas.height / 2 + 30);
        }
        
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#aaa";
        this.ctx.fillText("🎮 Di chuyển: Phím Mũi Tên hoặc W A S D", this.canvas.width / 2, this.canvas.height / 2 + 100);
        this.ctx.fillText("🪨 Hope u enjoy the game.", this.canvas.width / 2, this.canvas.height / 2 + 130);
        this.ctx.fillText("👻 Good luck !", this.canvas.width / 2, this.canvas.height / 2 + 160);
        this.ctx.fillText("----GROUP 8----", this.canvas.width / 2, this.canvas.height / 2 + 190);
    }
}