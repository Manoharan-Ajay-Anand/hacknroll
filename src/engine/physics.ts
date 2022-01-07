import * as CANNON from "cannon-es";
import { RenderEngine } from "./render";

const timeStep = 1 / 60;
let lastCallTime: number;

export class PhysicsEngine {
    renderEngine: RenderEngine;
    world: CANNON.World;
    catfishBody: CANNON.Body;
    raftBody: CANNON.Body;


    constructor(renderEngine: RenderEngine) {
        this.renderEngine = renderEngine;
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0), 
        });
        this.catfishBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Sphere(1),
        });
        this.catfishBody.position.set(0, 5, 0);
        this.world.addBody(this.catfishBody);
        this.raftBody = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Sphere(1),
        });
        this.raftBody.position.set(0, 5, 0);
        this.world.addBody(this.raftBody);
    }

    animate() {
        const time = performance.now() / 1000;
        if (!lastCallTime) {
            this.world.step(timeStep);
        } else {
            this.world.step(timeStep, time - lastCallTime);
        }
        lastCallTime = time;
        this.renderEngine.setCatfishPosition(this.catfishBody.position, this.catfishBody.quaternion);
        this.renderEngine.setRaftPosition(this.raftBody.position, this.raftBody.quaternion);
        this.renderEngine.render();
    }
}
