const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    update(dt: number) {
        // if (!this.player) return;

        let cameraPosition = this.node.position;
        let playerPosition = this.player.position;
        
        // remain Y-axit unchanged
        let newPosition = cc.v2(playerPosition.x, cameraPosition.y);

        // smoothly moving camera
        this.node.position = cameraPosition.lerp(newPosition, 0.1);
        
        // clampf to avoid out of boundary
    }
}
