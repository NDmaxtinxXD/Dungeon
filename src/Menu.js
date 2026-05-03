export class Menu {
    constructor(canvasWidth) {
        this.buttons = [
            {
                id: 'restart',
                text: "🔄 Restart (R)",
                x: canvasWidth - 160,
                y: 20,
                width: 140,
                height: 40,
                bgColor: "rgba(180, 40, 40, 0.8)"
            }
        ];
    }

    draw(ctx) {
        for (let btn of this.buttons) {
            ctx.fillStyle = btn.bgColor;
            ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
            
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

            ctx.fillStyle = "white";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
        }
    }

    getClickedButton(mouseX, mouseY) {
        for (let btn of this.buttons) {
            if (mouseX >= btn.x && mouseX <= btn.x + btn.width &&
                mouseY >= btn.y && mouseY <= btn.y + btn.height) {
                return btn.id; 
            }
        }
        return null; 
    }
}