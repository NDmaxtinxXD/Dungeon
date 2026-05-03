export class SoundManager {
    constructor() {
        // cả Phòng 1, Phòng 2 và Boss Phase 1
        this.mainBgm = new Audio('/audio/phase1.mp3'); 
        this.mainBgm.loop = true;
        this.mainBgm.volume = 0.3;

        // Nhạc này vẫn giữ nguyên cho lúc Boss nổi điên
        this.bgmPhase2 = new Audio('/audio/phase2.mp3'); 
        this.bgmPhase2.loop = true;
        this.bgmPhase2.volume = 0.4; 
    }

    // Hàm này gọi khi bắt đầu game, qua phòng 1, phòng 2
    playMainBGM() {
        // Kiểm tra nếu nhạc đang tắt thì mới bật (để qua phòng nhạc không bị giật lại từ đầu)
        if (this.mainBgm.paused) {
            this.mainBgm.play().catch(e => console.log("Chưa tương tác nên trình duyệt chặn:", e));
        }
    }

    // Hàm này gọi đúng lúc Boss gáy xong 6 giây
    playPhase2() {
        this.mainBgm.pause(); // Tắt nhạc phòng/phase 1
        this.mainBgm.currentTime = 0; 
        
        this.bgmPhase2.play().catch(e => console.log(e));
    }
}

export const soundManager = new SoundManager();