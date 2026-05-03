export class InputManager {
    constructor(engine) {
        this.engine = engine; 
        this.keys = {};

        // Bắt sự kiện phím ấn xuống
        window.addEventListener('keydown', (e) => {
            // NẾU ĐANG Ở MENU: Bấm Enter hoặc Space để chơi
            if (this.engine.gameState === 'START_MENU') {
                if (e.code === 'Enter' || e.code === 'Space') this.engine.startGame();
                return; // Dừng lại ở đây, không xử lý các phím di chuyển
            }

            // NẾU ĐANG TRONG GAME: Xử lý phím bình thường
            this.keys[e.code] = true;
            if (e.code === 'KeyN' && !this.engine.isTransitioning) this.engine.skipRoom();
            if (e.code === 'KeyR') this.engine.restartRoom();
        });

        // Bắt sự kiện phím nhả ra
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Bắt sự kiện click chuột
        this.engine.canvas.addEventListener('click', (e) => {
            // NẾU ĐANG Ở MENU: Click bất kỳ đâu để chơi
            if (this.engine.gameState === 'START_MENU') {
                this.engine.startGame();
                return;
            }

            // NẾU ĐANG TRONG GAME: Bấm nút Restart
            if (this.engine.isTransitioning) return;
            const rect = this.engine.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (this.engine.menu.getClickedButton(mouseX, mouseY) === 'restart') {
                this.engine.restartRoom();
            }
        });
    }
}