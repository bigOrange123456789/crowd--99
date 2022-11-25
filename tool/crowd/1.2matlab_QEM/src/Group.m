classdef Group < handle
    properties
        children
        path %json文件的存储路径
        listSim %模型简化过程中顶点的处理次序
        names
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
            this.names="";
            data_list = loadjson(pathJson);
            cell0=fieldnames(data_list);
            meshId=1;
            this.children=struct();
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                disp(["init",name]);
                data=getfield(data_list,name);
                mesh=MeshJson(data);
                mesh.meshId=meshId;
                %mesh.check();
                meshId=meshId+1;
                this.children=setfield(this.children,name,mesh);
                %this.names(size(this.names,1)+1)='aa';
                %this.names(size(this.names,1)+1)='CloM_A_Eye_lash_geo';
                %this.names(size(this.names,1)+1)=name;
                this.names=strcat(this.names,"^",name);
            end
            this.listSim=[];
        end
        
        function rectifyindex(this)%删除那些没有被引用的顶点
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                mesh.rectifyindex();
            end
        end
        function rectifyindex2(this)%删除那些没有被引用的顶点
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                mesh.rectifyindex2();
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

        function simplify_save(this,percent,number)
            step=round( (1-percent)/(number-1)*this.nv() );
            
            %% Start add waitbar
            hWaitbar = waitbar(0, 'simplify,wait...', 'CreateCancelBtn', 'delete(gcbf)');
            set(hWaitbar, 'Color', [0.9, 0.9, 0.9]);

            time0=step*(number-1); %需要进行坍塌的总次数
            for iii = 1:time0   %每次删除一个顶点(一条边/一个三角面)
                min_cost=Inf;   %正无穷
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
                
                if min_name~=""
                    mesh=getfield(this.children,min_name);
                    mesh.myQEM.simplification_makeStep(); 
                    this.listSim(size(this.listSim,1)+1)=mesh.meshId;
                    
                    %{
                    disp("i")
                    disp(i)
                    disp("v")
                    disp(mesh.V)
                    disp("f")
                    disp(mesh.F)
                    disp("e")
                    disp(mesh.E)
                    %}

                else
                    disp("压缩比太高,对象为空!");
                    break; 
                end
                
                compT = iii/time0;
                waitbar(compT, hWaitbar, ['simplify:', num2str(round(compT, 2) * 100), '%']);
                if mod(iii,step)==0
                    this.path=strcat('data2/',string(number-iii/step),'.json');
                    disp([this.path,num2str(round(compT, 2) * 100), '%']);
                    this.download2();
                end
                
            end
            close(hWaitbar);
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
        function download2(this)
            disp(strcat("start download:",this.path));
            
            this.rectifyindex2();%现在还不确定在中间是否能够去冗余
            model_result=struct();
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                json0=mesh.getJson2();
                model_result=setfield(model_result,name,json0);
            end
            str=savejson('',model_result);
            file=fopen(this.path,'w+');
            fprintf(file,'%s',str);
            fclose(file);

            disp(strcat("start download:",this.path,".pack.json"));

            model_result=struct();
            cell0=fieldnames(this.children);
            for i = 1:size(cell0,1)
                name=cell2mat(cell0(i));
                mesh=getfield(this.children,name);
                json0=mesh.recordOutput();  %mesh.record似乎为空
                model_result=setfield(model_result,name,json0);
            end
            model_result=setfield(model_result,"listSim",this.listSim);
            model_result=setfield(model_result,"names",this.names);
            str=savejson('',model_result);
            file=fopen(strcat(this.path,".pack.json"),'w+');
            fprintf(file,'%s',str);
            fclose(file);

            disp("end download");
        end
        

    end%methods
    methods(Hidden)
        function process(this)
        end
    end%methods(Hidden)
    methods(Static)
        function process_save(inPath,percent,pack_number)
            avatarGroup=Group(inPath);
            %avatarGroup.children.mesh0.download();
            avatarGroup.simplify_save(percent,pack_number);
        end
    end%methods(Static)
    methods(Static,Hidden)
        function test()
        end
    end%methods(Static)
end%class
