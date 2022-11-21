import * as THREE from "three";
import { CrowdMaterial } from './CrowdMaterial.js'
import { CrowdGeometry } from './CrowdGeometry.js'
class CrowdMesh extends THREE.InstancedMesh {
    constructor( geometry,material2,count,isSimShader) {
        var geometry2=new CrowdGeometry({
            "oldGeometry":geometry
        })
        // var material2=CrowdMaterial.create({
        //     "oldMaterial":material,
        //     "scattering":material.scattering,//true
        //     "isSimShader":isSimShader
        // })
        super(geometry2, material2, count )
        this.isSimShader=isSimShader
        // this.geometry=geometry2
        // this.material=material2
    }
    static async getCrowdMesh(//getCrowdMesh
        originMesh,
        animationUrl,
        morphTargetUrl,
        textureData,// textureUrl,
        lightMapUrl,
        textureCount, // [row, col]
        camera,
        clock,
        count,
        crowdGroup,
        cb
        ){
        originMesh.visible=false
        if(typeof(crowdGroup.assets[animationUrl])=="undefined")crowdGroup.assets[animationUrl]=await CrowdMesh.loadAnimJSON(animationUrl)
        
        const animations = crowdGroup.assets[animationUrl];
        const material=originMesh.material
        const isSimShader=crowdGroup.lodLevel>3//除了0,1,2,3
        const material2=await CrowdMaterial.create({
            "oldMaterial":material,
            "scattering":material.scattering,//true
            "isSimShader":isSimShader,
            "assets":crowdGroup.assets
        })
        material2.side=2//单面渲染 if(crowdGroup.lodLevel>18)material2.side=2//19

        var mesh= new CrowdMesh(//THREE.InstancedMesh(//
            originMesh.geometry,
            material2,//originMesh.material,
            count,
            isSimShader//lod0和lod1使用高计算量的方法渲染，更远的使用用低计算量的方法渲染
        )
        mesh.init(
            originMesh,
            animationUrl,
            morphTargetUrl,
            textureData,// textureUrl,
            lightMapUrl,
            textureCount, // [row, col]
            camera,
            clock,
            animations,
            crowdGroup
        )
        cb(mesh)        
    }
    init(
        originMesh,
        animationUrl,
        morphTargetUrl,
        textureData,// textureUrl,
        lightMapUrl,
        textureCount, // [row, col]
        camera,
        clock,
        animations,
        crowdGroup
        ) {
        this.name=originMesh.name
        this.crowdGroup=crowdGroup

        this.animations=animations
        this.originMesh = originMesh;
        this.animationUrl = animationUrl;
        this.morphTargetUrl = morphTargetUrl;
        this.textureData=textureData;//this.textureUrl = textureUrl;
        this.textureCount = textureCount;
        this.lightMapUrl = lightMapUrl;
        this.camera = camera;
        // this.uniforms;

        this.clock = clock;
        this.ifAnimated = !!animationUrl;
        this.ifMorphTarget = !!morphTargetUrl;
        this.dummy = new THREE.Object3D();

        this.speed; // 动画速度
        this.obesity
        this.moveMaxLength
        this.morphTargetWeight; // morph target 权重
        this.animationStartTime;
        this.animationType; // 动画类型
        this.textureType; // 身体贴图类型 vec4
        this.bodyScale; // 身体各部位缩放比例

        // body 每个身体部位对应的贴图uv坐标位置
        this.body = {
            head: [],
            hand: [],
            bottom: []
        }
        ////////////////////////////////////////////////////////////////////////////////////////////
        this.instanceColorIn=this.crowdGroup.instanceColorInVisible_All[this.name]
        this.instanceMatrix=this.crowdGroup.instanceMatrixVisible
        this.textureType = this.crowdGroup.textureTypeVisible//new THREE.InstancedBufferAttribute(new Uint8Array(this.count * 4), 4);
        this.animationType = this.crowdGroup.animationTypeVisible//new THREE.InstancedBufferAttribute(new Uint8Array(this.count), 1);
        this.speed = this.crowdGroup.speedVisible//new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.obesity=this.crowdGroup.obesityVisible
        this.moveMaxLength=this.crowdGroup.moveMaxLengthVisible
        this.animationStartTime = this.crowdGroup.animationStartTimeVisible//new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.bodyScale = this.crowdGroup.bodyScaleVisible//new THREE.InstancedBufferAttribute(new Float32Array(this.count * 4), 4);

        this.initMaterial()
        this.initGeometry()

        this.castShadow = true; // 阴影
        this.receiveShadow = true;
        this.frustumCulled = false;

        var mat4=new THREE.Matrix4()
        mat4.set(
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        )
        for(var i=0;i<this.count;i++){
            this.setMatrixAt(i,mat4)
        }
    }
    initMaterial() {
        var uniforms=this.material.uniforms
        uniforms.textureData= { value: this.textureData },
        uniforms.headUV= {value: this.body.head}//{ value: new THREE.Vector4(...this.body.head) },
        uniforms.bottomUV= {value:this.body.bottom}//{ value: new THREE.Vector4(...this.body.bottom) }
        if (this.ifAnimated) {
            uniforms.time = { value: 0 };
            uniforms.boneCount = { value: 0 };
            uniforms.animationCount = { value: 0 };
            uniforms.animationFrameCount = { value: 0 };
            uniforms.animationTexture = { value: new THREE.DataTexture(new Float32Array([0,0,0]), 1, 1, THREE.RGBFormat, THREE.FloatType) }
            uniforms.animationTextureLength = { value: 0 };
            this.initAnimation(uniforms); // 异步加载动画数据
        }
    }
    async updateTexture(url,cb) {
        var textureData =await this.loadTexture(url);
        textureData.flipY = false;
        this.material.uniforms.textureData={ value: textureData };
        if(cb){
            cb(textureData)
        }
    }
    initAnimation(uniforms) {
        var animations = this.animations//await this.loadAnimJSON(this.animationUrl);
        const boneCount = this.originMesh.skeleton.bones.length;
        uniforms.animationTexture.value.dispose();
        uniforms.time = { value: 0 };
        uniforms.boneCount = { value: boneCount };
        uniforms.animationFrameCount = { value: animations.config[1] / boneCount / 12 };//动画帧数 每个动画的帧数必须相同
        uniforms.animationTexture = 
            this.isSimShader?animations.animationTexture2:animations.animationTexture
        uniforms.animationTextureLength = { value: animations.animationTextureLength };
        
        let scope = this;
        updateAnimation();
        function updateAnimation() {
            let time = scope.clock.getElapsedTime();
            uniforms.time = { value: time };
            uniforms.cameraPosition = { value: scope.camera.position };
            requestAnimationFrame(updateAnimation);
        }
    }
    initGeometry() {
        let geometry = this.geometry//new THREE.InstancedBufferGeometry();
        geometry.setAttribute('animationIndex', this.animationType);
        if(this.instanceColorIn)
            geometry.setAttribute('instanceColorIn', this.instanceColorIn);
        if (this.ifAnimated) {
            geometry.setAttribute('skinIndex', this.originMesh.geometry.attributes.skinIndex);
            geometry.setAttribute('skinWeight', this.originMesh.geometry.attributes.skinWeight);
            geometry.setAttribute('speed', this.speed);
            geometry.setAttribute('obesity',this.obesity)
            geometry.setAttribute('moveMaxLength',this.moveMaxLength)
            geometry.setAttribute('animationStartTime', this.animationStartTime);
            geometry.setAttribute('bodyScale', this.bodyScale);
        }
        geometry.setAttribute('textureIndex', this.textureType);
    }
    static loadAnimJSON_Old( path ) {
        return new Promise( (resolve, reject) => { 
            const animationLoader = new THREE.FileLoader();
            animationLoader.load( path, data => {
                const animationData = JSON.parse( data );
                getAnimaTexture(animationData)
                resolve( animationData );
            } );
        } );
        function getAnimaTexture(animations){// 将动画数据保存为图片Texture格式//animations是读取的json对象
            getAnimation2(animations)
            // console.log(animations)
            const animationData = animations.animation.flat();
            const animationData2 = animations.animation2.flat();
            const animationDataLength = animations.config.reduce((prev, cur) => prev + cur, 0); // sum
            const animationTextureLength = THREE.MathUtils.ceilPowerOfTwo( Math.sqrt(animationDataLength / 4) );
            animations.animationTextureLength=animationTextureLength
            animations.animationTexture={ value: array2Texture(
                animationData, 
                animationTextureLength
                ) }
            animations.animationTexture2={ value: array2Texture(
                animationData2, 
                animationTextureLength
                ) }
        }
        function array2Texture(array, length) {
            let data = new Float32Array(length * length * 4); // RGB:3 RGBA:4
            data.set(array);
            let texture = new THREE.DataTexture(data, length, length, THREE.RGBAFormat, THREE.FloatType);
            texture.needsUpdate = true;
            return texture;
        }
        function getAnimation2(animations){
            console.log("getAnimation2 start")
            animations.animation2=[]
            animations.config2=[]
            let frameNumber=parseInt(animations["frameNumber"])
            let boneNumber=animations.config[0]/((frameNumber+1)*12)//animations["boneNumber"]
            animations.boneNumber=boneNumber
            // console.log("animations.animation.length",animations.animation.length)
            for(let i=0;i<animations.animation.length;i++){
                let animation=animations.animation[i];
                let animation2=[]
                // console.log("frameNumber,boneNumber:",frameNumber,boneNumber)
                for(let f=0;f<frameNumber;f++){
                    for(let b=0;b<boneNumber;b++){
                        let m1=getMatrix(animation,0,b)//boneInverses
                        let m2=getMatrix(animation,f+1,b)//bones[i].matrixWorld
                        let m0=m2.multiply ( m1 )
                        
                        for(let k1=0;k1<4;k1++)//4行
                            for(let k2=0;k2<3;k2++)//3列
                                animation2.push(m0.elements[4*k1+k2])
                    }
                }
                animations.animation2.push(animation2)
                animations.config2.push(animation2.length)
            }
            console.log("getAnimation2 end")
            function getMatrix(arr,f_i,b_i){
                let s=f_i*boneNumber*12+b_i*12
                const m = new THREE.Matrix4();
                m.set( 
                    arr[s+0], arr[s+3], arr[s+6], arr[s+9], 
                    arr[s+1], arr[s+4], arr[s+7], arr[s+10], 
                    arr[s+2], arr[s+5], arr[s+8], arr[s+11],
                    0,0,0,1
                )
                return m
            }
        }
    }
    static loadAnimJSON( path ) {
        return new Promise( (resolve, reject) => { 
            let loader = new THREE.FileLoader();
			loader.setResponseType("arraybuffer");
			loader.load(
  				path,
  				buffer => {
					let itemSize1=4
					let itemSize2=2
                    let headSize=4
    				let head = new Uint32Array(buffer.slice(0, headSize * itemSize1))
    				let config_len=head[0]
					let config_0=head[1]
                    let animationDataLength=head[2]
                    let frameNumber=head[3]
                    var config=[]
                    for(var i=0;i<config_len;i++)
                        config.push(config_0)
					
					let animationTextureLength = 
						THREE.MathUtils.ceilPowerOfTwo( Math.sqrt(animationDataLength / 4) )
                    let length=animationTextureLength
					let data1 = new Uint16Array(buffer.slice(
						headSize * itemSize1, 
						headSize * itemSize1+head[2]* itemSize2
						))
                    let data1_ = new Uint16Array(length * length * 4)
                    data1_.set(data1)

				    let data2 = new Uint16Array(buffer.slice(
						headSize * itemSize1+head[2]* itemSize2, 
						buffer.byteLength
						))	
                    let data2_ = new Uint16Array(length * length * 4)
                    data2_.set(data2)
					
    				let map1 = new THREE.DataTexture()
    				map1.type = THREE.HalfFloatType
    				map1.image = {
      					data: data1_,
      					width: animationTextureLength,
      					height: animationTextureLength,
    				}	
                    map1.needsUpdate = true
					let map2 = new THREE.DataTexture()
    				map2.type = THREE.HalfFloatType
    				map2.image = {
      					data: data2_,
      					width: animationTextureLength,
      					height: animationTextureLength,
    				}	
                    map2.needsUpdate = true

                    var animationData={
                        config:config,
                        frameNumber:frameNumber,
                        animationTextureLength:animationTextureLength,
                        animationTexture:{value:map1},
                        animationTexture2:{value:map2}
                    }
                    resolve( animationData );
  				}	
			)//end
        } );
    }
    static loadTexture(path) {
        return new Promise((resolve, reject)=> {
            new THREE.TextureLoader().load(
                path,
                texture => { // onLoad
                    texture.flipY = false;
                    resolve(texture);
                }, 
                null, // onProgress
                error => reject(error) // onError
            )
        })
    }
}
export { CrowdMesh };
