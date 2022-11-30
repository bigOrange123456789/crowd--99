class modelMessage {
    constructor(pathModel, pathAnima, pathLodGeo, lod_visible, useColorTag, animtionNum, walkAnimationList, sitAnimationList, standAnimationList, modelCount) {
        this.pathModel = pathModel;
        this.pathAnima = pathAnima;
        this.pathLodGeo = pathLodGeo;
        this.lod_visible = lod_visible;
        this.useColorTag = useColorTag;
        this.animtionNum = animtionNum;
        this.walkAnimationList = walkAnimationList;
        this.sitAnimationList = sitAnimationList;
        this.standAnimationList = standAnimationList;
        this.ModelCount = modelCount;

        this.PosRotCount = 0;
        this.posRotList = [];
        this.animtionTypes = [];
        //modelIndex//

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
        //this.getPosRot();
    }

    addModel(opt) {
        console.log("opt", opt)
        var modelmessage = new modelMessage(
            opt.pathModel,
            opt.pathAnima,
            opt.pathLodGeo,
            opt.lod_visible,
            opt.useColorTag,
            opt.animtionNum,
            opt.walkAnimationList,
            opt.sitAnimationList,
            opt.standAnimationList,
            opt.modelCount);
        this.modelList.push(modelmessage);
        this.modelIndex += 1;
        this.sumModelCount += opt.modelCount;
    }

    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        console.log(window.location)
        let url = window.location.href.split('?')[1].match(reg);
        // console.log(url)
        if (url != null) {
            let id = decodeURI(url[2])
            window.id = id
            return id//decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码。
        } else {
            return "all"
        }
    }
    init() {

        let index = this.getQueryString("id")
        // let arr=[this.init0(),this.init1(),this.init2(),this.init3(),this.init4(),this.init5(),this.init6(),this.init7(),this.init8()]
        let arr = [
            this.init0(),
            this.init3(),
            this.init4(),
            this.init5(),
            //this.init6(),this.init7(),this.init8() //注意修改此处同时要修改本文件652行（有关坐着动画的y坐标调整）
        ]
        // let arr=[this.init0(),this.init1(),this.init2()]
        // let arr=[this.init2()]//,this.init1()]
        for (let i = 0; i < arr.length; i++) {
            // arr[i].index=i;
            arr[i].modelCount = Math.floor(9 * (11123) / arr.length)
        }
        // console.log("typeof(index)",typeof(index))
        if (index == "all") {
            // console.log("arr",arr)
            for (let i = 0; i < arr.length; i++) {
                // console.log("arr[i]",arr[i],i)
                this.addModel(arr[i])
            }
        } else {
            index = parseInt(index)
            // console.log("index-1",index-1)
            // console.log(arr)
            this.addModel(arr[index])
        }
    }
    init0() {
        return {
            lod_visible: [
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

                // ['CloM_A_waitao_geo',   10],
                ['CloM_A_kuzi_geo', 21],
                ["CloM_A_head_geo", 21],
            ],
            useColorTag: [
                "CloM_A_lingdai_geo",
                "CloM_A_kuzi_geo",
                "CloM_A_waitao_geo",
                "CloM_A_Xiezi_geo",
                "CloM_A_Hair_geo"
            ],
            walkAnimationList: [11],
            sitAnimationList: [14, 15, 16, 17, 18, 19],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/man_A_4.glb",
            pathAnima: "assets/animation_man_B.bin",
            pathLodGeo: "assets/man_ALOD/",
            animtionNum: 28,
            modelCount: Math.floor(9 * (11123))//20000
        }
    }
    init1() {
        return {
            lod_visible: [
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
            ],
            useColorTag: [
                "CloM_A_lingdai_geo",
                "CloM_A_kuzi_geo",
                "CloM_A_waitao_geo",
                "CloM_A_Xiezi_geo",
                "CloM_A_Hair_geo"
            ],
            walkAnimationList: [11],
            sitAnimationList: [14, 15, 16, 17, 18, 19],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/man_A_4.glb",
            pathAnima: "assets/animation_man_B.bin",
            pathLodGeo: "assets/man_ALOD/",
            animtionNum: 28,
            modelCount: 20000
        }
    }
    init2() {
        return {
            lod_visible: [
                ["CloM_B_body_geo2", 19],
                ["CloM_B_chenshan_geo1", 19],
                ["CloM_B_kuzi_geo", 19],
                ["CloM_B_lianzi_geo", 10],
                ["CloM_B_Nail_geo", -1],
                ["CloM_B_waitao_geo2", 19],
                ["CloM_B_xianglian_geo", 10],
                ["CloM_B_xie_geo", 19],
                ["CloM_C_Eye_lash_geo", -1],
                ["CloM_C_Eyebrow_geo", -1],
                ["CloM_C_EyeLeft_geo", 10],
                ["CloM_C_EyeRight_geo", 10],
                ["CloM_C_head_geo", 19],
                ["CloM_C_Saliva_geo", -1],
                ["CloM_C_Teeth_geo", -1],
                ["CloM_E_hair_geo", 19],
                ["CloM_E_shorthair_geo", 19],
            ],
            useColorTag: [
                "CloM_B_chenshan_geo1",
                "CloM_B_kuzi_geo",
                "CloM_B_waitao_geo2",
            ],
            walkAnimationList: [11],
            sitAnimationList: [14, 15, 16, 17, 18, 19],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/man_B.glb",
            pathAnima: "assets/animation_man_B.bin",
            pathLodGeo: "assets/man_BLOD/",
            animtionNum: 28,
            modelCount: 20000
        }
    }
    init3() {
        return {
            lod_visible: [
                ["CloW_A_body_geo1", 19],
                ["CloW_A_chenshanxie_geo2", 19],
                ["CloW_A_eyelash_geo", -1],
                ["CloW_A_eyeLeft_geo", 10],
                ["CloW_A_eyeRight_geo", 10],
                ["CloW_A_hair_geo", 19],
                ["CloW_A_kuzi_geo", 20],
                ["CloW_A_Nail_geo", -1],
                ["CloW_A_saliva_geo", -1],
                ["CloW_A_teeth_geo", -1],
                ["CloW_A_xifu_geo", 22],
                ["head", 20],
            ],
            useColorTag: [
                "CloW_A_chenshanxie_geo2",
                "CloW_A_kuzi_geo",
                "CloW_A_xifu_geo",
            ],
            walkAnimationList: [9, 18],
            sitAnimationList: [12, 13, 14, 15, 16, 17],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/woman_A.gltf",
            pathAnima: "assets/animation_woman_A.bin",
            pathLodGeo: "assets/woman_ALOD/",
            animtionNum: 28,
            modelCount: 10000

        }
    }
    init4() {
        return {
            lod_visible: [
                ["body1", 20],
                ["CloW_B_meimao_geo", 10],
                ["CloW_B_eyelash_geo", -1],
                ["CloW_B_eyeLeft_geo", 10],
                ["CloW_B_eyeRight_geo", 10],
                ["hair", 19],
                ["kouzi_geo", 10],
                ["Nail_geo", -1],
                ["CloW_B_saliva_geo", -1],
                ["CloW_B_teeth_geo", -1],
                ["qipao_geo", 15],
                ["waitao_geo", 22],
                ["xiezi_geo", 10],
                ["CloW_B_head_geo", 18],
            ],
            useColorTag: [
                "qipao_geo",
                "waitao_geo",
                "xiezi_geo",
            ],
            walkAnimationList: [9, 19],
            sitAnimationList: [13, 14, 15, 16, 17, 18],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/woman_B.gltf",
            pathAnima: "assets/animation_woman_B.bin",
            pathLodGeo: "assets/woman_BLOD/",
            animtionNum: 28,
            modelCount: 10000

        }
    }
    init5() {
        return {
            lod_visible: [
                ["body1", 20],
                ["CloW_B_eyeRight_geo", 10],
                ["CloW_C_eyelash_geo", -1],
                ["CloW_C_eyeLeft_geo", 10],
                ["CloW_C_hair_geo", 21],
                ["CloW_C_head_geo", 19],
                ["CloW_C_meimao_geo", 10],
                ["CloW_C_saliva_geo", -1],
                ["CloW_C_shangyi_geo", 22],
                ["CloW_C_teeth_geo", -1],
                ["CloW_C_xiashen_geo", 19],
                ["Nail_geo", -1],
            ],
            useColorTag: [
                "CloW_C_shangyi_geo",
                "CloW_C_xiashen_geo",
            ],
            walkAnimationList: [9, 18],
            sitAnimationList: [12, 13, 14, 15, 16, 17],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 19, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/woman_C.glb",
            pathAnima: "assets/animation_woman_C.bin",
            pathLodGeo: "assets/woman_CLOD/",
            animtionNum: 28,
            modelCount: 10000
        }
    }
    init6() {
        return {
            lod_visible: [
                ["CloW_A_eyelash_geo", -1],
                ["CloW_A_eyeLeft_geo", 10],
                ["CloW_A_eyeRight_geo", 10],
                ["CloW_A_teeth_geo", -1],
                ["CloW_D_Body_geo1", 19],
                ["CloW_D_Hair_geo", 19],
                ["CloW_D_Nail_geo1", -1],
                ["CloW_D_QunZi_geo", 19],
                ["CloW_D_ShangYi_geo_1", 19],
                ["CloW_D_ShangYi_geo_2", 19],
                ["CloW_D_XieZi_geo", 19],
                ["head", 19],
            ],
            useColorTag: [
                "CloW_D_QunZi_geo",
                "CloW_D_ShangYi_geo_1",
                "CloW_D_ShangYi_geo_2",
                "CloW_D_XieZi_geo",
            ],
            walkAnimationList: [9, 18],
            sitAnimationList: [12, 13, 14, 15, 16, 17],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/woman_D.glb",
            pathAnima: "assets/animation_woman_A.bin",
            pathLodGeo: "assets/woman_DLOD/",
            animtionNum: 28,
            modelCount: 10000
        }

    }
    init7() {
        return {
            lod_visible: [
                ["CloW_E_Body_geo1", 19],
                ["CloW_E_erhuan_geo", 10],
                ["CloW_E_eyelash_geo", -1],
                ["CloW_E_eyeLeft_geo", 10],
                ["CloW_E_eyeRight_geo", 10],
                ["CloW_E_hair_geo", 19],
                ["CloW_E_head_geo", 19],
                ["CloW_E_kuzi_geo", 19],
                ["CloW_E_meimao_geo", 10],
                ["CloW_E_Nail_geo", -1],
                ["CloW_E_saliva_geo", -1],
                ["CloW_E_shangyi_geo", 19],
                ["CloW_E_teeth_geo", -1],
                ["CloW_E_xiezi_geo", 19],
            ],
            useColorTag: [
                "CloW_E_kuzi_geo",
                "CloW_E_shangyi_geo",
                "CloW_E_xiezi_geo",
            ],
            walkAnimationList: [9, 18],
            sitAnimationList: [12, 13, 14, 15, 16, 17],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/woman_E.glb",
            pathAnima: "assets/animation_woman_A.bin",
            pathLodGeo: "assets/woman_ELOD/",
            animtionNum: 28,
            modelCount: 10000
        }
    }
    init8() {
        return {
            lod_visible: [
                ["CloW_B_eyelash_geo", -1],
                ["CloW_B_eyeLeft_geo", 10],
                ["CloW_B_eyeRight_geo", 10],
                ["CloW_B_head_geo", 19],
                ["CloW_B_meimao_geo", 10],
                ["CloW_B_saliva_geo", -1],
                ["CloW_B_teeth_geo", -1],
                ["CloW_F_body_geo1", 19],
                ["CloW_F_hair_geo", 19],
                ["CloW_F_kuzi_geo1", 19],
                ["CloW_F_Nail_geo", -1],
                ["CloW_F_wazi_geo", 10],
                ["CloW_F_weiyi_geo", 19],
                ["CloW_F_xiezi_geo", 19],
            ],
            useColorTag: [
                "CloW_F_kuzi_geo1",
                "CloW_F_weiyi_geo",
                "CloW_F_xiezi_geo",
            ],
            walkAnimationList: [9, 18],
            sitAnimationList: [12, 13, 14, 15, 16, 17],
            standAnimationList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27],

            pathModel: "assets/woman_F.glb",
            pathAnima: "assets/animation_woman_A.bin",
            pathLodGeo: "assets/woman_FLOD/",
            animtionNum: 28,
            modelCount: 10000
        }
    }

    getPosRot_e(i0, modelType) {
        var c = [//分组情况
            1250,//496,   //运动
            15 * 182,     //大看台1
            21 * 182,     //大看台2
            20 * 60,   //小看台1
            17 * 60,   //小看台2
            300,        //弧形看台1 （从小看台到大看台旁边的顺序排列）
            240,         //弧形看台2 
            192,         //弧形看台3
            152,    //弧形看台6
            217,    //弧形看台5
        ]
        if (i0 < c[0]) { //运动的
            var col_count = 90
            var row_count = 40
            var i = i0 % col_count
            var j = Math.floor(i0 / col_count)
            var position = [
                2 * j - 40,
                0,
                0,
            ]
            var rotation = [0, 0, 0]
            let animationTypeIndex = Math.floor(Math.random() * this.modelList[modelType].walkAnimationList.length);
            var animationType = this.modelList[modelType].walkAnimationList[animationTypeIndex];
            var speed = 5;
            var startTime = Math.floor((20 * i) / speed);
            //this.modelList[modelType].animtionTypes.push(this.modelList[modelType].walkAnimationList[animationTypeIndex]);
        }
        else {
            let animationTypeIndex = Math.floor(Math.random() * this.modelList[modelType].standAnimationList.length);
            var animationType = this.modelList[modelType].standAnimationList[animationTypeIndex];
            var speed = Math.random() * 7 + 4;
            var startTime = 1000 * Math.random();
            //this.modelList[modelType].animtionTypes.push(this.modelList[modelType].standAnimationList[animationTypeIndex]);

            if (i0 < c[0] + c[1]) {//大看台1
                i0 -= c[0]
                var row_count = 182
                var row = i0 % row_count
                var col = Math.floor(i0 / row_count) + 1
                var position = [
                    1.5 * -31 - 1.5 * (col) * 1.9,
                    1.3 * col,//
                    0.82 * row - 75,
                ]
                var rotation = [0, -Math.PI * 0.5 + Math.PI, 0]
            }
            else if (i0 < c[0] + c[1] + c[2]) {//大看台2
                i0 -= (c[0] + c[1])
                var row_count = 182
                var row = i0 % row_count
                var col = Math.floor(i0 / row_count) + 1
                var position = [
                    1.5 * 31 + 1.5 * col * 1.9,
                    1.3 * col,
                    0.82 * row - 75,
                ]
                var rotation = [0, Math.PI * 0.5 + Math.PI, 0]
            }
            else if (i0 < c[0] + c[1] + c[2] + c[3]) {//小看台1
                i0 -= (c[0] + c[1] + c[2])
                var row_count = 60
                var row = i0 % row_count
                var col = Math.floor(i0 / row_count)
                if (col > 12) col += 4
                var position = [
                    1. * row - 30,//1.5*(row*0.25-50)*2.01+73,
                    1.28 * col,
                    -99 - 1.5 * col * 1.9,
                ]
                var rotation = [0, -Math.PI + Math.PI, 0]
            } else if (i0 < c[0] + c[1] + c[2] + c[3] + c[4]) {//小看台2
                i0 -= (c[0] + c[1] + c[2] + c[3])
                var row_count = 60
                var row = i0 % row_count
                var col = Math.floor(i0 / row_count)
                if (col > 0) col += 3
                if (col > 12) col += 4
                var position = [
                    1. * row - 30,//1.5*(row*0.25-50)*2.01+73,
                    1.28 * col,
                    99 + 1.5 * col * 1.9
                ]
                var rotation = [0, 0 + Math.PI, 0]
                // var position=[-1000,-1000,-1000]
            } else if (i0 < c[0] + c[1] + c[2] + c[3] + c[4] + c[5]) {//弧形看台1 （从小看台到大看台旁边的顺序排列）
                i0 -= (c[0] + c[1] + c[2] + c[3] + c[4])
                if (i0 < 2) this.row_index = 0; // 重置行数
                var col_index = i0 - Math.floor((0 + this.row_index) * (this.row_index + 1) / 2);
                if (col_index > this.row_index) {
                    this.row_index++;
                    col_index -= this.row_index;
                }
                var position = [
                    1. * col_index + 30,
                    1.28 * this.row_index + 1.28,
                    99 + 1.5 * this.row_index * 1.9 - col_index * 0.25
                ]
                var rotation = [0, 0, 0] // 还需调整方向，目前尚未调整
            } else if (i0 < c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6]) { //弧形看台2
                i0 -= (c[0] + c[1] + c[2] + c[3] + c[4] + c[5]);
                if (i0 < 2) {
                    this.row_index = 0; // 重置行数
                    this.sum_count = 0;
                    this.row_count = 3;
                }
                var col_index = i0 - this.sum_count;
                if (col_index > this.row_count) {
                    this.row_index++;
                    col_index -= this.row_count;
                    this.sum_count += this.row_count;
                    if (this.row_index % 3 === 0) this.row_count += 2;
                }
                var position = [
                    1. * col_index + 31 + this.row_index,
                    1.28 * this.row_index,
                    98 + 1.5 * this.row_index * 1.75 - col_index * 0.6
                ]
                var rotation = [0, 0, 0]
            } else if (i0 < c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6] + c[7]) {
                i0 -= (c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6]);
                if (i0 < 2) {
                    this.row_index = 0; // 重置行数
                    this.sum_count = 0;
                    this.row_count = 3;
                }
                var col_index = i0 - this.sum_count;
                if (col_index > this.row_count) {
                    this.row_index++;
                    col_index -= this.row_count;
                    this.sum_count += this.row_count;
                    if (this.row_index % 4 === 0) this.row_count += 2;
                }
                // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
                var position = [
                    1. * col_index + 34.5 + this.row_index * 1.8,
                    1.28 * this.row_index,
                    95 + 1.5 * this.row_index * 1.45 - col_index
                ]
                var rotation = [0, Math.PI * 1.25, 0]
            } else if (i0 < c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6] + c[7] + c[8]) { //弧形看台6
                i0 -= (c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6] + c[7])
                if (i0 < 1) {
                    this.row_index = 8; // 重置行数
                    this.sum_count = 0;
                    this.row_count = 8;
                }
                var col_index = i0 - this.sum_count;
                if (col_index > this.row_count) {
                    this.row_index++;
                    col_index -= this.row_count;
                    this.sum_count += this.row_count;
                    if (this.row_index % 4 === 0) this.row_count += 1;
                }
                // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
                var position = [
                    1.5 * 31 + 1.5 * this.row_index * 1.9,
                    1.28 * this.row_index,
                    0.82 * col_index + 75,
                ]
                var rotation = [0, Math.PI * 0.5 + Math.PI, 0]
            } else if (i0 < c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6] + c[7] + c[8] + c[9]) { //弧形看台5
                i0 -= (c[0] + c[1] + c[2] + c[3] + c[4] + c[5] + c[6] + c[7] + c[8])
                if (i0 < 1) {
                    this.row_index = 8; // 重置行数
                    this.sum_count = 0;
                    this.row_count = 9;
                }
                var col_index = i0 - this.sum_count;
                if (col_index > this.row_count) {
                    this.row_index++;
                    col_index -= this.row_count;
                    this.sum_count += this.row_count;
                    this.row_count += 1;
                }
                // console.log(i0,this.row_index,col_index,this.row_count,this.sum_count);
                var position = [
                    1.5 * 30 + 1.5 * this.row_index * 1.9 - 0.3 * col_index,
                    1.28 * this.row_index,
                    0.82 * col_index + 79 + this.row_count * 0.5,
                ]
                var rotation = [0, Math.PI * 0.5 + Math.PI, 0]
            }
            else {
                var position = [
                    0, 0, 0
                ]
                var rotation = [0, 0, 0]
            }
        }
        return { pos: position, rot: rotation, ani: animationType, speed: speed, startTime: startTime }
    }

    getsitPos_e(i0, modelType) {
        var c = [//分组情况
            15 * 182,     //大看台1
            21 * 182,     //大看台2
        ]
        let animationTypeIndex = Math.floor(Math.random() * this.modelList[modelType].sitAnimationList.length);
        var animationType = this.modelList[modelType].sitAnimationList[animationTypeIndex];
        //console.log("animationType=",animationType)
        var speed = Math.random() * 7 + 4;
        var startTime = 1000 * Math.random();
        // 添加坐在前面的一排在两个大看台（其他就暂时不添加了，这个全改调试要好久）
        if (i0 < c[0]) {//大看台1
            var row_count = 182
            var row = i0 % row_count
            var col = Math.floor(i0 / row_count) + 1
            var position = [
                1.5 * -30 - 1.5 * (col) * 1.9 - 0.15,
                1.3 * col,//
                0.82 * row - 75,
            ]
            var rotation = [0, -Math.PI * 0.5 + Math.PI, 0]
        }
        else {//大看台2
            i0 -= (c[0])
            var row_count = 182
            var row = i0 % row_count
            var col = Math.floor(i0 / row_count) + 1
            var position = [
                1.5 * 30 + 1.5 * col * 1.9 + 0.15,
                1.3 * col,
                0.82 * row - 75,
            ]
            var rotation = [0, Math.PI * 0.5 + Math.PI, 0]
        }
        if (modelType == 1 || modelType == 3) { //对于使用woman_A和woman_C的设置特殊高度
            position[1] -= 0.4
        }
        else {
            position[1] -=0.2
        }
        return { pos: position, rot: rotation, ani: animationType, speed: speed, startTime: startTime }
    }

    getPosRot_9e(i0, modelType) {
        var PosRot = this.getPosRot_e(parseInt(i0 / 9), modelType)
        var j0 = i0 % 9;
        let k = 0.5;
        PosRot.pos[0] += (k * parseInt(j0 / 3))
        PosRot.pos[2] += (k * (j0 % 3))
        if (i0 < 9 * (10022)) {
            return PosRot
        }
        PosRot = this.getsitPos_e(i0 - 9 * 10022, modelType);
        console.log(PosRot)
        return PosRot
    }

    getPosRot() {
        for (let i = 0; i < this.sumModelCount; i++) {
            let modelType = Math.floor(this.modelIndex * Math.random());
            let PosRot = this.getPosRot_9e(i);
            while (!this.modelList[modelType].setPosRotList(PosRot)) {
                modelType = Math.floor(this.modelIndex * Math.random());
            };
            if (i <= 1250 * 9) {
                // 运动的
                // console.log(modelType,this.modelList[modelType].walkAnimationList[animationTypeIndex])
                let animationTypeIndex = Math.floor(Math.random() * this.modelList[modelType].walkAnimationList.length);
                this.modelList[modelType].animtionTypes.push(this.modelList[modelType].walkAnimationList[animationTypeIndex]);
            }
            else {
                //静止的
                let animationTypeIndex = Math.floor(Math.random() * this.modelList[modelType].standAnimationList.length);
                this.modelList[modelType].animtionTypes.push(this.modelList[modelType].standAnimationList[animationTypeIndex]);
            }
        }
    }
}
