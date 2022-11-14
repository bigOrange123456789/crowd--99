import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
//RGBMLoader
import { Crowd } from '../lib/crowd/Crowd.js'//let Crowd=Pack// 
import { CrowdMesh } from '../lib/crowd/CrowdMesh.js'//用于预加载动画数据
import { UI } from './UI.js'
import {MaterialProcessor1,MaterialProcessor2,MaterialProcessor3 } from './MaterialProcessor.js'
import * as THREE from "three";
export class AvatarManager{
    constructor(scene,camera){
        this.scene=scene
        this.camera=camera
        this.assets={}//为了防止资源重复加载，相同路径的资源只加载一次
        this.row_index = 0; //在梯形看台中计算当前人物所在看台行数(貌似含义和小看台中正好相反)
        this.sum_count = 0; //当前row_index前面行的人数总和
        this.row_count = 0; //当前行的可放置人数
        this.init()
    }
    async init(){
        var pathAnima="assets/animation_woman.bin"//"assets/animation_woman.json"
        window.timeTest.measure("Anima start await")
        this.assets[pathAnima]=await CrowdMesh.loadAnimJSON(pathAnima)
        window.timeTest.measure("Anima end await")
        // this.load_model1()
        // this.load_model2()
        this.load_Char47()
        this.load_man_A()
        new UI(this.scene,new THREE.Object3D())
    }
    load_model1(){
        var self = this
        var pathModel="assets/woman01.gltf"//woman01_0.glb"
        var pathAnima="assets/animation_woman.bin"//"assets/animation_woman.json"
        var pathLodGeo="assets/woman01LOD/"
        window.timeTest.measure("gltf load start")
        new GLTFLoader().load(pathModel, async (glb) => {
            window.timeTest.measure("gltf load end")
            console.log(glb)
            const p=new MaterialProcessor1(glb)
            await p.init()
            window.timeTest.measure("MaterialProcessor1 end")
            var crowd=new Crowd({
                camera:self.camera,
                count:100*100/2+754/2,//5*100*100,
                animPathPre:pathAnima,
                pathLodGeo:pathLodGeo,
                assets:self.assets,
                useColorTag:[//需要进行颜色编辑的区域mesh名称
                    "CloW_A_kuzi_geo","CloW_A_waitao_geo1","CloW_A_xiezi_geo","hair"
                ],
                lod_distance:[10,20,45,70,90],//6级LOD
                lod_geometry:[19,13,8,4,2,0],
                lod_set:()=>{
                    for(let i=0;i<crowd.children.length;i++){
                        var crowdGroup0=crowd.children[i]
                        crowdGroup0.getMesh("teeth").visible=false
                        if(i==0){
                        }else if(i==1){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        }else if(i==2){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        }else if(i==3){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_A_xiezi_geo").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        }else if(i==4){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_A_xiezi_geo").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                            crowdGroup0.getMesh("hair").visible=false
                        }else if(i==5){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_A_xiezi_geo").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                            crowdGroup0.getMesh("hair").visible=false
                        }
                    }
                },
            })
            window.timeTest.measure("set param start")
            self.setParam(crowd,0,12)
            window.timeTest.measure("set param end")
            console.log(crowd)
            self.scene.add(crowd)
            window.timeTest.measure("init start")
            crowd.init(
                glb.scene,
                ()=>{
                    window.timeTest.measure("init finish")
                    new UI(this.scene,crowd.children[0])
                }
            )
        })
    }
    load_model2(){
        var self = this
        var pathModel="assets/woman02.gltf"//woman01_0.glb"
        var pathAnima="assets/animation_woman.bin"//"assets/animation_woman.json"
        var pathLodGeo="assets/woman02LOD/"
        new GLTFLoader().load(pathModel, async (glb) => {
            const p=new MaterialProcessor2(glb)
            await p.init()
            var crowd=new Crowd({
                camera:self.camera,
                count:100,//100*100/2+754/2,//5*100*100,
                animPathPre:pathAnima,
                pathLodGeo:pathLodGeo,
                assets:self.assets,
                useColorTag:[//需要进行颜色编辑的区域mesh名称
                    "CloW_C_qunzi_geo3456",
                    "CloW_C_shangyi_geo",
                    "CloW_C_xie_geo",
                    "hair"
                ],
                lod_distance:[10,20,45,70,90],//6级LOD
                lod_geometry:[19,13,8,4,2,0],
                lod_set:()=>{
                    for(let i=0;i<crowd.children.length;i++){
                        var crowdGroup0=crowd.children[i]
                        crowdGroup0.getMesh("teeth").visible=false
                        if(i==0){
                        }else if(i==1){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        }else if(i==2){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        }else if(i==3){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_C_xie_geo").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        }else if(i==4){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_C_xie_geo").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                            crowdGroup0.getMesh("hair").visible=false
                        }else if(i==5){
                            crowdGroup0.getMesh("eyelash").visible=false
                            crowdGroup0.getMesh("CloW_C_xie_geo").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                            crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                            crowdGroup0.getMesh("hair").visible=false
                        }
                    }
                },
            })
            self.setParam(crowd,1,12)
            self.scene.add(crowd)
            window.crowd=crowd
            console.log(crowd)
            crowd.init(
                glb.scene
            )
        })
    }
    load_Char47(){
        var self = this
        var pathModel="assets/Char47.gltf"//woman01_0.glb"
        var pathAnima="assets/animation_Char47.bin"//"assets/animation_woman.json"
        var pathLodGeo="assets/Char47LOD/"
        new GLTFLoader().load(pathModel, async (glb) => {
            console.log(glb)
            const p=new MaterialProcessor3(glb)
            await p.init()
            var crowd=new Crowd({
                camera:self.camera,
                count:5*100*100,//100*100/2+754/2,//5*100*100,
                animPathPre:pathAnima,
                pathLodGeo:pathLodGeo,
                assets:self.assets,
                useColorTag:[//需要进行颜色编辑的区域mesh名称
                    // "CloW_C_qunzi_geo3456",
                    // "CloW_C_shangyi_geo",
                    // "CloW_C_xie_geo",
                    // "hair"
                    "Ch23_Belt",
                    "Ch23_Pants",
                    "Ch23_Shirt",
                    "Ch23_Shoes",
                    "Ch23_Suit"
                ],
                lod_distance:[10,30,50,70,90,110,130],//6级LOD
                lod_geometry:[19,17,15,10, 8,4,2,0],
                lod_set:()=>{
                    for(let i=0;i<crowd.children.length;i++){
                        var crowdGroup0=crowd.children[i]
                        crowdGroup0.getMesh("Ch23_Hair").visible=false
                        // crowdGroup0.getMesh("Ch23_Belt").visible=false
                        if(i>1){
                            // Ch23_Eyelashes
                            crowdGroup0.getMesh("Ch23_Eyelashes").visible=false
                            crowdGroup0.getMesh("Ch23_Belt").visible=false
                        }
                        if(i>4){
                            crowdGroup0.getMesh("Ch23_Shoes").visible=false
                        }
                        // if(i==0){
                        // }else if(i==1){
                        //     crowdGroup0.getMesh("eyelash").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        // }else if(i==2){
                        //     crowdGroup0.getMesh("eyelash").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        // }else if(i==3){
                        //     crowdGroup0.getMesh("eyelash").visible=false
                        //     crowdGroup0.getMesh("CloW_C_xie_geo").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        // }else if(i==4){
                        //     crowdGroup0.getMesh("eyelash").visible=false
                        //     crowdGroup0.getMesh("CloW_C_xie_geo").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        //     crowdGroup0.getMesh("hair").visible=false
                        // }else if(i==5){
                        //     crowdGroup0.getMesh("eyelash").visible=false
                        //     crowdGroup0.getMesh("CloW_C_xie_geo").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeRight_geo01").visible=false
                        //     crowdGroup0.getMesh("CloW_E_eyeLeft_geo02").visible=false
                        //     crowdGroup0.getMesh("hair").visible=false
                        // }
                    }
                },
            })
            self.setParam2(crowd,1,5)
            self.scene.add(crowd)
            window.crowd=crowd
            console.log(crowd)
            crowd.init(
                glb.scene
            )
        })
    }
    load_man_A(){
        var self = this
        var pathModel="assets/man_A.glb"//woman01_0.glb"
        var pathAnima="assets/animation_man_A.bin"//"assets/animation_woman.json"
        var pathLodGeo="assets/man_ALOD/"
        new GLTFLoader().load(pathModel, async (glb) => {
            console.log(glb)
            const p=new MaterialProcessor3(glb)
            await p.init()
            var crowd=new Crowd({
                camera:self.camera,
                count:5*100*100,//100*100/2+754/2,//5*100*100,
                animPathPre:pathAnima,
                pathLodGeo:pathLodGeo,
                assets:self.assets,
                useColorTag:[//需要进行颜色编辑的区域mesh名称
                    "CloM_A_chengyi_geo",
                    "CloM_A_kuzi_geo",
                    "CloM_A_waitao_geo"
                ],
                lod_distance:[30,50,70,90,110,130,150],//6级LOD
                lod_geometry:[19,17,15,10,8,4,2,0],
                lod_set:()=>{
                    for(let i=0;i<crowd.children.length;i++){
                        var crowdGroup0=crowd.children[i]
                        // crowdGroup0.getMesh("CloM_A_Eye_lash_geo").visible=false
                        crowdGroup0.getMesh("CloM_A_EyeEdge_geo").visible=false
                        crowdGroup0.getMesh("GW_man_Nail_geo").visible=false
                        // crowdGroup0.getMesh("Ch23_Belt").visible=false
                        if(i>1){
                            // Ch23_Eyelashes
                            // crowdGroup0.getMesh("Ch23_Eyelashes").visible=false
                            // crowdGroup0.getMesh("Ch23_Belt").visible=false
                            crowdGroup0.getMesh("CloM_A_xiuzi_geo").visible=false
                        }
                        if(i>4){
                            // crowdGroup0.getMesh("CloM_A_Wazi_geo").visible=false
                            crowdGroup0.getMesh("CloM_A_Xiezi_geo").visible=false
                        }
                    }
                },
            })
            self.setParamman_A(crowd,2,4)
            self.scene.add(crowd)
            window.crowd=crowd
            console.log(crowd)
            crowd.init(
                glb.scene
            )
        })
    }
    setParam(crowd,model_index,animtionNum){
        var crowd_count=100*100+754
        for(var i0=0;i0<crowd_count;i0++){
            var scale=[
                1,
                Math.random()*0.3+0.85,
                1,
            ]
            for(var i=0;i<3;i++)scale[i]*=1.3
            var animtionType=Math.floor(animtionNum*Math.random())//12
            // if(i0<1250){//496){
            //     if(Math.random()>0.5)animtionType=5
            //     else animtionType=8
            // }else if(animtionType==5)animtionType=0
            // else if(animtionType==8)animtionType=1

            var speed=Math.random()*2.5+2
            if(animtionType==5)speed+=1.5
            
            if(i0%2==model_index)continue
            let i00=Math.floor(i0/2)

            crowd.setSpeed(i00, speed)
            crowd.setObesity(i00, 0.85+1.1*Math.random())
            if(animtionType==5||animtionType==8)
                crowd.setMoveMaxLength(i00, 4+2*Math.random())
            crowd.setScale(i00, scale)

            var PosRot=this.getPosRot(i0)
            crowd.setPosition(i00,PosRot.pos)
            crowd.setRotation(i00,PosRot.rot)

            crowd.setAnimation(i00,animtionType,10000*Math.random())

            if(model_index==1){
                crowd.setColor(i00, [
                    62*Math.random(),
                    62*Math.random(),
                    62*Math.random()
                ],"CloW_C_qunzi_geo3456")
                crowd.setColor(i00, [
                    -Math.random(),
                    -Math.random(),
                    -Math.random()
                ],"CloW_C_shangyi_geo")
                crowd.setColor(i00, [
                    67*Math.random(),
                    67*Math.random(),
                    67*Math.random()
                ],"CloW_C_xie_geo")
                crowd.setColor(i00, [
                    20*Math.random(),
                    12*Math.random(),
                    12*Math.random()
                ],"hair")
            }else if(model_index==0){
                crowd.setColor(i00, [
                    12*Math.random(),
                    12*Math.random(),
                    12*Math.random()
                ],"CloW_A_kuzi_geo")
                crowd.setColor(i00, [
                    12*Math.random(),
                    12*Math.random(),
                    12*Math.random()
                ],"CloW_A_waitao_geo1")
                crowd.setColor(i00, [
                    12*Math.random(),
                    12*Math.random(),
                    12*Math.random()
                ],"CloW_A_xiezi_geo")
                crowd.setColor(i00, [
                    20*Math.random(),
                    12*Math.random(),
                    12*Math.random()
                ],"hair")
            }
        }//end
        // crowd.count=crowd_count

    }
    setParam2(crowd,model_index,animtionNum){
        var crowd_count=1*100*100+754
        for(var i0=0;i0<crowd_count;i0++){
            var scale=[
                1,
                Math.random()*0.3+0.85,
                1,
            ]
            for(var i=0;i<3;i++)scale[i]*=1.1
            var animtionType=Math.floor(animtionNum*Math.random())//12
            if(i0<1250){//496){
                animtionType=3
            }
            else if(animtionType==3)animtionType=4
            // else if(animtionType==4)animtionType=1

            var speed=(Math.random()*2.5+2)*2.5
            if(animtionType==5)speed+=1.5
            
            if(i0%2==model_index)continue
            let i00=Math.floor(i0/2)
            // let i00=i0

            crowd.setSpeed(i00, speed)
            crowd.setObesity(i00, 0.85+1.1*Math.random())
            if(animtionType==3)
                crowd.setMoveMaxLength(i00, 4+2*Math.random())
            crowd.setScale(i00, scale)

            var PosRot=this.getPosRot2(i0)
            crowd.setPosition(i00,PosRot.pos)
            crowd.setRotation(i00,PosRot.rot)

            crowd.setAnimation(i00,animtionType,10000*Math.random())

            crowd.setColor(i00, [
                12*Math.random(),
                12*Math.random(),
                12*Math.random()
            ],"Ch23_Belt")
            crowd.setColor(i00, [
                2*Math.random(),
                2*Math.random(),
                2*Math.random()
            ],"Ch23_Pants")
            crowd.setColor(i00, [
                3*Math.random()-1,
                3*Math.random()-2,
                3*Math.random()-2
            ],"Ch23_Shirt")
            crowd.setColor(i00, [
                20*Math.random(),
                15*Math.random(),
                15*Math.random()
            ],"Ch23_Shoes")
            crowd.setColor(i00, [
                20*Math.random(),
                20*Math.random(),
                20*Math.random()
            ],"Ch23_Suit")
        }//end
        // crowd.count=crowd_count

    }
    setParamman_A(crowd,model_index,animtionNum){
        var crowd_count=1*100*100+754
        for(var i0=0;i0<crowd_count;i0++){
            var scale=[
                1,
                Math.random()*0.3+0.85,
                1,
            ]
            for(var i=0;i<3;i++)scale[i]*=1.1
            var animtionType=Math.floor(animtionNum*Math.random())//12
            if(i0<1250){//496){
                animtionType=4
            }
            else if(animtionType==4)animtionType=0
            // else if(animtionType==4)animtionType=1

            var speed=(Math.random()*2.5+2)*2.5
            
            if(i0%2==model_index)continue
            let i00=Math.floor(i0/2)
            // let i00=i0

            crowd.setSpeed(i00, speed)
            crowd.setObesity(i00, 0.85+1.1*Math.random())
            if(animtionType==4)
                crowd.setMoveMaxLength(i00, 4+2*Math.random())
            crowd.setScale(i00, scale)

            var PosRot=this.getPosRot2(i0)
            crowd.setPosition(i00,PosRot.pos)
            PosRot.rot[1]+=Math.PI;
            crowd.setRotation(i00,PosRot.rot)

            crowd.setAnimation(i00,animtionType,10000*Math.random())

            crowd.setColor(i00, [
                12*Math.random(),
                12*Math.random(),
                12*Math.random()
            ],"CloM_A_chengyi_geo")
            crowd.setColor(i00, [
                12*Math.random(),
                12*Math.random(),
                12*Math.random()
            ],"CloM_A_kuzi_geo")
            crowd.setColor(i00, [
                12*Math.random(),
                12*Math.random(),
                12*Math.random()
            ],"CloM_A_waitao_geo")
            
        }//end
        // crowd.count=crowd_count

    }
    getPosRot(i0) {
        var c=[//分组情况
            1250,//496,   //运动
            15*182,     //大看台1
            21*182,     //大看台2
            20*60,   //小看台1
            17*60,   //小看台2
            300,        //弧形看台1 （从小看台到大看台旁边的顺序排列）
            240,         //弧形看台2 
            192,         //弧形看台3
        ]
        if(i0<c[0]){
            var col_count=25
            var row_count=50
            var i=i0%col_count
            var j=Math.floor(i0/col_count)
            var position=[
                2*(1.8*i+1.5*Math.random()-col_count/2-20+11),
                0,
                2*(1.8*j+1.5*Math.random()-row_count/2-25+5),
            ]
            var rotation=[0,Math.PI*2*Math.random(),0]
        }
        else if(i0<c[0]+c[1]){//大看台1
            i0-=c[0]
            var row_count=182
            var row=i0%row_count
            var col=Math.floor(i0/row_count)+1
            var position=[
                1.5*-31-1.5*(col)*1.9,
                1.3*col,//
                0.82*row-75,
            ]
            var rotation=[0,-Math.PI*0.5,0]
        }
        else if(i0<c[0]+c[1]+c[2]){//大看台2
            i0-=(c[0]+c[1])
            var row_count=182
            var row=i0%row_count
            var col=Math.floor(i0/row_count)+1
            var position=[
                1.5*31+1.5*col*1.9,
                1.3*col,
                0.82*row-75,
            ]
            var rotation=[0,Math.PI*0.5,0]
        }
        else if(i0<c[0]+c[1]+c[2]+c[3]){//小看台1
            i0-=(c[0]+c[1]+c[2])
            var row_count=60
            var row=i0%row_count
            var col=Math.floor(i0/row_count)
            if(col>12)col+=4
            var position=[
                1.*row-30,//1.5*(row*0.25-50)*2.01+73,
                1.28*col,
                -99-1.5*col*1.9,
            ]
            var rotation=[0,-Math.PI,0]
        }else if(i0<c[0]+c[1]+c[2]+c[3]+c[4]){//小看台2
            i0-=(c[0]+c[1]+c[2]+c[3])
            var row_count=60
            var row=i0%row_count
            var col=Math.floor(i0/row_count)
            if(col>0)col+=3
            if(col>12)col+=4
            var position=[
                1.*row-30,//1.5*(row*0.25-50)*2.01+73,
                1.28*col,
                99+1.5*col*1.9
            ]
            var rotation=[0,0,0]
            // var position=[-1000,-1000,-1000]
        }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]) {//弧形看台1 （从小看台到大看台旁边的顺序排列）
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4])
            if (i0<2) this.row_index = 0; // 重置行数
            var col_index=i0 - Math.floor((0+this.row_index)*(this.row_index+1)/2);
            if (col_index > this.row_index) {
                this.row_index++;
                col_index-=this.row_index;
            }
            var position=[
                1.*col_index+30,
                1.28*this.row_index+1.28,
                99+1.5*this.row_index*1.9-col_index*0.25
            ]
            var rotation=[0,0,0] // 还需调整方向，目前尚未调整
        }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]) { //弧形看台2
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]);
            if (i0<2) {
                this.row_index = 0; // 重置行数
                this.sum_count = 0;
                this.row_count = 3;
            }
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%3 === 0) this.row_count+=2;
            }
            var position=[
                1.*col_index+31+this.row_index,
                1.28*this.row_index,
                98+1.5*this.row_index*1.75-col_index*0.6
            ]
            var rotation = [0,0,0]
        } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]) {
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]);
            if (i0<2) {
                this.row_index = 0; // 重置行数
                this.sum_count = 0;
                this.row_count = 3;
            } 
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%4 === 0) this.row_count+=2;
            }
            // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
            var position=[
                1.*col_index+34.5+this.row_index*1.8,
                1.28*this.row_index,
                95+1.5*this.row_index*1.45-col_index
            ]
            var rotation = [0,0,0]
        } else {
            
        }
        return {pos:position,rot:rotation} 
    }
    getPosRot2(i0) {
        var c=[//分组情况
            1250,//496,   //运动
            15*182,     //大看台1
            21*182,     //大看台2
            20*60,   //小看台1
            17*60,   //小看台2
            300,        //弧形看台1 （从小看台到大看台旁边的顺序排列）
            240,         //弧形看台2 
            192,         //弧形看台3
        ]
        if(i0<c[0]){
            var col_count=25
            var row_count=50
            var i=i0%col_count
            var j=Math.floor(i0/col_count)
            var position=[
                2*(1.8*i+1.5*Math.random()-col_count/2-20+11),
                0,
                2*(1.8*j+1.5*Math.random()-row_count/2-25+5),
            ]
            var rotation=[0,Math.PI*2*Math.random(),0]
        }
        else if(i0<c[0]+c[1]){//大看台1
            i0-=c[0]
            var row_count=182
            var row=i0%row_count
            var col=Math.floor(i0/row_count)+1
            var position=[
                1.5*-31-1.5*(col)*1.9,
                1.3*col,//
                0.82*row-75,
            ]
            var rotation=[0,-Math.PI*0.5+Math.PI,0]
        }
        else if(i0<c[0]+c[1]+c[2]){//大看台2
            i0-=(c[0]+c[1])
            var row_count=182
            var row=i0%row_count
            var col=Math.floor(i0/row_count)+1
            var position=[
                1.5*31+1.5*col*1.9,
                1.3*col,
                0.82*row-75,
            ]
            var rotation=[0,Math.PI*0.5+Math.PI,0]
        }
        else if(i0<c[0]+c[1]+c[2]+c[3]){//小看台1
            i0-=(c[0]+c[1]+c[2])
            var row_count=60
            var row=i0%row_count
            var col=Math.floor(i0/row_count)
            if(col>12)col+=4
            var position=[
                1.*row-30,//1.5*(row*0.25-50)*2.01+73,
                1.28*col,
                -99-1.5*col*1.9,
            ]
            var rotation=[0,-Math.PI+Math.PI,0]
        }else if(i0<c[0]+c[1]+c[2]+c[3]+c[4]){//小看台2
            i0-=(c[0]+c[1]+c[2]+c[3])
            var row_count=60
            var row=i0%row_count
            var col=Math.floor(i0/row_count)
            if(col>0)col+=3
            if(col>12)col+=4
            var position=[
                1.*row-30,//1.5*(row*0.25-50)*2.01+73,
                1.28*col,
                99+1.5*col*1.9
            ]
            var rotation=[0,0+Math.PI,0]
            // var position=[-1000,-1000,-1000]
        }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]) {//弧形看台1 （从小看台到大看台旁边的顺序排列）
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4])
            if (i0<2) this.row_index = 0; // 重置行数
            var col_index=i0 - Math.floor((0+this.row_index)*(this.row_index+1)/2);
            if (col_index > this.row_index) {
                this.row_index++;
                col_index-=this.row_index;
            }
            var position=[
                1.*col_index+30,
                1.28*this.row_index+1.28,
                99+1.5*this.row_index*1.9-col_index*0.25
            ]
            var rotation=[0,0,0] // 还需调整方向，目前尚未调整
        }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]) { //弧形看台2
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]);
            if (i0<2) {
                this.row_index = 0; // 重置行数
                this.sum_count = 0;
                this.row_count = 3;
            }
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%3 === 0) this.row_count+=2;
            }
            var position=[
                1.*col_index+31+this.row_index,
                1.28*this.row_index,
                98+1.5*this.row_index*1.75-col_index*0.6
            ]
            var rotation = [0,0,0]
        } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]) {
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]);
            if (i0<2) {
                this.row_index = 0; // 重置行数
                this.sum_count = 0;
                this.row_count = 3;
            } 
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%4 === 0) this.row_count+=2;
            }
            // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
            var position=[
                1.*col_index+34.5+this.row_index*1.8,
                1.28*this.row_index,
                95+1.5*this.row_index*1.45-col_index
            ]
            var rotation = [0,0,0]
        } else {
            var position=[
                0,0,0
            ]
            var rotation = [0,0,0]
        }
        return {pos:position,rot:rotation} 
    }
}