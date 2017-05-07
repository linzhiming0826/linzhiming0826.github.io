---
layout:     post
title:      "windows下python的安装"
subtitle:   "人生苦短，请用python"
date:       "2017-05-07"
author:     "TuoX"
header-img: "img/post-2/1.png"
---

<p>今天来讲下windows下如何安装python</p>
<p>首先先去官网下载一个python，我选择的是python2，大家可能会问为什么不用python3呢？</p>
<p>虽然python3解决了恶心的编码问题，但是整体环境没有2的成熟，但是更新的速度这个毋庸置疑的，所以倾向于更加成熟的方案。</p>
<p>废话不多说，进入正题，这个是下载地址：<a href="https://www.python.org/downloads/" target="_block">点我</a></p>
<img src="/img/post-2/python-download.png" />
<p style="text-align:center;">安装图中的版本</p>
<p>安装路径可以自己选择，我选的是D:\Program Files (x86)\Python27</p>
<p>紧接着我们验证下，python是否已经安装成功，进入安装的目录（建议直接添加该bin目录到环境变量，这样子每次就不需要切到目录下运行python）</p>
<p>命令行模式下输入python --version，见到下图说明已经安装成功。</p>
<img src="/img/post-2/python-cmd.png" />
<p>最后我们也把pip这个强大的包管理器也加入环境变量</p>
<img src="/img/post-2/environment-variable.png" />
<p>使用起来也很简单,命令行直接输入 pip install flask,这个安装的是一个web框架，个人认为写api非常的友好。</p>
<p>现在让我们开始pyton路程吧，写我们的第一个代码。</p>
<img src="/img/post-2/hello-world.png" />