import * as CANNON from "cannon-es";
import * as THREE from 'three'

export class CharacterInfo {
    name: string;
    mass: number;
    scale: number;
    halfExtents: THREE.Vector3;

    constructor(name: string, mass: number, scale: number, halfExtents: THREE.Vector3) {
        this.name = name;
        this.mass = mass;
        this.scale = scale;
        this.halfExtents = halfExtents;
    }
}

export class Character {
    info: CharacterInfo;
    body: CANNON.Body;
    model: THREE.Object3D;

    constructor(info: CharacterInfo, body: CANNON.Body, model: THREE.Object3D) {
        this.info = info;
        this.body = body;
        this.model = model;
    }
}
