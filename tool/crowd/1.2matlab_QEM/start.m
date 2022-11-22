
addpath('src');
%m2=MeshJson("test");
% m2.simplify(0.9);
%m2.download();
%m2.downloadJson();

addpath('lib/jsonlab-master');
data_list = loadjson('manA20.json');

cell0=fieldnames(data_list);
model_result=struct();
for i = 1:size(cell0,1)
    c=cell0(i);
    name=cell2mat(c);
    data=getfield(data_list,name);
    mesh=MeshJson(data);
    json0=mesh.getJson();
    model_result=setfield(model_result,name,json0);
end
str=savejson('',model_result);
file=fopen('manA20_save.json','w+');
fprintf(file,'%s',str);