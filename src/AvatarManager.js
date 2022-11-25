import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Crowd } from '../lib/crowd/Crowd.js'//let Crowd=Pack// 
import { CrowdMesh } from '../lib/crowd/CrowdMesh.js'//用于预加载动画数据
import { UI } from './UI.js'
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
        // var pathAnima = "assets/animation_man_A.bin"
        window.timeTest.measure("Anima start await")
        window.timeTest.measure("Anima end await")

        this.modelManager = new modelManager();

        // this.load_model1()
        
        // this.load_model2()
        // this.load_Char47()
        
        this.load_model()
        //this.load_man_A()

        // setTimeout(() => {
        //     // this.load_man_D()
        // }, 1000)
        //this.load_woman_A()
        // this.load_woman_B()
        new UI(this.scene, new THREE.Object3D())
    }

    load_model() {
        var self = this
        for (let modelType = 0; modelType < self.modelManager.modelIndex; modelType++) {
            console.log(self.modelManager.modelList[modelType].pathModel)
            new GLTFLoader().load(self.modelManager.modelList[modelType].pathModel, async (glb) => {
                console.log(glb)
                glb.scene.traverse(node => {
                    if (node instanceof THREE.SkinnedMesh) {
                        let name = node.name
                        console.log(name)
                        // node.material.emissiveIntensity=0
                        node.material.envMapIntensity = 0.3
                        if (name == "CloM_A_head_geo" || name == "GW_man_Body_geo1") //尚未设置这个在modelManager中
                            node.material.envMapIntensity = 0.1
                    }
                })

                let lod_distance_max = 20
                let lod_distance = []
                for (var i = 0; i < 19; i++)
                    lod_distance.push((i + 1) * lod_distance_max / 19)
                lod_distance.push(lod_distance_max * 3)
                lod_distance.push(lod_distance_max * 6)

                let lod_geometry = []
                for (var i = 0; i <= 20; i++)//20..0
                    lod_geometry.push(20 - i)
                lod_geometry.push(0)
                let lod_visible = self.modelManager.modelList[modelType].lod_visible
                var crowd = new Crowd({
                    camera: self.camera,
                    count: self.modelManager.modelList[modelType].ModelCount,
                    animPathPre: self.modelManager.modelList[modelType].pathAnima,
                    pathLodGeo: self.modelManager.modelList[modelType].pathLodGeo,
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
                self.setParam(crowd,modelType)
                for (var i00 = 0; i00 < crowd.count; i00++) {
                    // 这部分还没整合到分别进行设置
                    let useTagLen = self.modelManager.modelList[modelType].useColorTag.length
                    for (let meshIndex = 0; meshIndex < useTagLen; meshIndex++) {
                        crowd.setColor(i00, [
                            20 * Math.random()-10,
                            20 * Math.random()-10,
                            20 * Math.random()-10
                        ], self.modelManager.modelList[modelType].useColorTag[meshIndex])
                    }
                    crowd.setObesity(i00, 0.85 + 1.1 * Math.random())
                }
                self.scene.add(crowd)
                window.crowd = crowd
                crowd.init(glb.scene)
                console.log(crowd)
            })
        }
    }

    setParam(crowd,modelType) {
        var crowd_count = crowd.count
        for (var i0 = 0; i0 < crowd_count; i0++) {
            var scale = [
                1,
                Math.random() * 0.3 + 0.85,
                1,
            ]
            for (var i = 0; i < 3; i++)scale[i] *= 0.34
            var animtionType =this.modelManager.modelList[modelType].animtionTypes[i0];
            // console.log("animationType = ",animtionType);
            var speed = Math.random() * 7 + 4

            // if(i0%2==model_index)continue
            // let i00=Math.floor(i0/2)
            let i00 = i0

            crowd.setSpeed(i00, speed)
            // crowd.setObesity(i00, 0.85+1.1*Math.random())
            let walkAnimationlen = this.modelManager.modelList[modelType].walkAnimationList.length;
            for (let walkAnimation = 0; walkAnimation<walkAnimationlen; walkAnimation++) {
                if (animtionType == this.modelManager.modelList[modelType].walkAnimationList[walkAnimation]) 
                {
                    crowd.setMoveMaxLength(i00, 4 + 2 * Math.random())
                    break;
                }
            }
            crowd.setScale(i00, scale)

            var PosRot = this.modelManager.modelList[modelType].posRotList[i0];
            crowd.setPosition(i00, PosRot.pos)
            PosRot.rot[1] += Math.PI;
            crowd.setRotation(i00, PosRot.rot)
            crowd.setAnimation(i00, animtionType, 1000 * Math.random())
        }//end

    }
    // load_man_A(){
    //     var self = this
    //     var pathModel="assets/man_A_4.glb"//woman01_0.glb"
    //     var pathAnima="assets/animation_man_B.bin"//"assets/animation_woman.json"
    //     var pathLodGeo="assets/man_ALOD/"
    //     new GLTFLoader().load(pathModel, async (glb) => {
    //         glb.scene.traverse(node=>{
    //             if(node instanceof THREE.SkinnedMesh){
    //                 let name=node.name
    //                 node.material.envMapIntensity=0.3
    //                 if(name=="CloM_A_head_geo"||name=="GW_man_Body_geo1")
    //                     node.material.envMapIntensity=0.1
    //             }
    //         })

    //         let lod_distance_max=20
    //         let lod_distance=[]
    //         for(var i=0;i<19;i++)
    //             lod_distance.push((i+1)*lod_distance_max/19)
    //         lod_distance.push(lod_distance_max*3)
    //         lod_distance.push(lod_distance_max*6)

    //         let lod_geometry=[]
    //         for(var i=0;i<=20;i++)//20..0
    //             lod_geometry.push(20-i)
    //         lod_geometry.push(0)

    //         let lod_visible=[
    //             ["CloM_A_Eye_lash_geo", -1],
    //             ["CloM_A_Eyeshell_geo", 1],
    //             ["CloM_A_EyeLeft_geo",  10],
    //             ["CloM_A_EyeRight_geo", 10],
    //             ["CloM_A_Saliva_geo",   -1],
    //             ["CloM_A_Teeth_geo",    -1],
    //             ['CloM_A_Hair_geo',     19],
    //             ['CloM_A_EyeEdge_geo',  5],
    //             ['GW_man_Body_geo1',    19],
    //             ['GW_man_Nail_geo',     -1],
    //             ['CloM_A_lingdai_geo',  10],
    //             ['CloM_A_Wazi_geo',     1],
    //             ['CloM_A_Xiezi_geo',    18],
    //             ['CloM_A_chengyi_geo',  19],
    //             ['CloM_A_xiuzi_geo',    -1],

    //             // ['CloM_A_waitao_geo',   10],
    //             ['CloM_A_kuzi_geo',     21],
    //             ["CloM_A_head_geo",     21],
    //         ]

    //         var crowd=new Crowd({
    //             camera:self.camera,
    //             count:Math.floor(9*(11123)/2),//5*100*100,
    //             animPathPre:pathAnima,
    //             pathLodGeo:pathLodGeo,
    //             assets:self.assets,
    //             useColorTag:[//需要进行颜色编辑的区域mesh名称
    //                 // "CloM_A_chengyi_geo",
    //                 "CloM_A_lingdai_geo",
    //                 "CloM_A_kuzi_geo",
    //                 "CloM_A_waitao_geo",
    //                 "CloM_A_Xiezi_geo",
    //                 "CloM_A_Hair_geo"
    //             ],
    //             lod_distance:lod_distance,//[30,50,70,90,110,130,150],//6级LOD
    //             lod_geometry:lod_geometry,//[19,17,15,10,8,4,2,0],
    //             lod_set:()=>{
    //                 for(let i=0;i<crowd.children.length;i++){
    //                     var crowdGroup0=crowd.children[i]
    //                     for(let j=0;j<lod_visible.length;j++){
    //                         if(i>=lod_visible[j][1]){
    //                             var mesh=crowdGroup0.getMesh(lod_visible[j][0])
    //                             if(mesh)mesh.visible=false
    //                         }
    //                     }


    //                 }
    //             },
    //         })
    //         self.setParamman_A(crowd,1,4)
    //         for(var i00=0;i00<crowd.count;i00++){
    //             crowd.setColor(i00, [
    //                 20*Math.random(),
    //                 20*Math.random(),
    //                 20*Math.random()-10
    //             ],"CloM_A_kuzi_geo")
    //             crowd.setColor(i00, [
    //                 20*Math.random(),
    //                 20*Math.random(),
    //                 20*Math.random()-10
    //             ],"CloM_A_waitao_geo")
    //             crowd.setColor(i00, [
    //                 20*Math.random(),
    //                 20*Math.random(),
    //                 20*Math.random()-10
    //             ],"CloM_A_lingdai_geo")
    //             crowd.setColor(i00, [
    //                 20*Math.random(),
    //                 20*Math.random(),
    //                 20*Math.random()
    //             ],"CloM_A_Xiezi_geo")
    //             crowd.setColor(i00, [
    //                 20*Math.random(),
    //                 20*Math.random(),
    //                 20*Math.random()
    //             ],"CloM_A_Hair_geo")
    //             crowd.setObesity(i00, 0.85+1.1*Math.random())
    //         }
    //         self.scene.add(crowd)
    //         window.crowd=crowd
    //         crowd.init(glb.scene)
    //         console.log(crowd)
    //     })
    // }
    // setParam(crowd,model_index,animtionNum){
    //     var crowd_count=100*100+754
    //     for(var i0=0;i0<crowd_count;i0++){
    //         var scale=[
    //             1,
    //             Math.random()*0.3+0.85,
    //             1,
    //         ]
    //         for(var i=0;i<3;i++)scale[i]*=1.3
    //         var animtionType=Math.floor(animtionNum*Math.random())//12
    //         // if(i0<1250){//496){
    //         //     if(Math.random()>0.5)animtionType=5
    //         //     else animtionType=8
    //         // }else if(animtionType==5)animtionType=0
    //         // else if(animtionType==8)animtionType=1

    //         var speed=Math.random()*2.5+2
    //         if(animtionType==5)speed+=1.5

    //         if(i0%2==model_index)continue
    //         let i00=Math.floor(i0/2)

    //         crowd.setSpeed(i00, speed)
    //         // crowd.setObesity(i00, 0.85+1.1*Math.random())
    //         if(animtionType==5||animtionType==8)
    //             crowd.setMoveMaxLength(i00, 4+2*Math.random())
    //         crowd.setScale(i00, scale)

    //         var PosRot=this.getPosRot(i0)
    //         crowd.setPosition(i00,PosRot.pos)
    //         crowd.setRotation(i00,PosRot.rot)

    //         crowd.setAnimation(i00,animtionType,10000*Math.random())

    //         // if(model_index==1){
    //         //     crowd.setColor(i00, [
    //         //         62*Math.random(),
    //         //         62*Math.random(),
    //         //         62*Math.random()
    //         //     ],"CloW_C_qunzi_geo3456")
    //         //     crowd.setColor(i00, [
    //         //         -Math.random(),
    //         //         -Math.random(),
    //         //         -Math.random()
    //         //     ],"CloW_C_shangyi_geo")
    //         //     crowd.setColor(i00, [
    //         //         67*Math.random(),
    //         //         67*Math.random(),
    //         //         67*Math.random()
    //         //     ],"CloW_C_xie_geo")
    //         //     crowd.setColor(i00, [
    //         //         20*Math.random(),
    //         //         12*Math.random(),
    //         //         12*Math.random()
    //         //     ],"hair")
    //         // }else if(model_index==0){
    //         //     crowd.setColor(i00, [
    //         //         12*Math.random(),
    //         //         12*Math.random(),
    //         //         12*Math.random()
    //         //     ],"CloW_A_kuzi_geo")
    //         //     crowd.setColor(i00, [
    //         //         12*Math.random(),
    //         //         12*Math.random(),
    //         //         12*Math.random()
    //         //     ],"CloW_A_waitao_geo1")
    //         //     crowd.setColor(i00, [
    //         //         12*Math.random(),
    //         //         12*Math.random(),
    //         //         12*Math.random()
    //         //     ],"CloW_A_xiezi_geo")
    //         //     crowd.setColor(i00, [
    //         //         20*Math.random(),
    //         //         12*Math.random(),
    //         //         12*Math.random()
    //         //     ],"hair")
    //         // }

    //     }//end
    //     // crowd.count=crowd_count

    // }
    // setParam2(crowd,model_index,animtionNum){
    //     var crowd_count=11123
    //     for(var i0=0;i0<crowd_count;i0++){
    //         var scale=[
    //             1,
    //             Math.random()*0.3+0.85,
    //             1,
    //         ]
    //         for(var i=0;i<3;i++)scale[i]*=1.1
    //         var animtionType=Math.floor(animtionNum*Math.random())//12
    //         if(i0<1250){//496){
    //             animtionType=3
    //         }
    //         else if(animtionType==3)animtionType=4
    //         // else if(animtionType==4)animtionType=1

    //         var speed=(Math.random()*2.5+2)*2.5
    //         if(animtionType==5)speed+=1.5

    //         if(i0%2==model_index)continue
    //         let i00=Math.floor(i0/2)
    //         // let i00=i0

    //         crowd.setSpeed(i00, speed)
    //         // crowd.setObesity(i00, 0.85+1.1*Math.random())
    //         if(animtionType==3)
    //             crowd.setMoveMaxLength(i00, 4+2*Math.random())
    //         crowd.setScale(i00, scale)

    //         var PosRot=this.getPosRot2(i0)
    //         crowd.setPosition(i00,PosRot.pos)
    //         crowd.setRotation(i00,PosRot.rot)

    //         crowd.setAnimation(i00,animtionType,10000*Math.random())

    //         crowd.setColor(i00, [
    //             12*Math.random(),
    //             12*Math.random(),
    //             12*Math.random()
    //         ],"Ch23_Belt")
    //         crowd.setColor(i00, [
    //             2*Math.random(),
    //             2*Math.random(),
    //             2*Math.random()
    //         ],"Ch23_Pants")
    //         crowd.setColor(i00, [
    //             3*Math.random()-1,
    //             3*Math.random()-2,
    //             3*Math.random()-2
    //         ],"Ch23_Shirt")
    //         crowd.setColor(i00, [
    //             20*Math.random(),
    //             15*Math.random(),
    //             15*Math.random()
    //         ],"Ch23_Shoes")
    //         crowd.setColor(i00, [
    //             20*Math.random(),
    //             20*Math.random(),
    //             20*Math.random()
    //         ],"Ch23_Suit")
    //     }//end
    //     // crowd.count=crowd_count

    // }
    // setParamman_A(crowd){
    //     var crowd_count=crowd.count
    //     for(var i0=0;i0<crowd_count;i0++){
            
    //         var scale=[
    //             1,
    //             Math.random()*0.3+0.85,
    //             1,
    //         ]
    //         for(var i=0;i<3;i++)scale[i]*=0.34
    //         var animtionType=Math.floor(28*Math.random())//12
    //         if( animtionType==11) animtionType=0
    //         if( animtionType==20) animtionType=1
    //         if(i0<1250*9/2){//496){
    //             //if(Math.random()>0.5)
    //             // animtionType=Math.random()>0.5?11:20
    //             animtionType=11
    //             //11走动 20跑动
    //         }

    //         var speed=Math.random()*7+4

    //         // if(i0%2==model_index)continue
    //         // let i00=Math.floor(i0/2)
    //         let i00=i0

    //         crowd.setSpeed(i00, speed)
    //         crowd.setObesity(i00, 0.85+1.1*Math.random())
    //         if(animtionType==11||animtionType==20)
    //             crowd.setMoveMaxLength(i00, 4+2*Math.random())
    //         crowd.setScale(i00, scale)

    //         var PosRot=this.getPosRotman(2*i0)
    //         crowd.setPosition(i00,PosRot.pos)
    //         PosRot.rot[1]+=Math.PI;
    //         crowd.setRotation(i00,PosRot.rot)

    //         crowd.setAnimation(i00,animtionType,1000*Math.random())
    //     }//end

    // }
    // getPosRot(i0) {
    //     var c=[//分组情况
    //         1250,//496,   //运动
    //         15*182,     //大看台1
    //         21*182,     //大看台2
    //         20*60,   //小看台1
    //         17*60,   //小看台2
    //         300,        //弧形看台1 （从小看台到大看台旁边的顺序排列）
    //         240,         //弧形看台2 
    //         192,         //弧形看台3


    //     ]
    //     if(i0<c[0]){
    //         var col_count=25
    //         var row_count=50
    //         var i=i0%col_count
    //         var j=Math.floor(i0/col_count)
    //         var position=[
    //             2*(1.8*i+1.5*Math.random()-col_count/2-20+11),
    //             0,
    //             2*(1.8*j+1.5*Math.random()-row_count/2-25+5),
    //         ]
    //         var rotation=[0,Math.PI*2*Math.random(),0]
    //     }
    //     else if(i0<c[0]+c[1]){//大看台1
    //         i0-=c[0]
    //         var row_count=182
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)+1
    //         var position=[
    //             1.5*-31-1.5*(col)*1.9,
    //             1.3*col,//
    //             0.82*row-75,
    //         ]
    //         var rotation=[0,-Math.PI*0.5,0]
    //     }
    //     else if(i0<c[0]+c[1]+c[2]){//大看台2
    //         i0-=(c[0]+c[1])
    //         var row_count=182
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)+1
    //         var position=[
    //             1.5*31+1.5*col*1.9,
    //             1.3*col,
    //             0.82*row-75,
    //         ]
    //         var rotation=[0,Math.PI*0.5,0]
    //     }
    //     else if(i0<c[0]+c[1]+c[2]+c[3]){//小看台1
    //         i0-=(c[0]+c[1]+c[2])
    //         var row_count=60
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)
    //         if(col>12)col+=4
    //         var position=[
    //             1.*row-30,//1.5*(row*0.25-50)*2.01+73,
    //             1.28*col,
    //             -99-1.5*col*1.9,
    //         ]
    //         var rotation=[0,-Math.PI,0]
    //     }else if(i0<c[0]+c[1]+c[2]+c[3]+c[4]){//小看台2
    //         i0-=(c[0]+c[1]+c[2]+c[3])
    //         var row_count=60
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)
    //         if(col>0)col+=3
    //         if(col>12)col+=4
    //         var position=[
    //             1.*row-30,//1.5*(row*0.25-50)*2.01+73,
    //             1.28*col,
    //             99+1.5*col*1.9
    //         ]
    //         var rotation=[0,0,0]
    //         // var position=[-1000,-1000,-1000]
    //     }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]) {//弧形看台1 （从小看台到大看台旁边的顺序排列）
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4])
    //         if (i0<2) this.row_index = 0; // 重置行数
    //         var col_index=i0 - Math.floor((0+this.row_index)*(this.row_index+1)/2);
    //         if (col_index > this.row_index) {
    //             this.row_index++;
    //             col_index-=this.row_index;
    //         }
    //         var position=[
    //             1.*col_index+30,
    //             1.28*this.row_index+1.28,
    //             99+1.5*this.row_index*1.9-col_index*0.25
    //         ]
    //         var rotation=[0,0,0] // 还需调整方向，目前尚未调整
    //     }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]) { //弧形看台2
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]);
    //         if (i0<2) {
    //             this.row_index = 0; // 重置行数
    //             this.sum_count = 0;
    //             this.row_count = 3;
    //         }
    //         var col_index = i0 - this.sum_count;
    //         if (col_index > this.row_count) {
    //             this.row_index++;
    //             col_index-=this.row_count;
    //             this.sum_count += this.row_count;
    //             if (this.row_index%3 === 0) this.row_count+=2;
    //         }
    //         var position=[
    //             1.*col_index+31+this.row_index,
    //             1.28*this.row_index,
    //             98+1.5*this.row_index*1.75-col_index*0.6
    //         ]
    //         var rotation = [0,0,0]
    //     } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]) {
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]);
    //         if (i0<2) {
    //             this.row_index = 0; // 重置行数
    //             this.sum_count = 0;
    //             this.row_count = 3;
    //         } 
    //         var col_index = i0 - this.sum_count;
    //         if (col_index > this.row_count) {
    //             this.row_index++;
    //             col_index-=this.row_count;
    //             this.sum_count += this.row_count;
    //             if (this.row_index%4 === 0) this.row_count+=2;
    //         }
    //         // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
    //         var position=[
    //             1.*col_index+34.5+this.row_index*1.8,
    //             1.28*this.row_index,
    //             95+1.5*this.row_index*1.45-col_index
    //         ]
    //         var rotation = [0,0,0]
    //     } else {

    //     }
    //     return {pos:position,rot:rotation} 
    // }
    // getPosRot2(i0) {
    //     var c=[//分组情况
    //         1250,//496,   //运动
    //         15*182,     //大看台1
    //         21*182,     //大看台2
    //         20*60,   //小看台1
    //         17*60,   //小看台2
    //         300,        //弧形看台1 （从小看台到大看台旁边的顺序排列）
    //         240,         //弧形看台2 
    //         192,         //弧形看台3
    //         152,    //弧形看台6
    //         217,    //弧形看台5
    //     ]
    //     if(i0<c[0]){
    //         var col_count=25
    //         var row_count=50
    //         var i=i0%col_count
    //         var j=Math.floor(i0/col_count)
    //         var position=[
    //             2*(1.8*i+1.5*Math.random()-col_count/2-20+11),
    //             0,
    //             2*(1.8*j+1.5*Math.random()-row_count/2-25+5),
    //         ]
    //         var rotation=[0,Math.PI*2*Math.random(),0]
    //     }
    //     else if(i0<c[0]+c[1]){//大看台1
    //         i0-=c[0]
    //         var row_count=182
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)+1
    //         var position=[
    //             1.5*-31-1.5*(col)*1.9,
    //             1.3*col,//
    //             0.82*row-75,
    //         ]
    //         var rotation=[0,-Math.PI*0.5+Math.PI,0]
    //     }
    //     else if(i0<c[0]+c[1]+c[2]){//大看台2
    //         i0-=(c[0]+c[1])
    //         var row_count=182
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)+1
    //         var position=[
    //             1.5*31+1.5*col*1.9,
    //             1.3*col,
    //             0.82*row-75,
    //         ]
    //         var rotation=[0,Math.PI*0.5+Math.PI,0]
    //     }
    //     else if(i0<c[0]+c[1]+c[2]+c[3]){//小看台1
    //         i0-=(c[0]+c[1]+c[2])
    //         var row_count=60
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)
    //         if(col>12)col+=4
    //         var position=[
    //             1.*row-30,//1.5*(row*0.25-50)*2.01+73,
    //             1.28*col,
    //             -99-1.5*col*1.9,
    //         ]
    //         var rotation=[0,-Math.PI+Math.PI,0]
    //     }else if(i0<c[0]+c[1]+c[2]+c[3]+c[4]){//小看台2
    //         i0-=(c[0]+c[1]+c[2]+c[3])
    //         var row_count=60
    //         var row=i0%row_count
    //         var col=Math.floor(i0/row_count)
    //         if(col>0)col+=3
    //         if(col>12)col+=4
    //         var position=[
    //             1.*row-30,//1.5*(row*0.25-50)*2.01+73,
    //             1.28*col,
    //             99+1.5*col*1.9
    //         ]
    //         var rotation=[0,0+Math.PI,0]
    //         // var position=[-1000,-1000,-1000]
    //     }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]) {//弧形看台1 （从小看台到大看台旁边的顺序排列）
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4])
    //         if (i0<2) this.row_index = 0; // 重置行数
    //         var col_index=i0 - Math.floor((0+this.row_index)*(this.row_index+1)/2);
    //         if (col_index > this.row_index) {
    //             this.row_index++;
    //             col_index-=this.row_index;
    //         }
    //         var position=[
    //             1.*col_index+30,
    //             1.28*this.row_index+1.28,
    //             99+1.5*this.row_index*1.9-col_index*0.25
    //         ]
    //         var rotation=[0,0,0] // 还需调整方向，目前尚未调整
    //     }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]) { //弧形看台2
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]);
    //         if (i0<2) {
    //             this.row_index = 0; // 重置行数
    //             this.sum_count = 0;
    //             this.row_count = 3;
    //         }
    //         var col_index = i0 - this.sum_count;
    //         if (col_index > this.row_count) {
    //             this.row_index++;
    //             col_index-=this.row_count;
    //             this.sum_count += this.row_count;
    //             if (this.row_index%3 === 0) this.row_count+=2;
    //         }
    //         var position=[
    //             1.*col_index+31+this.row_index,
    //             1.28*this.row_index,
    //             98+1.5*this.row_index*1.75-col_index*0.6
    //         ]
    //         var rotation = [0,0,0]
    //     } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]) {
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]);
    //         if (i0<2) {
    //             this.row_index = 0; // 重置行数
    //             this.sum_count = 0;
    //             this.row_count = 3;
    //         } 
    //         var col_index = i0 - this.sum_count;
    //         if (col_index > this.row_count) {
    //             this.row_index++;
    //             col_index-=this.row_count;
    //             this.sum_count += this.row_count;
    //             if (this.row_index%4 === 0) this.row_count+=2;
    //         }
    //         // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
    //         var position=[
    //             1.*col_index+34.5+this.row_index*1.8,
    //             1.28*this.row_index,
    //             95+1.5*this.row_index*1.45-col_index
    //         ]
    //         var rotation = [0,Math.PI*1.25,0]
    //     } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]+c[8]) { //弧形看台6
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7])
    //         if (i0<1) {
    //             this.row_index = 8; // 重置行数
    //             this.sum_count = 0;
    //             this.row_count = 8;
    //         } 
    //         var col_index = i0 - this.sum_count;
    //         if (col_index > this.row_count) {
    //             this.row_index++;
    //             col_index-=this.row_count;
    //             this.sum_count += this.row_count;
    //             if (this.row_index%4 === 0) this.row_count+=1;
    //         }
    //         // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
    //         var position=[
    //             1.5*31+1.5*this.row_index*1.9,
    //             1.28*this.row_index,
    //             0.82*col_index+75,
    //         ]
    //         var rotation = [0,Math.PI*0.5+Math.PI,0]
    //     } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]+c[8]+c[9]) { //弧形看台5
    //         i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]+c[8])
    //         if (i0<1) {
    //             this.row_index = 8; // 重置行数
    //             this.sum_count = 0;
    //             this.row_count = 9;
    //         } 
    //         var col_index = i0 - this.sum_count;
    //         if (col_index > this.row_count) {
    //             this.row_index++;
    //             col_index-=this.row_count;
    //             this.sum_count += this.row_count;
    //             this.row_count+=1;
    //         }
    //         // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
    //         var position=[
    //             1.5*30+1.5*this.row_index*1.9-0.3*col_index,
    //             1.28*this.row_index,
    //             0.82*col_index+79+this.row_count*0.5,
    //         ]
    //         var rotation = [0,Math.PI*0.5+Math.PI,0]
    //     }
    //     else {
    //         var position=[
    //             0,0,0
    //         ]
    //         var rotation = [0,0,0]
    //     }
    //     return {pos:position,rot:rotation} 
    // }
    // getPosRotman(i0){
    //     var PosRot=this.getPosRot2(parseInt(i0/9))
    //     var j0=i0%9;
    //     let k=0.5;
    //     PosRot.pos[0]+=(k*parseInt(j0/3))
    //     PosRot.pos[2]+=(k*(j0%3))
    //     return PosRot
    // }
    // getPosRotwomanA(i0){
    //     var PosRot=this.getPosRot2(parseInt(i0/2))
    //     var j0=i0%2;
    //     if (j0==0) {
    //         PosRot.pos[0]+=1
    //     }
    //     else if (j0==1) {
    //         PosRot.pos[2]+=1
    //     }
    //     return PosRot
    // }
    // getPosRotwomanB(i0){
    //     var PosRot=this.getPosRot2(parseInt(i0/2))
    //     var j0=i0%2;
    //     if (j0==0) {
    //         PosRot.pos[2]+=0.5
    //     }
    //     else if (j0==1) {
    //         PosRot.pos[0]+=0.5
    //         PosRot.pos[2]+=1
    //     }
    //     return PosRot
    // }
}