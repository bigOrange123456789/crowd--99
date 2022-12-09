let assets={
	sssLUT:{ value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) }
}
let assets_base64={
	"./assets/normal_woman01/CloW_A_body_Normal.png"://./assets/normal_woman01/CloW_A_body_Normal.png
		[
			"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwFdjv/9k=",
			1,1
		]
}
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import * as THREE from "three";
import{CrowdShader}from './CrowdShader.js'
class CrowdMaterial extends THREE.ShaderMaterial {
    constructor( parameters ) {
		super()
		this.map = null;
		this.normalMap = null;
		this.setValues( parameters );

        this.uniforms =  Object.assign( {} , THREE.ShaderLib.standard.uniforms , this.uniforms);
    }
	updateMap(pathPre,path0){
		let path=pathPre+path0
        var scope=this;
		if(assets[path]){
			scope.useMap(assets[path])
		}else{
			new THREE.TextureLoader().load(path,texture=>{
				console.log("crowd material updateMap",path)
				for(let tag in scope.map){
					if(tag!=="source")
						texture[tag]=scope.map[tag]
				}
				assets[path] = texture
				scope.useMap(texture)
			})
		}
    }
	useMap(texture){
		// this.map=texture//assets[path]
		// this.map.needsUpdate=true
		let preMesh=this.mesh//this.mesh.pre
		while(preMesh){
			preMesh.material.map=texture
			preMesh.material.map.needsUpdate=true

			preMesh=preMesh.pre

		}
	}

	static async create(opt){
		var material=opt["oldMaterial"]
		var shader=new CrowdShader(opt)
		await shader.init()
		var materialNew= new CrowdMaterial( {
			uniforms: {
				brightness_specular: { value: 1.0  },//未被使用
				sssIntensity: { 
					value: 0.85 
				},
				sssIntensity2: { //未被使用
					value: 1.0//0.35 
				},
				CurveFactor: { value:1.0 },
				sssLUT: assets.sssLUT//{ value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) },
			},
			// map:  material.map,//textureLoader.load( 'Head.png' ),
			// normalMap: material.normalMap,//new THREE.TextureLoader().load( './assets/textures/Normal.png' ) ,
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

		for(var i in shader){
			materialNew[i]=shader[i]
		}
		if(opt.useNormalMap){
			// materialNew.map=null
			materialNew.aoMap=null
            materialNew.normalMap=null
            materialNew.metalnessMap=null
            materialNew.roughnessMap=null
		}
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

class PicHandle {//只服务于MaterialHandle对象
	constructor(){
		this.image;
    	this.h;
    	this.w;
    	this.compressionRatio=0.1;//0-1
	}
    getCanvas(image) {
        var flipY = true;
        var canvas =  document.createElement( 'canvas' );
        //计算画布的宽、高
        canvas.width = image.width*this.compressionRatio;
        canvas.height = image.height*this.compressionRatio;

        var ctx = canvas.getContext( '2d' );

        if ( flipY === true ) {
            ctx.translate( 0, canvas.height );
            ctx.scale( 1, - 1 );
        }
        //将image画到画布上
        ctx.drawImage( image, 0, 0, canvas.width, canvas.height );


        /*var ctx=this.canvas.getContext( "2d" );  //设置画布类型2d
        ctx.fillStyle = "#FFFFFF";//白色
        for( var y = 0; y < this.canvas.height; y++ ) {
            for( var x = 0; x < this.canvas.width ; x++ ) {
                // 获取当前位置的元素
                var pixel = ctx.getImageData( x, y, 1, 1 );//获取一个像素点的数据
                // 判断透明度不为0
                if( pixel.data[0] +pixel.data[1] +pixel.data[2] >100) {//如果颜色较亮
                    ctx.fillRect(x,y,1,1);
                }
            }
        }*/
        return canvas;
    }
}