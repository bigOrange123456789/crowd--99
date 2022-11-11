import * as THREE from "three";
import { CrowdMesh } from './CrowdMesh.js'
export class CrowdGroup extends THREE.Group {
    constructor(opt) {
        super()
        this.visibleList_needsUpdate0=false
        const crowd=opt.crowd
        window.crowdGroup=this
        this.assets=crowd.assets
        this.camera=opt.camera
        this.count=opt.count
        this.animPathPre=opt.animPathPre
        this.dummy = crowd.dummy//new THREE.Object3D();
        this.clock=crowd.clock//new THREE.Clock()
        this.visibleList=new Int8Array(this.count)//元素为0或1,0表示对象不可见，1表示对象可见

        this.lod=crowd.lod

        this.instanceMatrix=crowd.instanceMatrix//new THREE.InstancedBufferAttribute(new Float32Array(this.count*16), 16);
        this.textureType = crowd.textureType//new THREE.InstancedBufferAttribute(new Uint8Array(this.count * 4), 4);
        this.animationType = crowd.animationType//new THREE.InstancedBufferAttribute(new Uint8Array(this.count), 1);
        this.speed = crowd.speed//new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.obesity=crowd.obesity
        this.moveMaxLength=crowd.moveMaxLength
        this.animationStartTime = crowd.animationStartTime//new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.bodyScale = crowd.bodyScale//new THREE.InstancedBufferAttribute(new Float32Array(this.count * 4), 4);
        this.instanceColorIn_All=crowd.instanceColorIn_All

        for(let i=0;i<this.count;i++){
            this.visibleList[i]=1
        }

        this.instanceMatrixVisible=new THREE.InstancedBufferAttribute(new Float32Array(this.count*16), 16);
        this.textureTypeVisible = new THREE.InstancedBufferAttribute(new Uint8Array(this.count * 4), 4);
        this.animationTypeVisible = new THREE.InstancedBufferAttribute(new Uint8Array(this.count), 1);
        this.speedVisible = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.obesityVisible = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.moveMaxLengthVisible = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.animationStartTimeVisible = new THREE.InstancedBufferAttribute(new Float32Array(this.count), 1);
        this.bodyScaleVisible = new THREE.InstancedBufferAttribute(new Float32Array(this.count * 4), 4);

        this.instanceMatrixVisible.origin=crowd.instanceMatrix
        this.textureTypeVisible.origin=crowd.textureType
        this.animationTypeVisible.origin=crowd.animationType
        this.speedVisible.origin=crowd.speed
        this.obesityVisible.origin=crowd.obesity
        this.moveMaxLengthVisible.origin=crowd.moveMaxLength
        this.animationStartTimeVisible.origin=crowd.animationStartTime
        this.bodyScaleVisible.origin= crowd.bodyScale
        this.buffer_all=[
            this.instanceMatrixVisible,
            this.textureTypeVisible,
            this.animationTypeVisible,
            this.speedVisible,
            this.obesityVisible,
            this.moveMaxLengthVisible,
            this.animationStartTimeVisible,
            this.bodyScaleVisible
        ]
        
        this.useColorTag=crowd.useColorTag
        this.instanceColorInVisible_All={}
        for(let i=0;i<this.useColorTag.length;i++){
            let meshName=this.useColorTag[i]
            this.instanceColorInVisible_All[meshName]=
                new THREE.InstancedBufferAttribute(new Float32Array(this.count*3), 3);
            this.instanceColorInVisible_All[meshName].origin=crowd.instanceColorIn_All[meshName]
            this.buffer_all.push(
                this.instanceColorInVisible_All[meshName]
            )
        }
        
    }
    init(groupOld,cb_){
        var arr=[]
        groupOld.traverse(obj=>{
            if(obj.type=="SkinnedMesh"){
                arr.push(obj)
            }
        })
        this.createMeshAll(arr,()=>{
            if(cb_)cb_()
        })
    }
    useLod(lod0){
        if(Number.isInteger(lod0)){
            if(lod0<this.lod.length){
                lod0=this.lod[lod0]
            }else{
                console.log("lod编号错误")
                return
            }
        }
        for(var i=0;i<this.children.length;i++){
            var name1=this.children[i].name
            var geometry1=this.children[i].geometry
            for(var name2 in lod0){
                if(name1==name2){
                    geometry1.bindGeometry(lod0[name2])
                }
            }
        }
    }
    createMeshAll(arr,cb){
        var scope=this
        function next(i){
            var mesh=arr[i]
            CrowdMesh.getCrowdMesh(
                mesh,//m,
                scope.animPathPre,//animPath,
                false,
                "",//this.filePath.male.superlowTexturePath,
                false,
                1,//this.manager.config.male.textureCount,
                scope.camera,//this.camera,
                scope.clock,//new THREE.Clock(),//this.clock
                scope.count,
                scope,
                m2=>{
                    scope.add(m2)
                    if(scope.children.length==arr.length){
                        cb()
                    }else{
                        next(i+1)
                    }
                }
            )
        }
        next(0)
    }
    getMesh(name){
        for(let i=0;i<this.children.length;i++){
            if(this.children[i].name==name)
                return this.children[i]
        }
    }
    update() {
        if(!this.visible)return//如果这个对象不可见就不用更新
        let index=0
        for(let i=0;i<this.visibleList.length;i++){
            if(this.visibleList[i]==1){
                for(let t=0;t<this.buffer_all.length;t++){
                    let buffer=this.buffer_all[t]
                    if(buffer.origin.needsUpdate0
                    ||this.visibleList_needsUpdate0){
                        let itemSize=buffer.itemSize
                        for(let j=0;j<itemSize;j++){
                            buffer.array[itemSize*index+j]=
                            buffer.origin.array[itemSize*i+j]
                        }
                    }
                }
                index++
            }
        }
        for(let t=0;t<this.buffer_all.length;t++){
            let buffer=this.buffer_all[t]
            if(buffer.origin.needsUpdate0
            ||this.visibleList_needsUpdate0)
                buffer.needsUpdate =true
        }
        if(this.visibleList_needsUpdate0){
            this.count=index
            for(var i=0;i<this.children.length;i++){
                this.children[i].count=this.count
            }
            this.visibleList_needsUpdate0=false
        }
    }

    
}