import * as THREE from 'three'
import { Character } from '../model/character';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GUI } from "dat.gui";
import { Vector3 } from 'three';

const bloom_params = {
    exposure: 0.2,
    bloomStrength: 0.2,//0.9,
    bloomThreshold: 0.18,//,0.5,
    bloomRadius: 0.35
};

const USE_BLOOM = true;

const menu_cam = {
    pos: new THREE.Vector3(32, 10, 60),
    lookAt: new THREE.Vector3(-60, 10, 20)
}

const player_cam = [
    {
        pos: new THREE.Vector3(-4,10,2),
        rot: Math.PI/2
    }
]
// const player_pos = [
    
// ]

const loadShaders = async (v:any, f:any, others:any, loader:any) => {
    // console.log(`v and f: ${v}, ${f}`);
    let toRet = [];
    let p1 = new Promise<void>((resolve) => {
      loader.load(v, (data:any) => {
        toRet.push(data);
        resolve();
      });
    });
    let p2 = new Promise<void>((resolve) => {
      loader.load(f, (data:any) => {
        toRet.push(data);
        resolve();
      });
    });
    let promise_arr = [p1, p2]
  //   let utils = []
    for (let idx in others){
      promise_arr.push(
          new Promise<void>((resolve) => {
              let fp = others[idx]["path"]
              loader.load(fp, (data:any) => {
                  others[idx]["content"] = data
                  resolve();
              });
          })
      )
    }
    // toRet.push(await loader.load(v,(data)=>{return data }))
    // toRet.push(await loader.load(f,(data)=>{return data }))
    await Promise.all(promise_arr);
    // console.log(`toRet ${toRet.length}`);

  //   console.log(toRet);
    toRet.push(others)
    return toRet;
};
export class RenderEngine {
    canvas: Element;
    scene: THREE.Scene;
    env: THREE.Group;
    pointLight: THREE.PointLight;
    sunLight: THREE.DirectionalLight;
    camera: THREE.PerspectiveCamera;
    characters: Map<string, Character> = new Map();
    renderer: THREE.WebGLRenderer;
    sizes: any;
    composer: any;
    frame_start: any;
    timeTarget:any;
    fps: number;
    water_mat1: any;
    water_mat2: any;
    mat2texture: any;
    textureLoader: THREE.TextureLoader;
    controls: any;
    

    constructor(canvas: Element, sizes: {width: number, height: number}, env: THREE.Group) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.sizes = sizes;
        this.env = env;
        this.scene.add(env);
        let ambi_light_color = new THREE.Color(0xffffff);   //0x2a1a3a
        this.scene.add(new THREE.AmbientLight(ambi_light_color, 3.0));
        this.pointLight = new THREE.PointLight(0xffffff, 200);
        this.pointLight.position.set(100, 10, 50);
        const geometry = new THREE.SphereGeometry( 10, 32, 16 );
        const lightMat = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(0xFFA13C),
            emissiveIntensity: 12000.0
        })
        let sphere = new THREE.Mesh( geometry, lightMat );
        sphere.position.set(100, 200, 50);
        this.scene.add( sphere );
        this.scene.add(this.pointLight);
        // this.sunLight = new THREE.DirectionalLight(0xffffff, 10);
        // this.sunLight.position.set(0, 0, 1000);
        // // this.sunLight.rotation.x = Math.PI / 2;
        // this.scene.add(this.sunLight);
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000);
        //this.camera.position.set(-50, 10, 75);
        this.camera.position.set(menu_cam.pos.x, menu_cam.pos.y, menu_cam.pos.z);
        this.camera.lookAt(menu_cam.lookAt)
        this.scene.add(this.camera);
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        this.renderer.physicallyCorrectLights = true;
        if (USE_BLOOM === true){
            const renderScene = new RenderPass( this.scene, this.camera );

            const bloomPass = new UnrealBloomPass( new THREE.Vector2( sizes.width, sizes.height ), 1.5, 0.4, 0.85 );
            bloomPass.threshold = bloom_params.bloomThreshold;
            bloomPass.strength = bloom_params.bloomStrength;
            bloomPass.radius = bloom_params.bloomRadius;

            let composer = new EffectComposer( this.renderer );
            composer.addPass( renderScene );
            composer.addPass( bloomPass );
            this.composer = composer;


            const createGUI = () => {
                var gui: GUI = new GUI();
                gui.add( bloom_params, 'exposure', 0.1, 2 ).onChange( function ( value:any ) {
            
                    this.renderer.toneMappingExposure = Math.pow( value, 4.0 );
        
                } );
        
                gui.add( bloom_params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value:any ) {
        
                    bloomPass.threshold = Number( value );
        
                } );
        
                gui.add( bloom_params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value:any ) {
        
                    bloomPass.strength = Number( value );
        
                } );
        
                gui.add( bloom_params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value:any ) {
        
                    bloomPass.radius = Number( value );
        
                } );
        
        
        
                gui.domElement.id = 'gui';
            }
            createGUI();
        }

        
        this.textureLoader = new THREE.TextureLoader();


        this.fps = 30;
        this.timeTarget = 0;
        this.frame_start = Date.now();

        this.water_mat1 = {};
        this.water_mat2 = {};
        this.mat2texture = {};


        // let controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.target = new THREE.Vector3(25, 10, 30);
        // controls.update();
        this.controls  = null;//controls;

        this.initWater();
    }

    initWater(){
        //  Uniforms
        let scale = 10.0;
        let uniforms = {
            scale:{
                type: "f",
                value: scale,
            },
            time: {
                type: "f",
                value: 0.1,
            },
            pointscale: {
                type: "f",
                value: 0.2,
            },
            decay: {
                type: "f",
                value: 0.3,
            },
            size: {
                type: "f",
                value: 0.3,
            },
            displace: {
                type: "f",
                value: 0.3,
            },
            complex: {
                type: "f",
                value: 0.0,
            },
            waves: {
                type: "f",
                value: 0.1,
            },
            eqcolor: {
                type: "f",
                value: 0.0,
            },
            rcolor: {
                type: "f",
                value: 0.0,
            },
            gcolor: {
                type: "f",
                value: 0.0,
            },
            bcolor: {
                type: "f",
                value: 0.0,
            },
            fragment: {
                type: "i",
                value: true,
            },
            redhell: {
                type: "i",
                value: true,
            },
            resolution: new THREE.Uniform( new THREE.Vector2(this.sizes.width,this.sizes.height) ),
        };
        let shaderDir = "/shaders/";
        let listOfOthers = [   // fk i need to do compiler dependency tree liddat...
            {
                "name":"classicnoise2D",
                "path":'classicnoise2D.glsl',
                "is_vs":true,
                "is_fs":true,
            },
            {
                "name":"noise_utils",
                "path":'noise_utils.glsl',
                "is_vs":true,
                "is_fs":false,
            },
            {
              "name":"musgrave",
              "path":'musgrave.glsl',
              "is_vs":false,
              "is_fs":true,
            },
            {
              "name":"voronoi",
              "path":"voronoi.glsl"
            },
            {
              "name":"metaballs",
              "path": "metaballs.glsl"
            }
        ]
        for (let i = 0; i < listOfOthers.length; i += 1){
            listOfOthers[i]["path"] = shaderDir + listOfOthers[i]["path"]
        }

        // main shader paths
        let vertShader = shaderDir + "noise2D.vert";//"noise.vert";
        let fragShader = shaderDir + "noise.frag";

        let vertShader2 = shaderDir + "noise2D.vert";
        let fragShader2 = shaderDir + "waterBed.frag";

        let f_loader = new THREE.FileLoader();

        
        loadShaders(vertShader, fragShader, listOfOthers,f_loader).then((shaders) => {
            //Create shader text
            // console.log(shaders)
            // Plane
            const detail = 2;
            const plane_geom = new THREE.PlaneGeometry(8, 8, 32 * detail, 32 * detail); 
            let plane_mat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.merge([uniforms]),
                vertexShader: shaders[0].replace(/\r/gi, ""),
                fragmentShader: shaders[1].replace(/\r/gi, ""),
                side: THREE.DoubleSide,
                transparent: true
            });
            // console.log(shaders[2])
            let utils = shaders[2]
            plane_mat.onBeforeCompile = (shader:any) => {
                // console.log("onBeforeCompile")
                for (let i in utils){
                    for (let j in utils){
                    const re = new RegExp(`^(?!\/\/)#include <${utils[j]["name"]}>`, 'gm')
                    const content = utils[j]["content"]
                    utils[i]["content"] = utils[i]["content"].replace(
                        re,
                        content
                    )
                    }

                }
                for (let idx in utils){
                    let util = utils[idx]
                    // console.log(util["name"])
                    const re = new RegExp(`^(?!\/\/)#include <${util["name"]}>`, 'gm')
                    const content = util["content"]
                    shader.vertexShader = shader.vertexShader.replace(
                        re,
                        content
                    )
                    // console.log(`Replacing fragment`)
                    shader.fragmentShader = shader.fragmentShader.replace(
                        re,
                        content
                    )
                }
            }
            const plane:THREE.Object3D = new THREE.Mesh(plane_geom, plane_mat);
            plane.scale.set(scale,scale,scale);
            plane.rotation.x = Math.PI / 2;
            this.scene.add(plane);
            this.water_mat1 = plane_mat;
            });
        loadShaders(vertShader2, fragShader2, listOfOthers,f_loader).then((shaders) => {
            //Create shader text
            // console.log(shaders)

            // Plane

            let rockTexture = "/textures/water_rocks_1.jpg";
            this.mat2texture = this.textureLoader.load(rockTexture,(load_text)=>{
                this.mat2texture.wrapS = this.mat2texture.wrapT = THREE.RepeatWrapping;
                this.mat2texture.offset.set( 0, 0 );
                this.mat2texture.repeat.set( 2, 2 );
            }); 


            // console.log("image texture");
            // console.log(this.mat2texture);
            const detail = 2;
            const plane_geom = new THREE.PlaneGeometry(8, 8, 32 * detail, 32 * detail); 
            let thisUni = THREE.UniformsUtils.merge(
                [
                uniforms,
                {
                    texture1: {
                    value: this.mat2texture
                    }
                }
                ]
            )
            // console.log(thisUni)

            let plane_mat2 = new THREE.ShaderMaterial({
                uniforms: thisUni,
                vertexShader: shaders[0].replace(/\r/gi, ""),
                fragmentShader: shaders[1].replace(/\r/gi, ""),
                side: THREE.DoubleSide,
                // map: texture
                // transparent: true
            });
            
            plane_mat2.uniformsNeedUpdate = true;
            let utils = shaders[2]
            plane_mat2.onBeforeCompile = (shader:any) => {
                // console.log("onBeforeCompile")
                for (let i in utils){
                    for (let j in utils){
                    const re = new RegExp(`^(?!\/\/)#include <${utils[j]["name"]}>`, 'gm')
                    const content = utils[j]["content"]
                    utils[i]["content"] = utils[i]["content"].replace(
                        re,
                        content
                    )
                    }

                }
                for (let idx in utils){
                    let util = utils[idx]
                    // console.log(util["name"])
                    const re = new RegExp(`^(?!\/\/)#include <${util["name"]}>`, 'gm')
                    const content = util["content"]
                    shader.vertexShader = shader.vertexShader.replace(
                        re,
                        content
                    )
                    // console.log(`Replacing fragment`)
                    shader.fragmentShader = shader.fragmentShader.replace(
                        re,
                        content
                    )
                }
            }
            const plane:THREE.Object3D = new THREE.Mesh(plane_geom, plane_mat2);
            plane.position.y-= (scale);
            plane.rotation.x = Math.PI / 2;
            plane.scale.set(scale,scale,scale);
            // console.log(`plane.rotation: ${plane.rotation}`)
            this.water_mat2 = plane_mat2;
            this.scene.add(plane);
        });



    }

    get_player_cam(player_num: number){
        return player_cam[player_num]
    }

    move_player_to(pos: THREE.Vector3){
        this.camera.position.set(pos.x,pos.y,pos.z);
    }

    rotate_player_to(rot: number){
        this.camera.rotation.y += rot;
    }

    lookat_cam(pos: THREE.Vector3){
        this.camera.lookAt(menu_cam.lookAt);
    }

    move_player_to_menu(){
        this.move_player_to(menu_cam.pos)
        this.lookat_cam(menu_cam.lookAt)
    }

    move_player_to_start(player_num: number){
        this.move_player_to(this.get_player_cam(player_num).pos)
        this.rotate_player_to(this.get_player_cam(player_num).rot)
    }

    setup_pointlock(){
        this.change_cam_2_pointlock();
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        if ( havePointerLock ) {

            var element:any = document.body;
            let controls = this.controls
            var pointerlockchange = function ( event:any ) {
                // console.log(pointerlockchange)
                // console.log(event)
                // console.log(controls)
                let pauseMenu = document.getElementById("pause-menu");
                if ( document.pointerLockElement === element ) {  // || document.mozPointerLockElement === element || document.webkitPointerLockElement === element

                    controls.enabled = true;
                    pauseMenu.style.display="none"

                } else {

                    controls.enabled = false;
                    pauseMenu.style.display="flex"
                    // blocker.style.display = '-webkit-box';
                    // blocker.style.display = '-moz-box';
                    // blocker.style.display = 'box';

                    // instructions.style.display = '';

                }

            }

            // var pointerlockerror = function ( event ) {

            //     instructions.style.display = '';

            // }

            // Hook pointer lock state change events
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

            // document.addEventListener( 'pointerlockerror', pointerlockerror, false );
            // document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
            // document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

            // instructions.addEventListener( 'click', function ( event:any ) {

            // instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event:any ) {

                    if ( document.fullscreenElement === element ) {  // || document.mozFullscreenElement === element || document.mozFullScreenElement === element

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                        element.requestPointerLock();
                    }

                }

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

            // }, false );

        } else {

            alert('Your browser doesn\'t seem to support Pointer Lock API');

        }
    }

    change_cam_2_pointlock(){
        if (this.controls == null) {
            this.controls = new PointerLockControls( this.camera );
        }
        
        this.scene.add( this.controls.getObject() );
    }

    add_cross_hair(){
        this.textureLoader.load("/textures/crossHair2.png",(texture:THREE.Texture)=>{
            // const material = new THREE.SpriteMaterial( { map: texture } );
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                depthTest: false,
                transparent: true,
            });
            const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            const scale = 0.01;
            const width = material.map.image.width * scale;
            const height = material.map.image.height * scale;
            const mesh = new THREE.Mesh(geometry, material);
            // console.log(mesh)
            mesh.position.set(0,0,-5);//x = 0;
            // mesh.position.y = 1.5;
            // mesh.position.z = -5;
            mesh.renderOrder = 9999;
            // let spriteC  = new THREE.Sprite( material );
            // spriteC .center.set( 0.5, 0.5 );
            // spriteC .scale.set( width, height, 1 );
            // spriteC.position.set( 0, 0, -1 );
            // spriteC.renderOrder = 9999;
            // this.scene.add(spriteC)
            this.camera.add(mesh)
        })
    }

    addCharacter(character: Character) {
        this.scene.add(character.model);
        this.characters.set(character.model.uuid, character);
    }

    removeCharacter(character: Character) {
        this.scene.remove(character.model);
        this.characters.delete(character.model.uuid);
    }

    resize(sizes: {width: number, height: number}) {
        this.camera.aspect = sizes.width / sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if(USE_BLOOM){
            this.composer.setSize( window.innerWidth, window.innerHeight );
        }
        // this.composer.setSize( window.innerWidth, window.innerHeight );
    }

    renderLogic(){
        let plane_mat = this.water_mat1;
        let plane_mat2 = this.water_mat2;
        if ("uniforms" in plane_mat) {
            // console.log(plane_mat.uniforms)
            plane_mat.uniforms["time"].value =
              (0.3 / 1000) * (Date.now() - this.frame_start);
        }
        if ("uniforms" in plane_mat2){
            this.water_mat2.uniforms["time"].value =
              (0.3 / 1000) * (Date.now() - this.frame_start);
            plane_mat2.uniforms["texture1"].value = this.mat2texture;
        }
        // this.composer.render();
        if(USE_BLOOM){
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
        
        // this.renderer
    }

    render() {
        // this.renderer.render(this.scene, this.camera);
        // Animation Loop
        this.renderLogic();
    }

}
