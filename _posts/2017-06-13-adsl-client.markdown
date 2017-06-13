---
layout:     post
title:      "搭建代理服务器-ADSL拨号（客户端）"
subtitle:   "部署-ADSL拨号服务器"
date:       "2017-06-13"
author:     "TuoX"
header-img: "img/post-11/bg.png"
---

<p>嗨，大家好。今天终于把所谓的动态获取ip的环境给搭建好了。这篇文章说的是怎么搭建一个动态vps服务器。</p>
<p>首先，我们得寻找一个拥有ADSL拨号的服务器。我呢，百度了一大堆，然后选了一家带宽10M，位于广州的服务器。大家可以自己去寻找，我不做广告，哈哈。</p>
<p>选用的服务器是centos，代理软件用的是tinyproxy，客户端代码为python2。</p>
<p>作为vps服务器做的事情有两个：</p>
<ul>
<li>
定时拨号
</li>
<li>
将新的ip发送给服务端
</li>
</ul>
<p>迫不及待啦，赶紧登录服务器配置起来。</p>
<p>登录之后，输入ls，会发现有ppp.sh这个文件。</p>
<img src="/img/post-11/ls.png"/>
<p>对了，这个就是我们的拨号程序。输入：</p>
```linux
sh ppp.sh
```
<p>然后继续输入我们的账号密码，出现以下图片的内容就表示成功。</p>
<img src="/img/post-11/sh.png"/>
<p>接着我们进行拨号看看</p>
```linux
adsl-start
```
<p>之后ping一个网站试试</p>
```linux
ping www.baidu.com
```
<img src="/img/post-11/ping.png"/>
<p>再者，我们需要安装一下一个代理软件，tinyproxy</p>
```linux
yum install -y tinyproxy
```
<p>安装完之后我们需要配置一下tinyproxy。</p>
```linux
vi /etc/tinyproxy/tinyproxy.conf
```
<img src="/img/post-11/config1.png"/>
<p>这个是代理端口，我设置成6666.就是需要点不一样。</p>
<img src="/img/post-11/config2.png"/>
<p>这个是允许的ip，我直接去掉允许所有的访问，为了测试方便。当然你也设置成只有你的服务器可以访问。之后，我们重启一下服务，就可以让设置生效啦。</p>
```linux
service tinyproxy start
```
<p>这个命令是查看网络设备器的命令，ppp0就是我们的网卡，ip为61.144.82.138</p>
```linux
ifconfig
```
<img src="/img/post-11/ifconfig.png"/>
<p>到我们的另外一台服务器测试下，这个代理是不是已经成功。</p>
```linux
curl -x 61.144.82.138:6666 www.baidu.com
```
<img src="/img/post-11/curl.png"/>
<p>成功获取到内容就说明可以了。</p>
<p>到此我们就搭建好了服务器的设置，但是这样子还不够的，如何定时进行拨号以及发送新的ip到服务端。我用python代码来实现它。</p>
```python
    def restart_adsl(self):
        '''
        进行重新拨号
        1.首先进行adsl的拨号
        2.进行拨号后ip的获取
        3.将新的ip发送到服务端
        4.等待一段时间，继续程序以及出现错误的一些处理方式
        '''
        while 1:
            print 'adsl will restart'
            status, output = commands.getstatusoutput(ADSL_BASH)
            if status == 0:
                print 'adsl start successfully'
                ip = self._get_ip()
                if ip:
                    print 'new ip: %s' % ip
                    self._send_ip(ip)
                    print 'wait %s seconds' % ADSL_CYCLE
                    time.sleep(ADSL_CYCLE)
                else:
                    print 'ip is null or empty'
            else:
                print 'adsl start is failed'
            time.sleep(1)
```
<p>以上是部分代码，接着看下自动拨号的魔力</p>
<img src="/img/post-11/result.png"/>
<p>这里说下，与服务端的交互。我这里采用混淆md5加密的方式，相对而言，起到那么一点点的作用。至于完整的代码，我会在写服务端文章的时候一起公布并且传到github上面，大家耐心等待。</p>