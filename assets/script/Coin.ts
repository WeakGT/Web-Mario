const { ccclass, property } = cc._decorator;

@ccclass
export class Coin extends cc.Component {

    @property
    jumpHeight: number = 50;

    @property
    jumpDuration: number = 0.3;

    onLoad() {
        // this.schedule(() => {
        //     const rotate = cc.rotateBy(0.5, 360, 0, 0);
        //     this.node.runAction(rotate);
        // }, 0.5);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // 判断碰撞的节点是否为玛利奥
        if (otherCollider.node.name === 'Mario') {
            // 创建跳跃动作
            // const jumpAction = cc.jumpBy(this.jumpDuration, cc.v2(0, 0), this.jumpHeight, 1);
            // // 同时执行跳跃动作和消失动作
            // const action = cc.sequence(jumpAction, cc.callFunc(() => {
            //     this.node.destroy(); // 动作执行完毕后销毁金币节点
            // }));
            // this.node.runAction(action);
            this.node.destroy();
        }
    }

    
}
