import { soundManager } from '../SoundManager.js'; 

export class GameTransition {
    constructor(engine) {
        this.engine = engine; 
    }

    play(message, textColor, delayTime, actionAfterDelay) {
        let e = this.engine; 
        if (e.isTransitioning) return;
        
        e.isTransitioning = true;

        // Tắt nhạc Boss
        if (soundManager && soundManager.bgmPhase2) {
            soundManager.bgmPhase2.pause();
            soundManager.bgmPhase2.currentTime = 0;
        }

        // Vẽ màn hình đen
        e.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        e.ctx.fillRect(0, 0, e.canvas.width, e.canvas.height);
        e.ctx.fillStyle = textColor; 
        e.ctx.font = "bold 40px Arial";
        e.ctx.textAlign = "center";
        e.ctx.fillText(message, e.canvas.width / 2, e.canvas.height / 2);

        setTimeout(() => {
            e.isTransitioning = false;
            actionAfterDelay();
        }, delayTime);
    }
}