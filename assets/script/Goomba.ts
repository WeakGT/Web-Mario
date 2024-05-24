const { ccclass, property } = cc._decorator;

@ccclass
export class Goomba extends cc.Component {


    @property(cc.SpriteFrame)
    diedGoombaSprite: cc.SpriteFrame = null;

    private moveDirection: number = 1;
    private moveSpeed: number = 80;
    private isDied: boolean = false;


    onLoad() {
        this.schedule(() => {
            this.node.scaleX *= -1
        }, 0.25);
    }

    update(dt) {
        if (!this.isDied) this.node.x += this.moveDirection * this.moveSpeed * dt;
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
        if (otherCollider.node.name.substring(0, 8) == "Boundary") {
            this.moveDirection *= -1;
        }
        else if (otherCollider.node.parent.name == "Enemies") {
            contact.disabled = true;
        }
        else if (otherCollider.node.name == "Mario") {
            if (contact.getWorldManifold().normal.y > 0.5) {
                this.die();
            }
            else { // Mario die

            }
        }
    }

    public die() {
        this.isDied = true;
        this.node.runAction(cc.callFunc(() => {
            this.getComponent(cc.Sprite).spriteFrame = this.diedGoombaSprite;
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.3);
        }, this));
    }
}
