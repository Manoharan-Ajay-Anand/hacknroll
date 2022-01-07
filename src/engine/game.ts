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

    constructor(renderEngine: RenderEngine, physicsEngine: PhysicsEngine) {
        this.renderEngine = renderEngine;
        this.physicsEngine = physicsEngine;
        this.clock = new THREE.Clock();
        this.characterMap = new Map();
    }

    async loadCharacters(infos: CharacterInfo[]) {
        const characters = await Promise.all(
            infos.map(info => ModelLoader.loadCharacter(info))
        );
        for (const character of characters) {
            this.renderEngine.addCharacter(character);
            this.physicsEngine.addCharacter(character);
            this.characterMap.set(character.name, character);
        }
    }

    spawnCharacter(name: string) {
        if (!this.characterMap.has(name)) {
            return;
        }
        let character = this.characterMap.get(name);
        let spawned = ModelLoader.cloneCharacter(character);
        this.renderEngine.addCharacter(spawned);
        this.physicsEngine.addCharacter(spawned);
    }

    loop() {
        let dt = this.clock.getDelta();
        this.physicsEngine.step(dt ? dt : timeStep);
        this.renderEngine.render();
    }
}
