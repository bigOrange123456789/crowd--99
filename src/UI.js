import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'//dat.gui.module.js';
class UI{
    constructor(scene,crowdGroup) {
        console.log("create ui")
        var gui = new GUI();
        gui.width = 300;
        gui.domElement.style.userSelect = 'none';
        this.gui_light=gui
        // var gui = new GUI();
        gui.width = 300;
        gui.domElement.style.userSelect = 'none';
        this.gui_material=gui

        var arr=[]
        for(var i=0;i<scene.children.length;i++){
            arr.push(scene.children[i])
        }
        for(var i=0;i<crowdGroup.children.length;i++){
            arr.push(crowdGroup.children[i])
        }

        for(var i in arr){
            var obj=arr[i]
            if(obj&&obj.name)
            if(obj.name=="head"){
                this.addUI_material("woman face Material",obj.material)
            }else if(obj.name=="CloM_A_body_geo"){
                this.addUI_material("hand Material",obj.material)
            }else if(obj.name=="dirLight1"){
                this.addUI_pointLight('PointLight1',obj)
            }else if(obj.name=="dirLight2"){
                this.addUI_directionalLight('directionalLight2',obj)
            }else if(obj.name=="ambient"){
                this.addUI_AmbientLight("ambient light",obj)
            }
        }        
        // this.addUI_crowdGroup("crowdGroup",crowdGroup)
    }
    addUI_crowdGroup(name,crowdGroup){
        var gui=this.gui_material
        const fSSS = gui.addFolder( name );
        const config_sss = {
            avatarCount:3000,
            triangular:1
        };
        fSSS.add(config_sss,'avatarCount',0,5*100*100,1)
            .name('avatarCount')
            .onChange( function () {
                crowdGroup.count=Math.floor(config_sss.avatarCount)
                crowdGroup.update()
        } );
        fSSS.add(config_sss,'triangular',0.05,1,0.05)
            .name('triangular')
            .onChange( function () {
                var t=Math.floor(20*config_sss.triangular)
                //if(t==20)t=19
                crowdGroup.useLod(t-1)
        } );
        fSSS.open();
    }
    addUI_material(name,material){
        var gui=this.gui_material
        const fSSS = gui.addFolder( name );
        const config_sss = {
            brightness_specular:1.0,
            sssIntensity:0.35,
            sssIntensity2:0.35,
            roughness: 0.46,
        };
        fSSS.add(config_sss,'sssIntensity',0,0.5,0.01)
            .name('sssIntensity')
            .onChange( function () {
                material.uniforms.sssIntensity.value = config_sss.sssIntensity;
        } );
        fSSS.add(config_sss,'sssIntensity2',0,0.5,0.01)
            .name('sssIntensity2')
            .onChange( function () {
                // console.log(material.uniforms)
                material.uniforms.sssIntensity2.value = config_sss.sssIntensity2;
        } );
        fSSS.add(config_sss,'brightness_specular',0,0.1,0.01)
            .name('Specular Intensity')
            .onChange( function () {
                material.metalness= config_sss.brightness_specular;
                material.uniforms.brightness_specular.value = config_sss.brightness_specular;
        } );
        fSSS.add(config_sss,'roughness',0,1.0,0.01)
            .name('roughness')
            .onChange( function (value) {
                // value=1-value
                material.roughness = (value<0.01)?0.01:value;
        } );
        fSSS.open();
    }
    addUI_pointLight(name,dirLight1){
        var gui=this.gui_light
        const config_dir1 = {
            intensity: 0.7,
            posX:dirLight1.position.x,
            posY:dirLight1.position.y,
            posZ:dirLight1.position.z,
            color:'#ffffff',
        };
        const fDir1 = gui.addFolder( name );
        fDir1.add( config_dir1, 'intensity', 0, 10, 0.01 )
        .name( 'Intensity' )
        .onChange( function () {
            dirLight1.intensity = config_dir1.intensity;
        } );
        fDir1.add( config_dir1, 'posX', -2, 2, 0.01 )
        .name( 'Pos X' )
        .onChange( function () {
            dirLight1.position.x = config_dir1.posX;
            // dirLight1.updateMatrix();

        } );
        fDir1.add( config_dir1, 'posY', -2, 2, 0.01 )
        .name( 'Pos Y' )
        .onChange( function () {
            dirLight1.position.y = config_dir1.posY;
            // dirLight1.updateMatrix();
        } );
        fDir1.add( config_dir1, 'posZ', -2, 2, 0.01 )
        .name( 'Pos Z' )
        .onChange( function () {
            dirLight1.position.z = config_dir1.posZ;
            // dirLight1.updateMatrix();
        } );
        fDir1.addColor(config_dir1,'color')
        .name('Color')
        .onChange( function () {
            dirLight1.color.set(config_dir1.color);
            
        } );
        fDir1.open();
    }
    addUI_directionalLight(name,dirLight2){
        var gui=this.gui_light
        const config_dir2 = {
            intensity: 1.0,
            posX:-20,
            posY:0,
            posZ:0,
            color:'#ccccff',
        };
        const fDir2 = gui.addFolder( name );
        fDir2.add( config_dir2, 'intensity', 0, 10, 0.01 )
            .name( 'Intensity' )
            .onChange( function () {
                dirLight2.intensity = config_dir2.intensity;
            } );
        fDir2.add( config_dir2, 'posX', -50, 50, 0.01 )
            .name( 'Pos X' )
            .onChange( function () {
                dirLight2.position.x = config_dir2.posX;
                dirLight2.updateMatrix();
            } );
        fDir2.add( config_dir2, 'posY', -50, 50, 0.01 )
            .name( 'Pos Y' )
            .onChange( function () {
                dirLight2.position.y = config_dir2.posY;
                dirLight2.updateMatrix();
            } );
        fDir2.add( config_dir2, 'posZ', -50, 50, 0.01 )
            .name( 'Pos Z' )
            .onChange( function () {
                dirLight2.position.z = config_dir2.posZ;
                dirLight2.updateMatrix();
            } );
        fDir2.addColor(config_dir2,'color')
            .name('Color')
            .onChange( function () {
                dirLight2.color.set(config_dir2.color);
                
            } );
        fDir2.open();
    }
    addUI_AmbientLight(name,ambient){
    var gui=this.gui_light
    const fAmbiemt = gui.addFolder( name);
    const config_ambient = {
        intensity: 0.5,
        color: '#443333',
    };
    fAmbiemt.add( config_ambient, 'intensity', 0, 10, 0.01 )
    .name( 'Intensity' )
    .onChange( function () {
        ambient.intensity = config_ambient.intensity;
    } );
    fAmbiemt.addColor(config_ambient,'color')
    .name('Color')
    .onChange( function () {
        ambient.color.set(config_ambient.color);
        
    } );
    fAmbiemt.open();
    }
    addUI_BloomFilter(name,bloom){//TODO 需要在此处获取到后处理效果才能用UI调整
    var gui=this.gui_light
    const fBloom = gui.addFolder( "Bloom");
    //this.unrealBloomPass=
    const config_bloom = {
        enabled: 1,
        strength: 0.3,
        radius: 1,
        threshold: 0.6
    };
    fBloom.add( config_bloom, 'enabled', 0, 1, 1 )
    .name( 'Enabled' )
    .onChange( function () {
        bloom.enabled=config_bloom.enabled==1
    } );
    fBloom.add( config_bloom, 'strength', 0, 2, 0.001 )
    .name( 'Strength' )
    .onChange( function () {
        bloom.strength=config_bloom.strength
    } );
    fBloom.add( config_bloom, 'radius', 0, 2, 0.001 )
    .name( 'Radius' )
    .onChange( function () {
        bloom.radius=config_bloom.radius
    } );
    fBloom.add( config_bloom, 'threshold', 0, 1, 0.001 )
    .name( 'Threshold' )
    .onChange( function () {
        bloom.threshold=config_bloom.threshold
    } );
    

    fBloom.open();
    }

}
export { UI };
