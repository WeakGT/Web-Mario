const { ccclass, property } = cc._decorator;

@ccclass
export class Turtle extends cc.Component {

    @property
    moveSpeed: number = 100;

    @property(cc.SpriteFrame)
    shellSprite: cc.SpriteFrame = null;

    private body: cc.RigidBody = null;
    private moveDirection: number = 1;
    private isShell: boolean = false;
    private canCollide: boolean = true;
    private anim: cc.Animation = null;

    onLoad() {
        this.body = this.getComponent(cc.RigidBody);
        this.body.linearVelocity = cc.v2(this.moveSpeed, 0);

        this.anim = this.getComponent(cc.Animation);
        this.anim.play("TurtleWalking");
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.canCollide) return;

        this.canCollide = false;
        this.scheduleOnce(() => {
            this.canCollide = true;
        }, 0.1);

        if (this.isShell) {
            if (otherCollider.node.name == "Mario") {
                const contactNormal = contact.getWorldManifold().normal;
                if (contactNormal.x != 0) {
                    this.moveDirection = contactNormal.x > 0 ? -1 : 1;
                    this.body.linearVelocity = cc.v2(this.moveDirection * this.moveSpeed * 2, 0); // 快速移動
                }
                if (!this.anim.getAnimationState("ShellRunning").isPlaying) this.anim.play("ShellRunning");
            }
            else if (otherCollider.node.name == "BoundaryNULL") {
                contact.disable = true;
            }
            else if (otherCollider.node.name == "Boundary") {
                this.moveDirection *= -1;
                this.body.linearVelocity = cc.v2(this.moveDirection * this.moveSpeed, 0);
                this.node.scaleX *= -1;
            }
        } else {
            if (otherCollider.node.name == "BoundaryNULL" || otherCollider.node.name == "Turtle") {
                this.moveDirection *= -1;
                this.body.linearVelocity = cc.v2(this.moveDirection * this.moveSpeed, 0);
                this.node.scaleX *= -1;
            } else if (otherCollider.node.name == "Mario") {
                const contactNormal = contact.getWorldManifold().normal;
                if (contactNormal.y > 0.8) {
                    this.node.runAction(cc.callFunc(this.changeToShell, this));
                } else { // Mario die

                }
            }
        }
    }

    changeToShell() {
        if (this.anim.getAnimationState("TurtleWalking").isPlaying) this.anim.stop();

        this.isShell = true;
        this.body.linearVelocity = cc.v2(0, 0);
        this.getComponent(cc.Sprite).spriteFrame = this.shellSprite;
        
    }
}