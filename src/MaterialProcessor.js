import * as THREE from "three";
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { Color } from 'three/src/math/Color.js';
import { TangentSpaceNormalMap } from 'three/src/constants.js';
import { Vector2 } from 'three/src/math/Vector2.js';
import { CrowdMaterial } from '../lib/CrowdMaterial'//用于预加载动画数据
var sssLUT= { value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) }
class MaterialProcessor0{
    constructor(glb){
		var self=this
        var textureLoader = new THREE.TextureLoader()
		this.normalMap1=textureLoader.load("./assets/models/CloM_A_cloth_mat_Normal.png")
		this.normalMap2=textureLoader.load("./assets/models/CloM_A_hair_Normal.png")
		this.normalMap3=textureLoader.load("./assets/models/CloM_A_head_Normal.png")
		glb.scene.traverse(m=>{
			if(m instanceof THREE.SkinnedMesh){
				self.processMesh(m)
			}
		})
    }
	processMesh(mesh){
		var name=mesh.name
        var material=mesh.material
		if(name=="CloM_A_body_geo"
            ||name=="CloM_A_chengyi_geo"
            ||name=="CloM_A_lingdai_geo"
            ||name=="CloM_A_xiukou_geo"
            ||name=="CloM_A_xizhuang_geo"
            ||name=="CloM_A_xizhuangku_geo"
            ||name=="CloM_A_xiezi_geo"){
            material.normalMap=this.normalMap1//textureLoader.load("./assets/models/CloM_A_cloth_mat_Normal.png")
        }else if(name=="CloM_A_hair_geo"){
            material.normalMap=this.normalMap2//textureLoader.load("./assets/models/CloM_A_hair_Normal.png")
        }else if(name=="head"){
            material.normalMap=this.normalMap3 
        }
        if(name=="head"||name=="CloM_A_body_geo"){
            material.scattering=true// m.material.useOldParam=false
			this.setSkinParam(material)
        }
	}
    setSkinParam(material){
		material.color = new Color( 0xffffff ); // diffuse
		material.roughness = 1.0;
		material.metalness = 0.0;

		material.lightMap = null;
		material.lightMapIntensity = 1.0;

		material.aoMap = null;
		material.aoMapIntensity = 1.0;

		material.emissive = new Color( 0x000000 );
		material.emissiveIntensity = 1.0;
		material.emissiveMap = null;

		material.bumpMap = null;
		material.bumpScale = 1;

		material.normalMapType = TangentSpaceNormalMap;
		material.normalScale = new Vector2( 1, 1 );

		material.displacementMap = null;
		material.displacementScale = 1;
		material.displacementBias = 0;

		material.roughnessMap = null;

		material.metalnessMap = null;

		material.alphaMap = null;

		material.envMap = null;
		material.envMapIntensity = 1.0;

		material.refractionRatio = 0.98;

		material.flatShading = false;


        var param={
			map:  material.map,//textureLoader.load( 'Head.png' ),
			normalMap: material.normalMap,//new THREE.TextureLoader().load( './assets/textures/Normal.png' ) ,
			roughness: 0.5,//0.3,
			metalness: 0.0,
			envMapIntensity: 1.0,
		}
        for(var i in param){
            material[i]=param[i]
        }

		var uniforms={
			brightness_specular: { value: 1.0  },
			sssIntensity: { 
				value: 0.35 
			},
			sssIntensity2: { 
				value: 0.35 
			},
			CurveFactor: { value:1.0 },
			sssLUT: sssLUT,
		}
		// if(material.uniforms){
		// 	for(var i in uniforms){
        //     	material.uniforms[i]=uniforms[i]
        // 	}
		// }else{
		// 	material.uniforms=uniforms
		// }
    }
}
class MaterialProcessor1{
    constructor(glb){
		var self=this
		
        var textureLoader = new THREE.TextureLoader()
		this.normalMap1=null//textureLoader.load("./assets/normal_woman01/CloW_A_body_Normal.png")
		//this.normalMap1_base64
		this.textureLoader=textureLoader
		this.glb=glb
		
		
		
    }
	async init(){
		var self=this
		const base64="data:image/jpeg;base64,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"
		const glb=this.glb
		// this.normalMap1=await CrowdMaterial.base64_texture(
		// 	base64,50,50//base64,1024,1024
		// )
		
		// this.normalMap1=this.textureLoader.load("./assets/normal_woman01/CloW_A_body_Normal.png")
		// this.normalMap2=this.textureLoader.load("./assets/normal_woman01/CloW_A_hair_Normal.png")
		this.normalMap1=await CrowdMaterial.getTexture_base64("./assets/normal_woman01/CloW_A_body_Normal.png")
		this.normalMap2=await CrowdMaterial.getTexture_base64("./assets/normal_woman01/CloW_A_hair_Normal.png")
		glb.scene.traverse(m=>{
			if(m instanceof THREE.SkinnedMesh){
				self.processMesh(m)
			}
		})
	}
	processMesh(mesh){
		var name=mesh.name
        var material=mesh.material
		if(name=="CloM_A_body_geo"
            ||name=="CloW_A_kuzi_geo"
            ||name=="CloW_A_shangyi_geo"
            ||name=="CloW_A_waitao_geo1"
            ||name=="CloW_A_xiezi_geo"){
            material.normalMap=this.normalMap1//textureLoader.load("./assets/models/CloM_A_cloth_mat_Normal.png")
			material.base64={
				noraml:this.normalMap1_base64
			}
        }else if(name=="hair"){
            material.normalMap=this.normalMap2//textureLoader.load("./assets/models/CloM_A_hair_Normal.png")
        }
        
		if(name=="CloW_A_kuzi_geo"
		||name=="CloW_A_shangyi_geo"
		||name=="CloW_A_waitao_geo1"
		||name=="CloW_A_xiezi_geo"){
			material.roughness=0
		}
		if(name=='CloW_E_eyeLeft_geo02'
			||name=='CloW_E_eyeRight_geo01'){
				material.roughness=0
				// material.metalness=1
			}
		if(name=="head"||name=="CloM_A_body_geo"){
            material.scattering=true// m.material.useOldParam=false
			this.setSkinParam(material)
        }
	}
    setSkinParam(material){
		material.color = new Color( 0xffffff ); // diffuse
		material.roughness = 1.0;
		material.metalness = 0.0;

		material.lightMap = null;
		material.lightMapIntensity = 1.0;

		material.aoMap = null;
		material.aoMapIntensity = 1.0;

		material.emissive = new Color( 0x000000 );
		material.emissiveIntensity = 1.0;
		material.emissiveMap = null;

		material.bumpMap = null;
		material.bumpScale = 1;

		material.normalMapType = TangentSpaceNormalMap;
		material.normalScale = new Vector2( 1, 1 );

		material.displacementMap = null;
		material.displacementScale = 1;
		material.displacementBias = 0;

		material.roughnessMap = null;

		material.metalnessMap = null;

		material.alphaMap = null;

		material.envMap = null;
		material.envMapIntensity = 1.0;

		material.refractionRatio = 0.98;

		material.flatShading = false;


        var param={
			map:  material.map,//textureLoader.load( 'Head.png' ),
			normalMap: material.normalMap,//new THREE.TextureLoader().load( './assets/textures/Normal.png' ) ,
			roughness: 0.5,//0.3,
			metalness: 0.0,
			envMapIntensity: 1.0,
		}
        for(var i in param){
            material[i]=param[i]
        }

		var uniforms={
			brightness_specular: { value: 1.0  },
			sssIntensity: { 
				value: 0.35 
			},
			sssIntensity2: { 
				value: 0.35 
			},
			CurveFactor: { value:1.0 },
			sssLUT: sssLUT,
		}
		// if(material.uniforms){
		// 	for(var i in uniforms){
        //     	material.uniforms[i]=uniforms[i]
        // 	}
		// }else{
		// 	material.uniforms=uniforms
		// }
    }
}
class MaterialProcessor2{
    constructor(glb){
        
		this.glb=glb
		// this.init()
    }
	async init(){
		var self=this
		var textureLoader = new THREE.TextureLoader()
		this.normalMap1=textureLoader.load("./assets/normal_woman02/CloW_C_body_Normal.png")
		console.log("this.normalMap1",this.normalMap1)
		this.normalMap2=textureLoader.load("./assets/normal_woman02/CloW_B_hair_Normal.png")
		// this.normalMap1=await CrowdMaterial.getTexture_base64("./assets/normal_woman02/CloW_C_body_Normal.png")
		// this.normalMap2=await CrowdMaterial.getTexture_base64("./assets/normal_woman02/CloW_B_hair_Normal.png")

		this.glb.scene.traverse(m=>{
			if(m instanceof THREE.SkinnedMesh){
				console.log("name",m.name)
				self.processMesh(m)
			}
		})
	}
	processMesh(mesh){
		var name=mesh.name
        var material=mesh.material
		if(name=="CloW_C_body_geo1"
            ||name=="CloW_C_qunzi_geo3456"
            ||name=="CloW_C_shangyi_geo"
            ||name=="CloW_C_xie_geo"){
            // material.normalMap=this.normalMap1
        }else if(name=="hair"){
            // material.normalMap=this.normalMap2//textureLoader.load("./assets/models/CloM_A_hair_Normal.png")
        }
        if(name=="head"||name=="CloW_C_body_geo1"){//if(name=="head"||name=="CloW_C_body_geo1"){
            material.scattering=true// m.material.useOldParam=false
			this.setSkinParam(material)
        }
		if(name=="CloW_C_qunzi_geo3456"
		||name=="CloW_C_shangyi_geo"
		||name=="CloW_C_xie_geo"){
			material.roughness=0
		}
		if(name=='CloW_E_eyeLeft_geo02'
			||name=='CloW_E_eyeRight_geo01'){
				material.roughness=0
				// material.metalness=1
			}
		
	}
    setSkinParam(material){
		// console.log("isSkin")
		material.color = new Color( 0xffffff ); // diffuse
		material.roughness = 1.0;
		material.metalness = 0.0;

		material.lightMap = null;
		material.lightMapIntensity = 1.0;

		material.aoMap = null;
		material.aoMapIntensity = 1.0;

		material.emissive = new Color( 0x000000 );
		material.emissiveIntensity = 1.0;
		material.emissiveMap = null;

		material.bumpMap = null;
		material.bumpScale = 1;

		material.normalMapType = TangentSpaceNormalMap;
		material.normalScale = new Vector2( 1, 1 );

		material.displacementMap = null;
		material.displacementScale = 1;
		material.displacementBias = 0;
		material.roughnessMap = null;
		material.metalnessMap = null;
		material.alphaMap = null;
		material.envMap = null;
		material.envMapIntensity = 1.0;
		material.refractionRatio = 0.98;
		material.flatShading = false;


        var param={
			map:  material.map,//textureLoader.load( 'Head.png' ),
			normalMap: material.normalMap,//new THREE.TextureLoader().load( './assets/textures/Normal.png' ) ,
			roughness: 0.5,//0.3,
			metalness: 0.0,
			envMapIntensity: 1.0,
		}
        for(var i in param){
            material[i]=param[i]
        }

		var uniforms={
			brightness_specular: { value: 1.0  },
			sssIntensity: { 
				value: 0.35 
			},
			sssIntensity2: { 
				value: 0.35 
			},
			CurveFactor: { value:1.0 },
			sssLUT: sssLUT,
		}
		// if(material.uniforms){
		// 	for(var i in uniforms){
        //     	material.uniforms[i]=uniforms[i]
        // 	}
		// }else{
		// 	material.uniforms=uniforms
		// }
    }
}
export { MaterialProcessor0,MaterialProcessor1,MaterialProcessor2 };