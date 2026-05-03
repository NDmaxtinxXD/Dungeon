export class Ghost {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;  
        this.height = 24;
        this.speed = 1; 
        
        // Ghi lại thời điểm con ma được sinh ra
        this.spawnTime = Date.now();
        // Cài đặt thời gian chờ (3000 mili-giây = 3 giây)
        this.delayTime = 3000; 
    }

    // Logic bay xuyên tường đuổi theo người chơi
    update(player) {
        // KIỂM TRA THỜI GIAN: Nếu chưa đủ 3 giây thì return luôn, không làm gì cả (đứng im)
        if (Date.now() - this.spawnTime < this.delayTime) {
            return; 
        }

        // Nếu đã qua 3 giây, bắt đầu đuổi theo
        let ghostCenterX = this.x + this.width / 2;
        let ghostCenterY = this.y + this.height / 2;
        let playerCenterX = player.x + player.width / 2;
        let playerCenterY = player.y + player.height / 2;

        if (ghostCenterX < playerCenterX) this.x += this.speed;
        if (ghostCenterX > playerCenterX) this.x -= this.speed;
        if (ghostCenterY < playerCenterY) this.y += this.speed;
        if (ghostCenterY > playerCenterY) this.y -= this.speed;
    }

    // Vẽ con ma
    draw(ctx) {
        // KIỂM TRA HIỆU ỨNG: Nếu đang trong 3 giây chờ, cho nó nhấp nháy mờ mờ cho ngầu
        let isWaiting = Date.now() - this.spawnTime < this.delayTime;
        
        if (isWaiting) {
            // Hiệu ứng chớp nháy mỗi 200ms
            if (Math.floor(Date.now() / 200) % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Mờ
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Rõ
            }
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Khi bắt đầu đuổi thì hiện rõ
        }

        // Vẽ thân hình
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Hai con mắt đỏ
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x + 6, this.y + 8, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 18, this.y + 8, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Kiểm tra va chạm với người chơi
    checkCollision(player) {
        // Trừ hao 4 pixel để k quá khó chơi
        return (
            this.x < player.x + player.width - 4 &&
            this.x + this.width - 4 > player.x &&
            this.y < player.y + player.height - 4 &&
            this.y + this.height - 4 > player.y
        );
    }
}