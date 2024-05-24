const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLevel1 extends cc.Component {
    // onLoad() {}
    start() {
        this.schedule(() => {
            cc.director.loadScene("menu");
        }, 1.5);
    }
}
