const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {
    start() {
        let SubmitButton = new cc.Component.EventHandler();
        SubmitButton.target = this.node;
        SubmitButton.component = "Login";
        SubmitButton.handler = "onLogin";
        cc.find("Canvas/LoginForm/SubmitButton").getComponent(cc.Button).clickEvents.push(SubmitButton);

        let HomeButton = new cc.Component.EventHandler();
        HomeButton.target = this.node;
        HomeButton.component = "Login";
        HomeButton.handler = "loadHomeScene";
        cc.find("Canvas/HomeButton").getComponent(cc.Button).clickEvents.push(HomeButton);
    }

    onLogin() {
        const email = cc.find("Canvas/LoginForm/EmailBox").getComponent(cc.Label).string;
        const password = cc.find("Canvas/LoginForm/PasswordBox").getComponent(cc.Label).string;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Logged in
                console.log('User logged in:', userCredential.user);
                cc.director.loadScene("menu");
            })
            .catch((error) => {
                // console.error('Error logging in:', error);
                alert(error.message);
            });
    }

    loadHomeScene() {
        cc.director.loadScene("Home");
    }
}