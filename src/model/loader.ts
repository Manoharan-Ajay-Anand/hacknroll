import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

const loader = new GLTFLoader();

export default {
    async loadRaft(): Promise<THREE.Group> {
        return loader.loadAsync('/raft.gltf').then(gltf => {
            let raft = gltf.scene;
            return raft;
        });
    },
    async loadCatFish(): Promise<THREE.Group> {
        return loader.loadAsync('/catfish.gltf').then(gltf => {
            return gltf.scene;
        });
    }
};
