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
        console.log("----- Login -----");

        const email = cc.find("Canvas/LoginForm/EmailBox").getComponent(cc.EditBox).string;
        const password = cc.find("Canvas/LoginForm/PasswordBox").getComponent(cc.EditBox).string;

        console.log(email);
        console.log(password);

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