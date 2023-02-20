import * as THREE from "three";
import JSZip from 'jszip';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export class Building{
    constructor(scene){
        this.parentGroup = new THREE.Group()
        this.parentGroup.scale.set(0.0005,0.0005,0.0005)

        scene.add(this.parentGroup)

        this.load()
    }
    load(){
        const loader = new GLTFLoader();
        
        loader.load(
            'assets/Building/scene.gltf',
            function ( gltf ) {
                scene.add( gltf.scene );
            },
            function ( xhr ) {
                //侦听模型加载进度
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                //加载出错时的回调
                console.log( 'gltf loader error' );
            }
        );

    }
    
}
