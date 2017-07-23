---
layout:     post
title:      "RESTful API"
subtitle:   "flask之restful api"
date:       "2017-07-23"
author:     "TuoX"
header-img: "img/post-19/bg.png"
---

REST全称是Representational State Transfer，中文意思是表述（编者注：通常译为表征）性状态转移。 它首次出现在2000年Roy Fielding的博士论文中，Roy Fielding是HTTP规范的主要编写者之一。 他在论文中提到："我这篇文章的写作目的，就是想在符合架构原理的前提下，理解和评估以网络为基础的应用软件的架构设计，得到一个功能强、性能好、适宜通信的架构。REST指的是一组架构约束条件和原则。" 如果一个架构符合REST的约束条件和原则，我们就称它为RESTful架构。
REST本身并没有创造新的技术、组件或服务，而隐藏在RESTful背后的理念就是使用Web的现有特征和能力， 更好地使用现有Web标准中的一些准则和约束。虽然REST本身受Web技术的影响很深， 但是理论上REST架构风格并不是绑定在HTTP上，只不过目前HTTP是唯一与REST相关的实例。 所以我们这里描述的REST也是通过HTTP实现的REST。

***

以上内容来自网络，如有侵权，告知立刻删除。

更加详细的说明信息请移步[链接](http://www.runoob.com/w3cnote/restful-architecture.html) 

***

### 我的一些看法

    REST最重要的有两点：
        1.请求状态
            分为GET(获取)、PUT(更新)、POST(新建)、DELETE(删除)
        2.资源url的命名
            GET     *****/1.0/Good/1?name=tuox          参数在url上面 1为第一页 问号后面为具体的过滤条件
            PUT     *****/1.0/Good/1                    参数在form表单中  1为更新的id form中是具体的详细信息
            POST    *****/1.0/Good                      参数在form表单中  form中是具体的详细信息
            DELETE  *****/1.0/Good/6                    参数在url上面     6是需要删除的id
            
            命名的一些规范：1.版本号 2.功能 3.标识 4.过滤

### flask下的RESTful API

    讲了这么多，我们进入正题。flask是一个非常轻量级的框架，非常适合写api。官方网站也扩展的相应的api框架-flask_restful。
    它就是我们今天的主角，下面就主要的介绍一下它的用法以及注意点。
***
    flask_restful使用非常简单，首先我们来看一下以下的代码。

    from flask import Flask
    from flask.ext import restful

    app = Flask(__name__)
    api = restful.Api(app)


    class HelloWorld(restful.Resource):
        def get(self):
            '''
            do something
            '''
            return {'hello': 'world'}

        def put(self, id):
            '''
            do something
            '''
            return {'code': 1, 'msg': 'success'}

        def psot(self):
            '''
            do something
            '''
            return {'code': 1, 'msg': 'success'}

        def delete(self):
            '''
            do something
            '''
            return {'code': 1, 'msg': 'success'}


    api.add_resource(HelloWorld, '/welcome', '/welcome/int:id')

    if __name__ == '__main__':
        app.run()

    这段代码包含了一些简单的例子。
        1.创建一个flask应用
        2.将flask应用注册成restful-api
        3.创建处理路由的类
        4.注册路由
        5.注册脚本启动文件

    说到这里相信大家已经对flask_restful简单优雅的写法深深的吸引，只要几行代码就可以实现一个非常规范的api，特别容易上手。
    其实flask还有很多非常有用的api，比如自定义输出结果、自定义参数获取等。
***
    不过我们真实的项目中代码可不能这么写，需要来点分级。
    下面我介绍下项目的主要结构。
    myapi/
        __init__.py
        app.py          # 这个文件主要是包含你的app以及路由规则
        resources/
            __init__.py
            foo.py      # 包含所有/Foo下的方法
            bar.py      # 包含所有/Bar下的方法
        common/
            __init__.py
            util.py     # 一些通用的使用方法
***

更多的用法，大家可以看下flask_restful的官网 [链接](https://flask-restful.readthedocs.io/en/0.3.6/)

### 源码地址

说了这么多，大家肯定想感受一下它的具体用法。我写了一个demo，代码放在github上面。[链接](https://github.com/linzhiming0826/restfulapi)

### 总结

    炎炎夏日，适合在家做点吃的，玩点游戏，看点电影，写点代码。
    如果你想交流探讨，随时欢迎~。

