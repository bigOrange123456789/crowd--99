import {
    BufferAttribute,
    Group,
    Scene,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export class BuildSplitter{
    constructor(gltfScene,structDescription,projectName){
        this.meshNodeList = gltfScene.children[0].children//children[""0""].children
        this.structDescription = structDescription
        this.projectName = projectName
        this.stride = 3
        console.log(this.projectName+" 已载入")
        this.splitToChildren2(
            result=>{
                console.log(result)
            }
        )
    }
    splitToChildren2(cb){
        var result=[]
        var index = 0
        var self = this
        var interval = setInterval(function(){
            if(index>=self.structDescription.length){//self.structDescription.length
                if(cb)cb(result)
                clearInterval(interval)
                return
            }
            var N = 0
            for(let n=0; n<index; n++)
                N+=self.structDescription[n].length

            var node = self.meshNodeList[index]//旧的mesh
            var groups = self.structDescription[index]//[(n,s,c),...]
            var stride = node.geometry.attributes.position.data.stride
            // console.log(node)
            // window.sceneRootNode.add(node)
            for(let i=0; i<groups.length; i++){
                if(i%100===0)
                    console.log(index+"/"+self.structDescription.length+", "+i+"/"+groups.length)
                var group = groups[i]
                var object = node.clone()
                object.geometry = node.geometry.clone()
                var index_arr = []
                if(group.c>3000000) continue
                for(let j=0; j<group.c*3; j+=3){
                    for(let k=0; k<3; k++){
                        index_arr.push(node.geometry.index.array[group.s*3+j+k])
                    }
                }
                var position_arr = []
                var normal_arr = []
                var pushed_index = []
                var updated_index_arr = []
                for(let j=0; j<index_arr.length; j++){
                    var t = pushed_index.indexOf(index_arr[j])
                    if(t===-1){
                        pushed_index.push(index_arr[j])
                        updated_index_arr.push(position_arr.length/self.stride)
                        for(let k=0; k<self.stride; k++){
                            position_arr.push(node.geometry.attributes.position.array[index_arr[j]*stride+k])
                            normal_arr.push(node.geometry.attributes.normal.array[index_arr[j]*stride+k])
                        }
                    }else{
                        updated_index_arr.push(t)
                    }
                }
                
                var new_position_array = new Float32Array(position_arr)
                var new_normal_array = new Float32Array(normal_arr)
                var new_index_array = new Uint16Array(updated_index_arr)
                object.geometry.attributes.position = new BufferAttribute(new_position_array,3)
                object.geometry.attributes.normal = new BufferAttribute(new_normal_array,3)
                object.geometry.index = new BufferAttribute(new_index_array,1)
                
                object.geometry.computeBoundingBox()
                object.geometry.computeBoundingSphere()
                object.name = (N+i).toString()
                result.push(object)
            }
            index++
        },300)
    }
    splitToChildren(){
        var index = 0
        var self = this
        var interval = setInterval(function(){
            if(index>=self.structDescription.length){//self.structDescription.length
                clearInterval(interval)
                return
            }
            var N = 0
            for(let n=0; n<index; n++)
                N+=self.structDescription[n].length
            var sum_group = new Group()
            var node = self.meshNodeList[index]
            var groups = self.structDescription[index]
            var stride = node.geometry.attributes.position.data.stride
            // console.log(node)
            // window.sceneRootNode.add(node)
            for(let i=0; i<groups.length; i++){
                if(i%100===0)
                    console.log(index+"/"+self.structDescription.length+", "+i+"/"+groups.length)
                var group = groups[i]
                var object = node.clone()
                object.geometry = node.geometry.clone()
                var index_arr = []
                if(group.c>3000000) continue
                for(let j=0; j<group.c*3; j+=3){
                    for(let k=0; k<3; k++){
                        index_arr.push(node.geometry.index.array[group.s*3+j+k])
                    }
                }
                var position_arr = []
                var normal_arr = []
                // var uv3_arr = []
                var pushed_index = []
                var updated_index_arr = []
                for(let j=0; j<index_arr.length; j++){
                    var t = pushed_index.indexOf(index_arr[j])
                    if(t===-1){
                        pushed_index.push(index_arr[j])
                        updated_index_arr.push(position_arr.length/self.stride)
                        for(let k=0; k<self.stride; k++){
                            position_arr.push(node.geometry.attributes.position.array[index_arr[j]*stride+k])
                            normal_arr.push(node.geometry.attributes.normal.array[index_arr[j]*stride+k])
                            // uv3_arr.push(node.geometry.attributes.uv3.array[index_arr[j]*stride+k])
                        }
                    }else{
                        updated_index_arr.push(t)
                        // console.log(t+"  "+t)
                    }
                }
                // console.log(updated_index_arr)
                var new_position_array = new Float32Array(position_arr)
                var new_normal_array = new Float32Array(normal_arr)
                // var new_uv3_array = new Uint8Array(uv3_arr)
                var new_index_array = new Uint16Array(updated_index_arr)
                object.geometry.attributes.position = new BufferAttribute(new_position_array,3)
                // object.geometry.attributes.position = new InterleavedBufferAttribute(
                //     new InterleavedBuffer(new_position_array,this.stride),
                //     3,0,false
                // )
                object.geometry.attributes.normal = new BufferAttribute(new_normal_array,3)
                // object.geometry.attributes.uv3 = new BufferAttribute(new_uv3_array,3)
                // object.geometry.attributes.uv3 = new InterleavedBufferAttribute(
                //     new InterleavedBuffer(new_uv3_array,this.stride),
                //     3,0,false
                // )
                object.geometry.index = new BufferAttribute(new_index_array,1)
                // object.geometry.computeVertexNormals()
                object.geometry.computeBoundingBox()
                object.geometry.computeBoundingSphere()
                object.name = (N+i).toString()
                // delete object.geometry.attributes.normal
                // console.log(object)
                sum_group.add(object)
            }
            var scene = new Scene()
            scene.add(sum_group)
            // console.log(sum_group)
            // window.sceneRootNode.add(sum_group)
            var fileName = self.projectName+"_output"+index+".gltf"
            // var fileName = "output"+index+".gltf"
            new GLTFExporter().parse(scene,function(result){
                var myBlob=new Blob([JSON.stringify(result)], { type: 'text/plain' })
                let link = document.createElement('a')
                link.href = URL.createObjectURL(myBlob)
                link.download = fileName
                link.click()
                // self.splitToChildren(index+1)
            });
            index++
        },300)
    }
    splitStructDescription(){
        var new_structDesc = []
        for(let i=0; i<this.structDescription.length; i++){
            for(let j=0; j<this.structDescription[i].length; j++){
                this.structDescription[i][j].s = 0
                new_structDesc.push([this.structDescription[i][j]])
            }
        }
        // console.log(new_structDesc.length)
        var myBlob=new Blob([JSON.stringify(new_structDesc)], { type: 'text/plain' })
        let link = document.createElement('a')
        link.href = URL.createObjectURL(myBlob)
        link.download = self.projectName+"_structdesc.json"
        link.click()
        // this.jumpToNext()
    }
    jumpToNext(){
        console.log(this.projectName+" 处理完成")
        var projectList = ["15li","15wang","16wang","16wang2","A14","A15","Azhang","B1Fzhang","B1li","B12F","Bli","changdi","F122","jidian","Renzhang"]
        var i = projectList.indexOf(this.projectName)
        if(i!==-1&&++i<projectList.length){
            var url = "http://localhost:3000/?scene=" + projectList[i]
            setTimeout(function(){
                console.log("跳转至 "+projectList[i])
                window.location.href = url
            },5000)
        }else{
            console.log("项目列表全部处理完成")
        }
    }
    splitAverage(index){
        const group_num = 1000
        var start = index*group_num
        var start_i = 0
        var N = 0
        while(N+this.structDescription[start_i].length<=start){
            N+=this.structDescription[start_i].length
            start_i++
            if(start_i>=this.structDescription.length){
                console.log("export over")
                return
            }
        }
        var start_j = start-N
        // console.log(index,start_i,start_j)

        var sum_group = new Group()
        for(let n=0; n<group_num; n++,start_j++){
            if(n%100===0) console.log(index,start_i,start_j)
            if(start_j>=this.structDescription[start_i].length){
                start_i++
                start_j = 0
            }
            if(start_i>=this.structDescription.length){
                break
            }
            var node = this.meshNodeList[start_i]
            var stride = node.geometry.attributes.position.data.stride
            var group = this.structDescription[start_i][start_j]
            var object = node.clone()
            object.geometry = node.geometry.clone()
            var index_arr = []
            for(let j=0; j<group.c*3; j+=3){
                for(let k=0; k<3; k++){
                    index_arr.push(node.geometry.index.array[group.s*3+j+k])
                }
            }
            var position_arr = []
            var pushed_index = []
            var updated_index_arr = []
            for(let j=0; j<index_arr.length; j++){
                var t = pushed_index.indexOf(index_arr[j])
                if(t===-1){
                    pushed_index.push(index_arr[j])
                    updated_index_arr.push(position_arr.length/this.stride)
                    for(let k=0; k<this.stride; k++){
                        position_arr.push(node.geometry.attributes.position.array[index_arr[j]*stride+k])
                    }
                }else{
                    updated_index_arr.push(t)
                }
            }
            var new_position_array = new Float32Array(position_arr)
            var new_index_array = new Uint16Array(updated_index_arr)
            object.geometry.attributes.position = new BufferAttribute(new_position_array,3)
            object.geometry.index = new BufferAttribute(new_index_array,1)
            object.geometry.computeBoundingBox()
            object.geometry.computeBoundingSphere()
            object.name = (start+n).toString()
            sum_group.add(object)
        }
        var scene = new Scene()
        scene.add(sum_group)
        // console.log(scene)
        var self = this
        var fileName = "output"+index+".gltf"
        new GLTFExporter().parse(scene,function(result){
            var myBlob=new Blob([JSON.stringify(result)], { type: 'text/plain' })
            let link = document.createElement('a')
            link.href = URL.createObjectURL(myBlob)
            link.download = fileName
            link.click()
            setTimeout(function(){
                self.splitAverage(index+1)
            },500)
        })
    }
}

