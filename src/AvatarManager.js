import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Crowd } from '../lib/crowd/Crowd.js'//let Crowd=Pack// 
import { CrowdMesh } from '../lib/crowd/CrowdMesh.js'//用于预加载动画数据
import { UI,UICrowd } from './UI.js'
import { MaterialProcessor1, MaterialProcessor2, MaterialProcessor3 } from './MaterialProcessor.js'
import * as THREE from "three";
import { modelManager } from "./modelManager.js";
export class AvatarManager {
    constructor(scene, camera) {
        this.scene = scene
        this.camera = camera
        this.assets = {}//为了防止资源重复加载，相同路径的资源只加载一次
        // this.row_index = 0; //在梯形看台中计算当前人物所在看台行数(貌似含义和小看台中正好相反)
        // this.sum_count = 0; //当前row_index前面行的人数总和
        // this.row_count = 0; //当前行的可放置人数
        this.init()
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
                            crowd.setPosition(i00, [i*2,0,j*2])
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

    load_model() {
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

                    let lod_distance_max = 17
                    let lod_distance = []
                    for (var i = 0; i < 19; i++)
                        lod_distance.push((i + 1) * lod_distance_max / 19+2)
                    lod_distance.push(lod_distance_max * 2.5)
                    lod_distance.push(lod_distance_max * 4)
                    console.log("lod_distance", lod_distance.length)

                    let lod_geometry = []
                    for (var i = 0; i <= 20; i++)//20..0
                        lod_geometry.push(20 - i)
                    lod_geometry.push(0)

                    // let lod_distance = []
                    // let lod_geometry = [20]


                    let lod_visible = self.modelManager.modelList[modelType].lod_visible
                    var crowd = new Crowd({
                        camera: self.camera,
                        count: self.modelManager.modelList[modelType].ModelCount,
                        animPathPre: self.modelManager.modelList[modelType].pathAnima,
                        pathLodGeo: self.modelManager.modelList[modelType].pathLodGeo,
                        pathTextureConfig: self.modelManager.modelList[modelType].pathTextureConfig,
                        assets: self.assets,
                        useColorTag: self.modelManager.modelList[modelType].useColorTag,
                        lod_distance: lod_distance,
                        lod_geometry: lod_geometry,
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
                    self.setParam(crowd, modelType, self.modelManager.modelIndex)
                    
                    for (var i00 = 0; i00 < crowd.count; i00++) {
                        // 这部分还没整合到分别进行设置
                        let useTagLen = self.modelManager.modelList[modelType].useColorTag.length

                        if (self.modelManager.modelList[modelType].pathModel == "assets/sim/man_A_4/sim.glb") {

                            crowd.setColor(i00, [
                                20 * Math.random(),
                                20 * Math.random(),
                                20 * Math.random() - 10
                            ], "CloM_A_kuzi_geo")
                            crowd.setColor(i00, [
                                20 * Math.random(),
                                20 * Math.random(),
                                20 * Math.random() - 10
                            ], "CloM_A_waitao_geo")
                            crowd.setColor(i00, [
                                20 * Math.random(),
                                20 * Math.random(),
                                20 * Math.random() - 10
                            ], "CloM_A_lingdai_geo")
                            crowd.setColor(i00, [
                                20 * Math.random(),
                                20 * Math.random(),
                                20 * Math.random()
                            ], "CloM_A_Xiezi_geo")
                            // crowd.setColor(i00, [
                            //     20 * Math.random(),
                            //     20 * Math.random(),
                            //     20 * Math.random()
                            // ], "CloM_A_Hair_geo")
                            // crowd.setColor(i00, [
                            //     10,
                            //     10,
                            //     10
                            // ], "CloM_A_Hair_geo")
                            crowd.setObesity(i00, 1)
                            // crowd.setObesity(i00, 0.85+1.1*Math.random())

                        } else if (self.modelManager.modelList[modelType].pathModel == "assets/sim/woman_A/sim.glb") {
                            // crowd.setColor(i00, [
                            //     0.1 * Math.random(),
                            //     0.1 * Math.random(),
                            //     0.1 * Math.random()
                            // ], "CloW_A_hair_geo")
                            crowd.setColor(i00, [
                                45 * Math.random(),
                                45 * Math.random(),
                                45 * Math.random()
                            ], "CloW_A_kuzi_geo")
                            crowd.setColor(i00, [
                                45 * Math.random(),
                                45 * Math.random(),
                                45 * Math.random()
                            ], "CloW_A_xifu_geo")
                            crowd.setObesity(i00, 1)
                        } else {
                            for (let meshIndex = 0; meshIndex < useTagLen; meshIndex++) {
                                crowd.setColor(i00, [
                                     Math.random() - 0.5,
                                     Math.random() - 0.5,
                                     Math.random() - 0.5
                                ], self.modelManager.modelList[modelType].useColorTag[meshIndex])
                            }
                            crowd.setObesity(i00, 1)
                            // crowd.setObesity(i00, 0.85 + 1.1 * Math.random())
                        }
                        crowd.setObesity(i00, 1)
                    }
                    // crowd.visible=false
                    self.scene.add(crowd)
                    window.model.push(crowd)
                    window.crowd = crowd
                    crowd.init(glb.scene)
                    console.log(crowd)

                    // new UI(this.scene, new THREE.Object3D())
                    

                    load_next(modelType + 1)
                })
            }
        }
        load_next(0)
        new UI(this.scene, new THREE.Object3D())
    }


    setParam(crowd, modelType, modelCount) {
        for (var i0 = 0; i0 < modelCount * crowd.count; i0++) {
            var scale = [
                1,
                Math.random() * 0.3 + 0.85,
                1,
            ]
            for (var i = 0; i < 3; i++)scale[i] *= 0.34

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
                if (animtionType == this.modelManager.modelList[modelType].walkAnimationList[walkAnimation]) {
                    crowd.setMoveMaxLength(i00, 2)
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