import './style.css'
import ModelLoader from './model/loader'
import { RenderEngine } from './engine/render'
import { PhysicsEngine } from './engine/physics';
import { CharacterInfo,FRONT } from './model/character';
import * as THREE from 'three'
import { GameEngine } from './engine/game';
const fishType = [
    'catfishAnim',
    "croc",
    "tuna",
    "turtle",
    "swordfish",
  ]
const characterInfos: Array<CharacterInfo> = [
    new CharacterInfo(
        'catfishAnim', 10, 1, new THREE.Vector3(1, 1, 1), 3, 8,FRONT.x,
    ),
    new CharacterInfo(
        'croc', 10, 1, new THREE.Vector3(1, 1, 1), 5, 10,FRONT.z
    ),
    new CharacterInfo(
        'raft', 10, 10, new THREE.Vector3(1, 1, 1), 0, 0,FRONT.x,
    ),
    new CharacterInfo(
        'swordfish', 10, 1, new THREE.Vector3(1, 1, 1), 15, 25,FRONT.z
    ),
    new CharacterInfo(
        'tuna', 10, 1, new THREE.Vector3(1, 1, 1), 10, 15,FRONT.x
    ),
    new CharacterInfo(
        'turtle', 10, 1, new THREE.Vector3(1, 1, 1), 4, 8,FRONT.z
    ),
    new CharacterInfo(
        'Derringer', 10, 1, new THREE.Vector3(1, 1, 1), 0, 0,FRONT.x
    ),
    new CharacterInfo(
        'machi', 10, 1, new THREE.Vector3(1, 1, 1), 0, 0,FRONT.x
    ),
];

function startAnimation(gameEngine: GameEngine) {
    gameEngine.loop()
    window.requestAnimationFrame(() => startAnimation(gameEngine));
}

function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
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
    gameEngine.spawnCharacter('raft', new THREE.Vector3());
    setInterval(() => {
        let pos_x = getRandomArbitrary(-80, 80);
        let pos_z = getRandomArbitrary(-80, 80);
        gameEngine.spawnCharacter(
            fishType[Math.floor(Math.random() * fishType.length)], 
            new THREE.Vector3(pos_x, -4, pos_z)
        );
    }, 2000);
}

init();
