---
layout:     post
title:      "自定义构建docker镜像-Dockerfile"
subtitle:   "把自己的项目变成docker镜像"
date:       "2019-02-16"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

之前介绍过docker的使用方法，我们经常使用docker pull拉取别人的镜像来使用，比如：nginx，那我们可不就可以构建自己的镜像呢，答案是就可以的，今天我们就来介绍下方法。

***

# 构建

## 新建Dockerfile文件

    vi Dockerfile

## 编写Dockerfile文件

    这里以python 项目为例

    目录为
        
        resources/
            __init__.py
            ...
        common/
            __init__.py
            util.py
        app.py
        config.py
        requirements.txt


    1.安装python环境

    FROM python:3.7.2

    2.设置docker工作目录

    WORKDIR /usr/share/

    3.安装python包

    COPY requirements.txt requirements.txt

    RUN pip install -r requirements.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com


    4.复制代码

    COPY resources resources

    COPY common common
    
    COPY app.py app.py

    COPY config.py config.py

## 运行Dockerfile文件

    docker build -t server .   # 编译当前目录下的项目，命名镜像为server

    这样子就成功的构建完了，我们的代码镜像。
    
    docker images

    发现我们定义的server镜像已经成功出现在列表中

## 运行镜像

     docker run --name server -d -p 8000:8000 server:latest python app.py

## 完整的的Dockerfile内容

    FROM python:3.7.2

    WORKDIR /usr/share/

    COPY requirements.txt requirements.txt

    RUN pip install -r requirements.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com

    COPY resources resources

    COPY common common
    
    COPY app.py app.py

    COPY config.py config.py

## Dockerfile常用命令介绍

    0.FROM 导入镜像

    FROM <name>:<version>

    1.RUN 运行指定的命令 

        RUN <command>

    2.CMD 容器启动时要运行的命令 

        CMD command param1 param2

    3.EXPOSE 暴漏容器运行时的监听端口给外部

        EXPOSE 5000

    4.ENV  设置环境变量
    
        ENV <key> <value>

    5.COPY 复制命令

        COPY <src>... <dest>

    6.WORKDIR 工作目录

        WORKDIR <src>        

# 代码更新

    在实际开发中，我们的代码肯定是频繁的在改动，那每一次改动代码都需要进行一次构建，显然不是最好的方案。
    docker中提供了一个挂载目录的功能，它正好可以完美的解决我们的问题，我们通过把代码目录挂载到我们实际项目的目录下，这样子就完美的结果了这个问题。

    因此我们启动docker镜像时，只需要挂载下目录即可。

    假设我们的代码目录是在~/workplace/publish/server/下，那我们就这么启动：

    docker run --name server -d -p 8000:8000 -v ~/workplace/publish/server/:/usr/share/ server:latest python app.py

    这样子也方面我们的代码更新，也不需要进容器操作，也不需要重新对镜像的构建。

    当我们改动到代码的时候，只需要一个docker restart server就可以实现代码的更新。

    配合上git的钩子，完全可以实现自动化更新程序。

# End