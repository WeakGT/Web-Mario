const { ccclass, property } = cc._decorator;

@ccclass
export class Flower extends cc.Component {

    // @property(cc.Integer)
    // scoreValue: number = 100;

    @property(cc.Vec2)
    moveRange: cc.Vec2 = cc.v2(0, 100);

    @property(cc.Float)
    moveDuration: number = 2.0;

    private initialPosition: cc.Vec2 = null;

    onLoad() {
        this.getComponent(cc.Animation).play("Flower");
        this.startMoving();
    }

    startMoving() {
        const action = cc.repeatForever(
            cc.sequence(
                cc.moveBy(1, 0, -35),
                cc.delayTime(1),
                cc.moveBy(1, 0, 35),
                cc.delayTime(1))
        );
        this.node.runAction(action);
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
    }
}
