import './style.css'
import ModelLoader from './model/loader'
import { RenderEngine } from './engine/render'
import { PhysicsEngine } from './engine/physics';
import { CharacterInfo } from './model/character';
import * as THREE from 'three'
import { GameEngine } from './engine/game';

const characterInfos: Array<CharacterInfo> = [
    new CharacterInfo(
        'catfishAnim', 10, 1, new THREE.Vector3(0, 10, 0), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'croc', 10, 1, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'raft', 10, 10, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'swordfish', 10, 1, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'tuna', 10, 1, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'turtle', 10, 1, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'Derringer', 10, 1, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
    new CharacterInfo(
        'machi', 10, 1, new THREE.Vector3(), new THREE.Vector3(1, 1, 1)
    ),
];

function startAnimation(gameEngine: GameEngine) {
    gameEngine.loop()
    window.requestAnimationFrame(() => startAnimation(gameEngine));
}

async function init() {
    const env = await ModelLoader.loadEnv();
    // const water = await ModelLoader.loadWater();water
    const renderEngine = new RenderEngine(
        document.querySelector('canvas.webgl'), 
        { width: window.innerWidth, height: window.innerHeight },
        env
    );
    const physicsEngine = new PhysicsEngine();
    const gameEngine = new GameEngine(renderEngine, physicsEngine);
    
    window.addEventListener('resize', () => {
        renderEngine.resize({ width: window.innerWidth, height: window.innerHeight });
    });
    // keyboardJS.bind('w', () => {
    //     renderEngine.moveCamera({x: 0, y: 0, z: -1});
    // });
    
    // keyboardJS.bind('s', () => {
    //     renderEngine.moveCamera({x: 0, y: 0, z: 1});
    // });
    
    // keyboardJS.bind('a', () => {
    //     renderEngine.moveCamera({x: -1, y: 0, z: 0});
    // });
    
    // keyboardJS.bind('d', () => {
    //     renderEngine.moveCamera({x: 1, y: 0, z: 0});
    // });
    await gameEngine.loadCharacters(characterInfos);
    startAnimation(gameEngine);
}

init();
