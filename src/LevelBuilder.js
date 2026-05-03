import { ROOMS } from './map/Map.js';
import { Stone } from './map/Stone.js';
import { Button } from './map/Button.js';
import { Ghost } from './Ghost.js';
import { Boss } from './Boss/Boss.js';
import { soundManager } from './SoundManager.js';

export class LevelBuilder {
    static load(index, engine) {
        if (index >= ROOMS.length) {
            alert("Chúc mừng! Bạn đã thắng!");
            engine.currentRoomIndex = 0;
            return this.load(0, engine); // Load lại màn 1
        }

        const roomData = ROOMS[index];

        // Cài đặt vị trí người chơi & load map
        engine.player.x = roomData.playerStart.x;
        engine.player.y = roomData.playerStart.y;
        engine.map.loadLevelGrid(index);

        // Tạo Đá
        engine.stones = roomData.stones ? roomData.stones.map(s => new Stone(s.x, s.y, engine.map.tileSize)) : [];
        
        // Tạo Nút bấm
        engine.buttons = [];
        for (let row = 0; row < engine.map.grid.length; row++) {
            for (let col = 0; col < engine.map.grid[row].length; col++) {
                if (engine.map.grid[row][col] === 2) {
                    engine.buttons.push(new Button(row, col, engine.map.tileSize));
                }
            }
        }
        
        // --- 2. MÀN 2 ---
        if (index === 2) {
            // ĐÂY LÀ MÀN 3: KỊCH BẢN BOSS
            engine.ghosts = []; // Quét sạch ma nhỏ
            engine.boss = null; // Boss chưa xuất hiện ngay
            
            // Đảm bảo nhạc nền chính vẫn đang chạy trong lúc Boss đang "nhá hàng"
            soundManager.playMainBGM();
            
            // Giây 0:
            engine.uiText.showTitle("ROOM 3");
            
            // Giây 2.5: Đổi dòng chữ
            setTimeout(() => {
                if (engine.currentRoomIndex !== 2) return;
                engine.uiText.showTitle("SURVIVE");
            }, 2500);


            // Giây 5: Kịch tính! Thả Boss
            setTimeout(() => {
                if (engine.currentRoomIndex !== 2) return;
                engine.uiText.showTitle("Good Luck.");
                engine.boss = new Boss(600, 300); // Thả boss ở giữa phòng
                // (Nhạc lúc này vẫn là bài MainBGM của Phase 1 nhé)
            }, 5000);

        } else {
            // CÁC MÀN BÌNH THƯỜNG KHÁC (1, 2...)
            engine.uiText.showTitle(roomData.name || `Room ${index + 1}`);
            engine.ghosts = roomData.monsters ? roomData.monsters.map(m => new Ghost(m.x, m.y)) : [];
            engine.boss = null; // Đảm bảo màn thường không có boss

            // --- THÊM: ĐẢM BẢO CHẠY NHẠC NỀN CHÍNH Ở CÁC PHÒNG ---
            soundManager.playMainBGM();
        }

        // --- 3. KIỂM TRA MỞ CỬA ---
        // NẾU phòng không có nút bấm VÀ KHÔNG PHẢI MÀN BOSS (index !== 2) thì mở cửa luôn
        // (Nếu không thêm dòng index !== 2, cửa màn Boss sẽ tự động mở toang ngay từ đầu)
        if (engine.buttons.length === 0 && index !== 2) {
            engine.map.openGates();
        }
        
        engine.isTransitioning = false;
    }
}