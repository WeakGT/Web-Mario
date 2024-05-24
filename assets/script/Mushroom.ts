const { ccclass, property } = cc._decorator;

@ccclass
export class Mushroom extends cc.Component {

    private moveDirection: number = 1;
    private moveSpeed: number = 80;
    private onGround: boolean = false;

    // onLoad() {}

    update(dt) {
        this.node.x += this.moveDirection * this.moveSpeed * dt;
        if (!this.onGround) this.node.y -= this.moveSpeed * dt;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "Mario") {
            const marioComponent = otherCollider.node.getComponent("Mario");
            if (marioComponent.life == 0) {
                contact.disabled = true;
                return;
            }
        }
        /* ---------- ---------- ---------- */
        if (otherCollider.node.name == "Boundary") this.moveDirection *= -1;
        else if (otherCollider.node.name == "BoundaryNULL") contact.disabled = true;
        else if (otherCollider.node.parent.name == "Enemies") contact.disabled = true;
        else if (otherCollider.node.name.substring(0, 6) == "Ground") this.onGround = true;
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name.substring(0, 6) == "Ground") this.onGround = false;
    }
}
