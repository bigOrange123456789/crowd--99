classdef QEMJson < handle
    properties
        %mesh
        QVex %4*4*nv  顶点的矩阵
        QEdge%4*4*ne  边的矩阵
        cost % ne*3 
        v    %4*3*ne  顶点坐标
    end
    methods
        function o= QEMJson()
        end
        function mesh=simplification(o,mesh,percent )
            o.pretreatment(mesh);
            for iii = 1:(1-percent)*mesh.nv()           %每次删除一个顶点(一条边/一个三角面)
                [min_cost, vidx] = min(o.cost,[],2);    %返回包含每一行的最小值的列向量
                % min_cost:ne*1   vidx:ne*1
                
                [~, k] = min(min_cost); %获取代价最小的边序号
                mesh=o.deleteEdge(k,mesh, vidx); %删除边k
                
            end
            mesh.rectifyindex();%删除那些没有被引用的顶点
            
        end%simplification
        function pretreatment(o,mesh)
            N=mesh.NF;
            nv = mesh.nv(); 
            p=getPlane(mesh.V,mesh.F,N);
            function p=getPlane(V,F,N)%���е�ƽ�棬n*4
                %p = [N, -sum(N .* V(F(:,1),:), 2)];
                v0=V(F(:,1),:);
                d=sum(v0.*N,2);
                p=[N,-d];%ÿһ�ж�Ӧһ��ƽ��
            end
            
            %����������ľ���
            QFace = getQFace(p);%������4*4�ľ���sizeΪ4*4*n
            function QFace=getQFace(p)
                %bsxfun(@times, permute(p, [2,3,1]), permute(p, [3,2,1]))
                %p��ά���� n*4=n*4*1
                p1=permute(p, [2,3,1]);%4*1*n
                p2=permute(p, [3,2,1]);%1*4*n
                QFace=bsxfun(@times,p1,p2);%4*4*n
            end
            
            %1.���㶥��ľ���Q
            o.QVex=getQ(mesh.F,QFace,nv);%4*4*nv
            function Q=getQ(F,QFace,nv)
                Q = zeros(4,4,nv);%ÿ�����㶼��Ӧһ��4*4�ľ���
                nf = size(F,1);%���������
                for i = 1:nf%����������
                    for j = 1:3%����������Ķ���
                        v_indx=F(i,j);%��ȡ�������ϵĶ������
                        Q(:,:,v_indx) = Q(:,:,v_indx) + QFace(:,:,i);%����ľ��������������������ľ����
                    end
                end
            end
            
            %2.����ÿ���߾���
            %E=getE(mesh.F,mesh.V);%��ȡ���б�
            ne = size(mesh.E,1);
            o.QEdge = getQEdge(o.QVex,mesh.E);%�߾���ĺ��������������˵��۵����λ����ͬ����������еı߾���
            %QEdge:4*4*ne
            function QEdge=getQEdge(Q,E)% compute Q1+Q2 for each pair
                %QEdge = Q(:,:,E(:,1)) + Q(:,:,E(:,2))
                e1=E(:,1);% ne*2 -> ne*1
                e2=E(:,2);
                QEdge = Q(:,:,e1) + Q(:,:,e2);% Q:4*4*nv -> QEdge:4*4*ne
            end
            
            %3.����ÿ���ߵĴ���
            [o.cost,o.v]=getcost(o,mesh.V,mesh.E,ne,o.QEdge);
            %cost:ne*3 v:4*3*ne
            function [cost,v]=getcost(o,V,E,ne,QEdge)% a simple scheme: select either v1, v2 or (v1+v2)/2
                %v:4*3*ne (����+1)*��3���㣩*��������
                v=getv(V,E,ne);%4*3*ne
                function v=getv(V,E,ne)
                    v1 = getv_4(V,E,ne,1);%4*1*ne
                    v2 = getv_4(V,E,ne,2);
                    function v_4=getv_4(V,E,ne,col)
                        %v1 = permute([V(E(:,1),:),ones(ne,1)], [2,3,1]);%��ȡ�ߵ���һ���˵�λ��
                        %v2 = permute([V(E(:,2),:),ones(ne,1)], [2,3,1]);%��ȡ�ߵ���һ���˵�λ��
                        vertex_index=E(:,col);%�ߵĵ�һ������ ne*1
                        vertex_pos=V(vertex_index,:);% V:nv*3 -> vertex_pos:ne*3
                        v_4 = permute([vertex_pos,ones(ne,1)], [2,3,1]);%ne*4*1 ->4*1*ne %��ȡ�ߵ�һ���˵�λ��
                    end
                    vm = 0.5 .* (v1 + v2);%��ȡ�ߵ��е�λ��
                    v = [v1, v2, vm]; % 4*1*ne -> 4*3*ne
                end
                
                cost = zeros(ne,3);%���ڼ�¼ÿ���ߵĴ���
                cost(:,1)=o.get_costi(v(:,1,:),QEdge);% ne*1
                cost(:,2)=o.get_costi(v(:,2,:),QEdge);
                cost(:,3)=o.get_costi(v(:,3,:),QEdge);
                
                
                %{
                for i=1:ne
                    if i==1
                        %display(cost(i,1))
                    end
                    if V(E(i,1),1)>0 %���x>0 ���ۼ�100
                        cost(i,1)=cost(i,1)+100;
                        cost(i,2)=cost(i,2)+100;
                        cost(i,3)=cost(i,3)+100;
                    end
                end
                %}
                
            end
            
        end%pretreatment
        function mesh=deleteEdge(o,k,mesh, vidx)
            %k�Ǵ�ɾ���ıߵ����
            e = mesh.E(k,:);%��ȡ�߶�Ӧ����������
            
            % update position for v1
            mesh.V(e(1),:) = o.v(1:3, vidx(k), k)';%һ������̮����ָ��λ��
            mesh.V(e(2),:) = NaN;%ɾ����һ������
            
            % update Q for v1  %���´��۾�������Ĵ���֮���ƺ����¼�����
            o.QVex(:,:,e(1)) = o.QVex(:,:,e(1)) + o.QVex(:,:,e(2));%e(1)�Ĵ���Ϊ֮ǰ������Ĵ���֮��
            o.QVex(:,:,e(2)) = NaN;%e(2)�Ĵ���Ϊ��
            
            %����������
            mesh.F(mesh.F == e(2)) = e(1);%e1��e2���Ǿ�����ֵ %��������e2���������ڶ�ָ��e1
            f_remove = sum(diff(sort(mesh.F,2),[],2) == 0, 2) > 0;%�������������������ͬ�ĵ��Ӧ���Ƴ�
            mesh.F(f_remove,:) = [];%��Ҫ�Ƴ���ƽ����Ϊ��
            
            %ɾ��ȥ���ıߺ���ñ���ص���Ϣ collapse and delete edge and related edge information
            mesh.E(mesh.E == e(2)) = e(1);%����e2���������ڶ�ָ��e1
            mesh.E(k,:) = [];%k�Ǵ�����С�ı���ţ���Ϊ��
            o.cost(k,:) = [];%�޸ıߵĴ�����Ϣ
            o.QEdge(:,:,k) = [];%ɾ���߶�Ӧ�ľ���
            o.v(:,:,k) = [];%v��ÿ�ж�Ӧһ����
            
            %ɾ���ظ��ıߺ���ñ���ص���Ϣ delete duplicate edge and related edge information
            [mesh.E,ia] = unique(sort(mesh.E,2), 'rows'); %E:ne*2 ��ȡ��һ���У��ߣ�
            o.cost = o.cost(ia,:);
            o.QEdge = o.QEdge(:,:,ia);%QEdge:4*4*ne
            o.v = o.v(:,:,ia);
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
            % pairs involving v1
            pair = sum(mesh.E == e(1), 2) > 0;%��e1��صıߵ����
            npair = sum(pair);%��e1��صıߵĸ���
            
            
            % updata edge information
            o.QEdge(:,:,pair) = o.QVex(:,:,mesh.E(pair,1)) + o.QVex(:,:,mesh.E(pair,2));
            %QEdge:4*4*ne  pair:n*1
            
            
            pair_v1 = permute([mesh.V(mesh.E(pair,1),:),ones(npair,1)], [2,3,1]);
            pair_v2 = permute([mesh.V(mesh.E(pair,2),:),ones(npair,1)], [2,3,1]);
            %pair_v2:3*1*n       V(E(pair,2),:))--n*3
            %pair_v2:3*1*1       V(E(pair,2),:))--1*3
            pair_vm = 0.5 .* (pair_v1 + pair_v2);
            o.v(:,:,pair) = [pair_v1, pair_v2, pair_vm];
            
            
            %����������e1��صıߵĴ���
            o.cost(pair,1) =o.get_costi(pair_v1,o.QEdge(:,:,pair));
            o.cost(pair,2) =o.get_costi(pair_v2,o.QEdge(:,:,pair));
            o.cost(pair,3) =o.get_costi(pair_vm,o.QEdge(:,:,pair));
            % cost(pair,1) =sum(squeeze(sum(bsxfun(@times,pair_v1,QEdge(:,:,pair)),1)).*squeeze(pair_v1),1)';
        end%deleteEdge
    end% methods
    methods(Static)
        function costi=get_costi(vi,QEdge)
            costi=QEM.get_costi0(vi,QEdge);
        end
        function costi=get_costi1(vi,QEdge)
            %����  vi:4*1*ne    QEdge:4*4*ne
            %���  costi��ne*1
            %ͳһʹ�ñ߾��󣿣��о����Ǻܺ���
            bsx=bsxfun(@times,QEdge,vi); %{QEdge:4*4*ne   vi:4*1*ne } -> 4*4*ne
            
            s=sum(bsx,1);               % 4*4*ne -> 1*4*ne
            s=permute(s, [2,1,3]);%!!!!!!!!!!!!!!!!!�����BUG
            costi=sum(squeeze(s).*squeeze(vi),1)';
            %           s:1*4*ne  vi:4*1*ne
            % ne*1 = {  1*4*ne ,  4*1*ne  }'
            %����z>=0�ĵ�ɾ�����ۼӴ�
            
            for i=1:size(vi,3) %  vi:4*1*ne
                if vi(3,1,i)>=0  %z>=-1
                    costi(i)=costi(i)*10000000;%��ǰ��
                elseif vi(3,1,i)>=-1  %z>=0
                    costi(i)=costi(i)*1000;%�м�
                end
            end
        end
        function costi=get_costi0(vi,QEdge)
            %����  vi:4*1*ne    QEdge:4*4*ne
            %���  costi��ne*1
            %ͳһʹ�ñ߾��󣿣��о����Ǻܺ���
            bsx=bsxfun(@times,QEdge,vi); %{QEdge:4*4*ne   vi:4*1*ne } -> 4*4*ne
            
            s=sum(bsx,1);               % 4*4*ne -> 1*4*ne
            s=permute(s, [2,1,3]);%!!!!!!!!!!!!!!!!!�����BUG
            costi=sum(squeeze(s).*squeeze(vi),1)';
            %           s:1*4*ne  vi:4*1*ne
            % ne*1 = {  1*4*ne ,  4*1*ne  }'
        end
    end%methods(Static)
end%class

