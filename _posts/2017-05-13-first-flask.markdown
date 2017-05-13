---
layout:     post
title:      "Python web框架之flask"
subtitle:   "初探flask"
date:       "2017-05-13"
author:     "TuoX"
header-img: "img/post-4/bg.png"
---

<p>今天跟大家介绍一个很轻量级的python web框架-flask。</p>
<p>也许你会问为什么不用Django啊，其实框架并没有好坏，只有是否适合自己，最近在看flask，它简单灵活，并且可以高度自定义的语法深深的吸引了我，对于写api有一个非常友好的支持。</p>
<p>首先，我们先把falsk安装上 命令行模式下 输入 pip install flask.如下图</p>
<img src="/img/post-4/install-flask.png" />
<p>接着，就可以开始我们的第一个程序啦。</p>
```python
#!/usr/bin/env python
# encoding:utf-8

from flask import Flask, jsonify

# 创建一个flask的api
api = Flask(__name__)


# 为api指定路由
@api.route('/api/v1.0/content', methods=['GET'])
def get_content():
    return jsonify({'content': 'Hello World!'})


# 设置启动程序
if __name__ == '__main__':
    api.run()
```
<p>api的写法建议遵循Restful api的设计理念，这个后续会说到，现在暂且不提。 </p>
<p>相信大家看上以上代码，会觉得原来写一个api是如此的简单，对，这个就是flask，简单，干净，可以定制，这个也是它最大的两点所在。</p>
<p>那现在让我们跑起来看看吧。</p>
<img src="/img/post-4/run-flask.png" />
<p>浏览器输入 http://127.0.0.1:5000/api/v1.0/content 我们刚刚在代码里面写好的api地址。</p>
<img src="/img/post-4/get-api.png" />
<P>到这里，我们的第一个基于flask的api就写好了，下篇文章会介绍，如何让api支持跨域访问。</p>