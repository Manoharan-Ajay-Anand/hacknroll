import * as CANNON from "cannon-es";
import * as THREE from 'three'

export class CharacterInfo {
    name: string;
    mass: number;
    scale: number;
    halfExtents: THREE.Vector3;
    hasAnimation: boolean;

    constructor(name: string, mass: number, scale: number, halfExtents: THREE.Vector3) {
        this.name = name;
        this.mass = mass;
        this.scale = scale;
        this.halfExtents = halfExtents;
        this.hasAnimation = false;
    }

    set_has_anim(has_anim: boolean){
        this.hasAnimation = has_anim;
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
