import * as THREE from 'three'
import { Character } from '../model/character';



export class RenderEngine {
    canvas: Element;
    scene: THREE.Scene;
    characters: Character[];
    env: THREE.Group;
    pointLight: THREE.PointLight;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    constructor(canvas: Element, sizes: {width: number, height: number}, 
        characters: Character[], env: THREE.Group) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.characters = characters;
        for (const character of this.characters) {
            this.scene.add(character.model);
        }
        this.env = env;
        this.scene.add(env);
        this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
        this.pointLight.position.set(0, 0, 10);
        this.scene.add(this.pointLight);
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 20;
        this.scene.add(this.camera);
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    resize(sizes: {width: number, height: number}) {
        this.camera.aspect = sizes.width / sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    moveCamera(vec: { x: number, y: number, z: number }) {
        this.camera.position.add(new THREE.Vector3(vec.x, vec.y, vec.z));
    }
}
