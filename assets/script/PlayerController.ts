// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class PlayerController extends cc.Component {

    @property()
    playerSpeed: number = 300;

    @property()
    playerStandSpeed: number = 50;

    private moveDir = 0;
    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private physicManager: cc.PhysicsManager = null;
    private fallDown: boolean = false;
    private idleFrame: cc.SpriteFrame = null;
    private anim: cc.Animation = null;

    onLoad(){
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2 (0, -200);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        // ========== TODO ==========
        // 1. Assign the animation component into this.anim from this.node
        this.anim = this.getComponent(cc.Animation);

    }

    update(dt) {
        this.node.x += this.playerSpeed * this.moveDir * dt;
        this.node.scaleX = (this.moveDir >= 0) ? 1 : -1;
        if(this.getComponent(cc.RigidBody).linearVelocity.y != 0) this.fallDown = true;
        else this.fallDown = false;
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.leftDown = true;
                this.playerMove(-1);
                break;
            case cc.macro.KEY.right:
                this.rightDown = true;
                this.playerMove(1);
                break;
            case cc.macro.KEY.a:
                this.reborn(cc.v3(-445, -275, 0));
                break;
            case cc.macro.KEY.space:
                this.playerJump(200);
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.leftDown = false;
                if(this.rightDown)
                    this.playerMove(1);
                else
                    this.playerMove(0);
                break;
            case cc.macro.KEY.right:
                this.rightDown = false;
                if(this.leftDown)
                    this.playerMove(-1);
                else
                    this.playerMove(0);
                break;
        }
    }

    public playerMove(moveDir: number) {
        this.moveDir = moveDir;
    }

    public playerJump(velocity: number)
    {
        if(!this.fallDown)
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, velocity);
    }

    public reborn(rebornPos: cc.Vec3)
    {
        this.node.position = rebornPos;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2();
    }
}
