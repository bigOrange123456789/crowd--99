import * as THREE from "three";
import JSZip from 'jszip';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { BuildCulling } from "./BuildCulling";
import { BuildPreprocess } from "./BuildPreprocess";
import { BuildSplitter } from "./BuildSplitter";
export class Build{
    constructor(url,camera){
        this.camera=camera
        this.parentGroup = new THREE.Group()
        var self = this
        this.load(url,manager=>{
            var loader=new THREE.FileLoader(manager)
            loader.load("blob:assets/Building/structdesc.json",json=>{
                var structList = JSON.parse(json)
                loader.load("blob:assets/Building/smatrix.json",json=>{
                    var matrixList = JSON.parse(json)
                    new GLTFLoader(manager).load("blob:assets/Building/output.glb",gltf=>{
                        var meshNodeList = gltf.scene.children[0].children
                        self.addGroup(meshNodeList,structList,matrixList)
                        new BuildCulling(self)
                        new BuildPreprocess(self.parentGroup)
                        // console.log("gltf.scene",gltf.scene)//children[""0""].children
                        // new BuildSplitter(gltf.scene,structList,"crowd_build")
                    })
                })
            })
        })
    }
    load(url,cb){
        var promise = JSZip.external.Promise
        var baseUrl = "blob:"+THREE.LoaderUtils.extractUrlBase(url)
        new promise(function(resolve,reject){
            var loader = new THREE.FileLoader(THREE.DefaultLoadingManager)
            loader.setResponseType('arraybuffer')
            loader.load(url,resolve,()=>{},reject)
        }).then(function(buffer){
            return JSZip.loadAsync(buffer)
        }).then(function(zip){
            var fileMap = {}
            var pendings = []
            for (var file in zip.files){
                var entry = zip.file(file)
                if(entry===null) continue
                pendings.push(entry.async("blob").then(function(file,blob){
                    fileMap[baseUrl+file] = URL.createObjectURL(blob)
                }.bind(this,file)))
            }
            return promise.all(pendings).then(function(){
                return fileMap
            })
        }).then(function(fileMap){
            return {
                urlResolver:function(url){
                    return fileMap[url]?fileMap[url]:url
                }}
        }).then(function(zip){
            var manager = new THREE.LoadingManager()
            manager.setURLModifier(zip.urlResolver)
            return manager
        }).then(function(manager){
            if(cb)cb(manager)
        })
    }
    getGeometry(geometry0,group){//为一个实例化对象生成几何
        var geometry=geometry0.clone()
        var stride = geometry0.attributes.position.data.stride
        var index_arr = []
        for(let k=0; k<group.c*3; k+=3){//group={n,s,c}
            for(let l=0; l<3; l++){
                index_arr.push(geometry0.index.array[group.s*3+k+l])
            }
        }
        var position_arr = []
        var pushed_index = []
        var updated_index_arr = []
        for(let k=0; k<index_arr.length; k++){
            var t = pushed_index.indexOf(index_arr[k])
            if(t===-1){
                pushed_index.push(index_arr[k])
                updated_index_arr.push(position_arr.length/3)
                for(let l=0; l<3; l++){
                    position_arr.push(geometry0.attributes.position.array[index_arr[k]*stride+l])
                }
            }else{
                updated_index_arr.push(t)
            }
        }
        var new_position_array = new Float32Array(position_arr)
        var new_index_array = new Uint16Array(updated_index_arr)
        geometry.attributes.position = new THREE.BufferAttribute(new_position_array,3)
        geometry.index = new THREE.BufferAttribute(new_index_array,1)
        geometry.computeBoundingBox()
        geometry.computeBoundingSphere()
        delete geometry.attributes.normal
        geometry.computeVertexNormals()
        return geometry
    }
    getMaterial(){
        var material= 
        // new THREE.MeshStandardMaterial({
        //     color:new THREE.Color(0.6+Math.random()*0.4,0.6+Math.random()*0.4,0.6+Math.random()*0.4),
        //     emissive:new THREE.Color(Math.random()*0.4,Math.random()*0.4,Math.random()*0.4),
        //     side:2
        // })
        // new THREE.MeshPhysicalMaterial({
        //     // color:0xff0000,
        //     color:new THREE.Color(Math.random()*0.1+0.3,0.9+Math.random()*0.1,0.9+Math.random()*0.1),
        //     emissive:new THREE.Color(0.2+Math.random()*0.1,0.3+Math.random()*0.2,0.3+Math.random()*0.2),
        //     // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
        //     // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        //     metalness: 1.0,
        //     // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        //     roughness: 0.6,
        //     // 设置环境贴图
        //     // envMap: textureCube,
        //     // 反射程度, 从 0.0 到1.0.默认0.5.
        //     // 这模拟了非金属材料的反射率。 当metalness为1.0时无效
        //     // reflectivity: 0.5,
        //   })
        new THREE.MeshStandardMaterial({
            // color:0xff0000,
            // color:new THREE.Color(Math.random()*0.1+0.3,0.9+Math.random()*0.1,0.9+Math.random()*0.1),
            // emissive:new THREE.Color(0.2+Math.random()*0.1,0.3+Math.random()*0.2,0.3+Math.random()*0.2),
            // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
            // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
            metalness: 0.9,
            // // // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
            roughness: 0.1,
            // // 设置环境贴图
            // // envMap: textureCube,
            // // 反射程度, 从 0.0 到1.0.默认0.5.
            // // 这模拟了非金属材料的反射率。 当metalness为1.0时无效
            // reflectivity: 0.5,
            
          })
        return material
    }
    getMesh(geometryOld,matrixList,group){
        var name=group.n
        var it=matrixList[name].it
        it.push([1,0,0,0, 0,1,0,0, 0,0,1,0])
        var geometry = this.getGeometry(geometryOld,group)//group={n,s,c}
        var material = this.getMaterial()
        var instancedMesh = new THREE.InstancedMesh(
            geometry,
            material,
            it.length)
        for(let k=0; k<it.length; k++){
            var mat = it[k]
            var instanceMatrix = new THREE.Matrix4().set(
                mat[0], mat[1], mat[2], mat[3],
                mat[4], mat[5], mat[6], mat[7],
                mat[8], mat[9], mat[10], mat[11],
                0, 0, 0, 1
            )
            instancedMesh.setMatrixAt(k,instanceMatrix)
        }
        return instancedMesh
    }
    addGroup(meshNodeList,structList,matrixList){
        for(let i=0; i<meshNodeList.length; i++){
            var node = meshNodeList[i]
            for(let j=0; j<structList[i].length; j++){
                var group = structList[i][j]//n,s,c
                var instanceMesh=this.getMesh(node.geometry,matrixList,group)//matrixList n:{it,id} 其中id没有用到
                this.parentGroup.add(instanceMesh)
            }
        }
    }
}
