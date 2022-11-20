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
        if(data.dummy){//if(data instanceof CrowdGroup){
            let data2={}
            for(let i=0;i<data.children.length;i++){
                data2[data.children[i].name]
                    =data.children[i].geometry
            }
            data=data2
        }
        var result={}
        for(var meshName in data){
            result[meshName]=new LodGeometry(data[meshName])
        }
        return result
    }
}
class LodGeometry{
    constructor(data){
        if(data instanceof THREE.BufferGeometry){
            this.init2(data)
        }else this.init(data)
    }
    init(data){
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
    init2(geometry1){
        let position1=geometry1.attributes.position
        let max=[-999999,-999999,-999999]
        let min=[999999,999999,999999]
        for(let i=0;i<position1.count;i++){
            for(let j=0;j<3;j++){
                let d=position1.array[3*i+j]
                if(d>max[j])max[j]=d
                if(d<min[j])min[j]=d
            }
        }

        const geometry2 = new THREE.BoxGeometry( 1, 1, 1 )
        console.log("geometry2",geometry2)
        const count2=geometry2.attributes.position.count
        
        let data={
            position:geometry2.attributes.position.array,
            uv:[],
            skinIndex:[],
            skinWeight:[]
        }
        for(let i=0;i<count2;i++){
            // for(let j=0;j<3;j++)
            //     data.position[i*3+j]=
            //         (geometry1.attributes.position.array[i*3+j]>0)?max[j]:min[j]
            for(let j=0;j<2;j++)
                data.uv.push(
                    geometry1.attributes.uv.array[i*2+j]
                )
            for(let j=0;j<4;j++)
                data.skinIndex.push(
                    geometry1.attributes.skinIndex.array[i*4+j]
                )
            for(let j=0;j<4;j++)
                data.skinWeight.push(
                    geometry1.attributes.skinWeight.array[i*4+j]
                )
        }
        data.index=geometry2.index.array
        // console.log("data",data)
        this.init(data)
    }
}
export { CrowdGeometry,LodGeometry };
