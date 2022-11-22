
addpath('src');
m1=Mesh("data/monkey");
m2=MeshJson("data/monkey");
m2.simplify(0.5);
m2.download();