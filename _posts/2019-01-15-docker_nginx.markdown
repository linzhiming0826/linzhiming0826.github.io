---
layout:     post
title:      "nginx在docker下的应用"
subtitle:   "nginx安装、部署"
date:       "2019-01-15"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

今天介绍下nginx在docker下的安装与配置。

***

## 安装

   1.获取镜像

   docker pull nginx

   2.使用容器运行镜像,并且绑定容器的80端口，对外暴露80端口

   docker run --name mynginx -d -p 80:80 nginx:latest

   3.查看nginx配置目录--由于nginx需要经常配置，所以进容器修改很不方便，于是我们采用挂载的方式来进行。
    
   docker exec mynginx ls /etc/nginx

   出现以下内容：

    conf.d
    fastcgi_params
    koi-utf
    koi-win
    mime.types
    modules
    nginx.conf
    scgi_params
    uwsgi_params
    win-utf

   4.复制内容到宿主机

   mkdir /data/nginx/conf  

   docker cp -a mynginx:/etc/nginx/ /data/nginx/conf
   
   5.停止刚刚的容器，并且删除

   docker stop mynginx

   docker rm mynginx

   或

   docker rm -f mynginx

   6.重新运行容器 ,将 www、etc/nginx、var/log/nginx、/wwwlogs 挂载到宿主机上

   docker run -p 80:80 --restart always --name nginx -v /data/nginx/www:/www -v /data/nginx/conf/:/etc/nginx/ -v /data/nginx/logs:/var/log/nginx -v /data/nginx/wwwlogs:/wwwlogs -d nginx

   7.修改配置文件，以后就可以直接在/data/nginx/conf/conf.d/ 下创建自己的配置conf

   8.配置完全，重启一下docker即生效

   docker restart nginx
   
### 注意点

   docker下的容器暴露的端口使用127.0.0.1是访问不到的，但是我们可以通过查看容器的内置ip来进行配置，查询方法 docker inspect <container id>  属性名IPAddress就是ip。

### End

    今年还差看一场大雪。



