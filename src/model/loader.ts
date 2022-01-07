import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import * as CANNON from "cannon-es";
import { Character, CharacterInfo } from './character';

const loader = new GLTFLoader();

export default {
    loadEnv(): Promise<THREE.Group> {
        return loader.loadAsync(`/env.gltf`).then(gltf => {
            return gltf.scene;
        });
    },
    loadCharacter(charInfo: CharacterInfo): Promise<Character> {
        return loader.loadAsync(`/${charInfo.name}.gltf`).then(gltf => {
            let model = gltf.scene;
            let body = new CANNON.Body({
                mass: charInfo.mass,
                shape: new CANNON.Sphere(1)
            });
            let startPos = charInfo.startPos;
            model.position.copy(startPos);
            body.position.set(startPos.x, startPos.y, startPos.z);
            return new Character(charInfo.name, body, model);
        });
    }
};
