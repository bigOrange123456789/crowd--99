import * as THREE from "three";
let assets={}
export class CrowdShader{
	constructor(opt){
		this.opt=opt
		this.path0="./assets/shader/"
	}
	async init(){
		let opt=this.opt
		var vert =await this.load("vert_MeshStandardMaterial")
		vert=this.addGlsl(vert,
			await this.load(
				opt["isSimShader"]?"vert_anim_sim":"vert_anim"
			)
		)//("vert_anim"))//
		var frag =await this.load("frag_MeshStandardMaterial")
		if(opt.scattering){
			var lights_physical_pars_fragment2=
				THREE.ShaderChunk["lights_physical_pars_fragment"]+//this.load("lights_physical_pars_fragment")+
				await this.load("frag_lights_physical_pars_fragment_Scattering")
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
	// load(name){
	// 	let url=this.path0+name+".glsl"
	// 	if(!assets[url]){
	// 		assets[url]=$.ajax({ url:url,async:false }).responseText;
	// 	}
	// 	return assets[url]
	// }
	load(name) {
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