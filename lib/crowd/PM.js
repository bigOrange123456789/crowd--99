import * as THREE from "three";
import { CrowdGeometry } from './CrowdGeometry.js'
import { PMGroup } from './PMGroup.js'
export class PM {
    constructor(opt){
        this.crowd=opt.crowd
        var groupOld=opt.groupOld//groupOld 是glb.scene
        this.getLodAll(groupOld)
    }
    getLodAll(groupOld){
        var scope=this

        var group={
            dummy:"test",
            children:[]
        }
        groupOld.traverse(node=>{
            if(node instanceof THREE.SkinnedMesh){
                group.children.push(node)
            }
        })

        var lod0=CrowdGeometry.getLod(group)
        lod0.lodLevel=scope.crowd.lod.length
        scope.crowd.lod.push(lod0)
        scope.crowd.useLod(lod0)

        let cb_last=lod_last=>{
            window.timeTest.measure("load lod finish")
            if(scope.crowd.lod_set)scope.crowd.lod_set()
            scope.crowd.myLodController.cameraStatePre=""
            scope.crowd.update()
            window.timeTest.measure("update finish")
        }
        let cb=lod0=>{
            window.timeTest.measure("lod "+lod0.lodLevel)
            if(scope.crowd.lod_set)scope.crowd.lod_set()
            
            window.lodnumber+=1
            document.getElementById("firstTime").innerText = "加载进度:"+(100*window.lodnumber/40)+"%"
        }
        // return
        //////////////////////////////////////  正确的代码  ///////////////////////////////////////////
        function loadJson(index) {
            var path=scope.crowd.pathLodGeo+index+".json"
            scope.loadJson(
                path,
                data=>{
                    // let pmGroup=new PMGroup(data)
                    // var data=pmGroup.getJson()

                    var lod0=CrowdGeometry.getLod(data)
                    lod0.lodLevel=scope.crowd.lod.length
                    scope.crowd.lod.push(lod0)
                    scope.crowd.useLod(lod0)
                    if(cb)cb(lod0)
                    if(index<scope.crowd.lodCount-1){
                        loadJson(index+1)
                    }else{
                        if(cb_last)cb_last(scope.crowd.lod)
                    } 
                }
            )
        }
        loadJson(1)
        ////////////////////////////////////  正确的代码  ///////////////////////////////////////////

        //////////////////////////////////////  错误的代码  ///////////////////////////////////////////
        // load1()
        function load1(){
            scope.loadJson(
                scope.crowd.pathLodGeo+"1.json",
                data=>{
                    var lod0=CrowdGeometry.getLod(data)
                    lod0.lodLevel=scope.crowd.lod.length
                    scope.crowd.lod.push(lod0)
                    scope.crowd.useLod(lod0)
                    if(cb)cb(lod0)
                    load2()
                }
            )
        }
        // function load2(){
        //     scope.loadJson(
        //         scope.crowd.pathLodGeo+"2.json",
        //         data=>{
        //             // scope.pmGroup=new PMGroup(data)
        //             // var data=pmGroup.getJson()

        //             var lod0=CrowdGeometry.getLod(data)
        //             lod0.lodLevel=scope.crowd.lod.length
        //             scope.crowd.lod.push(lod0)
        //             scope.crowd.useLod(lod0)
                    
        //             load3()
        //             if(cb)cb(lod0)
        //         }
        //     )
        // }
        function load2(){
            scope.loadJson(
                scope.crowd.pathLodGeo+"2.json",
                data=>{
                    scope.pmGroup=new PMGroup(data)
                    // var data=pmGroup.getJson()
                    var lod0=CrowdGeometry.getLod(data)
                    lod0.lodLevel=scope.crowd.lod.length
                    scope.crowd.lod.push(lod0)
                    scope.crowd.useLod(lod0)
                    loadIncrement(2)
                    if(cb)cb(lod0)
                }
            )
        }
        function loadIncrement(index){//index=[2,3,..,19]
            console.log("loadIncrement(index)",index)
            scope.loadJson(
                scope.crowd.pathLodGeo+index+".json.pack.json",
                data=>{
                    scope.pmGroup.addPack(data)
                    window.group3a=scope.pmGroup
                    console.log("scope.pmGroup",scope.pmGroup)
                    var data_new=scope.pmGroup.getJson()
                    var lod0=CrowdGeometry.getLod(data_new)
                    lod0.lodLevel=scope.crowd.lod.length
                    scope.crowd.lod.push(lod0)
                    scope.crowd.useLod(lod0)
                    
                    
                    if(cb)cb(lod0)
                    if(index<scope.crowd.lodCount-2){//index=[2,3,..,19]
                        loadIncrement(index+1)
                    }else{
                        if(cb_last)cb_last(scope.crowd.lod)
                    } 
                }
            )
        }
        //////////////////////////////////////  错误的代码  ///////////////////////////////////////////
        // test000()
        function test000(){
            scope.loadJson(
                scope.crowd.pathLodGeo+"4.json",
                data=>{
                    var pmGroup4=new PMGroup(data)
                    window.group4=pmGroup4;
                    console.log("pmGroup4",pmGroup4)
                    
                }
            )
        }
        //////////////////////   test   ////////////////////////
        // load1()
        // function load1(){
        //     scope.loadJson(
        //         scope.crowd.pathLodGeo+"1.json",
        //         data=>{
        //             var lod0=CrowdGeometry.getLod(data)
        //             lod0.lodLevel=scope.crowd.lod.length
        //             scope.crowd.lod.push(lod0)
        //             scope.crowd.useLod(lod0)
        //             if(cb)cb(lod0)
        //             load2()
        //         }
        //     )
        // }
        // function load2(){
        //     scope.loadJson(
        //         scope.crowd.pathLodGeo+"2.json",
        //         data=>{
        //             scope.pmGroup=new PMGroup(data)
        //             // var data=pmGroup.getJson()

        //             var lod0=CrowdGeometry.getLod(data)
        //             lod0.lodLevel=scope.crowd.lod.length
        //             scope.crowd.lod.push(lod0)
        //             scope.crowd.useLod(lod0)
                    
        //             loadIncrement(2)
        //             if(cb)cb(lod0)
        //         }
        //     )
        // }
        // function loadIncrement(){//index=[2,3,..,19]
        //     console.log("loadIncrement(index)",2)
        //     scope.loadJson(
        //         scope.crowd.pathLodGeo+"2.json.pack.json",
        //         data=>{
        //             scope.pmGroup.addPack(data)
        //             var data_new=scope.pmGroup.getJson()
        //             var lod0=CrowdGeometry.getLod(data_new)
        //             lod0.lodLevel=scope.crowd.lod.length
        //             scope.crowd.lod.push(lod0)
        //             scope.crowd.useLod(lod0)
                    
                    
        //             if(cb)cb(lod0)
                    
        //         }
        //     )
        // }
        //////////////////////   test   ////////////////////////
        
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