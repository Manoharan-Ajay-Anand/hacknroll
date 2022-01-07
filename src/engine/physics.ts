import * as CANNON from "cannon-es";
import { Character } from "../model/character";
import { RenderEngine } from "./render";

const timeStep = 1 / 60;
let lastCallTime: number;

export class PhysicsEngine {
    renderEngine: RenderEngine;
    world: CANNON.World;
    characters: Character[];
    groundBody: CANNON.Body;


    constructor(renderEngine: RenderEngine, characters: Character[]) {
        this.renderEngine = renderEngine;
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0), 
        });
        this.groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane()
        });
        this.groundBody.position.set(0, 0, 0);
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(this.groundBody);
        this.characters = characters;
        for (const character of this.characters) {
            this.world.addBody(character.body);
        }
    }

    animate() {
        const time = performance.now() / 1000;
        if (!lastCallTime) {
            this.world.step(timeStep);
        } else {
            this.world.step(timeStep, time - lastCallTime);
        }
        lastCallTime = time;
        for (const character of this.characters) {
            let body = character.body;
            character.model.position.set(body.position.x, body.position.y, body.position.z);
            character.model.quaternion.set(body.quaternion.x, body.quaternion.y, 
                body.quaternion.z, body.quaternion.w);
        } 
        this.renderEngine.render();
    }
}
