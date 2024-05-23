const {ccclass, property} = cc._decorator;

@ccclass
export class GameManager extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    start() {
        this.playBGM();
    }

    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }
}
