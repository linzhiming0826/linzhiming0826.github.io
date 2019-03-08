---
layout:     post
title:      "deepfakes初体验"
subtitle:   "换脸升级版"
date:       "2019-03-08"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

之前介绍过简单的换脸python方式，今天就更大家介绍下加强版的换脸，会以本机mac为例，进行举例说明，感谢deepfakes的开源。
[地址](https://github.com/deepfakes/faceswap)

***

# 构建

## 克隆

    git clone https://github.com/deepfakes/faceswap

## 编写Dockerfile文件

    官方提供了cpu版本跟gpu版本的dokcer文件

    我们选择cpu的版本，但是由于环境的原因，我们需要进行稍加修改

    FROM tensorflow/tensorflow:latest-py3

    RUN apt-get update -qq -y \
    && apt-get install -y libsm6 libxrender1 libxext-dev python3-tk libgtk2.0-dev x11-xserver-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

    COPY requirements.txt /opt/
    RUN pip3 install --upgrade pip -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
    RUN pip3 install cmake -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
    RUN pip3 install dlib --install-option=--yes --install-option=USE_AVX_INSTRUCTIONS -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
    RUN pip3 --no-cache-dir install -r /opt/requirements.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com && rm /opt/requirements.txt

    WORKDIR "/srv"
    CMD ["/bin/bash"]

    跟官方的比起来，我们新增了pip源的替换以及新增了两个安装包libgtk2.0-dev（基于GTK的界面构造程序）、x11-xserver-utils（用于设置mac下的界面显示工具）

## 运行Dockerfile文件

    docker build -t deepfakes-cpu -f Dockerfile.cpu .

## 安装xquartz

    brew cask install xquartz

    进入xquartz的偏好设置》安全性》允许从网络客服端连接

## 运行镜像

     docker run -tid -p 9001:9001 -e DISPLAY=$ip:0 --hostname deepfakes-cpu --name deepfakes-cpu -v /Users/gimi/workplace/develop/faceswap:/srv -v /tmp/.X11-unix:/tmp/.X11-unix deepfakes-cpu

     其中ip为本机的$ip

## 进入dockker

    docker exec -it deepfakes-cpu bash

## 执行命令

    1.进行我们数据的特征提取

        python faceswap.py extract -i photo/trump -o data/trump

        python faceswap.py extract -i photo/cage -o data/cage

        trump是被替换的脸的文件夹，cage是替换的脸的文件夹

        更多提取方法的帮助 python faceswap.py extract -h

    2.进行数据的训练

        python faceswap.py train -A data/trump -B data/cage -m models -p

        这边加入了-p是为了预览训练的结果，这样子方便我们查看训练效果，如果这个时候出现无法展示界面的报错，需要执行以下xhost local:root，赋予一下权限

        更多训练方法的帮助 python faceswap.py train -h

    3.进行脸部的转换

        python faceswap.py convert -i photo/trump -o output -m /models

        更多转换方法的帮助 python faceswap.py convert -h

    4.将视频转化成图片

        python tools.py effmpeg -h 

        或者

        ffmpeg -i video.mp4 photo/video-frame-%d.png

    5.将图片转换成视频

        ffmpeg -i photo/video-frame-%0d.png -c:v libx264 -vf "fps=25,format=yuv420p" out.mp4

# End

    训练的图片素材越多，训练的越久，我们的模型会越准确。