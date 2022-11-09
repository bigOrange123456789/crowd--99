let assets={
	sssLUT:{ value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) }
}
import * as THREE from "three";
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import{CrowdShader}from './CrowdShader.js'
class CrowdMaterial extends THREE.ShaderMaterial {
    constructor( parameters ) {
		window.THREE=THREE
		super()
		this.map = null;
		this.normalMap = null;
		this.setValues( parameters );
        this.uniforms =  Object.assign( {} , THREE.ShaderLib.standard.uniforms , this.uniforms);
    }
	static async create(opt){
		var material=opt["oldMaterial"]
		if(material.base64&&!material.normalMap){
			// const base64=material.base64.normalMap1_base64
			// //material.normalMap=
			// if(!assets["base64"])
			// 	assets["base64"]=
			// 		await CrowdMaterial.base64_texture(
			// 			material.base64.normalMap1_base64,
			// 			1024,
			// 			1024
			// 		)
			// material.normalMap=assets[base64]
		}
		// console.log(material)
		var shader=new CrowdShader(opt)
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
			// if(i=="roughness"||i=="metalness")
			// 	console.log(i,material[i],material.name)
		}
		for(var i in shader){
			materialNew[i]=shader[i]
		}
		return materialNew
	}
	static base64_texture_err(imgbase64,w,h,cb) {
		var img = new Image();
			img.src = imgbase64;
		var canvas=document.createElement("canvas")
			canvas.width=w;
		  	canvas.height=h;
		  	img.onload = () => {
				canvas.getContext('2d').drawImage(img, 0, 0,w,h);
				var texture=new THREE.CanvasTexture(canvas);
				texture.flipY=false;
				if(cb)cb(texture)
			};
	}
	// static async base64_texture(imgbase64,w,h) {
	// 	return new Promise((resolve, reject)=> {
	// 		var img = new Image();
	// 			img.src = imgbase64;
	// 	  var canvas=document.createElement("canvas")
	// 			canvas.width=w;
	// 	  canvas.height=h;
	// 	  img.onload = () => {
	// 		canvas.getContext('2d').drawImage(img, 0, 0,w,h);
	// 		var texture=new THREE.CanvasTexture(canvas);
	// 		texture.flipY=false;
	// 		resolve(texture);
	// 			};
	// 	});
	// }
	static async base64_texture(imgbase64,w,h) {
		return new Promise((resolve, reject)=> {
			var img = new Image();
				img.src = imgbase64;
		  var canvas=document.createElement("canvas")
				canvas.width=w;
		  canvas.height=h;
		  img.onload = () => {
			canvas.getContext('2d').drawImage(img, 0, 0,w,h);
			var texture=new THREE.CanvasTexture(canvas);
			// texture.flipY=false;
			resolve(texture);
				};
		});
	}
}
CrowdMaterial.prototype.isMeshStandardMaterial = true;
export { CrowdMaterial };