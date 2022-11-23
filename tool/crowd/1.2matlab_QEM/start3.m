clc
addpath('src');
addpath('lib/jsonlab-master');

%main(0.01,"test2.json");
number=20;
min=0.01;
step=(1-min)/(number-1);
for i =1:19
    ratio=min+(i-1)*step;    %压缩比
    disp([i,"ratio",ratio])
    savePath=strcat('data/',string(i),'.json'); 
    main(ratio,savePath);
end

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
        mesh.simplify(ratio);
        json0=mesh.getJson();
        model_result=setfield(model_result,name,json0);
    end
    str=savejson('',model_result);
    file=fopen(savePath,'w+');
    fprintf(file,'%s',str);
    fclose(file);
end
