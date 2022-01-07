import * as CANNON from "cannon-es";
import * as THREE from 'three'

const speed_multiplier = 0.1;   // TODO: TAG THIS TO FPS
// interface Char_Info_Params {
//     name: string, mass: number, scale: number, halfExtents: THREE.Vector3, relaxSpeed:number = 5, panikSpeed:number = 12, front = FRONT.z
// }
export class CharacterInfo {
    name: string;
    mass: number;
    scale: number;
    halfExtents: THREE.Vector3;
    hasAnimation: boolean;
    relaxSpeed: number;   // TODO: MAKE THIS A RAND RANGE CENTERING ON THIS NUM
    panikSpeed: number;
    mixer: THREE.AnimationMixer;
    front: FRONT;

    

    constructor(name: string, mass: number, scale: number, halfExtents: THREE.Vector3, relaxSpeed:number = 5, panikSpeed:number = 12, front = FRONT.z) {
        this.name = name;
        this.mass = mass;
        this.scale = scale;
        this.halfExtents = halfExtents;
        this.hasAnimation = false;
        this.relaxSpeed = relaxSpeed * speed_multiplier;
        this.panikSpeed = panikSpeed * speed_multiplier;
        this.front = front;
        
    }

    set_has_anim(has_anim: boolean){
        this.hasAnimation = has_anim;
    }

    set_mixer(mixer: THREE.AnimationMixer){
        this.mixer = mixer;
    }

    clone(){
        let cloned =  new CharacterInfo(this.name, this.mass, this.scale, this.halfExtents, this.relaxSpeed, this.panikSpeed, this.front);
        // cloned.set_mixer(this.mixer);
        cloned.set_has_anim(this.hasAnimation);
        return cloned;
    }
}

export class Character {
    info: CharacterInfo;
    body: CANNON.Body;
    model: THREE.Object3D;
    direction: THREE.Vector3;
    animation: THREE.AnimationClip[];
    

    constructor(info: CharacterInfo, body: CANNON.Body, model: THREE.Object3D, animation: THREE.AnimationClip[]) {
        this.info = info;
        this.body = body;
        this.model = model;
        this.animation = animation;
        if (info.front == FRONT.x){
            this.direction = new THREE.Vector3(1.0,0.0,0.0).normalize();
        } else {
            this.direction = new THREE.Vector3(0.0,0.0,1.0).normalize();
        }
        
    }
}


export enum FRONT {
    x,y,z
}