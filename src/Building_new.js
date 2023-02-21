import * as THREE from "three";
import JSZip from 'jszip';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export class Building{
    constructor(scene){
        this.parentGroup = new THREE.Group()
        this.parentGroup.scale.set(0.0005,0.0005,0.0005)

        scene.add(this.parentGroup)
        // window.o=this.parentGroup

        this.load()
    }
    load(){
        this.loadZip(0,new THREE.Vector3(1,1,1))
        this.loadZip(1,new THREE.Vector3(0.1,0.1,0.1))
        this.loadLight()
    }
    loadLight(){
        var self = this
        new GLTFLoader().load("assets/Building/light.gltf",gltf=>{
            self.parentGroup.add(gltf.scene)
        })
    }
    loadZip(index,scale){
        var self = this
        var url = "assets/Building/tiyuguan"+index+".zip"
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
            new THREE.FileLoader(manager).load("blob:assets/Building/structdesc.json",json=>{
                var structList = JSON.parse(json)
                new THREE.FileLoader(manager).load("blob:assets/Building/smatrix.json",json=>{
                    var matrixList = JSON.parse(json)
                    new GLTFLoader(manager).load("blob:assets/Building/output.glb",gltf=>{
                        console.log(index)
                        var meshNodeList = gltf.scene.children[0].children
                        self.processMesh(index,meshNodeList,structList,matrixList,scale)
                    })
                })
            })
        })
    }
    processMesh(modelIndex,meshNodeList,structList,matrixList,scale){
        var wire = new THREE.LineBasicMaterial({color: 0x444444})
        for(let i=0; i<meshNodeList.length; i++){
            var node = meshNodeList[i].clone()
            if(modelIndex===0){
                node.material = new THREE.MeshStandardMaterial({
                    color:new THREE.Color(0.6+Math.random()*0.4,0.6+Math.random()*0.4,0.6+Math.random()*0.4),
                    emissive:new THREE.Color(Math.random()*0.4,Math.random()*0.4,Math.random()*0.4),
                    side:2
                })
            }else{
                node.material = new THREE.MeshStandardMaterial({
                    color:node.material.color,
                    emissive:0x444444,
                    side:2
                })
            }
            node.scale.copy(scale)
            this.parentGroup.add(node)
            if(node.geometry.boundingSphere.radius>1000000&&modelIndex===0){
                let edges = new THREE.EdgesGeometry(node.geometry,60)
                let lines = new THREE.LineSegments(edges,wire)
                lines.scale.copy(scale)
                this.parentGroup.add(lines)
            }
            var stride = node.geometry.attributes.position.data.stride
            for(let j=0; j<structList[i].length; j++){
                var object = node.clone()
                object.geometry = node.geometry.clone()
                if(modelIndex===0){
                    object.material = new THREE.MeshStandardMaterial({
                        color:new THREE.Color(0.6+Math.random()*0.4,0.6+Math.random()*0.4,0.6+Math.random()*0.4),
                        emissive:new THREE.Color(Math.random()*0.4,Math.random()*0.4,Math.random()*0.4),
                        side:2
                    })
                }else{
                    object.material = new THREE.MeshStandardMaterial({
                        color:object.material.color,
                        emissive:0x444444,
                        side:2
                    })
                }
                var group = structList[i][j]
                if(matrixList[group.n].it.length===0) continue
                var index_arr = []
                for(let k=0; k<group.c*3; k+=3){
                    for(let l=0; l<3; l++){
                        index_arr.push(node.geometry.index.array[group.s*3+k+l])
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
                            position_arr.push(node.geometry.attributes.position.array[index_arr[k]*stride+l])
                        }
                    }else{
                        updated_index_arr.push(t)
                    }
                }
                var new_position_array = new Float32Array(position_arr)
                var new_index_array = new Uint16Array(updated_index_arr)
                object.geometry.attributes.position = new THREE.BufferAttribute(new_position_array,3)
                object.geometry.index = new THREE.BufferAttribute(new_index_array,1)
                object.geometry.computeBoundingBox()
                object.geometry.computeBoundingSphere()
                delete object.geometry.attributes.normal
                object.geometry.computeVertexNormals()

                matrixList[group.n].it.push([1,0,0,0,0,1,0,0,0,0,1,0])
                var instanceMesh = new THREE.InstancedMesh(object.geometry,object.material,matrixList[group.n].it.length)
                for(let k=0; k<matrixList[group.n].it.length; k++){
                    var mat = matrixList[group.n].it[k]
                    var instanceMatrix = new THREE.Matrix4().set(
                        mat[0], mat[1], mat[2], mat[3],
                        mat[4], mat[5], mat[6], mat[7],
                        mat[8], mat[9], mat[10], mat[11],
                        0, 0, 0, 1)
                    instanceMesh.setMatrixAt(k,instanceMatrix)
                }
                instanceMesh.scale.copy(scale)
                this.parentGroup.add(instanceMesh)
            }
        }
    }
}
