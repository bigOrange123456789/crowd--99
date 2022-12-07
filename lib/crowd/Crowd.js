import * as THREE from "three";
import { CrowdMesh } from './CrowdMesh.js'
import { CrowdGroup } from './CrowdGroup.js'
import { CrowdLod } from './CrowdLod.js'
import {PM}from"./PM.js";
export class Crowd extends THREE.Object3D {
    constructor(opt) {
        super()
        this.assets=opt.assets  //{}//防止资源重复加载
        // this.visible=false
        this.count=opt.count
        this.camera=opt.camera
        this.pathLodGeo=opt.pathLodGeo
        this.pathTextureConfig=opt.pathTextureConfig
        this.dummy = new THREE.Object3D();
        this.clock=new THREE.Clock()
        this.instanceMatrix=new THREE.InstancedBufferAttribute(new Float32Array(this.count*16), 16);
        this.textureType = new THREE.InstancedBufferAttribute(new Uint8Array(this.count * 4), 4);
        this.animationType = new THREE.InstancedBufferAttribute(new Uint8Array(this.count), 1);
        this.speed = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.obesity = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.moveMaxLength = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.animationStartTime = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.bodyScale = new THREE.InstancedBufferAttribute(new Float32Array(this.count * 4), 4);
        this.useColorTag=opt.useColorTag//["CloW_A_kuzi_geo","CloW_A_waitao_geo1","CloW_A_xiezi_geo","hair"]
        this.instanceColorIn_All={}
        for(let i=0;i<this.useColorTag.length;i++){
            let meshName=this.useColorTag[i]
            this.instanceColorIn_All[meshName]=
                new THREE.InstancedBufferAttribute(new Float32Array(this.count*3), 3);
        }

        this.visibleList_needsUpdate0=false

        this.lodCount=21//几何lod层级的个数
        // this.lodLevel=20//this.lodCount-1//当前的lod层级编号 //
        this.lodList=new Int8Array(this.count)
        var e=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]
        for(let i=0;i<this.count;i++){
            this.lodList[i]=1
            for(let j=0;j<16;j++){
                this.instanceMatrix.array[16*i+j]=e[j]
            }
        }

        this.lod=[]//里面存放的元素为 仿照mesh类型 自定义的结构
        this.lod_distance=opt.lod_distance//[15,25,50,75,100]
        this.lod_geometry=opt.lod_geometry
        this.lod_set=opt.lod_set

        opt.crowd=this
        for(let i=0;i<1+this.lod_distance.length;i++){//层级数量由lod_distance数组的长度确定
            let child=new CrowdGroup(opt)
            child.lodLevel=i
            this.add(child)
        }
        // this.lod_set()

        this.myLodController=new CrowdLod(this)
        // window.timeTest.measure("update start")
        // this.update()//没有位置信息更新无用
        // window.timeTest.measure("update end")

        this.usePM=true//window.id==0
        
        
    }
    createPre(){//生成LOD的前向索引
        let pre=null
        for(let i=0;i<this.children.length;i++){//层级数量由lod_distance数组的长度确定
            let group=this.children[i]
            group.pre=pre;
            for(let k=0; k<group.children.length;k++){
                let mesh=group.children[k]
                if(pre==null)mesh.pre=null
                else
                    for(let j=0; j<pre.children.length;j++){
                        let mesh_pre=pre.children[j]
                        if(mesh.name==mesh_pre.name){
                            mesh.pre=mesh_pre
                        }
                    }
            }
            pre=group;
        }
    }
    init(groupOld,cb_){
        var scope=this
        
        this.pm=new PM({
            "crowd":scope,
            "groupOld":groupOld,
            "usePM":scope.usePM
        },()=>{
            let lod0=scope.lod[0]
            groupOld.traverse(node=>{
                if(node instanceof THREE.Mesh||node instanceof THREE.SkinnedMesh){
                    let name=node.name
                    node.geometry=lod0[name]
                    if(!node.geometry)node.geometry=Object.values(lod0)[0]//初始化的时候 geometry不能为空
                    // console.log(name,lod0[name],lod0)
                }
            })
            initChild(0)
        })
        function initChild(i){
            scope.children[i].init(//初始化所有子节点，本来是要等待动画数据的加载，采用预加载后应该就不用等待了
                groupOld,
                ()=>{
                    if(i+1<scope.children.length)initChild(i+1)
                    else {
                        
                        window.timeTest.measure("update start")
                        scope.myLodController.cameraStatePre=""
                        scope.update()
                        scope.createPre()
                        window.timeTest.measure("update end")
                        if(cb_)cb_()
                        scope.pm.init(()=>{
                            console.log("test")
                            loadTexture()
                        })
                    }
                }
            )
        }
        function loadTexture(){
            // console.log("loadTexture start!",scope.pathTextureConfig)
            scope.pm.loadJson(
                scope.pathTextureConfig,
                data=>{
                    // console.log(data)
                    scope.updateMap(data)
                }
            )
        }
        
    }
    updateMap(data){
        // console.log("crowd updatemap")
        // for(var i=this.children.length-1;i>15;i--){
            // this.children[this.children.length-1].updateMap(data)
            const i0=this.children.length>7?7:this.children.length-1
            this.children[i0].updateMap("./assets/textures_sim1/",data)
            // this.children[0].updateMap("./assets/textures/",data)
        // }
    }
    useLod(lod0){
        if(lod0.lodLevel)lod0=lod0.lodLevel
        // if(this.lodLevel==lod0)
        //     return
        // for(let i=1;i<this.children.length;i++){//0组对象不更新LOD
        for(let i=0;i<this.children.length;i++){
            var geometryLod=this.lod_geometry[i]
            lod0=Math.min(lod0,geometryLod)
            this.children[i].useLod(lod0)
            // this.lodLevel=lod0
        }
    }
    getMesh(m,animPath,cb){
        CrowdMesh.getCrowdMesh(
            m,
            animPath,
            false,
            "",//this.filePath.male.superlowTexturePath,
            false,
            1,//this.manager.config.male.textureCount,
            this.camera,//this.camera,
            this.clock,//new THREE.Clock(),//this.clock
            this.count,
            this,
            m2=>{
                cb(m2)
            }
        )
    }
    getMatrixAt( index, matrix ) {
		matrix.fromArray( this.instanceMatrix.array, index * 16 );
	}
    setMatrixAt( index, matrix ) {
		matrix.toArray( this.instanceMatrix.array, index * 16 );
        this.instanceMatrix.needsUpdate0=true
	}
    getPosition(avatarIndex) {
        var mat4 = new THREE.Matrix4();
        this.getMatrixAt(avatarIndex,mat4)
        var e=mat4.elements
        return [e[12],e[13],e[14]];
    }

    getRotation(avatarIndex) {
        var mat4 = new THREE.Matrix4();
        this.getMatrixAt(avatarIndex,mat4)

        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        mat4.decompose(position, quaternion, scale);

        let euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(quaternion);
        return [euler.x, euler.y, euler.z];
    }
    getScale(avatarIndex) {
        var mat4 = new THREE.Matrix4();
        this.getMatrixAt(avatarIndex,mat4)

        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        mat4.decompose(position, quaternion, scale);
        return [scale.x, scale.y, scale.z];

    }
    setPosition(avatarIndex, pos) {
        var mat4 = new THREE.Matrix4();
        this.getMatrixAt(avatarIndex,mat4)
        mat4.elements[12]=pos[0]
        mat4.elements[13]=pos[1]
        mat4.elements[14]=pos[2]
        this.setMatrixAt(avatarIndex,mat4)
    }
    setScale(avatarIndex, size) {
        var mat4 = new THREE.Matrix4();
        this.getMatrixAt(avatarIndex,mat4)

        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();

        mat4.decompose(position, quaternion, scale);
        let euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(quaternion);

        this.dummy.scale.set(size[0], size[1], size[2]);
        this.dummy.rotation.set(euler.x, euler.y, euler.z);
        this.dummy.position.set(position.x, position.y, position.z);
        this.dummy.updateMatrix();

        this.setMatrixAt(avatarIndex,this.dummy.matrix)        
    }
    setRotation(avatarIndex, rot) {
        var mat4 = new THREE.Matrix4();
        this.getMatrixAt(avatarIndex,mat4)

        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        mat4.decompose(position, quaternion, scale);

        this.dummy.scale.set(scale.x, scale.y, scale.z);
        this.dummy.rotation.set(rot[0], rot[1], rot[2]);
        this.dummy.position.set(position.x, position.y, position.z);
        this.dummy.updateMatrix();

        this.setMatrixAt(avatarIndex, this.dummy.matrix);
    }

    setTexture(avatarIndex, type) { // 设置贴图类型
        
        this.textureType.array[avatarIndex * 4] = type[0]; // 大部分区域
        this.textureType.array[avatarIndex * 4 + 1] = type[1]; // 头部和手部
        this.textureType.array[avatarIndex * 4 + 2] = type[2]; // 裤子
        this.textureType.array[avatarIndex * 4 + 3] = type[3];

    }

    setBodyScale(avatarIndex, scale) { // 设置身体部位缩放
        this.bodyScale.array[avatarIndex * 4] = scale[0]; 
        this.bodyScale.array[avatarIndex * 4 + 1] = scale[1]; 
        this.bodyScale.array[avatarIndex * 4 + 2] = scale[2]; 
        this.bodyScale.array[avatarIndex * 4 + 3] = scale[3];
    }

    setAnimation(avatarIndex, type, offset) { // 设置动画类型
        this.animationType.array[avatarIndex] = type;
        this.animationStartTime.array[avatarIndex] = offset;
        this.animationType.needsUpdate0=true
        this.animationStartTime.needsUpdate0=true
    }

    setSpeed(avatarIndex, speed) { // 设置动画速度
        this.speed.array[avatarIndex] = speed;
        this.speed.needsUpdate0=true
    }
    setObesity(avatarIndex, obesity) { // 设置动画速度
        this.obesity.array[avatarIndex] = obesity;
        this.obesity.needsUpdate0=true
    }
    setMoveMaxLength(avatarIndex, moveMaxLength) { // 设置动画速度
        this.moveMaxLength.array[avatarIndex] = moveMaxLength;
        this.moveMaxLength.needsUpdate0=true
    }
    setColor(avatarIndex, color,meshName) { // 设置动画速度
        let buffer=this.instanceColorIn_All[meshName]
        if(buffer)
        for(let j=0;j<3;j++)
            buffer.array[avatarIndex*3+j]=color[j]
    }
    update() {
        for(let i=0;i<this.children.length;i++){
            for(let j=0;j<this.lodList.length;j++)
                this.children[i].visibleList[j]=this.lodList[j]==i?1:0
            this.children[i].visibleList_needsUpdate0=true
            this.children[i].update()
        }
    }
    move(avatarIndex, dPos) {
        let pos = this.getPosition(avatarIndex);
        this.setPosition(avatarIndex, [pos[0] + dPos[0], pos[1] + dPos[1], pos[2] + dPos[2]]);
    }
    rotation(avatarIndex, dRot) {
        let rot = this.getRotation(avatarIndex);
        this.setRotation(avatarIndex, [rot[0] + dRot[0], rot[1] + dRot[1], rot[2] + dRot[2]]);
    }
}
