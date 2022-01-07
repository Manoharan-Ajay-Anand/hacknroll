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
    model_mixers: any[];

    constructor(renderEngine: RenderEngine, physicsEngine: PhysicsEngine) {
        this.renderEngine = renderEngine;
        this.physicsEngine = physicsEngine;
        this.clock = new THREE.Clock();
        this.characterMap = new Map();
        this.model_mixers = [];
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

    spawnCharacter(name: string, pos: THREE.Vector3) {
        if (!this.characterMap.has(name)) {
            return;
        }
        let character = this.characterMap.get(name);
        let spawned = ModelLoader.cloneCharacter(character);
        spawned.model.position.copy(pos);
        spawned.body.position.set(pos.x, pos.y, pos.z);
        // run the animation
        if (character.info.hasAnimation == true){
            console.log("HAS ANIMATION")
            let anims = spawned.animation;
            console.log(anims)
            let mixer = new THREE.AnimationMixer( spawned.model );
            for (let idx in anims){
                let clipAction = mixer.clipAction( anims[ idx ] );
                clipAction.play();
            }
            this.model_mixers.push(mixer);
        }
        // spawned.model.tick = (delta) => mixer.update(delta);
        this.renderEngine.addCharacter(spawned);
        this.physicsEngine.addCharacter(spawned);
    }

    loop() {
        let dt = this.clock.getDelta();
        for(let idx in this.model_mixers){
            this.model_mixers[idx].update(dt)
        }
        this.physicsEngine.step(dt ? dt : timeStep);
        this.renderEngine.render();
    }
}
