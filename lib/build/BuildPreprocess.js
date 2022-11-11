
export class BuildPreprocess{
    constructor(build){
        this.build=build
        this.getSphere()
    }
    getSphere(){
        var result=[]
        var parent=this.build.parentGroup//window.instanceRoot
        for(var i=0;i<parent.children.length;i++){
            var mesh=parent.children[i]
            var bounding_sph=[]
            for(var j=0;j<mesh.bounding_sph.length;j++){
                let sphere=mesh.bounding_sph[j]
                bounding_sph.push([
                    sphere.center.x,
                    sphere.center.y,
                    sphere.center.z,
                    sphere.radius
                ])
            }
            result.push(bounding_sph)
        }
        this.download("bounding_sph.json",result ) 
    }
    download(name,data){
        var str=JSON.stringify(
            data//scope.viewPointData[b.myId] 
            , null, "\t")
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([str], { type: 'text/plain' }));
        link.download =name?name:"test.json";
        link.click();
    }

}
