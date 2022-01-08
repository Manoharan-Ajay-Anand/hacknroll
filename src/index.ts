import './style.css'
import ModelLoader from './model/loader'
import { RenderEngine } from './engine/render'
import { PhysicsEngine } from './engine/physics';
import { Character, CharacterInfo, FRONT } from './model/character';
import { AudioManager,AudioInfo } from "./engine/audio"
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine, MODE } from './engine/game';
import * as keyboardjs from 'keyboardjs';


const fishType = [
    'catfishAnim',
    "croc",
    "tuna",
    "turtle",
    "swordfish",
  ]
const characterInfos: Array<CharacterInfo> = [
    new CharacterInfo(
        'catfishAnim', 10, 1, new THREE.Vector3(3, 2, 2), 3, 8,FRONT.x, 2, 4
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
        'machi', 10, 1, new THREE.Vector3(1, 1, 1), 0, 0,FRONT.x, 4, 2
    ),
];

const audioInfo: Array<AudioInfo> = [
    new AudioInfo("ambi1Trimmed.m4a","ambi1",false,true,0.25,true,true),
    new AudioInfo("ambi2.m4a","ambi2",false,true,0.5,false,true),
    new AudioInfo("ambi3.m4a","ambi3",false,true,0.5,false,true),
    new AudioInfo("WeeeeeShort.wav", "shoot",false, false, 0.75, false,false)
]

function startAnimation(gameEngine: GameEngine) {
    gameEngine.loop()
    window.requestAnimationFrame(() => startAnimation(gameEngine));
}

// function getRandomArbitrary(min: number, max: number) {
//     return Math.random() * (max - min) + min;
// }

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

    let username = gameEngine.get_my_name();
    document.getElementById("userName").innerHTML = username;

    const audioManager = new AudioManager(audioInfo);

    document.getElementById("play_audio").onclick = function () {
        audioManager.play_by_name("ambi1");
    }
    
    const menuBanner: HTMLImageElement = document.getElementById("menuBanner") as HTMLImageElement;
    menuBanner.src = "/ugliestTitle.png"

    const score = document.getElementById('score');

    document.getElementById("match_mode").onclick = function (){
        menuBanner.style.display = 'none'
        gameEngine.set_mode(MODE.MATCHING);
        audioManager.play_by_name("ambi3");
        score.style.display = "block";
        // just testing the flow
        setTimeout(()=>{
            gameEngine.set_mode(MODE.INGAME);
            audioManager.play_by_name("ambi2");
            
        },1000)
        
    }
    document.getElementById('continue_play').onclick = ()=>{
        document.body.requestPointerLock();
    }
    document.getElementById('exit_game').onclick = ()=>{
        gameEngine.set_mode(MODE.MENU);
        audioManager.play_by_name("ambi1");
        document.getElementById("pause-menu").style.display = 'none';
        menuBanner.style.display = 'block'
        score.style.display = "none";
    }

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
    gameEngine.spawnCharacter(
        'raft', new THREE.Vector3(), 
        new THREE.Euler(), new THREE.Vector3()
    );
    keyboardjs.bind('space', () => {
        let rot = renderEngine.camera.quaternion;
        let velocity = new THREE.Vector3(0, 0, -200);
        velocity.applyQuaternion(rot);
        gameEngine.spawnCharacter(
            'machi', renderEngine.camera.position, 
            new THREE.Euler(), velocity,
        );
        // play shooting audio
        audioManager.play_by_name("shoot");
    });
    

}

init();
