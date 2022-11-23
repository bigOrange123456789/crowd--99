clc
addpath('src');
addpath('lib/jsonlab-master');

main(0.1,"test2.json");

%{
number=20;
min=0.01;
step=(1-min)/(number-1);
for i =1:19
    ratio=min+(i-1)*step;    %压缩比
    disp([i,"ratio",ratio])
    savePath=strcat('data/',string(i),'.json'); 
    main(ratio,savePath);
end
%}

function avatarGroup=main(ratio,savePath)
    avatarGroup=Group('manA20.json');
    avatarGroup.path="test_.json";
    avatarGroup.download();
end
