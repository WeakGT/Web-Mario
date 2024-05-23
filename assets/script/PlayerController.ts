const {ccclass, property} = cc._decorator;

@ccclass
export class PlayerController extends cc.Component {

    @property()
    playerSpeed: number = 200;

    private moveDir = 0;
    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private physicManager: cc.PhysicsManager = null;
    private anim: cc.Animation = null;

    onLoad(){
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2(0, -1500);
        this.anim = this.getComponent(cc.Animation);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    // start() {}

    update(dt) {
        this.node.x += this.playerSpeed * this.moveDir * dt;
        this.node.scaleX = this.moveDir >= 0 ? 1 : -1;
        this.playAnimation();
    }

    playAnimation() {
        if(this.moveDir == 0) this.anim.stop();
        else if(!this.anim.getAnimationState("SmallMarioWalking").isPlaying) this.anim.play("SmallMarioWalking");
    }

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.left) this.leftDown = true, this.moveDir = -1;
        if (event.keyCode == cc.macro.KEY.right) this.rightDown = true, this.moveDir = 1;
        if (event.keyCode == cc.macro.KEY.a) this.reborn(cc.v3(-445, -275, 0));
        if (event.keyCode == cc.macro.KEY.space) this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 400);
    }

    onKeyUp(event) {
        if (event.keyCode == cc.macro.KEY.left) {
            this.leftDown = false;
            this.moveDir = this.rightDown ? 1 : 0;
        }
        if (event.keyCode == cc.macro.KEY.right) {
            this.rightDown = false;
            this.moveDir = this.leftDown ? -1 : 0;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // Boundary || BoundaryNULL
        if (otherCollider.node.name.substring(0, 8) == "Boundary") {
            contact.disabled = true;
        }
    }

    public reborn(rebornPos: cc.Vec3) {
        this.node.position = rebornPos;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2();
    }
}