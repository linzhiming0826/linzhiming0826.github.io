---
layout:     post
title:      "elasticsearch入门(一)"
subtitle:   "安装篇"
date:       "2017-12-08"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

# 概述

最近在研究一个搜索引擎，于是决定亲自动手安装一下，并且进行比较系统的学习。elasticsearch是基于lucene开发出来的一个开源工具，非常的好用。
扩展性比solr好许多，还有其他更多的优势，这里就不详细说明了。

# 安装

1.导入Elasticsearch PGP密钥
    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

2.从APT存储库安装
    首先得先安装一个支持库
    apt-get install apt-transport-https
    其次保存储存库定义 到/etc/apt/sources.list.d/elastic-6.x.list
    echo“deb https://artifacts.elastic.co/packages/6.x/apt stable main”| sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list

3.安装软件包
    apt-get update && apt-get install elasticsearch

4.添加到systemctl自启动
    /bin/systemctl daemon-reload
    /bin/systemctl enable elasticsearch.service

5.修改配置文件
    vi /etc/elasticsearch/elasticsearch.yml
    取消注释，并且修改以下两个配置
    network.host: 0.0.0.0 开放ip地址
    http.port: 9200       设置访问ip为9200

6.启动服务
    systemctl start elasticsearch.service

7.访问
    curl 127.0.0.1:9200
    如果出现以下结果，表示成功。
    {
        "name" : "eqdKa79",
        "cluster_name" : "elasticsearch",
        "cluster_uuid" : "Dhs90KlLR868X5p26zUw8Q",
        "version" : {
            "number" : "6.0.1",
            "build_hash" : "601be4a",
            "build_date" : "2017-12-04T09:29:09.525Z",
            "build_snapshot" : false,
            "lucene_version" : "7.0.1",
            "minimum_wire_compatibility_version" : "5.6.0",
            "minimum_index_compatibility_version" : "5.0.0"
        },
        "tagline" : "You Know, for Search"
    }

这边只是做一个粗略的安装配置说明，更多的详情可以查看官网。[点我](https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html)

# End

今天的介绍就到这里咯，等待后续的更多的学习笔记。
