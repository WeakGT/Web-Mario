const {ccclass, property} = cc._decorator;

@ccclass
export class GameManager extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    // @property(cc.AudioClip)
    // flyingSE: cc.AudioClip = null;

    // @property(cc.Prefab)
    // pigsmPrefabs: cc.Prefab = null;

    // @property(cc.Prefab)
    // pigbgPrefabs: cc.Prefab = null;

    start() {
        this.playBGM();
        // this.pigInstantiate();
    }

    playBGM() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    // playEffect() {
    //     cc.audioEngine.playEffect(this.flyingSE, false);
    // }

    // pigInstantiate() {
    //     // ===================== TODO 5 =====================
    //     // 1. Instantiate a small pig (this.pigsmPrefabs)
    //     //    under node Environment, and set it position
    //     //    to (822.711, 240.513) 
    //     // 2. Instantiate a big pig (this.pigbgPrefabs)
    //     //    under node Environment, and set it position
    //     //    to (822.711, 335.628) 
    //     var pig_sm = cc.instantiate(this.pigsmPrefabs);
    //     pig_sm.setPosition(822.711, 240.513);
    //     cc.find("Canvas/Environment").addChild(pig_sm);
        
    //     var pig_bg = cc.instantiate(this.pigbgPrefabs);
    //     pig_bg.setPosition(822.711, 335.628);
    //     cc.find("Canvas/Environment").addChild(pig_bg);
    //     // ==================================================
    // }
}
