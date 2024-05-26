const {ccclass, property} = cc._decorator;

@ccclass
export default class Win extends cc.Component {
    onLoad() {
        
    }
    start() {
        this.schedule(function() {
            cc.director.loadScene("menu");
        }, 1.5);
    }
}
