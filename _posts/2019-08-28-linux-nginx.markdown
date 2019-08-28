---
layout:     post
title:      "百万请求下的优化"
subtitle:   "linux内核参数、linux tcp网络参数、nginx配置"
date:       "2019-08-28"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

随着用户量越来越多，服务器越发越觉得不够用，在边升级服务器的同时也不忘记进行系统级别以及nginx转发上的优化。
今天会跟大家以linux、nginx为例，讲讲一些基础的配置。

***

# linux系统

## 内核参数

    1.系统全局允许分配的最大文件句柄数:

    sysctl -w fs.file-max=2097152
    sysctl -w fs.nr_open=2097152
    echo 2097152 > /proc/sys/fs/nr_open
    
    2.允许当前会话/进程打开文件句柄数:

    ulimit -n 1048576
    为了每次启动系统都可以获取到对应的值，我们可以把它写入 /etc/profile
    vi /etc/profile
    ulimit -n 1048576
    保存退出，执行一下
    source /etc/profile

    3.持久化 ‘fs.file-max’ 设置到 /etc/sysctl.conf 文件:
    
    fs.file-max = 1048576

    4./etc/systemd/system.conf 设置服务最大文件句柄数

    DefaultLimitNOFILE=1048576

    5./etc/security/limits.conf 持久化设置允许用户/进程打开文件句柄数:

    root soft nofile 1048576
    root hard nofile 1048576
    * soft nofile 1048576
    * hard nofile 1048576

## TCP 协议栈网络参数

    1.并发连接 backlog 设置:

    sysctl -w net.core.somaxconn=32768
    sysctl -w net.ipv4.tcp_max_syn_backlog=16384
    sysctl -w net.core.netdev_max_backlog=16384

    2.可用知名端口范围:

    sysctl -w net.ipv4.ip_local_port_range='1000 65535'

    3.TCP Socket 读写 Buffer 设置:

    sysctl -w net.core.rmem_default=262144
    sysctl -w net.core.wmem_default=262144
    sysctl -w net.core.rmem_max=16777216
    sysctl -w net.core.wmem_max=16777216
    sysctl -w net.core.optmem_max=16777216

    #sysctl -w net.ipv4.tcp_mem='16777216 16777216 16777216'
    sysctl -w net.ipv4.tcp_rmem='1024 4096 16777216'
    sysctl -w net.ipv4.tcp_wmem='1024 4096 16777216'

    4.TCP 连接追踪设置:

    sysctl -w net.nf_conntrack_max=1000000
    sysctl -w net.netfilter.nf_conntrack_max=1000000
    sysctl -w net.netfilter.nf_conntrack_tcp_timeout_time_wait=30

    5.TIME-WAIT Socket 最大数量、回收与重用设置:

    sysctl -w net.ipv4.tcp_max_tw_buckets=1048576

    # 注意: 不建议开启該设置，NAT模式下可能引起连接RST
    # sysctl -w net.ipv4.tcp_tw_recycle=1
    # sysctl -w net.ipv4.tcp_tw_reuse=1

    6.FIN-WAIT-2 Socket 超时设置:

    sysctl -w net.ipv4.tcp_fin_timeout=15

# nginx

## 运行用户

    防止出现各种权限问题，将配置中的运行用户改成
    
    user root;

## nginx进程数，建议设置为等于CPU总核心数。可以和worker_cpu_affinity配合

    worker_processes  16;

## 最多文件描述符(句柄)数目

    一个nginx进程打开的最多文件描述符(句柄)数目，理论值应该是最多打开文件数（系统的值ulimit -n）与nginx进程数相除,但是nginx分配请求并不均匀，所以建议与ulimit -n的值保持一致。

    worker_rlimit_nofile 1048576;


## 工作模式与连接数上限

    events {
        # 参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; 
        # epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型，如果跑在FreeBSD上面，就用kqueue模型。
        # use epoll;
        # connections 20000;  # 每个进程允许的最多连接数
        # 单个进程最大连接数（最大连接数=连接数*进程数）该值受系统进程最大打开文件数限制，需要使用命令ulimit -n 查看当前设置
        worker_connections 1048576;
    }

## http服务器

    http {
        #关闭访问日志
        access_log off;
 
        #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
        sendfile        on;

        #防止网络阻塞
        #tcp_nopush     on;
 
        #长连接超时时间，单位是秒，默认为0
        keepalive_timeout  65;
 
        # gzip压缩功能设置
        gzip on; #开启gzip压缩输出
        gzip_min_length 1k; #最小压缩文件大小
        gzip_buffers    4 16k; #压缩缓冲区
        gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
        gzip_comp_level 9; #压缩等级
        #压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
        gzip_types application/json text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
        gzip_vary on; # 和http头有关系，加个vary头，给代理服务器用的，有的浏览器支持压缩，有的不支持，所以避免浪费不支持的也压缩，所以根据客户端的HTTP头来判断，是否需要压缩
        gzip_disable "MSIE [1-6]\."; # E6对Gzip不怎么友好，不给它Gzip了
        # 设定负载均衡后台服务器列表 
        upstream  myweb  { 
                                ip_hash; # 指定支持的调度算法
                                # upstream 的负载均衡，weight 是权重，可以根据机器配置定义权重。weigth 参数表示权值，权值越高被分配到的几率越大。
                                # max_conns 最大连接数
                                # max_fails:失败多少次 认为主机已挂掉则，踢出，公司资源少的话一般设置2~3次，多的话设置1次
                                # max_fails=2 fail_timeout=30s代表在30秒内请求某一应用失败2次，认为该应用宕机，后等待30秒，这期间内不会再把新请求发送到宕机应用，
                                # 而是直接发到正常的那一台，时间到后再有请求进来继续尝试连接宕机应用且仅尝试1次，如果还是失败，则继续等待30秒...以此循环，直到恢复。
                                server   192.168.1.39:8080 weight=5 max_conns=800 max_fails=2 fail_timeout=30s ;  
                                server   192.168.1.89:8080 weight=1 max_conns=800 max_fails=2 fail_timeout=30s ;  
                            }
        server{
            listen 80;
            server_name myweb.com;
            location / {
                proxy_pass_header Server;
                proxy_redirect off;
                proxy_pass http://myweb;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header REMOTE-HOST $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
        }
    }

# End

    这些参数是基于16核32G的ubuntu服务器的配置而来，适用于大部分业务场景，如果业务场景不一样，需要针对不同的参数做出不同的优化。
    除了这些参数之外，服务器的带宽也是一个比较考验的问题，希望这篇文章能够帮助到有需要的人。