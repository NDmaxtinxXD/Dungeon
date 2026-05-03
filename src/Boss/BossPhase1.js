import { Dash } from './Skills/Dash.js';

export class BossPhase1 {
    constructor(bossManager) {
        this.boss = bossManager;
        this.currentAttack = new Dash(this.boss); // Đổi tên biến thành currentAttack cho sát nghĩa
    }

    update(player, engine) {
        if (this.currentAttack) this.currentAttack.update(player, engine);
    }

    draw(ctx) {
        if (this.currentAttack) this.currentAttack.draw(ctx);
    }
}