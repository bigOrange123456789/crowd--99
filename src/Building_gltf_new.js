import * as THREE from "three";
import { GLTFLoader, DRACOLoader, DDSLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFParser } from "three/examples/jsm/loaders/GLTFParser";
import { GLTFLoaderUtils } from "three/examples/jsm/loaders/GLTFLoaderUtils";

export class Building{
    constructor(scene){
        this.parentGroup = new THREE.Group();
        this.parentGroup.scale.set(0.0005, 0.0005, 0.0005);
        this.scene = scene;
        this.parser = new GLTFParser();
        this.loaderUtils = new GLTFLoaderUtils(this.parser);
        this.loader = new GLTFLoader();
        this.loader.setCrossOrigin('anonymous');
        this.loader.setDRACOLoader(new DRACOLoader());
        this.loader.setDDSLoader(new DDSLoader());

        this.load();
    }

    load(){
        const modelUrl = 'assets/Building/scene_ao_areaLight_normalCorrect.gltf';

        // Load the base model without any dependencies
        this.loader.load(modelUrl, (gltf) => {
            this.scene.add(gltf.scene);
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }, (error) => {
            console.log('GLTF loader error');
        });

        // Load dependent files separately and merge them into the base model
        this.loaderUtils.loadDependencies(modelUrl, (dependencies) => {
            dependencies.forEach((dependency) => {
                const type = dependency.type;
                const url = dependency.url;

                // Load the dependency based on its type
                if (type === 'texture') {
                    const loader = new THREE.TextureLoader();
                    const texture = loader.load(url);

                    this.parser.assignTexture(gltf, dependency, texture);
                } else if (type === 'buffer') {
                    const loader = new THREE.FileLoader();
                    loader.setResponseType('arraybuffer');

                    loader.load(url, (data) => {
                        this.parser.assignBuffer(gltf, dependency, data);
                    });
                } else if (type === 'shader') {
                    // Load shaders using the three.js ShaderMaterial loader
                    const loader = new THREE.FileLoader();
                    loader.load(url, (data) => {
                        this.parser.assignShader(gltf, dependency, data);
                    });
                }
            });

            // Merge the dependencies into the base model
            this.parser.assignFinalMaterials(gltf);
        });
    }
}
