---
layout:     post
title:      "搭建代理服务器-ip池（服务端）"
subtitle:   "部署-ips池服务器"
date:       "2017-06-13"
author:     "TuoX"
header-img: "img/post-12/bg.png"
---
<p>上一篇文章说了如何搭建vps服务器。这次就轮到主角，服务端出场了。服务端类似于一个调配中心。拥有大量的ip池，接收来自个个客户端的ip并且给有需要的服务器返回代理资源。</p>
<p>那用什么来存储这些ip池呢，我采用的是redis hash来存储，hash的key为每台vps自己的独立标识，value为ip地址以及端口信息。</p>
<p>服务采取flask框架，轻量简洁好用。</p>
<p>接口的访问模式，采用混淆md5加密方式。</p>
<p>对外提供获取ip池的方法。</p>
<p>暂时是提供两个api，遵循resetful api设计原则。（更多的可以大家自己去扩展，我只是写一个demo）</p>
<ul>
<li>接收来自客户端的ip</li>
<li>对外提供ip</li>
<li>更多...</li>
</ul>
```python
# encoding:utf-8
from flask import Flask, jsonify, request, abort
from proxy import Proxy
from decorators import Decorators

api = Flask(__name__)


@api.route('/api/v1/proxy', methods=['POST'])
@Decorators.proxy_auth
@Decorators.jsonp
def add_proxy():
    '''
    新增一个代理
    '''
    dic = request.form.to_dict()
    return jsonify(Proxy.add_proxy(**dic))


@api.route('/api/v1/proxy', methods=['GET'])
@Decorators.jsonp
def get_proxy():
    '''
    获取一个代理
    '''
    module = request.args.get('module', False)
    return jsonify(Proxy.get_proxy(module)) if module else abort(404)


if __name__ == '__main__':
    api.run(debug=False, host='0.0.0.0', port='5000')

```
<p>这里面的代码，我写了两个修饰器，一个是新增代理的时候的签名验证，另一个是返回jsonp的信息。jsonp修饰器在之前的文章有讲到，熟悉的小伙伴应该知道。更多的代码内容请移步源码。</p>
<p>还等什么呢，把代码run起来，看看效果如何</p>
<p>1.先试试获取一个ip池的方法吧，就是get请求。浏览器输入 ********:5000/api/v1/proxy?module=one</p>
<img src="/img/post-12/get-result.png"/>
<p>拿到我们的代理了，心里面美滋滋的。</p>
<p>2.看下我们的post请求，可以借助chrome的一个插件就可以做到，不过我懒得动，直接写个代码还更快啊，哈哈，请看代码。</p>
```python
import hashlib
import urllib
import urllib2

url = 'http://********:5000/api/v1/proxy'
key = 'vps1'
value = '61.144.82.138:6666'
token = hashlib.md5('%s%sproxy' % (key, value)).hexdigest()
data = {'key': key, 'value': value, 'token': token}
data = urllib.urlencode(data)
result = urllib2.urlopen(url, data).read()
print result
```
<img src="/img/post-12/post-result.png"/>
<p>把****改成自己服务器的ip。如果有域名绑定那就更好了，我是没有，因为我是穷人啊，得省着花。</p>
<p>好了，到这里我们整体的服务器就搭好了。哎，今晚终于可以睡个好觉了。</p>
<p>这样子就会结束了嘛，肯定不会，道高一尺魔高一丈，爬虫与反爬虫之间的斗争永远不会结束。</p>
<p>这里说下开发中遇到的问题吧，每个人一开始都是不定的，但是没有关系。正所谓闻道有先后，术业有专攻。不懂我们可以学，遇到问题，别急，因为代码上能解决的问题就不是问题。更重要的是我们处理事情的方式，学会如何处理问题，这个才是我们在学习中最重要的东西。</p>
<p>多说了一些，现在我要源码啦，源码只是一个demo比较粗浅的东西，大家可以根据自己的喜爱去随意修改。</p>
<p><a href="https://github.com/linzhiming0826/ADSL">我是源码，点我，点我。</a></p>