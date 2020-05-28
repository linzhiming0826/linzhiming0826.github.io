---
layout:     post
title:      "elasticsearch入门"
subtitle:   "docker下的安装"
date:       "2019-01-24"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

之前介绍过elasticsearch、elasticsearch-head普通安装以及python下的一些操作api，今天介绍下docker下的安装。

***

# 获取镜像

    docker pull registry.docker-cn.com/library/elasticsearch

    docker pull mobz/elasticsearch-head:5

# 安装

## elasticsearch

   1.使用容器运行镜像,设置起始内存，以及最大内存

    docker run -e ES_JAVA_OPTS="-Xms1024m -Xmx1024m" -d -p 9200:9200 -p 9300:9300 --name es  registry.docker-cn.com/library/elasticsearch

   2.查看elasticsearch配置目录--由于elasticsearch需要经常配置，所以进容器修改很不方便，于是我们采用挂载的方式来进行。
    
   docker exec -it es bash

   3.复制内容到宿主机

   mkdir /data/elasticsearch

   docker cp es:/usr/share/elasticsearch/ /data
   
   5.停止刚刚的容器，并且删除

   docker stop es

   docker rm es

   或

   docker rm -f es

   6.重新运行容器 ,挂载配置文件到宿主机上

    docker run -e ES_JAVA_OPTS="-Xms1024m -Xmx1024m" -d -p 9200:9200 -p 9300:9300 -v /data/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /data/elasticsearch/data:/usr/share/elasticsearch/data --name es  registry.docker-cn.com/library/elasticsearch

    或者通过配置文件修改内存的大小

    vi /usr/share/elasticsearch/config/jvm.options

    -Xms2g

    -Xmx2g

    如果找到配置文件，可以使用
    find / -name jvm.options

   7.修改配置文件，以后就可以直接在/data/elasticsearch/config/elasticsearch.yml 下直接修改配置文件

   8.配置完全，重启一下docker即生效

   docker restart es

## elasticsearch-head

   1.使用容器运行镜像

    docker run -d --name eshead -p 9100:9100 mobz/elasticsearch-head:5

   2.查看elasticsearch-head配置目录--由于elasticsearch-head需要经常配置，所以进容器修改很不方便，于是我们采用挂载的方式来进行。
    
   docker exec -it eshead bash

   3.复制内容到宿主机

   mkdir /data/elasticsearch-head

   docker cp -a eshead:/usr/src/app /data/elasticsearch-head
   
   5.停止刚刚的容器，并且删除

   docker stop eshead

   docker rm eshead

   或

   docker rm -f eshead

   6.重新运行容器 ,挂载配置文件到宿主机上

    docker run -d --name eshead -p 9100:9100 -v /data/elasticsearch-head/Gruntfile.js:/usr/src/app/Gruntfile.js -v /data/elasticsearch-head/_site/app.js:/usr/src/app/_site/app.js mobz/elasticsearch-head:5

   7.修改配置文件，以后就可以直接在/data/elasticsearch-head/Gruntfile.js 以及 -v /data/elasticsearch-head/_site/app.js:/usr/src/app/_site/app.js 下直接修改配置文件

   8.配置完全，重启一下docker即生效

   docker restart eshead

## 注意点

    当使用elasticsearch-head时，需要配置允许跨域头部。

    vi /data/elasticsearch/config/elasticsearch.yml

    加入以下内容

    http.cors.enabled: true
    http.cors.allow-origin: "*"

    docker restart es

# End