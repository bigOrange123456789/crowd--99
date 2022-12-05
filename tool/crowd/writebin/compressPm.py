import json
import os
from tqdm import tqdm
import numpy as np
import struct


# 将list转化为Float32二进制
def listToBin32(data):
    data_bin = []
    for item in data:
        b = struct.pack('<f', item)
        data_bin.append(b)
    return data_bin


# 将list转化为Float16二进制
def listToBin16(data):
    data_bin = []
    for item in data:
        b = struct.pack('<e', float(item))
        data_bin.append(b)
    return data_bin


def floatToBin32(data):
    b = struct.pack('<f', float(data))
    return b


# 保存二进制文件
def storeBin(path, data):
    with open(path, 'wb') as f:
        for item in data:
            f.write(item)


# 将图像保存为二进制
def saveImgBin(head, img, img2, img3, path):
    data = []
    for e in head:
        data.append(struct.pack('<I', e))
    # data.append(struct.pack('<I',head[1]))
    # data.append(struct.pack('<I',head[2]))
    data += listToBin32(
        np.array(img).reshape(-1)
    )
    data += listToBin32(
        np.array(img2).reshape(-1)
    )
    data += listToBin32(
        np.array(img3).reshape(-1)
    )
    storeBin(path, data)


if __name__ == "__main__":
    path = "1.json.pack.json"
    print("数据的路径为:", path)
    file = open(path)
    result = json.load(file)
    # print("图片1的长度:",np.array(result["animation"]).reshape(-1).shape)#逆矩阵与世界矩阵
    # print("图片2的长度:",np.array(result["animation2"]).reshape(-1).shape)#逆矩阵与世界矩阵的乘积

    for meshname, value in result.items():
        # listSim是啥不明白
        if len(value) > 0 and meshname != 'listSim' and meshname != 'names':
            array1 = []
            array2 = []  # 表示faceRe
            array3 = []  # 表示face
            array2length = 0
            array3length = 0
            for i in value[0]:
                # 处理array1
                array1.append(i['aI'])
                array1.append(i['bI'])
                array1.append(i['aPos'][0])
                array1.append(i['aPos'][1])
                array1.append(i['aPos'][2])
                array1.append(i['bPos'][0])
                array1.append(i['bPos'][1])
                array1.append(i['bPos'][2])
                array1.append(i['cPos'][0])
                array1.append(i['cPos'][1])
                array1.append(i['cPos'][2])
                array1.append(i['aUV'][0])
                array1.append(i['aUV'][1])
                array1.append(i['aSkinWeight'][0])
                array1.append(i['aSkinWeight'][1])
                array1.append(i['aSkinWeight'][2])
                array1.append(i['aSkinWeight'][3])
                array1.append(i['aSkinIndex'][0])
                array1.append(i['aSkinIndex'][1])
                array1.append(i['aSkinIndex'][2])
                array1.append(i['aSkinIndex'][3])
                array1.append(i['bUV'][0])
                array1.append(i['bUV'][1])
                array1.append(i['bSkinWeight'][0])
                array1.append(i['bSkinWeight'][1])
                array1.append(i['bSkinWeight'][2])
                array1.append(i['bSkinWeight'][3])
                array1.append(i['bSkinIndex'][0])
                array1.append(i['bSkinIndex'][1])
                array1.append(i['bSkinIndex'][2])
                array1.append(i['bSkinIndex'][3])
                array1.append(array2length)
                array1.append(array3length)
                if isinstance(i['faceRe'],list):
                    array2length += len(i['faceRe'])
                    array1.append(len(i['faceRe']))
                    for face in i['faceRe']:
                        array2.append(face)
                elif isinstance(i['faceRe'],int):
                    array2length += 1
                    array1.append(1)
                    array2.append(i['faceRe'])
                if isinstance(i['face']['x'], list):
                    array3length += len(i['face']['x']) * 4
                    array1.append(len(i['face']['x']))
                    for index in range(len(i['face']['x'])):
                        array3.append(i['face']['x'][index])
                        array3.append(i['face']['y'][index])
                        array3.append(i['face']['z'][index])
                        array3.append(i['face']['d'][index])
                elif isinstance(i['face']['x'], int):
                    array3length += 4
                    array1.append(1)
                    array3.append(i['face']['x'])
                    array3.append(i['face']['y'])
                    array3.append(i['face']['z'])
                    array3.append(i['face']['d'])
            print(array1, array2, array3)
            saveImgBin([
                len(value[0]), # 这个mesh中变化的个数
                len(array1), #array1长度
                array2length,
                array3length
            ],
            array1,
            array2,
            array3,
            "pack/"+meshname+'.bin')

    # print(array1,array2,array3)
    # saveImgBin(
    #     [
    #         len(result["config"]),  # 动画的个数
    #         result["config"][0],  # 单个动画数据的长度
    #         np.array(result["animation"]).reshape(-1).shape[0],  # 图片1的长度
    #         int(result["frameNumber"])
    #     ],
    #     result["animation"],
    #     result["animation2"],
    #     "test.bin"
    # )
