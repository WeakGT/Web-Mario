const {ccclass, property} = cc._decorator;

@ccclass
export class PlayerController extends cc.Component {

    @property()
    playerSpeed: number = 144;

    @property(cc.SpriteFrame)
    smallMarioSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bigMarioSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    diedMarioSprite: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.AudioClip)
    coinSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    jumpSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    kickSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerUpSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerDownSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    stompSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    dieSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameOverSound: cc.AudioClip = null;


    private moveDir = 0;
    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private physicManager: cc.PhysicsManager = null;
    private anim: cc.Animation = null;
    private rigidBody: cc.RigidBody = null;
    private isDescending: boolean = false;
    private fallDown: boolean = false;
    private isInvincible: boolean = false;
    public life: number = 1;
    private score: number = 0;

    private remainTime: number = 300;
    private remainLife: number = 5;

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        cc.audioEngine.playEffect(this.bgm, true);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    // start() {}

    playAnimation() {
        if (this.moveDir == 0) {
            this.anim.stop();
        }
        else if (this.life == 0) {
            this.anim.stop();
        }
        else if (this.life == 1) {
            if (!this.anim.getAnimationState("SmallMarioWalking").isPlaying) this.anim.play("SmallMarioWalking");
        }
        else if (this.life == 2) {
            if (!this.anim.getAnimationState("BigMarioWalking").isPlaying) this.anim.play("BigMarioWalking");
        }
    }

    reborn(rebornPos: cc.Vec3) {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.position = rebornPos;
        // this.getComponent(cc.RigidBody).linearVelocity = cc.v2();
        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.bgm, true);
        this.getComponent(cc.Sprite).spriteFrame = this.smallMarioSprite;
        this.life = 1;
        this.moveDir = 0;
        this.remainTime = 300;
        this.beInvincible();
    }

    die() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.remainLife -= 1;
        if (this.remainLife > 0) { // life -= 1
            cc.audioEngine.stopAll();
            cc.audioEngine.playEffect(this.dieSound, false);
            this.getComponent(cc.Sprite).spriteFrame = this.diedMarioSprite;
            this.scheduleOnce(() => {
                this.reborn(cc.v3(-414, -280, 0));
            }, 2);
        }
        else { // game over
            cc.audioEngine.stopAll();
            cc.audioEngine.playEffect(this.gameOverSound, false);
            this.getComponent(cc.Sprite).spriteFrame = this.diedMarioSprite;
            this.scheduleOnce(() => {
                cc.director.loadScene("GameOver");
            }, 2);
        }
    }

    beInvincible() {
        this.isInvincible = true;
        this.scheduleOnce(() => {
            this.isInvincible = false;
        }, 1);

        // Flashing effect
        this.schedule(() => {
            this.node.opacity = this.node.opacity === 255 ? 0 : 255;
        }, 0.1, 9, 0);
    }

    takeDamage() {
        this.life -= 1;
        if (this.life >= 1) {
            cc.audioEngine.playEffect(this.powerDownSound, false);
            this.getComponent(cc.Sprite).spriteFrame = this.smallMarioSprite;
            this.beInvincible();
        }
        else {
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
            this.die();
        }
    }

    updateScore(addScore: number) {
        this.score += addScore;
        console.log(this.score);
        cc.log(this.score);
    }

    update(dt) {
        if (this.isDescending) { // win
            this.rigidBody.linearVelocity = cc.v2(0, -10);
        }
        else if (this.life == 0) { // die
            // do nothing
        }
        else if (this.node.y < -320) { // out of bound
            this.life = 0;
            this.die();
        }
        else { // gaming
            // timeout
            if (Math.floor(this.remainTime) > 0) this.remainTime -= dt;
            else this.life = 0, this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000), this.die();

            this.node.x += this.playerSpeed * this.moveDir * dt;
            this.node.scaleX = this.moveDir >= 0 ? 1 : -1;
            this.playAnimation();

            if (this.rigidBody.linearVelocity.y != 0) this.fallDown = true;
            else this.fallDown = false;            
        }

        // update UI
        // cc.find("Canvas/Main Camera/Labels/coinNum").getComponent(cc.Label).string = String(this.coin);
        cc.find("Canvas/Main Camera/Labels/LifeNumber").getComponent(cc.Label).string = String(this.remainLife);
        cc.find("Canvas/Main Camera/Labels/Time").getComponent(cc.Label).string = String(Math.floor(this.remainTime));
        cc.find("Canvas/Main Camera/Labels/Score").getComponent(cc.Label).string = ("0000000" + this.score.toString()).slice(-7);
    }

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.a) this.leftDown = true, this.moveDir = -1;
        if (event.keyCode == cc.macro.KEY.d) this.rightDown = true, this.moveDir = 1;
        if (event.keyCode == cc.macro.KEY.w && !this.fallDown) {
            this.rigidBody.linearVelocity = cc.v2(0, 692);
            cc.audioEngine.playEffect(this.jumpSound, false);
        }
        if (event.keyCode == cc.macro.KEY.space) this.reborn(cc.v3(1700, -250, 0));
    }

    onKeyUp(event) {
        if (event.keyCode == cc.macro.KEY.a) this.leftDown = false, this.moveDir = this.rightDown ? 1 : 0;
        if (event.keyCode == cc.macro.KEY.d) this.rightDown = false, this.moveDir = this.leftDown ? -1 : 0;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.life == 0) {
            contact.disabled = true;
            return;
        }

        // Boundary || BoundaryNULL
        if (otherCollider.node.name.substring(0, 8) == "Boundary") {
            contact.disabled = true;
        }
        else if (otherCollider.node.name == "Flag") { // win
            this.isDescending = true;
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
        else if (otherCollider.node.name == "Box" && this.isDescending && contact.getWorldManifold().normal.y == -1) { // win
            this.isDescending = false;
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            cc.director.loadScene("menu");
        }
        else if (otherCollider.node.parent.name == "Enemies" || otherCollider.node.name == "Flower") {
            if (otherCollider.node.name == "Goomba") {
                if (contact.getWorldManifold().normal.y < -0.5) {
                    cc.audioEngine.playEffect(this.stompSound, false);
                    this.rigidBody.linearVelocity = cc.v2(0, 692);
                    this.updateScore(100);
                }
                else {
                    if (this.isInvincible) contact.disabled = true;
                    else this.takeDamage();
                }
            }
            else if (otherCollider.node.name == "Turtle") {
                const turtleComponent = otherCollider.node.getComponent('Turtle');
                if (turtleComponent) {
                    if (turtleComponent.state == 1 || turtleComponent.state == 3) {
                        if (contact.getWorldManifold().normal.y < -0.5) {
                            cc.audioEngine.playEffect(this.stompSound, false);
                            this.rigidBody.linearVelocity = cc.v2(0, 692);
                            this.updateScore(100);
                        }
                        else {
                            if (this.isInvincible) contact.disabled = true;
                            else this.takeDamage();
                        }
                    }
                    else if (turtleComponent.state == 2) {
                        this.isInvincible = true;
                        this.scheduleOnce(() => {
                            this.isInvincible = false;
                        }, 1);
                        cc.audioEngine.playEffect(this.kickSound, false);
                        this.updateScore(100);
                    }
                    // state == 2, do nothing
                }
            }
            else if (otherCollider.node.name == "Flower") {
                if (this.isInvincible) contact.disabled = true;
                else this.takeDamage();
            }
        }
        // else if (otherCollider.node.name == "QuestionBox") {}
        else if (otherCollider.node.name == "Mushroom") {
            this.life += 1;
            cc.audioEngine.playEffect(this.powerUpSound, false);
            this.getComponent(cc.Sprite).spriteFrame = this.bigMarioSprite;
            otherCollider.node.destroy();
            this.beInvincible();
            this.updateScore(1000);
        }
        else if (otherCollider.node.name == "Coin") {
            cc.audioEngine.playEffect(this.coinSound, false);
            otherCollider.node.destroy();
            this.updateScore(100);
        }
    }
}
