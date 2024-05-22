// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {
    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log(contact.getWorldManifold().normal.y);
        if (contact.getWorldManifold().normal.y != 1 || contact.getWorldManifold().normal.x != 0) {
            contact.disabled = true;
        }
    }
}
