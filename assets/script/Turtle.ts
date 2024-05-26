const { ccclass, property } = cc._decorator;

@ccclass
export class Turtle extends cc.Component {

    @property
    moveSpeed: number = 100;

    @property(cc.SpriteFrame)
    shellSprite: cc.SpriteFrame = null;

    private moveDirection: number = 1;
    public state: number = 1; // 1: turtle, 2: shell, 3: shellRunning
    private anim: cc.Animation = null;
    private marioUnable: boolean = false;
    private onGround: boolean = true;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("TurtleWalking");
    }

    update(dt) {
        if (this.state == 1) this.node.x += this.moveDirection * this.moveSpeed * dt;
        else if (this.state == 2) this.node.x = this.node.x; // stop
        else if (this.state == 3) {
            this.node.x += this.moveDirection * this.moveSpeed * 2 * dt;
            if (!this.onGround) this.node.y -= this.moveSpeed * dt;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == "Mario") {
            const marioComponent = otherCollider.node.getComponent("Mario");
            if (marioComponent.life == 0) {
                contact.disabled = true;
                return;
            }
        }
        /* ---------- ---------- ---------- */
        if (otherCollider.node.parent.name == "Collider") {
            console.log(this.onGround);
            if (contact.getWorldManifold().normal.y == -1) this.onGround = true;
            else this.onGround = false;
        }

        if (this.state == 1) {
            if (otherCollider.node.name == "BoundaryNULL") {
                this.moveDirection *= -1;
                this.node.scaleX *= -1;
            }
            else if (otherCollider.node.parent.name == "Enemies") {
                contact.disabled = true;
            }
            else if (otherCollider.node.name == "Mario") {
                const contactNormal = contact.getWorldManifold().normal;
                if (contactNormal.y > 0.5) {
                    if (this.anim.getAnimationState("TurtleWalking").isPlaying) this.anim.stop();                        
                    this.getComponent(cc.Sprite).spriteFrame = this.shellSprite;
                    this.state = 2; // shell
                }
                else {} // Mario Die
            }
        }
        else if (this.state == 2) {
            if (otherCollider.node.name == "Mario") {
                const contactNormal = contact.getWorldManifold().normal;
                if (contactNormal.x != 0) this.moveDirection = contactNormal.x > 0 ? -1 : 1;
                else this.moveDirection = Math.random() >= 0.5 ? 1 : 0;
                if (!this.anim.getAnimationState("ShellRunning").isPlaying) this.anim.play("ShellRunning");
                this.marioUnable = true;
                this.scheduleOnce(() => {
                    this.marioUnable = false;
                }, 0.1);
                this.state = 3;
            }
        }
        else if (this.state == 3) {
            if (otherCollider.node.parent.name == "Enemies") {
                otherCollider.node.destroy();
            }
            else if (otherCollider.node.name == "Boundary" && Math.abs(contact.getWorldManifold().normal.x) == 1) {
                this.moveDirection *= -1;
                this.node.scaleX *= -1;
            }
            else if (otherCollider.node.name == "BoundaryNULL") {
                contact.disabled = true;
            }
            else if (otherCollider.node.name == "Mario") {
                if (this.marioUnable) return;

                const contactNormal = contact.getWorldManifold().normal;
                if (contactNormal.y > 0.5) {
                    if (this.anim.getAnimationState("ShellRunning").isPlaying) this.anim.stop();                        
                    this.getComponent(cc.Sprite).spriteFrame = this.shellSprite;
                    this.state = 2; // shell
                }
                else {} // Mario Die
            }
        }
    }
    // onEndContact(contact, selfCollider, otherCollider) {
    //     if (otherCollider.node.parent.name == "Collider") {
    //         if (contact.getWorldManifold().normal.y == 1) this.onGround = false;
    //         else this.onGround = true;
    //     }
    // }
}