const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    start () {
        // firebase.auth().onAuthStateChanged(user => {
        //     if (user) {} // read database
        //     else cc.director.loadScene("Home");
        // });

        let StartButton = new cc.Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component = "Menu";
        StartButton.handler = "loadGameScene";
        
        cc.find("Canvas/L1_Button").getComponent(cc.Button).clickEvents.push(StartButton);
        cc.find("Canvas/L2_Button").getComponent(cc.Button).clickEvents.push(StartButton);
    }

    loadGameScene() {
        cc.director.loadScene("GameStart1"); 
    }
    
}
