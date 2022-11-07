let assets={
	sssLUT:{ value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) }
}
import * as THREE from "three";
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
class CrowdMaterial extends THREE.ShaderMaterial {
    constructor( parameters ) {
		window.THREE=THREE
		super()
		this.map = null;
		this.normalMap = null;
		this.setValues( parameters );
        this.uniforms =  Object.assign( {} , THREE.ShaderLib.standard.uniforms , this.uniforms);
    }
	static getCrowdMaterial(opt){
		var material=opt["oldMaterial"]
		var shader=new LoadShader(opt)
		var materialNew= new CrowdMaterial( {
			uniforms: {
				brightness_specular: { value: 1.0  },
				sssIntensity: { 
					value: 0.35 
				},
				sssIntensity2: { //test
					value: 0.35 
				},
				CurveFactor: { value:1.0 },
				sssLUT: assets.sssLUT//{ value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) },
			},
			map:  material.map,//textureLoader.load( 'Head.png' ),
			normalMap: material.normalMap,//new THREE.TextureLoader().load( './assets/textures/Normal.png' ) ,
		})
		for(var i in material){
			if(i!=="type")
				materialNew[i]=material[i]
		}
		for(var i in shader){
			materialNew[i]=shader[i]
		}
		return materialNew
	}
}

CrowdMaterial.prototype.isMeshStandardMaterial = true;

export { CrowdMaterial };

class LoadShader{
	constructor(opt){
		this.path0="./assets/shader/"
		var vert = this.load("vert_MeshStandardMaterial")
		vert=this.addGlsl(vert,this.load(
			opt["isSimShader"]?"vert_anim_sim":"vert_anim"
			))//("vert_anim"))//
		var frag = this.load("frag_MeshStandardMaterial")
		if(opt.scattering){
			var lights_physical_pars_fragment2=
				THREE.ShaderChunk["lights_physical_pars_fragment"]+//this.load("lights_physical_pars_fragment")+
				this.load("frag_lights_physical_pars_fragment_Scattering")
			frag = frag.replace( '#include <lights_physical_pars_fragment>', lights_physical_pars_fragment2 )
		}
		this.fragmentShader=frag
		this.vertexShader=vert
	}
	addGlsl(origin,str0,tag){
		if(!tag)tag='#include <common>' 
		var str1='\n' + str0+ '\n' + tag + '\n' 
		return origin
				.replace( tag, str1 );
	}
	load(name){
		let url=this.path0+name+".glsl"
		if(!assets[url]){
			assets[url]=$.ajax({ url:url,async:false }).responseText;
		}
		return assets[url]
	}
	load2(name) {
		let path=this.path0+name+".glsl"
        return new Promise((resolve, reject) => {
            if(!window.my_shader)window.my_shader={
    		}
            if(window.my_shader[path]){
                resolve(window.my_shader[path])
                return
            }
            let xhr = new XMLHttpRequest();
            xhr.onload =  () => {
                resolve(xhr.responseText)
                window.my_shader[path]=xhr.responseText
            };
            xhr.onerror =  event => reject(event);
            xhr.open('GET', path);
            xhr.overrideMimeType("text/html;charset=utf-8");
            xhr.send();
        });

    }
}