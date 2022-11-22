
addpath('src');
addpath('lib/jsonlab-master');
main(0.5,"test1.json");

function main(ratio,savePath)
    data_list = loadjson('manA20.json');
    cell0=fieldnames(data_list);
    model_result=struct();
    for i = 1:size(cell0,1)
        c=cell0(i);
        name=cell2mat(c);
        disp(name);
        data=getfield(data_list,name);
        mesh=MeshJson(data);
        %mesh.simplify(ratio);
        json0=mesh.getJson();
        model_result=setfield(model_result,name,json0);
    end
    str=savejson('',model_result);
    file=fopen(savePath,'w+');
    fprintf(file,'%s',str);
end
