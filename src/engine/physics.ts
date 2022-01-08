import * as CANNON from "cannon-es";
import { Character } from "../model/character";

export class PhysicsEngine {
    world: CANNON.World;
    characters: Map<String, Character>;

    constructor() {
        this.world = new CANNON.World({
        });
        this.characters = new Map();
    }

    addCharacter(character: Character, detectCollision: Function | undefined) {
        if (detectCollision) {
            character.body.addEventListener('collide', () => detectCollision(character));
        }
        this.world.addBody(character.body);
        this.characters.set(character.model.uuid, character);
    }

    removeCharacter(character: Character) {
        this.world.removeBody(character.body);
        this.characters.delete(character.model.uuid);
    }

    step(dt: number) {
        this.world.step(dt);
        const characters = this.characters.values()
        while(true) {
            const result = characters.next();
            if (result.done) {
                break;
            }
            const character: Character = result.value;
            let position = character.body.position;
            let quaternion = character.body.quaternion;
            character.model.position.set(position.x, position.y, position.z);
            character.model.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
    }
}
