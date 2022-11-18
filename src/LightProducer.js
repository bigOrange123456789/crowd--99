import * as THREE from "three";
class LightProducer{
    constructor(scene){
        // Lights 
        const ambient = new THREE.AmbientLight( 0xffffff ,0.5);
        scene.add( ambient );
        ambient.name="ambient"

        const dirLight1 = new THREE.PointLight( 0xffffff, 0.7, 10000 ,1)//new THREE.DirectionalLight( 0xffddcc, 0.5 );
        dirLight1.position.set( 0.2001199212621189,  1.8324430884592016,  -0.285745579849489)//( 10, 10, 10 );
        scene.add( dirLight1 );
        dirLight1.name="dirLight1"

        const dirLight2 = new THREE.DirectionalLight( 0xcffffff,2 );
        dirLight2.position.set( -20, 0, 0 );
        scene.add( dirLight2 )
        dirLight2.name="dirLight2"
    }
}
export { LightProducer }