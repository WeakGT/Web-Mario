const { ccclass, property } = cc._decorator;

@ccclass
export class QuestionBox extends cc.Component {

    @property(cc.SpriteFrame)
    usedSprite: cc.SpriteFrame = null;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mushroomPrefab: cc.Prefab = null;

    private isHit: boolean = false;

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'Mario' && contact.getWorldManifold().normal.y < -0.5) {
            this.onHit(selfCollider);
        }
    }

    onHit(selfCollider: cc.Collider) {
        if (this.isHit) return;

        this.isHit = true;

        this.node.runAction(
            cc.sequence(
                cc.moveBy(0.1, cc.v2(0, 10)),
                cc.moveBy(0.1, cc.v2(0, -10)),
                cc.callFunc(() => {
                    const anim = this.getComponent(cc.Animation);
                    if (anim) anim.stop();
                    
                    this.getComponent(cc.Sprite).spriteFrame = this.usedSprite;
                    this.spawnReward(selfCollider.tag);
                }, this)
            )
        );
    }

    spawnReward(tag: number) {
        let prefabToInstantiate = null;

        if (tag == 0) prefabToInstantiate = this.coinPrefab;
        else if (tag == 1) prefabToInstantiate = this.mushroomPrefab;
        
        if (prefabToInstantiate) {
            const reward = cc.instantiate(prefabToInstantiate);
            reward.setPosition(this.node.position.x, this.node.position.y + this.node.height, this.node.position.z);
            this.node.parent.addChild(reward);

            if (tag == 0) {
                const moveUp = cc.moveBy(0.5, cc.v2(0, 50)).easing(cc.easeCubicActionOut());
                const fadeOut = cc.fadeOut(0.5);
                const sequence = cc.sequence(moveUp, fadeOut, cc.callFunc(() => reward.destroy()));
                reward.runAction(sequence);
            } else if (tag == 1) {
                const moveUp = cc.moveBy(0.5, cc.v2(0, 50)).easing(cc.easeCubicActionOut());
                reward.runAction(moveUp);
            }
        }
    }
}
