---
layout:     post
title:      "python在vs code下的快速开发"
subtitle:   "写python的正确姿势"
date:       "2017-05-07"
author:     "TuoX"
header-img: "img/post-3/bg.png"
---

<p>工欲善其事必先利其器,vs code的横空出世，给开发界带来的极大的福音，以简洁的界面，极快的响应速度以及完美的用户体验，俘虏了广大开发者的心。</p>
<p>在有世界最强大的IDE Microsoft Visual Studio的基因下，让我们见证开发python的快速节奏。</p>
<p>首先，先去官网把vs code给装上。<a href="http://www.vscode.org/" target="_block">点我点我</a></p>
<p>接着，就开始我们的插件之旅吧。</p>
<p>推荐以下几个插件</p>
<p>1.Guides 这个插件我认为是最重要的，是什么呢，是一条条的竖线，大家都知道python的特点是什么，就是每个层级，每行代码的空格对齐都是严格要求的，这个简直就是python的福音啊。之前用其他语言写代码的时候，也有这种插件，给代码的严谨性带来不少的好处。</p>
<p>2.flake8 这个是代码规范神器。有了它，会帮助我们对于代码的规范，还有质量上有一定的保证。安装方法也很简单，命令行模式下，输入pip install flaske8 。完成安装之后，在我们的配置文件里面加上配置就行了。如何进行配置的添加呢，快捷键ctrl+shift+p，出现搜索框，输入settings,选择打开用户设置。</p>
<img src="/img/post-3/setting1.png" />
<p>接着，加入我们的配置 "python.linting.flake8Enabled": true</p>
<img src="/img/post-3/setting2.png" />
<P>上面那张截图已经暴露了，接下来要说的第三个需要安装的插件。每个python项目，vs code都会生成一个settings.json的文件，建议在里面配置，这样子每个项目都会有自己独立的配置了。</p>
<p>3.yapf 这个是代码格式化的利器，解决排版问题非它莫属，个人有代码的洁癖，强迫症，看到代码乱，就必须改，这个是个病，得治。安裝方法跟2 一样，命令行模式下输入 pip install yapf .在配置中加入 "python.formatting.provider": "yapf"</p>
<p>接下来的推荐就是一些常规的啦，可以安装 Code Runner、Git History、Python、Python Extended等。</p>
<p>到了这里，我们就可以开始写我们的第一个项目咯。just do it。</p>
```python
#!/usr/bin/env python
# encoding:utf-8


class MyFirstProject:
    @staticmethod
    def start():
        print 'Hello World!'


def main():
    MyFirstProject.start()


if __name__ == '__main__':
    main()
```
<p>右键run code ，这个就是上面提到的Code Runner插件，可以直接跑代码，在输出窗口输出，蛮实用的插件</p>
<img src="/img/post-3/run-code.png" />
<p>到了这里，文章可以告一段落啦，但是细心的小伙伴应该会发现，右侧出现了一个代码总览区域，就像sublime一样，身为如此强大的vs code怎么可以没有呢，开启方式很简单，在配置文件中加入"editor.minimap.enabled": true 就可以咯</p>
<p>插播一个flake8的一个代码规范设置，在开发的过程中一定会遇到，提示字符串过长的警告，有代码洁癖的人绝对容忍不了这种提示，就像下面这个情况：</p>
<img src="/img/post-3/flake8-error.png" />
<p>解决办法：命令行中输入flake8 -help查看flake的设置帮助，会发现有一条--max-line-length=n 默认值就79哦，这么短，哪里够啊，我给它改成500，简单暴力，哈哈<p>
<img src="/img/post-3/flake8-help.png" />
<p style="text-align:center;">每行最大长度的设置说明<p>
<img src="/img/post-3/flake8-setting.png" />
<p style="text-align:center;">在配置中加入我们需要的配置</p>
<img src="/img/post-3/clean.png" />
<p>看到恶心的红线提示已经消失，瞬间豁然开朗，知道了这个，那以后遇到其他的问题也可以这么配置，举一反三。</p>
<p>到了这里已经接近尾声了，整体的环境，IDE都已经准备就绪，那以后就是我们发挥所长的时候，期待下一篇文章的到来。</p>
<p>The End</p>