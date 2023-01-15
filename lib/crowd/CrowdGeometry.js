import * as THREE from "three";
class CrowdGeometry extends THREE.InstancedBufferGeometry {
    constructor( parameters ) {
        super();
        this.oldGeometry=parameters.oldGeometry
        if(this.oldGeometry.index!==null){
            // this.oldGeometry=this.oldGeometry.toNonIndexed();
            this.index=this.oldGeometry.index
        }
        for(var i in this.oldGeometry.attributes)
            this.setAttribute(i, this.oldGeometry.attributes[i])
    }
    bindGeometry(geometry){
        var attributes=geometry.attributes
        var tags=[
            'position','uv','skinIndex','skinWeight',//'normal'
        ]
        for(var i=0;i<tags.length;i++ ){
            var name=tags[i]
            if(attributes[name])
                this.setAttribute(name, attributes[name]);
        }
        this.index=geometry.index//geometry.index==null?
        delete this.attributes.normal
        this.computeVertexNormals()
    }
    static getLod(data){
        var result={}
        for(var meshName in data){
            result[meshName]=new LodGeometry(data[meshName])
        }
        return result
    }
}
class LodGeometry{
    constructor(data){
        var attributes={}
        attributes.position=
            new THREE.BufferAttribute(
                new Float32Array(data.position), 3
            );
        attributes.uv = 
            new THREE.BufferAttribute(
                new Float32Array(data.uv), 2
            );
        attributes.skinIndex = 
            new THREE.BufferAttribute(
                new Uint8Array(data.skinIndex), 4
            );
        attributes.skinWeight = 
            new THREE.BufferAttribute(
                new Float32Array(data.skinWeight), 4
            );
        // attributes.normal = 
        //     new THREE.BufferAttribute(
        //         new Float32Array(data.normal), 3
        //     );
        this.attributes=attributes
        if(data.index){
            this.index=
                new THREE.BufferAttribute(
                    new Uint16Array(data.index), 1
                );
        }
    }
}
export { CrowdGeometry,LodGeometry };
