const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLevel2 extends cc.Component {
    onLoad() {
        
    }
    start() {
        this.schedule(function() {
            cc.director.loadScene("level1");
        }, 1.5);
    }
}
