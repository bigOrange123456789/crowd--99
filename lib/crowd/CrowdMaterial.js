let assets={
	sssLUT:{ value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) }
}
let assets_base64={
	"./assets/normal_woman01/CloW_A_body_Normal.png"://./assets/normal_woman01/CloW_A_body_Normal.png
		[
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwFdjv/9k=",
			1,1
		],
	"./assets/normal_woman01/CloW_A_hair_Normal.png":
		[
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwFdjv/9k=",
			1,1
		],
	"./assets/normal_woman02/CloW_C_body_Normal.png":
		[
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwFdjv/9k=",
			1,1
		],
	"./assets/normal_woman02/CloW_B_hair_Normal.png":
		[
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwFdjv/9k=",
			1,1
		],
	"./assets/Char47/Ch23_1001_Normal.png":
		[
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwFdjv/9k=",
			1,1
		],
}
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import * as THREE from "three";
import{CrowdShader}from './CrowdShader.js'
import { arraySlice } from 'three/src/animation/animationutils.js';
class CrowdMaterial extends THREE.ShaderMaterial {
    constructor( parameters ) {
		super()
		this.map = null;
		this.normalMap = null;
		this.setValues( parameters );
        this.uniforms =  Object.assign( {} , THREE.ShaderLib.standard.uniforms , this.uniforms);
    }//
	static async create(opt){
		var material=opt["oldMaterial"]
		var shader=new CrowdShader(opt)
		await shader.init()
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
		if(materialNew.normalMap&&material.normalMap.path){//&&!opt.isSimShader){
			setTimeout(()=>{
			  this.getTexture(material.normalMap.path).then(
				texture=>{
					materialNew.normalMap=texture
					materialNew.normalMap.needsUpdate=true
					// materialNew.uniforms.normalMap.value=texture
					// materialNew.uniforms.normalMap={value:texture}
				}
			  )
			},5000)
		}
		// materialNew.uniforms.sssIntensity.value=10
		

		for(var i in material){
			if(i!=="type")
				materialNew[i]=material[i]
		}

		// var arr=[
		// 	// "isMaterial", "uuid", "name", 
		// 	// "type", 

		// 	// "blending", "side", 
		// 	// "vertexColors", "opacity", "transparent", "blendSrc", "blendDst", "blendEquation", 
		// 	// "blendSrcAlpha", "blendDstAlpha", "blendEquationAlpha", "depthFunc", "depthTest", "depthWrite", 
		// 	// "stencilWriteMask", "stencilFunc", "stencilRef", "stencilFuncMask", "stencilFail", "stencilZFail", 
		// 	// "stencilZPass", "stencilWrite", "clippingPlanes", "clipIntersection", "clipShadows", "shadowSide", 
		// 	// "colorWrite", "precision", "polygonOffset", "polygonOffsetFactor", "polygonOffsetUnits", "dithering", 
		// 	// "alphaToCoverage", "premultipliedAlpha", "visible", "toneMapped", "userData", "version", "_alphaTest", "isMeshStandardMaterial", 
		// 	// "defines", "color", "roughness", "metalness", 
		// 	"map", 
		// 	"lightMap", "lightMapIntensity", "aoMap", "aoMapIntensity", "emissive",
		// 	 "emissiveIntensity", "emissiveMap", "bumpMap", "bumpScale", 
		// 	 "normalMap", 
		// 	 "normalMapType", "normalScale", "displacementMap", 
		// 	 "displacementScale", "displacementBias", "roughnessMap", "metalnessMap", "alphaMap", "envMap", "envMapIntensity", "wireframe",
		// 	  "wireframeLinewidth", "wireframeLinecap", "wireframeLinejoin", "flatShading", "fog"
		// 	]
		// for(var i=0;i<arr.length;i++){
		// 	var name=arr[i]
		// 	materialNew[name]=material[name]
		// }

		for(var i in shader){
			materialNew[i]=shader[i]
		}
		if(opt.isSimShader)materialNew.normalMap=null
		return materialNew
	}
	static async getTexture_base64(path) {
		let base64=assets_base64[path]
		if(!base64) {
			console.log("缺少base64数据",path)
			return CrowdMaterial.getTexture(path)
		}
		let imgbase64=base64[0]
		let w=base64[1]
		let h=base64[2]
		return new Promise((resolve, reject)=> {
			var img = new Image();
				img.src = imgbase64;
		  	var canvas=document.createElement("canvas")
				canvas.width=w;
		  		canvas.height=h;
		  	img.onload = () => {
				canvas.getContext('2d').drawImage(img, 0, 0,w,h);
				var texture=new THREE.CanvasTexture(canvas);
				texture.path=path
				// texture.flipY=false;
				resolve(texture);
			};
		});
	}
	static async getTexture(path) {
		if(!assets[path])
			assets[path] = 
				new Promise((resolve, reject)=> {
					var textureLoader = new THREE.TextureLoader()
					textureLoader.load(
						path,
						texture=>{
							// console.log(assets[path])
							resolve(texture)
						}
					)
				});
		return assets[path]
	}
}
CrowdMaterial.prototype.isMeshStandardMaterial = true;
export { CrowdMaterial };