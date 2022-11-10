import * as THREE from "three";
export class BuildCulling{
    constructor(build){
        this.cameraStatePre=""
        this.camera=build.camera
        this.parentGroup = build.parentGroup
        this.frustum = new THREE.Frustum()
        
        this.computeSpheres()
        var scope=this
        window.addEventListener('resize', ()=>{
            scope.cameraStatePre=""
        }, false)
        BuildCulling.frustumCulling(this)//启动遮挡剔除
    }
    getCameraState(){
        var p=this.camera.position
        var r=this.camera.rotation
        return p.x+","+p.y+","+p.z+","
                +r.x+","+r.y+","+r.z  
    }
    computeSpheres(){//开始计算包围球
        var parent=this.parentGroup//window.instanceRoot
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
                if(false){//是否显示包围球
                    var r=sphere.radius
                    var c=sphere.center
                    var m = new THREE.Mesh( 
                        new THREE.SphereGeometry(  1, 8, 8 ), 
                        new THREE.MeshBasicMaterial( { color: 0x0faf0f } ) 
                        );
                    m.position.set(c.x,c.y,c.z)
                    m.scale.set(r,r,r)
                    var scene=parent.parent
                    scene.add(m)
                }
            }
        }
        // console.log("完成计算包围球")
    }
    updateFrustum(){
        this.frustum.setFromProjectionMatrix( 
            new THREE.Matrix4().multiplyMatrices( 
                this.camera.projectionMatrix, 
                this.camera.matrixWorldInverse 
            ) 
        );
    }
    static frustumCulling(scope){//视锥剔除
        var cameraState=scope.getCameraState()
        if(cameraState!==scope.cameraStatePre){
            var meshes=scope.parentGroup.children
            scope.updateFrustum()
            for(let i in meshes){//for(let i=0; i<window.meshes.length; i++){
                var m=meshes[i]
                m.visible=intersectSpheres(m.bounding_sph, scope.frustum)
            }
            function intersectSpheres(spheres, frustum){
                for(let i=0; i<spheres.length; i++)
                    if(intersectSphere(spheres[i].center, spheres[i].radius, frustum))
                        return true
                return false
            }
            function intersectSphere(center, radius, frustum) {
                const planes = frustum.planes;
                const negRadius = - radius;
                for(let i=0; i<planes.length-2; i++){
                    const distance = planes[ i ].distanceToPoint( center );//平面到点的距离，
                    if ( distance < negRadius ) //内正外负
                        return false;//不相交
                }
                return true;//相交
            }
            scope.cameraStatePre=cameraState
        } 
        requestAnimationFrame(()=>{
            BuildCulling.frustumCulling(scope)
        })    
    }
}
