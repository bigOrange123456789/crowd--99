import * as THREE from "three";
export class CrowdLod {
    constructor( crowd) {
        this.cameraStatePre=""
        this.crowd = crowd;
        this.countAll=crowd.count
        this.camera = crowd.camera;
        this.radius=1//1 //化身包围球的最大半径
        this.lod_distance=crowd.lod_distance//[15,25,50,75,100]//2000,10000
        this.lod_distanceSqua=[]
        for(let i=0;i<this.lod_distance.length;i++){
            this.lod_distanceSqua.push(
                Math.pow(this.lod_distance[i],2)
            )
        }
        this.frustum = new THREE.Frustum()
        CrowdLod.frustumCulling(this)//启动遮挡剔除
        var scope=this
        window.addEventListener('resize', ()=>{
            scope.cameraStatePre=""
        }, false)
    }
    getCameraState(){
        var p=this.camera.position
        var r=this.camera.rotation
        return p.x+","+p.y+","+p.z+","
                +r.x+","+r.y+","+r.z  
    }
    static frustumCulling(scope) { //每帧执行一次
        var cameraState=scope.getCameraState()
        if(cameraState!==scope.cameraStatePre){
            // 更新视锥体
            let matrix = new THREE.Matrix4().multiplyMatrices( scope.camera.projectionMatrix, scope.camera.matrixWorldInverse );
            scope.frustum.setFromProjectionMatrix( matrix );
            for ( let i = 0; i < scope.countAll; i++ ) {//遍历所有化身的位置
                scope.crowd.lodList[i]=0//默认显示最低等级的化身
                let p=scope.crowd.getPosition(i)
                let point = new THREE.Vector3( p[0],p[1],p[2] );
                // 视锥剔除
                for ( let j = 0; j < scope.frustum.planes.length-2; j++ ) {//遍历4个视锥面
                    if ( scope.frustum.planes[j].distanceToPoint( point ) < -scope.radius ) {
                        scope.crowd.lodList[i]=-1//不可见
                        break
                    }
                }
                // LOD
                if(scope.crowd.lodList[i]!==-1){
                    var s=camera.position.clone().sub(point)
                    let distance = s.x*s.x+s.y*s.y+s.z*s.z
                    scope.crowd.lodList[i]=scope.lod_distanceSqua.length//4
                    for(let j=0;j<scope.lod_distanceSqua.length;j++){//j=0 1 2 3
                        if(distance < scope.lod_distanceSqua[j]){
                            scope.crowd.lodList[i]=j
                            break
                        }
                    }
                }
            }
            scope.crowd.update()
            scope.cameraStatePre=cameraState
        }
        requestAnimationFrame(()=>{
            CrowdLod.frustumCulling(scope)
        })
    }
}
