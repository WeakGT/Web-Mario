const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    start () {
        let LoginButton = new cc.Component.EventHandler();
        LoginButton.target = this.node;
        LoginButton.component = "Home";
        LoginButton.handler = "loadLoginScene";
        cc.find("Canvas/LoginButton").getComponent(cc.Button).clickEvents.push(LoginButton);

        let SignUpButton = new cc.Component.EventHandler();
        SignUpButton.target = this.node;
        SignUpButton.component = "Home";
        SignUpButton.handler = "loadSignUpScene";
        cc.find("Canvas/SignUpButton").getComponent(cc.Button).clickEvents.push(SignUpButton);
    }

    loadLoginScene() {
        cc.director.loadScene("Login"); 
    }

    loadSignUpScene() {
        cc.director.loadScene("SignUp"); 
    }
    
}
