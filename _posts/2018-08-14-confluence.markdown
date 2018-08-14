---
layout:     post
title:      "wiki神器"
subtitle:   "confluence的安装部署破解"
date:       "2018-08-14"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

文档记录是一个备忘、严谨的好习惯，所以一个好用的wiki系统是很有必要的，比如轻量级的jekyll用于写写博客文章，还有今天我要跟大家介绍的重量级wiki，confluence。

***

废话不多说直接进入主题,本文以6.7.1为例

## 下载confluence

    输入命令

    wget https://downloads.atlassian.com/software/confluence/downloads/atlassian-confluence-6.7.1-x64.bin

### 安装

    1.进行文件的授权

    chmod +x atlassian-confluence-6.7.1-x64.bin

    2.进行文件的安装

    ./atlassian-confluence-6.7.1-x64.bin

    3.可以进行默认的安装或者自定义

    我的安装顺序是 o 1 i n

    4.进行破解文件的覆盖

        1).下载注册机 [地址](/doc/confluence.zip)

        2)./opt/atlassian/confluence/confluence/WEB-INF/lib/atlassian-extras-decoder-v2-3.3.0.jar复制到本地，并且重命名为atlassian-extras-2.4.jar

        3).运行注册机里面的confluence_keygen.jar文件,.patch!打开atlassian-extras-2.4.jar

        4).得到破解的atlassian-extras-2.4.jar，并且重命名为atlassian-extras-decoder-v2-3.3.0.jar，覆盖至原来的文件

        5).将mysql驱动也复制到该目录下/opt/atlassian/confluence/confluence/WEB-INF/lib/

    5.启动服务

    service confluence start

    如果不是以root安装，可以使用 sh /opt/atlassian/confluence/bin/start-confluence.sh 启动服务

### 配置

    1.打开网站 ***:8090

    2.下一步，下一步

    3.根据服务器id获取key
      
      刚刚打开的注册机里面，输入这个服务id，接着.gen!,复制key粘贴，下一步

    4.数据库配置  选择mysql，使用连接字符串，此前需要新建一个数据库，并且排序规则需要选择utf8_bin，字符集为utf-8

    5.连接字符串为 ***://localhost:3306/confluence??sessionVariables=tx_isolation='READ-COMMITTED'&useUnicode=true&characterEncoding=utf8

      如果后续安装报错，需要设置一下数据库的库类型

      mysql -u*** -p****

      SET GLOBAL tx_isolation='READ-COMMITTED';

### 一些注意点

    1.由于偶尔会出现重新安装的情况，所以这边说下怎么重新安装

      1).service confluence stop

      2).rm -rf /opt/atlassian/confluence/

      3).rm -rf /var/atlassian/application-data/confluence/

      4).删除原来的数据库

      5). ./atlassian-confluence-6.7.1-x64.bin

    2.如果忘记了停止服务就删除了文件夹，导致无法使用8090端口

      1). ps -ef|grep confluence

      2). kill -s 9 *****

### The End

    无论多忙，都得有不慌不忙根据计划去进行，稳中有序，方为上策。

