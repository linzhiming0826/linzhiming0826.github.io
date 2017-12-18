---
layout:     post
title:      "elasticsearch入门(二)"
subtitle:   "可视化篇-elasticsearch-head"
date:       "2017-12-18"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

# 扯淡

上海已经寒气逼人，出门大宝都顶不住。出生在上海比还南方的孩子表示受不了如此冷的天气，早早的就穿上羽绒服秋裤。

***

# 概述

今天跟大家说下一个elasticsearch的可视化工具elasticsearch-head。

基于web页面的一个管理控制台，方便我们的查询与检索。

[官网地址](https://github.com/mobz/elasticsearch-head)

# 安装

1.修改配置（需要让elasticsearch允许跨域连接）

    cd /etc/elasticsearch
    vi elasticsearch.yml
    添加下面两个配置：
    http.cors.enabled: true
    http.cors.allow-origin: "*"

2.依赖

    apt-get install git
    apt-get install nodejs
    apt-get install npm

3.获取编译运行

    git clone git://github.com/mobz/elasticsearch-head.git
    cd elasticsearch-head
    npm install
    npm run start

# 访问

浏览器输入ip地址 http://****:9100

![](/img/post-27/result.png)

大家可能发现图片中的集群健康值为什么是黄色的，因为我现在只是单点的，所以是黄色，有了集群了之后就变成绿色。只要不是红色的影响都不大。

功能相当之丰富，包括概览、索引、数据浏览、基本查询、复合查询。

# 一些建议

由于这个插件可以对数据直接进行操作，所以对于正式环境建议采取限制ip访问等方式。

# End

最近比较懒，所以说的话少，今天就简单的介绍了下，下篇将会介绍如何用python进行数据的操作。