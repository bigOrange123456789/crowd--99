import {Build} from "../lib/build/Build.js"
export class Building{
    constructor(scene,camera){
        var parentGroup = new Build(
            "assets/Building/tiyuguan.zip",
            camera
            ).parentGroup
        parentGroup.scale.set(0.00005,0.00005,0.00005)
        scene.add(parentGroup)   
        window.o=parentGroup

    }
}
