class modelMessage {
    constructor(pathModel, pathAnima, pathLodGeo, lod_visible, useColorTag, animtionNum, walkAnimationList, modelCount) {
        this.pathModel = pathModel;
        this.pathAnima = pathAnima;
        this.pathLodGeo = pathLodGeo;
        this.lod_visible = lod_visible;
        this.useColorTag = useColorTag;
        this.animtionNum = animtionNum;
        this.walkAnimationList = walkAnimationList;
        this.ModelCount = modelCount;
        this.PosRotCount = 0;
        this.posRotList = [];
    }

    setPosRotList(PosRot) {
        if (this.PosRotCount < this.ModelCount) {
            this.posRotList.push(PosRot);
            this.PosRotCount += 1;
            return true;
        }
        else return false;
    }
}

export class modelManager {
    constructor() {
        this.modelList = [];
        this.modelIndex = 0;
        this.sumModelCount = 0;
        this.row_index = 0; //在梯形看台中计算当前人物所在看台行数(貌似含义和小看台中正好相反)
        this.sum_count = 0; //当前row_index前面行的人数总和
        this.row_count = 0; //当前行的可放置人数
        this.init();
        this.getPosRot();
    }

    addModel(pathModel, pathAnima, pathLodGeo, lod_visible, useColorTag, animtionNum, walkAnimationList, modelCount) {
        var modelmessage = new modelMessage(pathModel, pathAnima, pathLodGeo, lod_visible, useColorTag, animtionNum, walkAnimationList, modelCount);
        this.modelList.push(modelmessage);
        this.modelIndex += 1;
        this.sumModelCount+=modelCount;
    }

    init() {
        let lod_visible = [
            ["CloM_A_Eye_lash_geo", -1],
            ["CloM_A_Eyeshell_geo", 1],
            ["CloM_A_EyeLeft_geo", 10],
            ["CloM_A_EyeRight_geo", 10],
            ["CloM_A_Saliva_geo", -1],
            ["CloM_A_Teeth_geo", -1],
            ['CloM_A_Hair_geo', 19],
            ['CloM_A_EyeEdge_geo', 5],
            ['GW_man_Body_geo1', 19],
            ['GW_man_Nail_geo', -1],
            ['CloM_A_lingdai_geo', 10],
            ['CloM_A_Wazi_geo', 1],
            ['CloM_A_Xiezi_geo', 18],
            ['CloM_A_chengyi_geo', 19],
            ['CloM_A_xiuzi_geo', -1],
            ['CloM_A_kuzi_geo', 21],
            ["CloM_A_head_geo", 21],
        ]
        let useColorTag = [
            "CloM_A_lingdai_geo",
            "CloM_A_kuzi_geo",
            "CloM_A_waitao_geo",
            "CloM_A_Xiezi_geo",
            "CloM_A_Hair_geo"
        ]
        let walkAnimationList = [11,20]
        this.addModel("assets/man_A_4.glb", "assets/animation_man_A.bin", "assets/man_ALOD/", lod_visible,useColorTag,28,walkAnimationList,100000);
    }

    getPosRot0(i0) {
        var c=[//分组情况
            1250,//496,   //运动
            15*182,     //大看台1
            21*182,     //大看台2
            20*60,   //小看台1
            17*60,   //小看台2
            300,        //弧形看台1 （从小看台到大看台旁边的顺序排列）
            240,         //弧形看台2 
            192,         //弧形看台3
            152,    //弧形看台6
            217,    //弧形看台5
        ]
        if(i0<c[0]){
            var col_count=25
            var row_count=50
            var i=i0%col_count
            var j=Math.floor(i0/col_count)
            var position=[
                2*(1.8*i+1.5*Math.random()-col_count/2-20+11),
                0,
                2*(1.8*j+1.5*Math.random()-row_count/2-25+5),
            ]
            var rotation=[0,Math.PI*2*Math.random(),0]
        }
        else if(i0<c[0]+c[1]){//大看台1
            i0-=c[0]
            var row_count=182
            var row=i0%row_count
            var col=Math.floor(i0/row_count)+1
            var position=[
                1.5*-31-1.5*(col)*1.9,
                1.3*col,//
                0.82*row-75,
            ]
            var rotation=[0,-Math.PI*0.5+Math.PI,0]
        }
        else if(i0<c[0]+c[1]+c[2]){//大看台2
            i0-=(c[0]+c[1])
            var row_count=182
            var row=i0%row_count
            var col=Math.floor(i0/row_count)+1
            var position=[
                1.5*31+1.5*col*1.9,
                1.3*col,
                0.82*row-75,
            ]
            var rotation=[0,Math.PI*0.5+Math.PI,0]
        }
        else if(i0<c[0]+c[1]+c[2]+c[3]){//小看台1
            i0-=(c[0]+c[1]+c[2])
            var row_count=60
            var row=i0%row_count
            var col=Math.floor(i0/row_count)
            if(col>12)col+=4
            var position=[
                1.*row-30,//1.5*(row*0.25-50)*2.01+73,
                1.28*col,
                -99-1.5*col*1.9,
            ]
            var rotation=[0,-Math.PI+Math.PI,0]
        }else if(i0<c[0]+c[1]+c[2]+c[3]+c[4]){//小看台2
            i0-=(c[0]+c[1]+c[2]+c[3])
            var row_count=60
            var row=i0%row_count
            var col=Math.floor(i0/row_count)
            if(col>0)col+=3
            if(col>12)col+=4
            var position=[
                1.*row-30,//1.5*(row*0.25-50)*2.01+73,
                1.28*col,
                99+1.5*col*1.9
            ]
            var rotation=[0,0+Math.PI,0]
            // var position=[-1000,-1000,-1000]
        }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]) {//弧形看台1 （从小看台到大看台旁边的顺序排列）
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4])
            if (i0<2) this.row_index = 0; // 重置行数
            var col_index=i0 - Math.floor((0+this.row_index)*(this.row_index+1)/2);
            if (col_index > this.row_index) {
                this.row_index++;
                col_index-=this.row_index;
            }
            var position=[
                1.*col_index+30,
                1.28*this.row_index+1.28,
                99+1.5*this.row_index*1.9-col_index*0.25
            ]
            var rotation=[0,0,0] // 还需调整方向，目前尚未调整
        }else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]) { //弧形看台2
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]);
            if (i0<2) {
                this.row_index = 0; // 重置行数
                this.sum_count = 0;
                this.row_count = 3;
            }
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%3 === 0) this.row_count+=2;
            }
            var position=[
                1.*col_index+31+this.row_index,
                1.28*this.row_index,
                98+1.5*this.row_index*1.75-col_index*0.6
            ]
            var rotation = [0,0,0]
        } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]) {
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]);
            if (i0<2) {
                this.row_index = 0; // 重置行数
                this.sum_count = 0;
                this.row_count = 3;
            } 
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%4 === 0) this.row_count+=2;
            }
            // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
            var position=[
                1.*col_index+34.5+this.row_index*1.8,
                1.28*this.row_index,
                95+1.5*this.row_index*1.45-col_index
            ]
            var rotation = [0,Math.PI*1.25,0]
        } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]+c[8]) { //弧形看台6
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7])
            if (i0<1) {
                this.row_index = 8; // 重置行数
                this.sum_count = 0;
                this.row_count = 8;
            } 
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                if (this.row_index%4 === 0) this.row_count+=1;
            }
            // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
            var position=[
                1.5*31+1.5*this.row_index*1.9,
                1.28*this.row_index,
                0.82*col_index+75,
            ]
            var rotation = [0,Math.PI*0.5+Math.PI,0]
        } else if (i0<c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]+c[8]+c[9]) { //弧形看台5
            i0-=(c[0]+c[1]+c[2]+c[3]+c[4]+c[5]+c[6]+c[7]+c[8])
            if (i0<1) {
                this.row_index = 8; // 重置行数
                this.sum_count = 0;
                this.row_count = 9;
            } 
            var col_index = i0 - this.sum_count;
            if (col_index > this.row_count) {
                this.row_index++;
                col_index-=this.row_count;
                this.sum_count += this.row_count;
                this.row_count+=1;
            }
            // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
            var position=[
                1.5*30+1.5*this.row_index*1.9-0.3*col_index,
                1.28*this.row_index,
                0.82*col_index+79+this.row_count*0.5,
            ]
            var rotation = [0,Math.PI*0.5+Math.PI,0]
        }
        else {
            var position=[
                0,0,0
            ]
            var rotation = [0,0,0]
        }
        return {pos:position,rot:rotation} 
    }
    getPosRot1(i0){
        var PosRot=this.getPosRot0(parseInt(i0/9))
        var j0=i0%9;
        let k=0.5;
        PosRot.pos[0]+=(k*parseInt(j0/3))
        PosRot.pos[2]+=(k*(j0%3))
        return PosRot
    }

    getPosRot() {
        for (let i=0;i<this.sumModelCount;i++) {
            let modelType = Math.floor(this.modelIndex*Math.random());
            let PosRot = this.getPosRot1(i);
            while (!this.modelList[modelType].setPosRotList(PosRot)) {
                modelType = Math.floor(this.modelIndex*Math.random());
            };
        }
    }
}
