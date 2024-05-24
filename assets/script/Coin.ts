const { ccclass, property } = cc._decorator;

@ccclass
export class Coin extends cc.Component {

    onLoad() {
        // this.schedule(() => {
        //     const rotate = cc.rotateBy(0.5, 360, 0, 0);
        //     this.node.runAction(rotate);
        // }, 0.5);
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

        if (otherCollider.node.name === 'Mario') {
            this.node.destroy();
        }
    }

    
}
