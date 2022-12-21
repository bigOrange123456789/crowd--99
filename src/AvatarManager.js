import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Crowd } from '../lib/crowd/Crowd.js'//let Crowd=Pack// 
import { CrowdMesh } from '../lib/crowd/CrowdMesh.js'//用于预加载动画数据
import { UI,UICrowd } from './UI.js'
import { MaterialProcessor1, MaterialProcessor2, MaterialProcessor3 } from './MaterialProcessor.js'
import * as THREE from "three";
import { modelManager } from "./modelManager.js";
export class AvatarManager {
    constructor(scene, camera) {
        window.scene=scene
        this.scene = scene
        this.camera = camera
        this.assets = {}//为了防止资源重复加载，相同路径的资源只加载一次
        // this.row_index = 0; //在梯形看台中计算当前人物所在看台行数(貌似含义和小看台中正好相反)
        // this.sum_count = 0; //当前row_index前面行的人数总和
        // this.row_count = 0; //当前行的可放置人数
        this.init()

        // let scope=this
        // test1()
        function test1(){
            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            const mesh = new THREE.InstancedMesh(geometry, material, 10*100*100);    
            for(let i=0;i<mesh.count;i++){
                for(let j=0;j<16;j++){
                    var x=i%300-70
                    var y=0
                    var z=i/300-70
                    var s=0.1//0.001//0.000001
                    var e=[s,0,0,0, 0,s,0,0, 0,0,s,0, 0.5*x,0.5*y,0.5*z,1]
                    mesh.instanceMatrix.array[16*i+j]=e[j]
                }  
            }
            scope.scene.add(mesh);
        }
        function test2(){
            // // const map = new THREE.TextureLoader().load( 'dist/assets/textures_sim1/CloW_A_hair_BaseColor.png' );
            // const map = new THREE.TextureLoader().load( 'dist/assets/textures_sim1/CloM_A_body_Basecolor.jpg' );
            // const material = new THREE.SpriteMaterial( { map: map } );

            // const sprite = new THREE.Sprite( material );
            // scope.scene.add( sprite );
            // window.s=sprite
            // console.log(sprite)

            const vertexShader = `
                uniform float u_time;  //时间累计
                uniform vec3 u_gravity; //粒子重力加速度
                attribute vec3 velocity; //粒子速度
                void main() {
                    vec3 vel = velocity * u_time; //根据时间计算速度  
                    vel = vel + u_gravity * u_time * u_time; //根据时间计算加速度 
                    vec3 pos = position + vel;  //计算位置偏移
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = 3.0;
                }
`
            const fragmentShader = `
                void main() {
                    vec3 color = vec3(1.0);
                    gl_FragColor = vec4(color, 1.0);
                }
` 
              const uniforms = {
                u_time: { value: 0 },//时间
                u_gravity: { value: new THREE.Vector3(0, -5, 0) }//加速度
              }
              const material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader,
                fragmentShader
              })
              const COUNT = 100
              const positions = new Float32Array(COUNT*3)
              const velocity = new Float32Array(COUNT*3)
              const geometry = new THREE.BufferGeometry()
              const size = 0
              const speed = 20
              for(let i = 0; i < positions.length; i++) {
                positions[i] = (Math.random() - 0.5) * size //设施粒子位置
                velocity[i] = (Math.random() - 0.5) * speed //设置粒子运动速度
              }
              geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
              geometry.setAttribute('velocity', new THREE.BufferAttribute(velocity, 3))
              const mesh = new THREE.Points(geometry, material)
              mesh.position.y=2
              scope.scene.add(mesh)
            //   setTimeout(()=>{
            //     uniforms.u_time.value+=0.1
            //   },1)
              setInterval(()=>{
                uniforms.u_time.value+=0.005
              })
        }
        function test3(){
            const vertexShader = `
                void main() {
                    vec3 pos = position;  //计算位置偏移
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = 3.0;
                }
`
            const fragmentShader = `
                void main() {
                    vec3 color = vec3(1.0);
                    gl_FragColor = vec4(color, 1.0);
                }
` 
              const material = new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader,
                fragmentShader
              })
              const COUNT = 10*100*100
              const positions = new Float32Array(COUNT*3)
              const geometry = new THREE.BufferGeometry()
              for(let i = 0; i < COUNT; i++) {
                positions[3*i+0] =i%300-70
                positions[3*i+2] =i/300-70
              }
              geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
              const mesh = new THREE.Points(geometry, material)
              mesh.position.y=2
              scope.scene.add(mesh)
        }
        function test4(){
            const vertexShader = `
                void main() {
                    vec3 pos = position;  //计算位置偏移
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = 3.0;
                }
`
            const fragmentShader = `
                void main() {
                    vec3 color = vec3(1.0);
                    gl_FragColor = vec4(color, 1.0);
                }
` 
              const material = new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader,
                fragmentShader
              })
              const COUNT = 10*100*100
              const positions = new Float32Array(COUNT*3)
              const geometry = new THREE.BufferGeometry()
              for(let i = 0; i < COUNT; i++) {
                positions[3*i+0] =i%300-70
                positions[3*i+2] =i/300-70
              }
              geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
              const mesh = new THREE.Points(geometry, material)
              mesh.position.y=2
              scope.scene.add(mesh)
        }
    }
    async init() {
        var pathAnima = "assets/animation_man_A.bin"
        window.timeTest.measure("Anima start await")

        window.timeTest.measure("Anima end await")

        this.modelManager = new modelManager();

        if(true){
            this.load_model()
        }else{
            this.test()
        }
        new UI(this.scene, new THREE.Object3D())
    }
    test() {
        this.modelManager = new modelManager();
        var self = this
        window.model = []
        function load_next(modelType) {
            if (modelType < self.modelManager.modelIndex) {
                console.log(self.modelManager.modelList[modelType].pathModel)
                new GLTFLoader().load(self.modelManager.modelList[modelType].pathModel, async (glb) => {
                    glb.scene.traverse(node => {
                        if (node instanceof THREE.Mesh || node instanceof THREE.SkinnedMesh) {
                            let name = node.name
                            // node.material.envMapIntensity = 0.3
                            // if (name == "CloM_A_head_geo" || name == "GW_man_Body_geo1") //尚未设置这个在modelManager中
                            //     node.material.envMapIntensity = 0.1

                            node.material.envMapIntensity = 0.1
                            node.material.roughness = 0.5//0.5
                            node.material.metalness=0.1

                            if(name=="CloM_A_Hair_geo"){//man_A
                                // alert(name)
                                console.log(node.material.color)
                                node.material.color.r=20
                                node.material.color.g=20
                                node.material.color.b=20
                                node.material.transparent=true
                                node.material.alphaTest = 0.7;
                                node.material.depthWrite = true;
                                node.material.side=THREE.DoubleSide

                                node.material.roughness = 0.9
                                node.material.envMapIntensity = 0.1
                                node.material.metalness=1
                            }
                            if(name=="CloW_A_hair_geo"){//man_b
                                console.log(node.material.color)
                                node.material.color.r=10
                                node.material.color.g=10
                                node.material.color.b=10
                                node.material.transparent=true
                                node.material.alphaTest = 0.7;
                                node.material.depthWrite = true;
                                node.material.side=THREE.DoubleSide

                                node.material.roughness = 0.9
                                node.material.envMapIntensity = 0.1
                                node.material.metalness=1
                            }
                            if(name=="CloW_C_hair_geo"){//man_b
                                node.material.color.r=10
                                node.material.color.g=10
                                node.material.color.b=10
                                node.material.transparent=true
                                node.material.alphaTest = 0.7;
                                node.material.depthWrite = true;
                                node.material.side=THREE.DoubleSide

                                node.material.roughness = 0.9
                                node.material.envMapIntensity = 0.1
                                node.material.metalness=1
                            }
                            if(name=="CloW_D_Hair_geo"){//man_b
                                // alert(123)
                                node.material.color.r=30
                                node.material.color.g=30
                                node.material.color.b=30
                                node.material.transparent=true
                                node.material.alphaTest = 0.7;
                                node.material.depthWrite = true;
                                node.material.side=THREE.DoubleSide

                                node.material.roughness = 0.9
                                node.material.envMapIntensity = 0.1
                                node.material.metalness=1
                            }

                            if(
                                name=="CloM_A_head_geo"//1
                                ||name=="GW_man_Body_geo1"//1
                                ||name=="head"//3
                                ||name=="CloW_A_body_geo1"//3
                                ||name=="CloW_C_head_geo"//5
                                ||name=="body1"//5
                                ||name=="CloW_D_Body_geo1"//6
                                ){
                                node.material.scattering=true
                            }


                            
                        }
                    })

                    let lod_visible = self.modelManager.modelList[modelType].lod_visible
                    var crowd = new Crowd({
                        camera: self.camera,
                        count: 3000,
                        animPathPre: self.modelManager.modelList[modelType].pathAnima,
                        pathLodGeo: self.modelManager.modelList[modelType].pathLodGeo,
                        pathTextureConfig: self.modelManager.modelList[modelType].pathTextureConfig,
                        assets: self.assets,
                        useColorTag: self.modelManager.modelList[modelType].useColorTag,
                        lod_distance: [],
                        lod_geometry: [20],
                        lod_set: () => {
                            for (let i = 0; i < crowd.children.length; i++) {
                                var crowdGroup0 = crowd.children[i]
                                for (let j = 0; j < lod_visible.length; j++) {
                                    if (i >= lod_visible[j][1]) {
                                        var mesh = crowdGroup0.getMesh(lod_visible[j][0])
                                        if (mesh) mesh.visible = false
                                    }
                                }

                            }
                        },
                    })

                    for(let i=0;i<200;i++){
                        for(let j=0;j<15;j++){
                            let i00=i*15+j
                            crowd.setSpeed(i00, 5)
                            crowd.setScale(i00, [1,1,1])
                            crowd.setMoveMaxLength(i00, 0)
                            crowd.setPosition(i00, [i*2-30,0,j*2-10])
                            crowd.setRotation(i00, [0,0,0])
                            crowd.setAnimation(i00,i%5 , j)
                            crowd.lodList[i]=i00<100?0:-1
            
                        }
                    }
                    // self.setParam(crowd, modelType, self.modelManager.modelIndex)
                    for (var i00 = 0; i00 < crowd.count; i00++) {
                        // 这部分还没整合到分别进行设置
                        crowd.setObesity(i00, 1)
                    }
                    // crowd.visible=false
                    self.scene.add(crowd)
                    window.model.push(crowd)
                    window.crowd = crowd
                    crowd.init(glb.scene)
                    console.log(crowd)

                    crowd.myLodController.open=false
                    
                    // new UI(this.scene, new THREE.Object3D())
                    setTimeout(()=>{
                        new UICrowd(crowd)
                    },3000)
                    
                    

                    load_next(modelType + 1)
                })
            }
        }
        load_next(0)
    }
    materialSet(glb){
        console.log(glb)
        glb.scene.traverse(node => {
            if (node instanceof THREE.Mesh || node instanceof THREE.SkinnedMesh) {
                let name = node.name
                console.log(name)
                node.material.envMapIntensity = 0.1
                node.material.roughness = 0.5//0.5
                node.material.metalness=0.1

                if(name=="CloM_A_Hair_geo"){//man_A
                    node.material.color.r=20
                    node.material.color.g=20
                    node.material.color.b=20
                    node.material.transparent=true
                    node.material.alphaTest = 0.7;
                    node.material.depthWrite = true;
                    node.material.side=THREE.DoubleSide

                    node.material.roughness = 0.9
                    node.material.envMapIntensity = 0.1
                    node.material.metalness=1
                }
                if(name=="CloW_A_hair_geo"){//man_b
                    node.material.color.r=10
                    node.material.color.g=10
                    node.material.color.b=10
                    node.material.transparent=true
                    node.material.alphaTest = 0.7;
                    node.material.depthWrite = true;
                    node.material.side=THREE.DoubleSide

                    node.material.roughness = 0.9
                    node.material.envMapIntensity = 0.1
                    node.material.metalness=1
                }
                if(name=="CloW_C_hair_geo"){//man_b
                    node.material.color.r=10
                    node.material.color.g=10
                    node.material.color.b=10
                    node.material.transparent=true
                    node.material.alphaTest = 0.7;
                    node.material.depthWrite = true;
                    node.material.side=THREE.DoubleSide

                    node.material.roughness = 0.9
                    node.material.envMapIntensity = 0.1
                    node.material.metalness=1
                }
                if(name=="CloW_D_Hair_geo"){//man_b
                    // alert(123)
                    node.material.color.r=30
                    node.material.color.g=30
                    node.material.color.b=30
                    node.material.transparent=true
                    node.material.alphaTest = 0.7;
                    node.material.depthWrite = true;
                    node.material.side=THREE.DoubleSide

                    node.material.roughness = 0.9
                    node.material.envMapIntensity = 0.1
                    node.material.metalness=1
                }

                if(
                    name=="CloM_A_head_geo"//1
                    ||name=="GW_man_Body_geo1"//1
                    ||name=="head"//3
                    ||name=="CloW_A_body_geo1"//3
                    ||name=="CloW_C_head_geo"//5
                    ||name=="body1"//5
                    ||name=="CloW_D_Body_geo1"//6
                    ){
                    node.material.scattering=true
                }


                
            }
        })
    }
    load_model() {
        var self = this
        window.model = []
        crowd_next(0)
        function crowd_next(modelType) {
            const scenes=[]
            gltfloader_next(0)
            function gltfloader_next(gltf_index){
                new GLTFLoader().load(self.modelManager.modelList[modelType].pathModel[gltf_index], async (glb0) => {
                    self.materialSet(glb0)
                    scenes.push(glb0.scene)
                    if(gltf_index+1<self.modelManager.modelList[modelType].pathModel.length) gltfloader_next(gltf_index+1)
                    else process(scenes,modelType)
                })
            }
            if (modelType+1 < self.modelManager.modelIndex) crowd_next(modelType+1)
        }
        function process(scenes,modelType){
            console.log("scenes",scenes)

            // let lod_distance_max = 10
            // let lod_distance = []
            // for (var i = 0; i < 19; i++)
            //     lod_distance.push((i + 1) * lod_distance_max / 19)
            // lod_distance.push(lod_distance_max * 2)   //最低精度模型
            // lod_distance.push(lod_distance_max * 9)     //多个四面体

            // let lod_geometry = []
            // for (var i = 0; i <= 20; i++)//20..0
            //     lod_geometry.push(20 - i)
            // lod_geometry.push(0)

            // let lod_distance_max = 10
            // let lod_distance = []
            // for (var i = 0; i < 9; i++)
            //     lod_distance.push((i + 1) * lod_distance_max / 9)
            // lod_distance.push(lod_distance_max * 2)   //最低精度模型
            // lod_distance.push(lod_distance_max * 9)     //多个四面体

            // let lod_geometry = []
            // for (var i = 0; i <= 10; i++)//20..0
            //     lod_geometry.push(20 - 2*i)
            // lod_geometry.push(0)


            let lod_distance = [1,  2, 3,   5,  30, 50]
            let lod_geometry = [17, 14,11,  8,  1,  0,0]
            // alert("test2")
            // lod_distance=[
            //     0.5263157894736842, 1.0526315789473684, 1.5789473684210527, 
            //     2.1052631578947367, 2.6315789473684212, 3.1578947368421053, 
            //     3.6842105263157894, 4.2105263157894735, 4.7368421052631575, 
            //     5.2631578947368425, 5.7894736842105265, 
            //     6.315789473684211, 6.842105263157895, 7.368421052631579, 
            //     7.894736842105263, 8.421052631578947, 8.947368421052632, 9.473684210526315, 10, 20, 90]
            // lod_geometry=[20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0]

            
            // lod_distance=[]
            // lod_geometry=[0]

            console.log("lod_distance",lod_distance)
            console.log("lod_geometry",lod_geometry)

            let lod_visible = self.modelManager.modelList[modelType].lod_visible
            var crowd = new Crowd({
                camera: self.camera,
                count: self.modelManager.modelList[modelType].ModelCount,
                animPathPre: 
                    self.modelManager.modelList[modelType].pathAnima
                ,

                pathLodGeo: 
                    self.modelManager.modelList[modelType].pathLodGeo,

                pathTextureConfig: 
                    self.modelManager.modelList[modelType].pathTextureConfig,
                useColorTag: 
                    self.modelManager.modelList[modelType].useColorTag,
                meshType:
                    self.modelManager.modelList[modelType].meshType,
                
                assets: self.assets,
                lod_distance: lod_distance,
                lod_geometry: lod_geometry,
                lod_visible:lod_visible,
            })
            self.setParam(crowd, modelType, self.modelManager.modelIndex)
            
            for (var i00 = 0; i00 < crowd.count; i00++) {
                // 这部分还没整合到分别进行设置
                let useTagLen = self.modelManager.modelList[modelType].useColorTag.length
                const test_k=1//00000
                for (let meshIndex = 0; meshIndex < useTagLen; meshIndex++) {
                    crowd.setColor(i00, [
                        test_k*Math.random() - 0.5,
                        test_k* Math.random() - 0.5,
                        test_k* Math.random() - 0.5
                    ], self.modelManager.modelList[modelType].useColorTag[meshIndex])
                }
                crowd.setObesity(i00, 1)
            }
            // crowd.visible=false
            
            window.model.push(crowd)
            window.crowd = crowd
            crowd.init(scenes)
            self.scene.add(crowd)
            self.scene.add(crowd.CrowdPoints)
            window.p=crowd.CrowdPoints
        }
        
    }


    setParam(crowd, modelType, modelCount) {
        for (var i0 = 0; i0 < modelCount * crowd.count; i0++) {
            var scale = [
                1,
                Math.random() * 0.3 + 0.85,
                1,
            ]
            for (var i = 0; i < 3; i++)scale[i] *= 0.2

            if (i0 % modelCount != modelType) continue
            let i00 = Math.floor(i0 / modelCount)
            // let i00 = i0

            var PosRot = this.modelManager.getPosRot_9e(i0, modelType)
            var speed = PosRot.speed;
            var startTime = PosRot.startTime;
            crowd.setSpeed(i00, speed)
            crowd.setScale(i00, scale)
            //this.modelManager.modelList[modelType].posRotList[i0];
            // crowd.setObesity(i00, 0.85+1.1*Math.random())
            let animtionType = PosRot.ani;
            let walkAnimationlen = this.modelManager.modelList[modelType].walkAnimationList.length;
            for (let walkAnimation = 0; walkAnimation < walkAnimationlen; walkAnimation++) {
                if (animtionType == this.modelManager.modelList[modelType].walkAnimationList[walkAnimation]&&animtionType!==10) {
                    crowd.setMoveMaxLength(i00, 2*(1+Math.random()) )
                    break;
                }
            }
            crowd.setPosition(i00, PosRot.pos)
            PosRot.rot[1] += Math.PI;
            crowd.setRotation(i00, PosRot.rot)
            crowd.setAnimation(i00, animtionType, startTime)
        }//end

    }


}