---
layout:     post
title:      "Python web框架flask之调试"
subtitle:   "vs code下flask的调试"
date:       "2017-05-25"
author:     "TuoX"
header-img: "img/post-6/bg.png"
---
<p>这次文章隔了十二天，老是忘记，事情也多。这次就分享一个简单的东西，自己也顺便记录一下。后续得写一些干货了，总是写一些简单的，似乎也没啥好看的，所以期待我下次的憋大招。</p>
<p>开发程序，debug简直就是家常便饭，在vs code下调试flask，当然是轻而易举，只需要修改一下配置即可。</p>
<p><img src="/img/post-6/debug-setting.png" /></p>
<p>在上图中加入以下的配置，有两个配置，一个是新版本的flask，一个是旧版本的，现在大家装的一般都是新版了，所以旧版加不加无所谓。配置中主要修改的地方是program这个属性。${workspaceRoot}为项目的工作目录，/api/controlls.py为执行文件所在目录。</p>
```python
{
            "name": "Flask",
            "type": "python",
            "request": "launch",
            "stopOnEntry": false,
            "pythonPath": "${config.python.pythonPath}",
            "program": "${workspaceRoot}/api/controlls.py",
            "cwd": "${workspaceRoot}",
            "env": {
                "FLASK_APP": "${workspaceRoot}/quickstart/app.py"
            },
            "args": [
                "run",
                "--no-debugger",
                "--no-reload"
            ],
            "envFile": "${workspaceRoot}/.env",
            "debugOptions": [
                "WaitOnAbnormalExit",
                "WaitOnNormalExit",
                "RedirectOutput"
            ]
        },
        {
            "name": "Flask (old)",
            "type": "python",
            "request": "launch",
            "stopOnEntry": false,
            "pythonPath": "${config.python.pythonPath}",
            "program": "${workspaceRoot}/run.py",
            "cwd": "${workspaceRoot}",
            "args": [],
            "env": null,
            "envFile": "${workspaceRoot}/.env",
            "debugOptions": [
                "WaitOnAbnormalExit",
                "WaitOnNormalExit",
                "RedirectOutput"
            ]
        }
```
<p>配置完成之后，就可以开始调试啦。按下熟悉的F5，开启调试模式，F10下一步，F11如果有方法，会先进去该方法，再进行下一步。（调试选项记得选择flask哦）</p>