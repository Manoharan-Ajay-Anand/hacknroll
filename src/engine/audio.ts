import * as THREE from 'three'

const AUDIO_DIR = "/audio/"

export class AudioInfo{
    path: string="";
    name:  string="";
    addToCam: boolean=false;
    isLoop: boolean = false;
    vol:number = 0.5;
    autoPlay: boolean = false;
    buffer: AudioBuffer;
    source: THREE.Audio;
    isAmbi: boolean = false;

    constructor(path: string,name: string, addToCam=false, isLoop:boolean=false,vol:number = 0.5, autoPlay:boolean = false, isAmbi:boolean = false){
        this.path = AUDIO_DIR + path;
        this.addToCam = addToCam;
        this.isLoop = isLoop;
        this.vol = vol;
        this.autoPlay = autoPlay;
        this.buffer = null;
        this.name = name;
        this.isAmbi = isAmbi;
    }

    set_buffer(buf: AudioBuffer){
        this.buffer = buf
    }

    set_audio_obj(source: THREE.Audio){
        this.source = source;
    }

    // play(){

    // }

}

//https://stackoverflow.com/questions/24099509/multiple-3d-sounds-in-three-js
export class AudioManager{   
    // paths: string[] = [];
    audio_loader: THREE.AudioLoader;
    // global_source: THREE.Audio;
    global_listener: THREE.AudioListener;
    audios: AudioInfo[]
    name2audio: any
    currentAmbi: AudioInfo

    constructor(audios: AudioInfo[] ){//paths: string[]
        // this.paths = paths;
        this.global_listener = new THREE.AudioListener();  // to be added to camera
        // this.global_source = new THREE.Audio(this.global_listener)
        this.audio_loader = new THREE.AudioLoader();
        this.audios = audios;
        this.name2audio = {};
        this.load_audio();
    }
    load_audio(){
        for(let idx in this.audios){
            let audio = this.audios[idx] 
            audio.set_audio_obj(new THREE.Audio(this.global_listener))
            let path = audio.path;
            console.log(console.log(audio.name))
            this.name2audio[audio.name] = audio;
            
            this.audio_loader.load(path,(buffer: AudioBuffer)=>{
                audio.set_buffer(buffer);
                if (audio.autoPlay){
                    this.play_audio(audio); 

                    // this.global_source.setBuffer  (buffer);
                    // if (audio.isLoop){
                    //     this.global_source.setLoop(true);
                    // }
                    // this.global_source.setVolume(audio.vol);
                    // this.global_source.play();
                }
                
            })
        }
    }

    play_by_name(name: string){{
        console.log(this.name2audio)
        if(!this.name2audio[name]){
            return;
        }
        let audio = this.name2audio[name];
        this.play_audio(audio);
    }}

    play_audio(audio: AudioInfo){
        let cur_source = audio.source;
        if (cur_source.isPlaying){
            cur_source.stop()
        }
        if (audio.isAmbi){
            if (this.currentAmbi){
                if (this.currentAmbi.source.isPlaying){
                    this.currentAmbi.source.stop();
                }
            }
            this.currentAmbi = audio
        }
        cur_source.setBuffer(audio.buffer);
        if (audio.isLoop){
            cur_source.setLoop(true);
        }
        cur_source.setVolume(audio.vol);
        cur_source.play();
    }

}
