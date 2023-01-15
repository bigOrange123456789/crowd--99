import * as THREE from "three";
export class BuildPreprocess{
    constructor(mesh_parent){
        this.computeSpheres(mesh_parent)
        this.result=this.getSphere(mesh_parent)
        this.download("bounding_sph.json",this.result ) 
    }
    computeSpheres(parent){//开始计算包围球
        parent.updateMatrixWorld()
        for(var i=0;i<parent.children.length;i++){
            var mesh=parent.children[i]
            mesh.geometry.computeBoundingSphere()
            mesh.bounding_sph=[]
            for(var j=0;j<mesh.count;j++){
                var sphere = mesh.geometry.boundingSphere.clone()
                var m1=new THREE.Matrix4()
                mesh.getMatrixAt(j,m1)
                sphere.applyMatrix4(m1)
                sphere.applyMatrix4(parent.matrixWorld)
                mesh.bounding_sph.push(sphere)
            }
        }
    }
    getSphere(parent){
        var result=[]
        //var parent=this.build.parentGroup//window.instanceRoot
        for(var i=0;i<parent.children.length;i++){
            var mesh=parent.children[i]
            var bounding_sph=[]
            for(var j=0;j<mesh.bounding_sph.length;j++){
                let sphere=mesh.bounding_sph[j]
                bounding_sph.push([
                    sphere.center.x,
                    sphere.center.y,
                    sphere.center.z,
                    sphere.radius
                ])
            }
            result.push(bounding_sph)
        }
        return result//this.download("bounding_sph.json",result ) 
    }
    download(name,data){
        var str=JSON.stringify(
            data//scope.viewPointData[b.myId] 
            , null, "\t")
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([str], { type: 'text/plain' }));
        link.download =name?name:"test.json";
        link.click();
    }

}
