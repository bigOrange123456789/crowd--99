import { CrowdGeometry } from './CrowdGeometry.js'
import { PMGroup } from './PMGroup.js'
export class PM {
    constructor(opt,cb0){
        this.usePM=opt.usePM
        this.crowd=opt.crowd
        this.groupOld=opt.groupOld//groupOld 是glb.scene

        if(this.usePM) this.getBase_PM(cb0)
        else this.getBase_noPM(cb0)
        
    }
    init(cb00){//需要整个lod体系
        this.crowd.useLod(0)
        this.crowd.useLod(1)
        this.cb(0)
        this.cb(1)
        if(this.usePM) this.loadIncrement(1,cb00)
        else this.loadMesh_noPM(2,cb00)
    }
    getBase_PM(cb0){
        var scope=this;
        scope.loadJson(
            scope.crowd.pathLodGeo+"1.json",
            data=>{
                scope.pmGroup=new PMGroup(data)
                var lod0_=CrowdGeometry.getLod2(scope.pmGroup.getJson2())
                lod0_.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0_)
                if(cb0)cb0(lod0_)
                // scope.crowd.useLod(lod0_)

                var lod0=CrowdGeometry.getLod(data)
                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                // scope.crowd.useLod(lod0)
                // scope.cb(lod0)
                // scope.loadIncrement(1)
            }
        )
    }
    getBase_noPM(cb0){
        var scope=this;
        var path=scope.crowd.pathLodGeo+"1.json"
        scope.loadJson(
            path,
            data=>{
                var lod0=CrowdGeometry.getLod(data)
                var lod0_=CrowdGeometry.getLod2(lod0)
                lod0_.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0_)
                if(cb0)cb0(lod0_)
                // scope.crowd.useLod(lod0_)

                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                // scope.crowd.useLod(lod0)
                // scope.cb(lod0)
                

                // scope.loadMesh_noPM(2)
            }
        )

    }

    loadMesh_noPM(index,cb00) {//1,2,3...20
        var scope=this;
        var path=scope.crowd.pathLodGeo+index+".json"
        scope.loadJson(
            path,
            data=>{
                var lod0=CrowdGeometry.getLod(data)
                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                scope.crowd.useLod(lod0)
                scope.cb(lod0)
                if(index<scope.crowd.lodCount-1){
                    scope.loadMesh_noPM(index+1,cb00)
                }else{
                    if(cb00)cb00()
                    scope.cb_last(scope.crowd.lod)
                    
                } 
            }
        )
    }
    // loadMesh(){
    //     var scope=this;
    //     scope.loadJson(
    //         scope.crowd.pathLodGeo+"1.json",
    //         data=>{
    //             scope.pmGroup=new PMGroup(data)
    //             var lod0=CrowdGeometry.getLod(data)
    //             lod0.lodLevel=scope.crowd.lod.length
    //             scope.crowd.lod.push(lod0)
    //             scope.crowd.useLod(lod0)
    //             scope.cb(lod0)
    //             scope.loadIncrement(1)
    //         }
    //     )
    // }
    loadIncrement(index,cb00){//index=[1,3,..,19]
        var scope=this;
        scope.loadJson(
            scope.crowd.pathLodGeo+index+".json.pack.json",
            data=>{
                scope.pmGroup.addPack(data)
                window.group3a=scope.pmGroup
                var data_new=scope.pmGroup.getJson()

                var lod0=CrowdGeometry.getLod(data_new)
                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                scope.crowd.useLod(lod0)

                scope.cb(lod0)
                if(index<19){//if(index<scope.crowd.lodCount-2){//index=[2,3,..,19]
                    scope.loadIncrement(index+1,cb00)
                }else{
                    if(cb00)cb00()
                    scope.cb_last(scope.crowd.lod)
                    
                } 
            }
        )
    }
    cb_last(lod_last){
        var scope=this;
        window.timeTest.measure("load lod finish")
        if(scope.crowd.lod_set)scope.crowd.lod_set()
        scope.crowd.myLodController.cameraStatePre=""
        scope.crowd.update()
        window.timeTest.measure("update finish")
    }
    cb(lod0){
        var scope=this;
        window.timeTest.measure("lod "+lod0.lodLevel)
        if(scope.crowd.lod_set)scope.crowd.lod_set()
        
        // window.lodnumber+=1
        // document.getElementById("firstTime").innerText = "加载进度:"+(100*window.lodnumber/40)+"%"
    }
    loadBin0(path){
        let loader = new THREE.FileLoader();
		loader.setResponseType("arraybuffer");
		loader.load(
  			path,
  			buffer => {
            
            }
        )
        //获取元素
        //监听事件
        fileInput.onchange = function () {
            //获取文件
            var file = this.files[0];
            console.log("read")
            //读取文件
            var fileReader = new FileReader();
            //转换文件为ArrayBuffer
            fileReader.readAsArrayBuffer(file);
            //监听完成事件
            fileReader.onload = function () {
                console.log("read ok")
                //打印arraybuffer的字节长度 也是文件的大小 到了这一步就可以使用arraybuffer进行
                //文件的修改之类的操作了
                //将文件流转为64位的float数组数组用于音频播放
                var intData = new Uint32Array(fileReader.result);
                var meshLength = intData[0];
                var array1Length = intData[1];
                var array2Length = intData[2];
                var array3Length = intData[3];
                console.log(meshLength);
                console.log(array1Length);
                console.log(array2Length);
                console.log(array3Length);
                var nodeList = []
                var data = new Float32Array(fileReader.result);
                for (var i = 0; i < meshLength; i++) {
                    let node = {
                        aI: 0,
                        bI: 0,
                        aPos: [],
                        bPos: [],
                        cPos: [],
                        aUV: [],
                        aSkinWeight: [],
                        aSkinIndex: [],
                        bUV: [],
                        bSkinWeight: [],
                        bSkinIndex: [],
                        faceRe: [],
                        face: {
                            x: [],
                            y: [],
                            z: [],
                            d: [],
                        }
                    }
                    let start = i * 35 + 4;
                    node.aI = data[start];
                    node.bI = data[start + 1];
                    for (let j = 0; j < 3; j++) {
                        node.aPos.push(data[start + 2 + j])
                        node.bPos.push(data[start + 5 + j])
                        node.cPos.push(data[start + 8 + j])
                    }
                    for (let j = 0; j < 2; j++) {
                        node.aUV.push(data[start + 11 + j])
                        node.bUV.push(data[start + 21 + j])
                    }
                    for (let j = 0; j < 4; j++) {
                        node.aSkinWeight.push(data[start + 13 + j])
                        node.aSkinIndex.push(data[start + 17 + j])
                        node.bSkinWeight.push(data[start + 23 + j])
                        node.bSkinIndex.push(data[start + 27 + j])
                    }
                    let faceRestart = data[start + 31] + array1Length + 4
                    let facestart = data[start + 32] + array1Length + array2Length + 4
                    let faceReLength = data[start + 33]
                    let faceLength = data[start + 34]
                    for (let j = 0; j < faceReLength; j++) {
                        node.faceRe.push(data[faceRestart + j])
                    }
                    for (let j = 0; j < faceLength; j++) {
                        node.face.x.push(data[facestart + j * 4])
                        node.face.y.push(data[facestart + j * 4 + 1])
                        node.face.z.push(data[facestart + j * 4 + 2])
                        node.face.d.push(data[facestart + j * 4 + 3])
                    }
                    console.log(node)
                    nodeList.push(node)
                }
            }
        }
    }
    bin2json(){

    }
    loadJson(path,cb_) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", path, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status =="200") {
                var str=rawFile.responseText
                var data=JSON.parse(str)
                if(cb_)cb_(data)
            }
        }
        rawFile.send(null);
    }
}