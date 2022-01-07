import './style.css'
import ModelLoader from './model/loader'
import { RenderEngine } from './engine/render'
import { PhysicsEngine } from './engine/physics';
import * as keyboardJS from 'keyboardjs'
import { CharacterInfo, Character } from './model/character';
import * as THREE from 'three'

const modelNames = ['catfishAnim', 'croc', 'env', 'raft', 'swordfish', 'tuna', 'turtle'];

const characterInfos: Array<CharacterInfo> = [
    new CharacterInfo('catfishAnim', 10, new THREE.Vector3()),
    new CharacterInfo('croc', 10, new THREE.Vector3(0, 5, 0)),
    new CharacterInfo('env', 0, new THREE.Vector3()),
    new CharacterInfo('raft', 10, new THREE.Vector3()),
    new CharacterInfo('swordfish', 10, new THREE.Vector3()),
    new CharacterInfo('tuna', 10, new THREE.Vector3()),
    new CharacterInfo('turtle', 10, new THREE.Vector3()),
];

function startAnimation(physicsEngine: PhysicsEngine) {
    physicsEngine.animate();
    window.requestAnimationFrame(() => startAnimation(physicsEngine));
}

async function init() {
    const characters = await Promise.all(characterInfos.map(info => ModelLoader.loadCharacter(info)));
    const renderEngine = new RenderEngine(
        document.querySelector('canvas.webgl'), 
        { width: window.innerWidth, height: window.innerHeight },
        characters
    );
    const physicsEngine = new PhysicsEngine(renderEngine, characters);
    window.addEventListener('resize', () => {
        renderEngine.resize({ width: window.innerWidth, height: window.innerHeight });
    });
    keyboardJS.bind('w', () => {
        renderEngine.moveCamera({x: 0, y: 0, z: -1});
    });
    
    keyboardJS.bind('s', () => {
        renderEngine.moveCamera({x: 0, y: 0, z: 1});
    });
    
    keyboardJS.bind('a', () => {
        renderEngine.moveCamera({x: -1, y: 0, z: 0});
    });
    
    keyboardJS.bind('d', () => {
        renderEngine.moveCamera({x: 1, y: 0, z: 0});
    });
    
    startAnimation(physicsEngine);
}

init();
