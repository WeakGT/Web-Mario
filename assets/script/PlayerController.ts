const {ccclass, property} = cc._decorator;

@ccclass
export class PlayerController extends cc.Component {

    @property()
    playerSpeed: number = 144;

    @property(cc.SpriteFrame)
    smallMarioSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bigMarioSprite: cc.SpriteFrame = null;

    private moveDir = 0;
    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private physicManager: cc.PhysicsManager = null;
    private anim: cc.Animation = null;
    private rigidBody: cc.RigidBody = null;
    private isDescending: boolean = false;
    private fallDown: boolean = false;
    private life: number = 1;

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        // this.physicManager.gravity = cc.v2(0, -1500);
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.getComponent(cc.RigidBody);
        

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    // start() {}

    update(dt) {
        if (this.isDescending) {
            this.rigidBody.linearVelocity = cc.v2(0, -10);
        }
        else {
            this.node.x += this.playerSpeed * this.moveDir * dt;
            this.node.scaleX = this.moveDir >= 0 ? 1 : -1;
            this.playAnimation();

            if(this.rigidBody.linearVelocity.y != 0) this.fallDown = true;
            else this.fallDown = false;
        }
    }

    playAnimation() {
        if(this.moveDir == 0) {
            this.anim.stop();
        }
        else if (this.life == 1) {
            if(!this.anim.getAnimationState("SmallMarioWalking").isPlaying) this.anim.play("SmallMarioWalking");
        }
        else if (this.life == 2) {
            if(!this.anim.getAnimationState("BigMarioWalking").isPlaying) this.anim.play("BigMarioWalking");
        }
    }

    public reborn(rebornPos: cc.Vec3) {
        this.node.position = rebornPos;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2();
    }

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.a) this.leftDown = true, this.moveDir = -1;
        if (event.keyCode == cc.macro.KEY.d) this.rightDown = true, this.moveDir = 1;
        if (event.keyCode == cc.macro.KEY.w && !this.fallDown) this.rigidBody.linearVelocity = cc.v2(0, 692);
        if (event.keyCode == cc.macro.KEY.space) this.reborn(cc.v3(1700, -250, 0));
    }

    onKeyUp(event) {
        if (event.keyCode == cc.macro.KEY.a) this.leftDown = false, this.moveDir = this.rightDown ? 1 : 0;
        if (event.keyCode == cc.macro.KEY.d) this.rightDown = false, this.moveDir = this.leftDown ? -1 : 0;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // Boundary || BoundaryNULL
        if (otherCollider.node.name.substring(0, 8) == "Boundary") {
            contact.disabled = true;
        }
        else if (otherCollider.node.name == "Flag") {
            this.isDescending = true;
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
        else if (otherCollider.node.name == "Box" && this.isDescending && contact.getWorldManifold().normal.y == -1) {
            this.isDescending = false;
            this.rigidBody.linearVelocity = cc.v2(0, 0);
            cc.director.loadScene("menu");
        }
        else if (otherCollider.node.name == "Goomba" || otherCollider.node.name == "Turtle") {
            if (contact.getWorldManifold().normal.y < -0.8)
                this.rigidBody.linearVelocity = cc.v2(0, 692);
        }
        else if (otherCollider.node.name == "Mushroom") {
            this.life += 1;
            this.getComponent(cc.Sprite).spriteFrame = this.bigMarioSprite;
            otherCollider.node.destroy();
        }
    }
}