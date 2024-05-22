const { ccclass, property } = cc._decorator;

@ccclass
export class QuestionBox extends cc.Component {

    @property(cc.SpriteFrame)
    usedSprite: cc.SpriteFrame = null;

    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;

    private isHit: boolean = false;

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'Mario' && contact.getWorldManifold().normal.y < -0.5) this.onHit();   
    }

    onHit() {
        if (this.isHit) return;

        this.isHit = true;

        const moveUp = cc.moveBy(0.1, cc.v2(0, 10));
        const moveDown = cc.moveBy(0.1, cc.v2(0, -10));
        const sequence = cc.sequence(moveUp, moveDown, cc.callFunc(this.changeSprite, this));
        this.node.runAction(sequence);
    }

    changeSprite() {
        const anim = this.getComponent(cc.Animation);
        if (anim) anim.stop();
        
        this.getComponent(cc.Sprite).spriteFrame = this.usedSprite;
        this.spawnReward();
    }

    spawnReward() {
        if (this.rewardPrefab) {
            const reward = cc.instantiate(this.rewardPrefab);
            reward.setPosition(this.node.position.x, this.node.position.y + this.node.height, this.node.position.z);
            this.node.parent.addChild(reward);

            const moveUp = cc.moveBy(0.5, cc.v2(0, 50)).easing(cc.easeCubicActionOut());
            const fadeOut = cc.fadeOut(0.5);
            const sequence = cc.sequence(moveUp, fadeOut, cc.callFunc(() => reward.destroy()));
            reward.runAction(sequence);
        }
    }
}
