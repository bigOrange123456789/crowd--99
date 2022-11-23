classdef Group < handle
    properties
        children
        path %json文件的存储路径
    end
    properties(Constant,Hidden)
      m34=[1 0 0 0;0 1 0 0;0 0 1 0]
    end
    methods
        function n=nv(this)
            n=0;
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                n=n+mesh.nv();
            end
        end

        function this = Group(pathJson)
            this.path=pathJson;
            data_list = loadjson(pathJson);
            cell0=fieldnames(data_list);
            this.children=struct();
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                disp(["init",name]);
                data=getfield(data_list,name);
                mesh=MeshJson(data);
                this.children=setfield(this.children,name,mesh);
            end
        end
        
        function rectifyindex(this)%删除那些没有被引用的顶点
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                mesh.rectifyindex();
            end
        end
        
        function simplify(this,percent)
            %% Start add waitbar
            hWaitbar = waitbar(0, 'simplify,wait...', 'CreateCancelBtn', 'delete(gcbf)');
            set(hWaitbar, 'Color', [0.9, 0.9, 0.9]);

            time0=(1-percent)*this.nv(); %需要进行坍塌的总次数
            for iii = 1:time0  %每次删除一个顶点(一条边/一个三角面)
                min_cost=999999999;
                min_name="";
                cell0=fieldnames(this.children);
                for i = 1:size(cell0,1)
                    name=cell2mat(cell0(i));
                    mesh=getfield(this.children,name);
                    if size(mesh.E,1)==0 %如果mesh对象中已经没有边了,就停止算法
                        continue;
                    end
                    cost0=mesh.myQEM.simplification_getCost();
                    if cost0<min_cost
                        min_name=name;
                        min_cost=cost0;
                    end
                end
                if min_name==""
                    break;    
                end
                mesh=getfield(this.children,min_name);
                mesh.myQEM.simplification_makeStep();

                compT = iii/time0;
                waitbar(compT, hWaitbar, ['simplify:', num2str(round(compT, 2) * 100), '%']);
            end
            close(hWaitbar)
            this.rectifyindex();%删除那些没有被引用的顶点
        end

        function simplify_old2(this,ratio)
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                disp(["simplify",name]);
                mesh=getfield(this.children,name);
                mesh_sim=mesh.myQEM.simplification(ratio);
                setfield(this.children,name,mesh_sim);
            end
        end

        function simplify_old(this,ratio)
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
