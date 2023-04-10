import * as THREE from "three";
import JSZip from 'jszip';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export class Building{
    constructor(scene){
        this.parentGroup = new THREE.Group()
        // this.parentGroup.scale.set(0.0005,0.0005,0.0005)
        // this.parentGroup.scale.set(0.9,0.9,0.9)
        // this.parentGroup.rotation.y=Math.PI
        // alert()
        this.parentGroup.position.z=-32

        scene.add(this.parentGroup)

        this.load()
    }
    load(){
        const loader = new GLTFLoader();
        var scope=this
        loader.load(
            'assets/Building/scene.gltf',
            function ( gltf ) {
                let nameList=[
                    // 'xialouti_1', 
                    // 'xialouti_2', 
                    // 'xialouti_3', 
                    'xialouti_4', 
                    
                    // 'shanglouti_3', 'shanglouti_1', 

                    // 'shanglouti_2', 'dinggai_3', 'dinggai_1', 'dinggai_2', 'videowall_2_1', 'videowall_2_2', 
                    // 'videowall_2_3', 'Stage_08_FBXASC230FBXASC140FBXASC164FBXASC229FBXASC142FBXASC139_14_1', 
                    // 'Stage_08_FBXASC230FBXASC140FBXASC164FBXASC229FBXASC142FBXASC139_14_2', 
                    // 'Stage_08_FBXASC230FBXASC140FBXASC164FBXASC229FBXASC142FBXASC139_14_3', 
                    // 'deng_1', 'deng_2', 'deng_3', 'deng_4', 'deng_5', 'deng_6', 'deng_7', 'deng_8', 'deng_9', 

                    // 'deng_10', 'deng_11', 'deng_12', 'deng_13', 'deng_14', 'deng_15', 'polySurface115_1', 
                    // 'polySurface115_2', 'baiqiang', 'FBXASC230FBXASC140FBXASC164FBXASC229FBXASC142FBXASC139', 
                    // 'Wutai_zhongjian_1', 'Wutai_zhongjian', 'San_Obj3d66_4612284_7_694', 'San_Obj3d66_4612284_7_696', 
                    // 'Object005', 'stage15_Obj3d66_724704_1_434_6', 'Rectangle001', 'Object008', 'jinhsu_08', 'Obj3d66_724704_1_435', 

                    // 'FBXASC229FBXASC156FBXASC134FBXASC230FBXASC159FBXASC177FBXASC228FBXASC189FBXASC147_2', 'San_Obj3d66_4612284_132_860', 
                    // 'San_Obj3d66_4612284_67_417', 'San_Obj3d66_4612284_7_697', 'Object010', 'Object011', 'StaticMeshActor_85', 

                    // 'StaticMeshActor_34', 'StaticMeshActor_44', 'StaticMeshActor_87', 'pasted__polySurface117', 'imagewall_6', 
                    // 'yuanzhu_jingmian', 'weilan15', 'yuanding', 'polySurface135', 'imagewall_3', 'imagewall_2', 'pingmu1', 'imagewall_5', 
                    // 'imagewall_4', 'zhunagshi_010', 'videowall_1', 'videowall_3', 'videowall_4', 'videowall_5'
                
                ]

                gltf.scene.traverse(node=>{
                    if(node instanceof THREE.Mesh){
                        var name=node.name
                        let c=node.material.color
                        // nameList.push(name)
                        for(var i=0;i<nameList.length;i++){
                            if(name===nameList[i]){
                                // node.visible=false
                            }
                        }
                        if(name.split("image").length>1){
                            // node.visible=false
                        }else if(name=='xialouti_4'){
                            // node.visible=false
                            // alert(1)

                        }else if(name.split("Wutai").length>1){
                            // node.visible=false
                            // alert(1)

                        }else if(name.split("videowall").length>1){
                            // c.r-=0.1
                            // c.g-=0.1
                            // c.b-=0.1
                            // node.visible=false
                            // alert(2)polySurface
                        }
                        else{
                            // if(c.r+c.g+c.b>2.5&&c.r+c.g+c.b<3)
                            {
                                // c.r*=10.1
                                // c.g*=10.1
                                // c.b*=10.1
                                c.r+=0.05
                                c.g+=0.21
                                c.b+=0.21
                            }
                        }
                        // console.log(node)

                        
                        
                        
                        // console.log(node.material.color)
                    }
                    
                })
                // console.log("nameList",nameList)
     
                scope.parentGroup.add( gltf.scene );
                // window.o=gltf.scene
            },
            function ( xhr ) {
                //侦听模型加载进度
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                //加载出错时的回调
                console.log( 'gltf loader error' );
            }
        );

    }
    
}
