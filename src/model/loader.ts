import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
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
                collisionResponse: false,
                collisionFilterGroup: charInfo.collisionGroup,
                collisionFilterMask: charInfo.collisionTarget
            });
            model.scale.setScalar(charInfo.scale);
            //Animation
            // console.log("ANIMATIONs")
            // console.log(charInfo.name)
            // console.log(gltf.animations)
            let animations:any[] = []
            if (gltf.animations && gltf.animations.length > 0) {
                // console.log("Set has animation")
                let mixer = new THREE.AnimationMixer( model );
                animations = gltf.animations;
                charInfo.set_has_anim(true);
                for (let idx in animations){
                    let clipAction = mixer.clipAction( animations[ idx ] );
                    clipAction.play();
                }
                // let mixer = new THREE.AnimationMixer( gltf.scene );
                // var action = mixer.clipAction( gltf.animations[ 0 ] );
	            // action.play();
                charInfo.set_mixer(mixer);
            }
            return new Character(charInfo, body, model, animations);
        });
    },
    cloneCharacter(character: Character) {
        // console.log("cloneCharacter")
        let info = character.info.clone();
        let halfExtents = info.halfExtents;
        let animations = character.animation.slice();
        let model = SkeletonUtils.clone(character.model);
        info.set_mixer(new THREE.AnimationMixer(model));
        // console.log(animations)
        for (let idx in animations){
            let clipAction = info.mixer.clipAction( animations[ idx ] );
            clipAction.play();
        }
        let body = new CANNON.Body({
            mass: info.mass,
            shape: new CANNON.Box(new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z)),
            collisionResponse: false,
            collisionFilterGroup: info.collisionGroup,
            collisionFilterMask: info.collisionTarget
        }); 
        return new Character(info, body, model, animations);
    }
};
