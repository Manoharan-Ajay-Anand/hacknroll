import * as CANNON from "cannon-es";
import * as THREE from 'three'

export class CharacterInfo {
    name: string;
    mass: number;
    scale: number;
    halfExtents: THREE.Vector3;
    hasAnimation: boolean;
    relaxSpeed: number;
    panikSpeed: number;
    mixer: THREE.AnimationMixer;

    constructor(name: string, mass: number, scale: number, halfExtents: THREE.Vector3, relaxSpeed:number = 5, panikSpeed:number = 12) {
        this.name = name;
        this.mass = mass;
        this.scale = scale;
        this.halfExtents = halfExtents;
        this.hasAnimation = false;
        this.relaxSpeed = relaxSpeed;
        this.panikSpeed = panikSpeed;
    }

    set_has_anim(has_anim: boolean){
        this.hasAnimation = has_anim;
    }

    set_mixer(mixer: THREE.AnimationMixer){
        this.mixer = mixer;
    }

    clone(){
        let cloned =  new CharacterInfo(this.name, this.mass, this.scale, this.halfExtents, this.relaxSpeed, this.panikSpeed);
        // cloned.set_mixer(this.mixer);
        cloned.set_has_anim(this.hasAnimation);
        return cloned;
    }
}

export class Character {
    info: CharacterInfo;
    body: CANNON.Body;
    model: THREE.Object3D;
    animation: any;
    

    constructor(info: CharacterInfo, body: CANNON.Body, model: THREE.Object3D, animation: any) {
        this.info = info;
        this.body = body;
        this.model = model;
        this.animation = animation;
    }
}
