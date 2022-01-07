import { Character, CharacterInfo } from "../model/character";
import { PhysicsEngine } from "./physics";
import { RenderEngine } from "./render";
import * as THREE from "three";
import ModelLoader from '../model/loader';

const timeStep = 1 / 60;

export class GameEngine {
    renderEngine: RenderEngine;
    physicsEngine: PhysicsEngine;
    characterMap: Map<string, Character>;
    clock: THREE.Clock;
    // model_mixers: any[];
    fishies: Character[];

    constructor(renderEngine: RenderEngine, physicsEngine: PhysicsEngine) {
        this.renderEngine = renderEngine;
        this.physicsEngine = physicsEngine;
        this.clock = new THREE.Clock();
        this.characterMap = new Map();
        this.fishies = [];
    }

    async loadCharacters(infos: CharacterInfo[]) {
        const characters = await Promise.all(
            infos.map(info => ModelLoader.loadCharacter(info))
        );
        for (const character of characters) {
            //this.renderEngine.addCharacter(character);
            //this.physicsEngine.addCharacter(character);
            this.characterMap.set(character.info.name, character);
        }
    }

    spawnCharacter(name: string, pos: THREE.Vector3, rot: THREE.Euler, velocity: THREE.Vector3) {
        // console.log("")
        if (!this.characterMap.has(name)) {
            return;
        }
        let character = this.characterMap.get(name);
        let spawned = ModelLoader.cloneCharacter(character);
        spawned.model.position.set(pos.x, pos.y, pos.z);
        spawned.body.position.set(pos.x, pos.y, pos.z);
        spawned.body.velocity.set(velocity.x, velocity.y, velocity.z);
        spawned.body.quaternion.setFromEuler(rot.x, rot.y, rot.z);

        console.log(`FISHY LENGTH: ${this.fishies.length}`)
        this.fishies.push(spawned)
        this.renderEngine.addCharacter(spawned);
        this.physicsEngine.addCharacter(spawned);
    }

    updateAnimalMovement(dt: number){
        
        for(let idx in this.fishies){
            let cur_fish = this.fishies[idx]
            let model = cur_fish.model;
            let char_info = cur_fish.info;
            // console.log(info)
            if (char_info.mixer){
                char_info.mixer.update(dt)
            }
            // let direction: THREE.Vector3 = cur_fish.direction.clone();
            // console.log(`direction:`)
            // console.log(direction)
            // let displace = direction.multiplyScalar(char_info.relaxSpeed);
            // console.log("displace")
            // console.log(displace)
            // let pos = model.position; 
            // // model.position.copy(pos);
            // console.log("BEFORE")
            // console.log(pos)
            // pos = pos.add(displace);
            // console.log("AFTER")
            // console.log(pos)
            // cur_fish.model.position.set(pos.x, pos.y, pos.z);
            // cur_fish.body.position.set(pos.x, pos.y, pos.z);
            // this.fishies[idx].update(dt)
        }
    }

    loop() {
        let dt = this.clock.getDelta();
        this.updateAnimalMovement(dt)
        
        this.physicsEngine.step(dt ? dt : timeStep);
        this.renderEngine.render();
    }
}
