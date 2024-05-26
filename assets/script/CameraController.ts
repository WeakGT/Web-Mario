const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    update(dt: number) {
        // if (!this.player) return;

        let cameraPosition = this.node.position;
        let playerPosition = this.player.position;
        
        console.log(playerPosition.x);
        console.log(cameraPosition.x);
        // remain Y-axit unchanged
        let newPosition = cc.v2(playerPosition.x, cameraPosition.y);

        // smoothly moving camera
        if (playerPosition.x >= 0) this.node.position = cameraPosition.lerp(newPosition, 0.1);
        else this.node.position = cc.v3(0, cameraPosition.y, cameraPosition.z);
        
        // clampf to avoid out of boundary
    }
}
