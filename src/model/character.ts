import * as CANNON from "cannon-es";
import * as THREE from 'three'

export class CharacterInfo {
    name: string;
    mass: number;
    scale: number;
    startPos: THREE.Vector3;
    halfExtents: THREE.Vector3;

    constructor(name: string, mass: number, scale: number, startPos: THREE.Vector3, 
        halfExtents: THREE.Vector3) {
        this.name = name;
        this.mass = mass;
        this.scale = scale;
        this.startPos = startPos;
        this.halfExtents = halfExtents;
    }
}

export class Character {
    name: string;
    info: CharacterInfo;
    body: CANNON.Body;
    model: THREE.Group;

    constructor(name: string, info: CharacterInfo, body: CANNON.Body, model: THREE.Group) {
        this.name = name;
        this.info = info;
        this.body = body;
        this.model = model;
    }
}
