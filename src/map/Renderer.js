// File: map/Renderer.js

export class Renderer {
    
    // --- VẼ HÒN ĐÁ ---
    static drawStone(ctx, stone) {
        const s = stone.size;

        // 1. Viền ngoài (Màu tối)
        ctx.fillStyle = '#2c3e50'; 
        ctx.fillRect(stone.x, stone.y, s, s);

        // 2. Mặt đá chính (Xám trung tính)
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(stone.x + 2, stone.y + 2, s - 4, s - 4);

        // 3. Hiệu ứng vát cạnh 3D
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.moveTo(stone.x + 2, stone.y + 2);
        ctx.lineTo(stone.x + s - 2, stone.y + 2); 
        ctx.lineTo(stone.x + s/2, stone.y + s/2); 
        ctx.lineTo(stone.x + 2, stone.y + s - 2); 
        ctx.fill();

        // 4. Lõi vuông khắc lõm
        ctx.fillStyle = '#34495e';
        ctx.fillRect(stone.x + s/2 - 4, stone.y + s/2 - 4, 8, 8);
    }

    // --- VẼ NÚT BẤM ---
    static drawButton(ctx, button) {
        const s = button.tileSize;
        
        ctx.fillStyle = '#2b2d35';
        ctx.fillRect(button.x, button.y, s, s);
        ctx.strokeStyle = '#151619';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, s, s);

        let innerSize = s - 10;
        let offset = button.isPressed ? 4 : 0; 
        
        if (button.isPressed) {
            ctx.fillStyle = '#0a0a0c';
            ctx.fillRect(button.x + 5, button.y + 5, innerSize, innerSize);
        }

        ctx.fillStyle = button.isPressed ? '#1abc9c' : '#c0392b'; 
        ctx.fillRect(button.x + 5, button.y + 5 + offset, innerSize, innerSize - offset);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(button.x + 5, button.y + 5 + offset, innerSize, 3);
        
        if (button.isPressed) {
            ctx.save(); 
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#1abc9c';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(button.x + s/2, button.y + s/2 + offset, innerSize / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore(); 
        }
    }

    // --- VẼ MAP (HẦM NGỤC) ---
    static drawMap(ctx, map) {
        for (let row = 0; row < map.grid.length; row++) {
            for (let col = 0; col < map.grid[row].length; col++) {
                const cell = map.grid[row][col];
                const x = col * map.tileSize;
                const y = row * map.tileSize;

                // [0] - SÀN NGỤC 
                if (cell === 0) {
                    ctx.fillStyle = (row + col) % 2 === 0 ? '#1e1e24' : '#18181d';
                    ctx.fillRect(x, y, map.tileSize, map.tileSize);
                    
                    ctx.strokeStyle = '#111115';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, map.tileSize, map.tileSize);
                } 
                // [1] - TƯỜNG ĐÁ 
                else if (cell === 1) {
                    ctx.fillStyle = '#3a3f47';
                    ctx.fillRect(x, y, map.tileSize, map.tileSize);

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; 
                    ctx.fillRect(x, y, map.tileSize, 3);
                    ctx.fillRect(x, y, 3, map.tileSize);

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; 
                    ctx.fillRect(x, y + map.tileSize - 3, map.tileSize, 3);
                    ctx.fillRect(x + map.tileSize - 3, y, 3, map.tileSize);

                    ctx.strokeStyle = '#23262b';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y + map.tileSize / 2);
                    ctx.lineTo(x + map.tileSize, y + map.tileSize / 2);
                    ctx.moveTo(x + map.tileSize / 2, y);
                    ctx.lineTo(x + map.tileSize / 2, y + map.tileSize / 2);
                    ctx.moveTo(x + map.tileSize / 4, y + map.tileSize / 2);
                    ctx.lineTo(x + map.tileSize / 4, y + map.tileSize);
                    ctx.moveTo(x + map.tileSize * 3 / 4, y + map.tileSize / 2);
                    ctx.lineTo(x + map.tileSize * 3 / 4, y + map.tileSize);
                    ctx.stroke();
                } 
                // [2] - SÀN CHỖ NÚT BẤM (Để class Button tự vẽ nút đè lên)
                else if (cell === 2) {
                    ctx.fillStyle = (row + col) % 2 === 0 ? '#1e1e24' : '#18181d';
                    ctx.fillRect(x, y, map.tileSize, map.tileSize);
                    
                    ctx.strokeStyle = '#111115';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, map.tileSize, map.tileSize);
                }
                // [3] - CỔNG KHÓA 
                else if (cell === 3) {
                    ctx.fillStyle = '#1e1e24';
                    ctx.fillRect(x, y, map.tileSize, map.tileSize);

                    ctx.fillStyle = '#3a3f47';
                    ctx.fillRect(x, y, 6, map.tileSize);
                    ctx.fillRect(x + map.tileSize - 6, y, 6, map.tileSize);

                    ctx.fillStyle = '#4a5462'; 
                    ctx.fillRect(x + 8, y, 4, map.tileSize);
                    ctx.fillRect(x + 14, y, 4, map.tileSize);
                    ctx.fillRect(x + 20, y, 4, map.tileSize);
                    
                    ctx.beginPath();
                    ctx.moveTo(x + 8, y + map.tileSize); ctx.lineTo(x + 10, y + map.tileSize + 6); ctx.lineTo(x + 12, y + map.tileSize);
                    ctx.moveTo(x + 14, y + map.tileSize); ctx.lineTo(x + 16, y + map.tileSize + 6); ctx.lineTo(x + 18, y + map.tileSize);
                    ctx.moveTo(x + 20, y + map.tileSize); ctx.lineTo(x + 22, y + map.tileSize + 6); ctx.lineTo(x + 24, y + map.tileSize);
                    ctx.fill();
                    
                    ctx.fillStyle = '#2c333a';
                    ctx.fillRect(x + 6, y + 8, map.tileSize - 12, 6);
                    ctx.fillRect(x + 6, y + 20, map.tileSize - 12, 6);
                } 
                // [4] - CỔNG MỞ
                else if (cell === 4) {
                    let grad = ctx.createLinearGradient(x, y, x, y + map.tileSize);
                    grad.addColorStop(0, 'rgba(255, 215, 0, 0.2)'); 
                    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(x, y, map.tileSize, map.tileSize);

                    ctx.fillStyle = '#3a3f47';
                    ctx.fillRect(x, y, 6, map.tileSize);
                    ctx.fillRect(x + map.tileSize - 6, y, 6, map.tileSize);

                    ctx.fillStyle = '#4a5462';
                    ctx.beginPath();
                    ctx.moveTo(x + 8, y); ctx.lineTo(x + 10, y + 6); ctx.lineTo(x + 12, y);
                    ctx.moveTo(x + 14, y); ctx.lineTo(x + 16, y + 6); ctx.lineTo(x + 18, y);
                    ctx.moveTo(x + 20, y); ctx.lineTo(x + 22, y + 6); ctx.lineTo(x + 24, y);
                    ctx.fill();
                }
            }
        }
    }
}