const { ccclass, property } = cc._decorator;

@ccclass
export class Goomba extends cc.Component {

    @property
    moveSpeed: number = 80;

    @property(cc.SpriteFrame)
    diedGoombaSprite: cc.SpriteFrame = null;

    private body: cc.RigidBody = null;
    private moveDirection: number = 1;

    onLoad() {
        this.body = this.getComponent(cc.RigidBody);
        this.body.linearVelocity = cc.v2(this.moveSpeed, 0);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log(otherCollider.node.group);
        if (otherCollider.node.name == "Boundary" || otherCollider.node.name == "Goomba") {
            this.moveDirection *= -1;
            this.body.linearVelocity = cc.v2(this.moveDirection * this.moveSpeed, 0);
        }
        else if (otherCollider.node.name == "Mario") {
            if (contact.getWorldManifold().normal.y > 0.8) {
                this.node.runAction(cc.callFunc(this.changeSprite, this));
            }
            else { // Mario die

            }
        }
    }

    changeSprite() {
        this.body.linearVelocity = cc.v2(0, 0);
        this.getComponent(cc.Sprite).spriteFrame = this.diedGoombaSprite;
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.3);
    }
}
