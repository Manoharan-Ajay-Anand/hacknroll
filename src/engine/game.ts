import { Character, CharacterInfo } from "../model/character";
import { PhysicsEngine } from "./physics";
import { RenderEngine } from "./render";
import * as THREE from "three";
import ModelLoader from '../model/loader';
import { generateName, getRandomFloat } from '../utility'

const timeStep = 1 / 60;
export enum MODE {
    MENU,
    MATCHING,
    INGAME,
    END
}

const fishType: any = {
    'catfishAnim':{
        score: 5
    },
    "croc":{
        score: -5
    },
    "tuna":{
        score: 2
    },
    "turtle":{
        score: 50
    },
    "swordfish":{
        score: 100
    },
}

export class GameEngine {
    renderEngine: RenderEngine;
    physicsEngine: PhysicsEngine;
    characterMap: Map<string, Character>;
    clock: THREE.Clock;
    // model_mixers: any[];
    fishies: Character[];
    mode: MODE;
    username: string;
    menuGUI: any;
    pauseMenu: any;
    scoreEl: any;
    playerNum: number;
    isPause: boolean;
    score: number;
    spawnInterval: any;
    spawnTime: number;
    fishCount: number;
    
    

    constructor(renderEngine: RenderEngine, physicsEngine: PhysicsEngine) {
        this.renderEngine = renderEngine;
        this.physicsEngine = physicsEngine;
        this.clock = new THREE.Clock();
        this.characterMap = new Map();
        this.fishies = [];
        this.mode = MODE.MENU;
        this.username = generateName();
        this.menuGUI = document.getElementById("menu-title");
        this.pauseMenu = document.getElementById("pause-menu");
        this.scoreEl = document.getElementById('score');
        this.playerNum = 0;
        this.isPause = false;
        this.score = 0;
        this.spawnInterval = null;
        this.fishCount = 0;







        this.set_peaceful_spawn();
        
    }

    common_spawn(){  //spawnLogic: Function
        let spawnLogic = this.spawnLogic;
        var self = this;
        if (this.spawnInterval != null){
            clearInterval(this.spawnInterval);
        }
        this.spawnInterval = setInterval(()=>{
            // spawnLogic(self)
            this.spawnLogic();
        }, this.spawnTime);
    }
    spawnLogic(){
        console.log("spawnLogic")
        console.log(`this.fishCount: ${this.fishCount}`)
        if (this.fishCount == 50) {
            return;
        }
        let pos_x = getRandomFloat(-80, 80);
        let pos_z = getRandomFloat(-80, 80);
        let rot_x = getRandomFloat(0, Math.PI);
        let rot = new THREE.Euler(0, rot_x, 0);
        let velocity = new THREE.Vector3(3, 0, 0);
        velocity.applyEuler(rot); 
        let fishes = Object.keys(fishType);
        let randKey = fishes[Math.floor(Math.random() * fishes.length)]

        // let fishCount = this.fishCount;

        this.spawnCharacter(
            randKey, 
            new THREE.Vector3(pos_x, -4, pos_z),
            rot,
            velocity,
            (character: Character) => {
                console.log("BOOM")
                console.log(character)
                character.body.velocity.set(0, -10, 0);
                character.body.angularVelocity.set(-1, 0, 0);
                console.log(`SCORE: ${this.score}`)
                setTimeout(() => {
                    this.removeCharacter(character);
                }, 300)
                let name: string = character.info.name;
                if ( name in fishType){
                    this.score += fishType[name]["score"];
                    this.fishCount -= 1;
                }
                this.scoreEl.innerHTML = this.score.toString();
            }
        );
        
        this.fishCount++;
        
    }

    set_mode(mode: MODE){
        this.mode = mode
        this.change_state();
    }

    set_spawn_rush(){
        this.spawnTime = 300;
        this.common_spawn()
    }

    set_peaceful_spawn(){
        this.spawnTime = 1000;
        this.common_spawn();
    }
    
    
    get_my_name(){
        return this.username;
    }
    change_state(){
        if (this.mode == MODE.MENU){
            this.menuGUI.style.display = 'flex';
            this.renderEngine.move_player_to_menu();
        }
        if (this.mode == MODE.MATCHING){
            this.menuGUI.style.display = 'none';
        }
        if (this.mode == MODE.INGAME){
            this.renderEngine.add_cross_hair();
            this.renderEngine.move_player_to_start(this.playerNum);
            this.renderEngine.setup_pointlock();
            this.score = 0;
            this.set_peaceful_spawn();
            // document.addEventListener("keydown", (e) => {
            //     // console.log(e.keyCode);
            //     // console.log(e.key);
            //     // console.log(e.code);
            //     // console.log(e.shiftKey);
            //     if (e.code == "Escape"){
            //         this.isPause = true;
            //         this.pauseMenu.style.display="flex"
            //     }
            // });
            // window.addEventListener("focus",(e)=>{
            //     document.body.requestPointerLock();
            // })
            // document.body.addEventListener("click",(e)=>{
            //     document.body.requestPointerLock();
            // })
        }
    }

    async loadCharacters(infos: CharacterInfo[]) {
        const characters = await Promise.all(
            infos.map(info => ModelLoader.loadCharacter(info))
        );
        for (const character of characters) {
            //this.renderEngine.addCharacter(character);
            //this.physicsEngine.addCharacter(character);
            this.characterMap.set(character.info.name, character);
        }
    }

    spawnCharacter(name: string, pos: THREE.Vector3, rot: THREE.Euler
        , velocity: THREE.Vector3, detectCollision: Function | undefined = undefined) {
        // console.log("")
        if (!this.characterMap.has(name)) {
            return;
        }
        let character = this.characterMap.get(name);
        let spawned = ModelLoader.cloneCharacter(character);
        spawned.model.position.set(pos.x, pos.y, pos.z);
        spawned.body.position.set(pos.x, pos.y, pos.z);
        spawned.body.velocity.set(velocity.x, velocity.y, velocity.z);
        spawned.body.quaternion.setFromEuler(rot.x, rot.y, rot.z);

        console.log(`FISHY LENGTH: ${this.fishies.length}`)
        this.fishies.push(spawned)
        this.renderEngine.addCharacter(spawned);
        this.physicsEngine.addCharacter(spawned, detectCollision);
    }

    removeCharacter(character: Character) {
        this.physicsEngine.removeCharacter(character);
        this.renderEngine.removeCharacter(character);
    }

    updateAnimalMovement(dt: number){
        
        for(let idx in this.fishies){
            let cur_fish = this.fishies[idx]
            let model = cur_fish.model;
            let char_info = cur_fish.info;
            // console.log(info)
            if (char_info.mixer){
                char_info.mixer.update(dt)
            }
            // let direction: THREE.Vector3 = cur_fish.direction.clone();
            // console.log(`direction:`)
            // console.log(direction)
            // let displace = direction.multiplyScalar(char_info.relaxSpeed);
            // console.log("displace")
            // console.log(displace)
            // let pos = model.position; 
            // // model.position.copy(pos);
            // console.log("BEFORE")
            // console.log(pos)
            // pos = pos.add(displace);
            // console.log("AFTER")
            // console.log(pos)
            // cur_fish.model.position.set(pos.x, pos.y, pos.z);
            // cur_fish.body.position.set(pos.x, pos.y, pos.z);
            // this.fishies[idx].update(dt)
        }
    }

    add_point_lock(){
        
    }


    loop() {
        let dt = this.clock.getDelta();
        this.updateAnimalMovement(dt)
        
        this.physicsEngine.step(dt ? dt : timeStep);
        this.renderEngine.render();
    }
}
