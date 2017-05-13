---
layout:     post
title:      "Python web框架flask之跨域访问"
subtitle:   "人人都爱jsonp"
date:       "2017-05-13"
author:     "TuoX"
header-img: "img/post-5/bg.jpg"
---

<p>ajax是所有web开发人员都必须掌握的一项知识，当浏览器提示XMLHttpRequest cannot load **** . Origin **** is not allowed by Acess-Control-Allow-Origin.那么恭喜你，遇到了跨域的问题。</p>
<p>为什么会出现这种问题呢，是因为同源策略。那是什么是同源策略呢？</p>
<p>同源策略，它是由Netscape提出的一个著名的安全策略，现在所有支持JavaScript 的浏览器都会使用这个策略。</p>
<p>那这样，我们还可以解决跨域请求的问题嘛，答案当然是可以的。有两种方式：</p>
<p>1.给请求的链接地址加上跨域头部，就是告诉浏览器，我允许你跨域请求。</p>
<p>2.给出jsonp格式的输出（推荐使用这个），那什么是jsonp呢。</p>
<p>jsonp跟json的关系很微妙，其实就是在json的基础上加了点修饰，那为什么它会这么神奇，直接就变成支持跨域了。</p>
<p>细心的同学应该会发现，html中的script跟link还有img等，都是可以支持跨域的啊，jsonp就是使用了script中的回调函数来绕过同源策略的限制，告诉浏览器说，我这可是一个js哟，你不能限制我。</p>
<p>说到这里，那我们就明白，flask怎么返回jsonp的请求咯，只要在输出的时候，给头部加上application/javascript，并且返回callback那不就行了嘛。</p>
<p>在这里介绍一个方法，直接编写一个python的修饰器，在需要返回jsonp的地方，全部加上这个，修饰器，那就一劳永逸啦。</p>
<p>废话不多说，直接上代码。</p>
```python
# encoding:utf-8
from functools import wraps
from flask import request, current_app


def jsonp(func):

    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = str(callback) + '(' + str(
                func(*args, **kwargs).data) + ')'
            return current_app.response_class(
                content, mimetype='application/javascript')
        else:
            return func(*args, **kwargs)

    return decorated_function
```

<p>我们来解读下代码，如果请求中存在callback参数的话，那我们就在这个方法的结果加上callback参数（结果），并且加上application/javascript返回输出。</p>
<p>@wraps这个修饰器是什么呢，它的作用就是让函数保留原有函数的名称和docstring。因为加了修饰器之后其实函数已经不再是那个函数了，但是python提供了这个来保证。</p>
<p>接下来看下我们的实现方式吧。</p>
```python
#!/usr/bin/env python
# encoding:utf-8

from flask import Flask, jsonify
from jsonp import jsonp

# 创建一个flask的api
api = Flask(__name__)


# 为api指定路由
@api.route('/api/v1.0/content', methods=['GET'])
@jsonp
def get_content():
    return jsonify({'content': 'Hello World!'})


# 设置启动程序
if __name__ == '__main__':
    api.run()
```
<p>为jsonp建立一个模块，然后在flask api程序中引入，直接在函数前面加上jsonp的函数引用，大功告成，api run起来我们看看效果。</p>
<img src="/img/post-5/jsonp-result.png" />
<p>如果出现以上的效果，那么恭喜，你已经完成了jsonp的功能。</p>