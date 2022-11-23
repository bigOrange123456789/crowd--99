clc
addpath('src');
addpath('lib/jsonlab-master');

main(0.5,'manA20.json',"test2.json");

function avatarGroup=main(ratio,inPath,savePath)
    avatarGroup=Group(inPath);
    avatarGroup.simplify(ratio);
    avatarGroup.path=savePath;
    avatarGroup.download();
end
