import * as THREE from 'three'
import ModelLoader from '../model/loader'

export class RenderEngine {
    canvas: Element;
    scene: THREE.Scene;
    raft: THREE.Group;
    catfish: THREE.Group;
    pointLight: THREE.PointLight;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    constructor(canvas: Element, sizes: {width: number, height: number}) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
        this.pointLight.position.set(0, 0, 10);
        this.scene.add(this.pointLight);
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 20;
        this.scene.add(this.camera);
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    async init() {
        this.raft = await ModelLoader.loadRaft();
        this.catfish = await ModelLoader.loadCatFish();
        this.scene.add(this.raft);
        this.scene.add(this.catfish);
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

    setCatfishPosition(pos: { x: number, y: number, z: number }, quat: { x: number, y: number, z: number, w: number }) {
        this.catfish.position.set(pos.x, pos.y, pos.z);
        this.catfish.quaternion.set(quat.x, quat.y, quat.z, quat.w);
    }

    setRaftPosition(pos: { x: number, y: number, z: number }, quat: { x: number, y: number, z: number, w: number }) {
        this.raft.position.set(pos.x, pos.y, pos.z);
        this.raft.quaternion.set(quat.x, quat.y, quat.z, quat.w);
    }
}
