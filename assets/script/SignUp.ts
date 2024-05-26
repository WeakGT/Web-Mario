const { ccclass, property } = cc._decorator;

@ccclass
export default class SignUp extends cc.Component {
    start() {
        let SubmitButton = new cc.Component.EventHandler();
        SubmitButton.target = this.node;
        SubmitButton.component = "Login";
        SubmitButton.handler = "onSignUp";
        cc.find("Canvas/SignUpForm/SubmitButton").getComponent(cc.Button).clickEvents.push(SubmitButton);

        let HomeButton = new cc.Component.EventHandler();
        HomeButton.target = this.node;
        HomeButton.component = "SignUp";
        HomeButton.handler = "loadHomeScene";
        cc.find("Canvas/HomeButton").getComponent(cc.Button).clickEvents.push(HomeButton);
    }

    onSignUp() {
        const email = cc.find("Canvas/SignUpForm/EmailBox").getComponent(cc.Label).string;
        const password = cc.find("Canvas/SignUpForm/PasswordBox").getComponent(cc.Label).string;

        firebase.auth().createUserWithEmailAndPassword(email, password)
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