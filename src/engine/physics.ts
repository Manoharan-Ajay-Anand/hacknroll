import * as CANNON from "cannon-es";
import { Character } from "../model/character";

export class PhysicsEngine {
    world: CANNON.World;
    characters: Character[];

    constructor() {
        this.world = new CANNON.World({
        });
        this.characters = [];
    }

    addCharacter(character: Character, detectCollision: Function | undefined) {
        if (detectCollision) {
            character.body.addEventListener('collide', () => detectCollision(character));
        }
        this.world.addBody(character.body);
        this.characters.push(character);
    }

    step(dt: number) {
        this.world.step(dt);
        for (const character of this.characters) {
            let position = character.body.position;
            let quaternion = character.body.quaternion;
            character.model.position.set(position.x, position.y, position.z);
            character.model.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
    }
}
