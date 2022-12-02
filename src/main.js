import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {MapControls,OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js'
//RGBMLoader
import { Building } from './Building.js'
import {LightProducer } from './LightProducer.js'
import {AvatarManager } from './AvatarManager.js'
import { MoveManager } from '../lib/playerControl/MoveManager.js'
import {MyUI} from "./MyUI.js"
export class Loader{
    constructor(body){
        this.isIosPlatform =this.isMobile()
        this.body = body
        this.canvas = document.getElementById('myCanvas')
        window.addEventListener('resize', this.resize.bind(this), false)
        this.initScene()
        this.addMyUI()
    }
    async initScene(){
        window.timeTest.measure("initScene start")
        this.renderer = new THREE.WebGLRenderer({
            alpha:true,
            antialias: true,
            canvas:this.canvas,
            preserveDrawingBuffer:true
        })
        this.renderer.setSize(this.body.clientWidth,this.body.clientHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        window.renderer=this.renderer
        this.body.appendChild(this.renderer.domElement)

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute'
        this.stats.domElement.style.left = '0px'
        this.stats.domElement.style.top = '0px'
        var statsContainer = document.createElement('div')
        statsContainer.id = 'stats-container'
        statsContainer.appendChild(this.stats.domElement)
        this.body.appendChild(statsContainer)

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(50,this.body.clientWidth/this.body.clientHeight,0.001,5000)
        this.camera.position.set(-43.486343682038736,  2.127206120237504,  -8.698678933445201)
        this.camera.lookAt(0,0,0)
        // this.camera.position.set( -0.6821012446503002,  11.0913040259869,  -0.2459109391034793)
        // this.camera.rotation.set(-1.5929642031588853,  -0.061406332932874515, -1.9174927752336077)
        window.camera=this.camera
        
        this.scene.add(this.camera)
        this.orbitControl = new MapControls(this.camera,this.renderer.domElement)
        // this.orbitControl = new OrbitControls(this.camera,this.renderer.domElement)
        new LightProducer(this.scene)
        
        this.animate = this.animate.bind(this)
        requestAnimationFrame(this.animate)

        new AvatarManager(this.scene,this.camera)
        new Building(this.scene,this.camera)
        this.autoMove=this.wander2()
        var scope=this
        setTimeout(()=>{
          scope.initSky()
          // scope.autoMove.stopFlag = false;
        },1000)
        
    }
    addMyUI()
    {
      var ui=new MyUI()
      var height=window.innerHeight
  
      var camera_pos = [
        new THREE.Vector3(48.55640273290092,  1.9142025592268763,  -7.314690567468844),
        new THREE.Vector3(47.298827892375,  1.7232932395224025,  -7.348360792773678),
        new THREE.Vector3( -58.92759054201366, 39.57529059951184,  -130.21318894586796),
        new THREE.Vector3(-1.0911605157232827,  0.7075214699744158,  -99.90313103529786),
        new THREE.Vector3( -64.39189399430883,  8.99856114154391,  -74.3016535116766),
        new THREE.Vector3( -1.5994877198648538,  1.4997407676957795,  -77.1512219063800),
        new THREE.Vector3( -54.63874349381954,  18.532468360185952,  46.071540822),
        
        
      ]
      var camera_tar = [
        new THREE.Vector3( 51.03516532171532,  2.290497364346837,  -7.248324342451475),
        new THREE.Vector3( 51.03516532171532,  2.290497364346837,  -7.248324342451475),
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(-0.9868855788301696,  0.7075214699744165,  -99.03513139079297),
        new THREE.Vector3( -65.34712509322323,  9.472649100434154,  -69.41033714095124),
        new THREE.Vector3(-1.9992580266994615,  1.6314769709077197,  -59.25814512545),
        new THREE.Vector3( -66.03747192556759,  9.679838586814231,  41.845030134054),
        
      ]
      var inf = {
        '视点7':6,
        '视点6':5,
        '视点5':4,
        '视点4':3,
        '视点3':2,
        '视点2':1,
        '视点1':0,
      }
  
      var self = this;
      var names=Object.keys(inf)
      for(let i=0; i<names.length; i++){
        new ui.Button(names[i], "#D4D80B", '#DAA520', '#FFFACD',
            30, 10,
            150, 45,
            10,height-60*(i+1.5),()=>{
              var id = inf[names[i]]
              self.camera.position.copy(camera_pos[id])
              self.camera.lookAt(camera_tar[id])
              self.orbitControl.target = camera_tar[id].clone()
            });
      }
    }
    animate(){
        this.stats.update()
        this.renderer.render(this.scene,this.camera)
        requestAnimationFrame(this.animate)
    }
    resize(){
        this.canvas.width = window.innerWidth;//this.body.clientWidth
        this.canvas.height = window.innerHeight;//this.body.clientHeight
        this.camera.aspect = this.canvas.width/this.canvas.height;//clientWidth / clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.canvas.width, this.canvas.height)
    }
    initSky(cb){
        var scope=this
        this.getCubeMapTexture('assets/environment/royal_esplanade_1k.hdr').then(
            ({ envMap }) => {
                scope.scene.environment = envMap
                if(cb)cb()
            }
        )
    }
    isMobile() {
          let check = false
            ; (function (a) {
              if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                  a
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                  a.substr(0, 4)
                )
              )
                check = true
            })(navigator.userAgent || navigator.vendor || window.opera)
          if (check == false) {
            check =
              [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
              ].includes(navigator.platform) ||
              // iPad on iOS 13 detection
              (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
          }
          return check
    }
    getCubeMapTexture(evnMapAsset) {
        var path = evnMapAsset
        var scope = this
        var HalfFloatType=THREE.HalfFloatType
        var FloatType=THREE.FloatType
        return new Promise((resolve, reject) => {
          if (!path) {
            resolve({ envMap: null })
          } else if (path.indexOf('.hdr') >= 0) {
            new RGBELoader()
              .setDataType(scope.isIosPlatform ? HalfFloatType : FloatType)
              .load(
                path,
                texture => {
                  scope.pmremGenerator = new THREE.PMREMGenerator(scope.renderer)
                  scope.pmremGenerator.compileEquirectangularShader()
    
                  const envMap =
                    scope.pmremGenerator.fromEquirectangular(texture).texture
                  scope.pmremGenerator.dispose()
    
                  resolve({ envMap })
                },
                undefined,
                reject
              )
          } else if (path.indexOf('.png') >= 0) {
            new RGBMLoader(this.options.manager).setMaxRange(8).load(
              path,
              texture => {
                scope.pmremGenerator = new PMREMGenerator(scope.renderer)
                scope.pmremGenerator.compileEquirectangularShader()
    
                const envMap =
                  scope.pmremGenerator.fromEquirectangular(texture).texture
                scope.pmremGenerator.dispose()
    
                resolve({ envMap })
              },
              undefined,
              reject
            )
          }
        })
    }
    wander2() {
      let movePath = [
        ,[-14.41, 6.41, 54.32, -2.72136,0.00159,3.14088, 200]
        ,[22.97,3.44,59.34,-2.79166,0.00164,3.14099,700]
        
        ,[40.07,4.36,57.78,-0.31993,-0.58416,-0.18073,300]
        ,[37.08,6.75,-55.9,-0.31993,-0.58416,-0.18073,1400]
        ,[-31.42,8,-38.82,-2.1859,1.39718,2.19304,350]
        ,[-37.72,5.75,47.94,-2.18567,1.10707,2.23914,500]
        ,[-38.04,6.25,55.46,-0.01195,-0.62332,-0.00697,100]
      ];
      let funcArr = new Array( movePath.length );
      funcArr[ movePath.length - 1 ] = function() {
      }
      return new MoveManager(this.camera, movePath, funcArr);
  }
    
}
document.addEventListener('DOMContentLoaded', () => {
    window.timeTest.measure("document.addEventListener")
    new Loader(document.body)
    //document.documentElement.clientHeight和document.documentElement.clientWidth
})
