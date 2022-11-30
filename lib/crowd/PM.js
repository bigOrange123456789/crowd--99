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
    init(){//需要整个lod体系
        this.crowd.useLod(0)
        this.crowd.useLod(1)
        this.cb(0)
        this.cb(1)
        if(this.usePM) this.loadIncrement(1)
        else this.loadMesh_noPM(2)
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

    getBase_PM0(){
        var scope=this;
        scope.loadJson(
            scope.crowd.pathLodGeo+"1.json",
            data=>{
                scope.pmGroup=new PMGroup(data)
                var lod0_=CrowdGeometry.getLod2(scope.pmGroup.getJson2())
                lod0_.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0_)
                scope.crowd.useLod(lod0_)

                var lod0=CrowdGeometry.getLod(data)
                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                scope.crowd.useLod(lod0)
                scope.cb(lod0)
                scope.loadIncrement(1)
            }
        )
    }
    getBase_noPM0(){
        var scope=this;
        var path=scope.crowd.pathLodGeo+"1.json"
        scope.loadJson(
            path,
            data=>{
                var lod0=CrowdGeometry.getLod(data)
                var lod0_=CrowdGeometry.getLod2(lod0)
                lod0_.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0_)
                scope.crowd.useLod(lod0_)

                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                scope.crowd.useLod(lod0)
                

                scope.loadMesh_noPM(2)
            }
        )

    }

    loadMesh_noPM(index) {//1,2,3...20
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
                    scope.loadMesh_noPM(index+1)
                }else{
                    scope.cb_last(scope.crowd.lod)
                } 
            }
        )
    }
    loadMesh(){
        var scope=this;
        scope.loadJson(
            scope.crowd.pathLodGeo+"1.json",
            data=>{
                scope.pmGroup=new PMGroup(data)
                var lod0=CrowdGeometry.getLod(data)
                lod0.lodLevel=scope.crowd.lod.length
                scope.crowd.lod.push(lod0)
                scope.crowd.useLod(lod0)
                scope.cb(lod0)
                scope.loadIncrement(1)
            }
        )
    }
    loadIncrement(index){//index=[1,3,..,19]
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
                    scope.loadIncrement(index+1)
                }else{
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