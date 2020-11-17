---
layout:     post
title:      "搭建一个属于自己的cdn服务器"
subtitle:   "openresty"
date:       "2020-11-17"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

今天给大家介绍一下，如何通过实现一个类似于七牛fetch的cdn服务器.

***

# 介绍

## 安装

    1.下载软件包（此处以1.19.3.1为例）

    wget https://openresty.org/download/openresty-1.19.3.1.tar.gz

    2.解压

    tar -xzvf openresty-1.19.3.1.tar.gz

    3.配置文件
    
    ./configure

    查看更多 ./configure --help

    4.编译

    make

    如果是双核则是 make -j2

    5.安装

    make install

    6.设置nginx的环境变量

    ln -s /usr/local/openresty/nginx/sbin/nginx /usr/local/bin/

    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    7.由于需要使用到http模块，所以需要加载一个http的lua库

    下载地址: https://github.com/ledgetech/lua-resty-http

    将 lib/resty 中的文件拷贝到 /usr/local/openresty/lualib/resty/

## 构建nginx配置文件

    以路由 /mirror/url/*** 为例，后面的***就是我们的图片地址

    location /mirror/url/ {
            resolver 8.8.8.8;
            expires 3d;
            if ( $request_uri ~* \/mirror\/url\/(.*?)$ ) { ## 正则匹配
                set $image_url $1; # 设置路由参数
                content_by_lua_file /usr/local/openresty/lualib/cdn.lua; # 加载lua文件
            }
    }


## 构建lua文件

    1.把目标url进行一次md5
    2.根据md5的值去找对应文件
    3.找到=>直接返回图片内容
    4.没找到=>下载对应的图片,存储到硬盘并且返回图片内容

    cd /usr/local/openresty/lualib

    vi cdn.lua

    ```lua
    -- 读取文件的方法
    local function read_file(file_name)

        local file = io.open(file_name,'r')

        if not file then

            return nil, "can\'t open file \"" .. file_name .. "\""

        end

        local content = file:read('*a')

        file:close()

        return content, nil

    end

    -- 写文件的方法
    local function write_file(file_name, content)

        local file = io.open(file_name, "w+")

        if not file then

            return "can\'t open file \"" .. file_name .. "\""

        end

        file:write(content)

        file:close()

        return nil

    end

    local url = ngx.var.image_url

    local key = ngx.md5(url)

    local file_name = "/mnt/cache/"..key

    local content, err = read_file(file_name)

    if not content then

        local http = require "resty.http"
        local httpc = http.new()
        local res, err = httpc:request_uri(url, {
            method = “GET”,
            headers = {
            ["Content-Type"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            ["User-Agent"]="Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.193 Safari/537.36"
            },
            keepalive_timeout = 60,
            keepalive_pool = 10
        })
        if not res then
            ngx.header["Content-Type"]="image/png"
            ngx.say("")
        end

        write_file(file_name,res.body)

        ngx.status = res.status
        for k,v in pairs(res.headers) do
            ngx.header[k]=v
        end

        ngx.say(res.body)

    else

        ngx.say(content)

    end
    ```

## nginx-api-for-lua

ngx.arg[index]                               # ngx指令参数，当这个变量在set_by_lua或者set_by_lua_file内使用的时候是只读的，指的是在配置指令输入的参数.
ngx.var.varname                              # 读写NGINX变量的值,最好在lua脚本里缓存变量值，避免在当前请求的生命周期内内存的泄漏
print()                                      # 与 ngx.print()方法有区别，print() 相当于ngx.log()
ngx.ctx                                      # 这是一个lua的table，用于保存ngx上下文的变量，在整个请求的生命周期内都有效,详细参考官方
ngx.location.capture()                       # 发出一个子请求，详细用法参考官方文档。
ngx.location.capture_multi()                 # 发出多个子请求，详细用法参考官方文档。
ngx.status                                   # 读或者写当前请求的相应状态. 必须在输出相应头之前被调用.
ngx.header.HEADER                            # 访问或设置http header头信息，详细参考官方文档。
ngx.req.set_uri()                            # 设置当前请求的URI,详细参考官方文档
ngx.set_uri_args(args)                       # 根据args参数重新定义当前请求的URI参数.
ngx.req.get_uri_args()                       # 返回一个LUA TABLE，包含当前请求的全部的URL参数
ngx.req.get_post_args()                      # 返回一个LUA TABLE，包括所有当前请求的POST参数
ngx.req.get_headers()                        # 返回一个包含当前请求头信息的lua table.
ngx.req.set_header()                         # 设置当前请求头header某字段值.当前请求的子请求不会受到影响.
ngx.req.read_body()                          # 在不阻塞ngnix其他事件的情况下同步读取客户端的body信息.
ngx.req.discard_body()                       # 明确丢弃客户端请求的body
ngx.req.get_body_data()                      # 以字符串的形式获得客户端的请求body内容
ngx.req.get_body_file()                      # 当发送文件请求的时候，获得文件的名字
ngx.req.set_body_data()                      # 设置客户端请求的BODY
ngx.req.set_body_file()                      # 通过filename来指定当前请求的file data。
ngx.req.clear_header()                       # 清求某个请求头
ngx.exec(uri,args)                           # 执行内部跳转，根据uri和请求参数
ngx.redirect(uri, status)                    # 执行301或者302的重定向。
ngx.send_headers()                           # 发送指定的响应头
ngx.headers_sent                             # 判断头部是否发送给客户端ngx.headers_sent=true
ngx.print(str)                               # 发送给客户端的响应页面
ngx.say()                                    # 作用类似ngx.print，不过say方法输出后会换行
ngx.log(log.level,...)                       # 写入nginx日志
ngx.flush()                                  # 将缓冲区内容输出到页面（刷新响应）
ngx.exit(http-status)                        # 结束请求并输出状态码
ngx.eof()                                    # 明确指定关闭结束输出流
ngx.escape_uri()                             # URI编码(本函数对逗号,不编码，而php的urlencode会编码)
ngx.unescape_uri()                           # uri解码
ngx.encode_args(table)                       # 将tabel解析成url参数
ngx.decode_args(uri)                         # 将参数字符串编码为一个table
ngx.encode_base64(str)                       # BASE64编码
ngx.decode_base64(str)                       # BASE64解码
ngx.crc32_short(str)                         # 字符串的crs32_short哈希
ngx.crc32_long(str)                          # 字符串的crs32_long哈希
ngx.hmac_sha1(str)                           # 字符串的hmac_sha1哈希
ngx.md5(str)                                 # 返回16进制MD5
ngx.md5_bin(str)                             # 返回2进制MD5
ngx.today()                                  # 返回当前日期yyyy-mm-dd
ngx.time()                                   # 返回当前时间戳
ngx.now()                                    # 返回当前时间
ngx.update_time()                            # 刷新后返回
ngx.localtime()                              # 返回 yyyy-mm-dd hh:ii:ss
ngx.utctime()                                # 返回yyyy-mm-dd hh:ii:ss格式的utc时间
ngx.cookie_time(sec)                         # 返回用于COOKIE使用的时间
ngx.http_time(sec)                           # 返回可用于http header使用的时间        
ngx.parse_http_time(str)                     # 解析HTTP头的时间
ngx.is_subrequest                            # 是否子请求（值为 true or false）
ngx.re.match(subject,regex,options,ctx)      # ngx正则表达式匹配，详细参考官网
ngx.re.gmatch(subject,regex,opt)             # 全局正则匹配
ngx.re.sub(sub,reg,opt)                      # 匹配和替换（未知）
ngx.shared.DICT                              # ngx.shared.DICT是一个table 里面存储了所有的全局内存共享变量
    ngx.shared.DICT.get     
    ngx.shared.DICT.get_stale     
    ngx.shared.DICT.set     
    ngx.shared.DICT.safe_set     
    ngx.shared.DICT.add     
    ngx.shared.DICT.safe_add     
    ngx.shared.DICT.replace     
    ngx.shared.DICT.delete     
    ngx.shared.DICT.incr     
    ngx.shared.DICT.flush_all     
    ngx.shared.DICT.flush_expired     
    ngx.shared.DICT.get_keys

[更多](https://www.nginx.com/resources/wiki/modules/lua/#nginx-api-for-lua)

# End

如有问题，欢迎随时讨论