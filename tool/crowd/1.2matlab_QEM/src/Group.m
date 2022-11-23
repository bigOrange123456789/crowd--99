classdef Group < handle
    properties
        children
        path %json文件的存储路径
    end
    properties(Constant,Hidden)
      m34=[1 0 0 0;0 1 0 0;0 0 1 0]
    end
    methods
        function this = Group(pathJson)
            this.path=pathJson
            data_list = loadjson(pathJson);
            cell0=fieldnames(data_list);
            this.children=struct();
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                data=getfield(data_list,name);
                mesh=MeshJson(data);
                this.children=setfield(this.children,name,mesh);
            end
        end
        
        function simplify(this,ratio)
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                mesh.simplify(ratio);
            end
        end

        function download(this)
            model_result=struct();
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);

                json0=mesh.getJson();
                model_result=setfield(model_result,name,json0);
            end
            str=savejson('',model_result);
            file=fopen(this.path,'w+');
            fprintf(file,'%s',str);
            fclose(file);
        end

    end%methods
    methods(Hidden)
        function process(this)
        end
    end%methods(Hidden)
    methods(Static)
        function getAffineMatrix(url1,url2)
        end
    end%methods(Static)
    methods(Static,Hidden)
        function test()
        end
    end%methods(Static)
end%class
