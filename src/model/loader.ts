import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import * as CANNON from "cannon-es";
import { Character, CharacterInfo } from './character';

const loader = new GLTFLoader();

export default {
    loadEnv(): Promise<THREE.Group> {
        return loader.loadAsync(`/env.gltf`).then(gltf => {
            let model = gltf.scene;
            model.scale.setScalar(10);
            return model;
        });
    },
    loadCharacter(charInfo: CharacterInfo): Promise<Character> {
        return loader.loadAsync(`/${charInfo.name}.gltf`).then(gltf => {
            let halfExtents = charInfo.halfExtents;
            let model = gltf.scene;
            let body = new CANNON.Body({
                mass: charInfo.mass,
                shape: new CANNON.Box(new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z)),
                collisionResponse: false
            });
            let startPos = charInfo.startPos;
            model.scale.setScalar(charInfo.scale);
            model.position.copy(startPos);
            body.position.set(startPos.x, startPos.y, startPos.z);
            return new Character(charInfo.name, charInfo, body, model);
        });
    },
    cloneCharacter(character: Character) {
        let info = character.info;
        let halfExtents = info.halfExtents;
        let model = character.model.clone();
        let body = new CANNON.Body({
            mass: info.mass,
            shape: new CANNON.Box(new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z)),
            collisionResponse: false
        }); 
        return new Character(info.name, info, body, model);
    }
};
