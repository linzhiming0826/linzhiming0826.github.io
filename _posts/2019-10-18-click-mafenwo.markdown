---
layout:     post
title:      "捅一捅马蜂窝"
subtitle:   "马蜂窝机票信息获取、解密api加密规则"
date:       "2019-10-18"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

还记得差不多三年前，第一次爬马蜂窝网站的数据，所有的请求都是没有加密，可以任意请求，自从出了那事之后，所有的api就开启了加密。

我好奇的打开了下几年前的代码，发现现在还是可以请求，且数据还是正确有效，估计是服务没停，只是现在从网站上没法查询到。

但是这些都不是今天的重点，今天的重点是分析一下现在马蜂窝机票服务的加密规则。

***

# 开始

## 作案工具

    1.一台能上网的电脑

    2.chrome浏览器

## 数据分析

    1.打开马蜂窝站点，这里选择一条作案路线，2019-11-19从上海到厦门的机票:

    https://www.mafengwo.cn/flight/#/list?departCity=上海&departCode=SHA&destCity=厦门&destCode=XMN&departDate=2019-11-19&status=0&withChild=0

    2.查找请求数据的api
    
    开启f12，点击Network=>xhr,分析发现有一个ajax请求

    https://fdspl-traffic.mafengwo.cn/fdspl/v1/flightList/search

    请求方式为post(json)

    参数为:

        {"tfb_req_id":"242b98c1697e8eab088f7c8b8ffb81dc","departCode":"SHA","destCode":"XMN","departDate":"2019-10-19","trip":0,"adultNums":1,"hasChildren":false,"queryTimes":1,"signKey":"e6f54d0167003a4d5c0519bb18f49e47","depDateAndFlightNo":"","sign":"d365ebeb04b4b1db5be4a24fb3d27355"}

    tfb_req_id 请求的随机数

    departCode 出发城市的标识

    destCode 到达城市的标识

    departDate 出发的时间

    trip  旅程 单程还是往返

    adultNums 成人的数量

    hasChildren 是否有孩子

    queryTimes 第几次请求，后面会说到

    signKey 签名的key（guid去除-的结果，通过源码知道）

    sign 加密的签名
    
    3.分析加密方法

    通过请求的域名中的部分路由 flightList/search 定位到一个变量（在js中找到,index.***.js）

![](/img/post-29/route.jpg)

    接着通过参数分析我们定义到获取请求的方法

![](/img/post-29/flight_list.jpg)

    这个js代码看着复杂，其实不会，因为是被混淆过的，webpack打包之后的代码，但是我们也可以利用工具进行一步步的抽丝剥茧。

![](/img/post-29/break.jpg)

    利用chrome的提调试，进行方法的定位与分析

    通过分析会发现参数的加密方法以及调用的方法

        function s(t, e) {
            var i = (65535 & t) + (65535 & e);
            return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i
        }
        ....
        function v(t, e) {
            return function (t, e) {
                var i, a, s = p(t), r = [], n = [];
                for (r[15] = n[15] = void 0,
                    s.length > 16 && (s = d(s, 8 * t.length)),
                    i = 0; i < 16; i += 1)
                    r[i] = 909522486 ^ s[i],
                        n[i] = 1549556828 ^ s[i];
                return a = d(r.concat(p(e)), 512 + 8 * e.length),
                    u(d(n.concat(a), 640))
            }(h(t), h(e))
        }

    what? 这个是什么鬼，我咋分析加密算法，然后再转化成python的加密算法呢。

    答案是，这些都不用你做，你只需要分析出是调用哪个方法，然后进行封装就好。

    4.进行加密方法的封装

    借用js2py这个类库进行js代码的解析与运行

    在刚刚的获取的js方法基础上，我们再加一个加密的方法

        function sign(t) {
            return f(m(t));
        }

    python获取加密算法的封装

        import js2py

        js = js2py.EvalJs() //生成
        js_script='''
                    function s(t, e) {
                        var i = (65535 & t) + (65535 & e);
                        return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i
                    }
                    ...
                    function sign(t) {
                        return f(m(t));
                    }
                  '''
        js.execute(js_script)
        sign = js.sign(t)

    5.模拟数据的请求

    分析可以知道请求参数中的queryTimes为第几次请求，这个是根据第一次请求的结果中返回的参数needQueryMore决定

    needQueryMore 如果为true，则需要持续的发起请求，直到为false为止

    其中存在两种情况，第一种为有机票数据，第二种没有，猜测是缓存更新机制的问题，1.生成缓存 2.需要更新缓存

    以下为完全的python请求代码

        import js2py
        import time
        import requests


        def log(result):
            '''打印数据
            '''
            for r in result['data']['list']:
                segment = r['goTrip']['segmentMOList'][0]
                depart_desc = '出发:%s-%s-%s-%s' % (segment['org_city_name'],
                                                segment['org_airport_name'], segment['org_airport_quay'], segment['arr_time'])
                dest_desc = '到达:%s-%s-%s-%s' % (segment['dst_city_name'],
                                                segment['dst_airport_name'], segment['dst_airport_quay'], segment['dep_time'])
                price_desc = '价格:%s' % (r['priceDigests'][0]['settlePrice'])
                time_desc = '耗时:%s' % (segment['fly_time'])
                print(segment['airline_name'], depart_desc,
                    dest_desc, price_desc, time_desc)


        js_script = '''
                function s(t, e) {
                    var i = (65535 & t) + (65535 & e);
                    return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i
                }
                function r(t, e, i, a, r, n) {
                    return s(function (t, e) {
                        return t << e | t >>> 32 - e
                    }(s(s(e, t), s(a, n)), r), i)
                }
                function n(t, e, i, a, s, n, o) {
                    return r(e & i | ~e & a, t, e, s, n, o)
                }
                function o(t, e, i, a, s, n, o) {
                    return r(e & a | i & ~a, t, e, s, n, o)
                }
                function c(t, e, i, a, s, n, o) {
                    return r(e ^ i ^ a, t, e, s, n, o)
                }
                function l(t, e, i, a, s, n, o) {
                    return r(i ^ (e | ~a), t, e, s, n, o)
                }
                function d(t, e) {
                    var i, a, r, d, u;
                    t[e >> 5] |= 128 << e % 32,
                        t[14 + (e + 64 >>> 9 << 4)] = e;
                    var p = 1732584193
                        , f = -271733879
                        , h = -1732584194
                        , m = 271733878;
                    for (i = 0; i < t.length; i += 16)
                        a = p,
                            r = f,
                            d = h,
                            u = m,
                            f = l(f = l(f = l(f = l(f = c(f = c(f = c(f = c(f = o(f = o(f = o(f = o(f = n(f = n(f = n(f = n(f, h = n(h, m = n(m, p = n(p, f, h, m, t[i], 7, -680876936), f, h, t[i + 1], 12, -389564586), p, f, t[i + 2], 17, 606105819), m, p, t[i + 3], 22, -1044525330), h = n(h, m = n(m, p = n(p, f, h, m, t[i + 4], 7, -176418897), f, h, t[i + 5], 12, 1200080426), p, f, t[i + 6], 17, -1473231341), m, p, t[i + 7], 22, -45705983), h = n(h, m = n(m, p = n(p, f, h, m, t[i + 8], 7, 1770035416), f, h, t[i + 9], 12, -1958414417), p, f, t[i + 10], 17, -42063), m, p, t[i + 11], 22, -1990404162), h = n(h, m = n(m, p = n(p, f, h, m, t[i + 12], 7, 1804603682), f, h, t[i + 13], 12, -40341101), p, f, t[i + 14], 17, -1502002290), m, p, t[i + 15], 22, 1236535329), h = o(h, m = o(m, p = o(p, f, h, m, t[i + 1], 5, -165796510), f, h, t[i + 6], 9, -1069501632), p, f, t[i + 11], 14, 643717713), m, p, t[i], 20, -373897302), h = o(h, m = o(m, p = o(p, f, h, m, t[i + 5], 5, -701558691), f, h, t[i + 10], 9, 38016083), p, f, t[i + 15], 14, -660478335), m, p, t[i + 4], 20, -405537848), h = o(h, m = o(m, p = o(p, f, h, m, t[i + 9], 5, 568446438), f, h, t[i + 14], 9, -1019803690), p, f, t[i + 3], 14, -187363961), m, p, t[i + 8], 20, 1163531501), h = o(h, m = o(m, p = o(p, f, h, m, t[i + 13], 5, -1444681467), f, h, t[i + 2], 9, -51403784), p, f, t[i + 7], 14, 1735328473), m, p, t[i + 12], 20, -1926607734), h = c(h, m = c(m, p = c(p, f, h, m, t[i + 5], 4, -378558), f, h, t[i + 8], 11, -2022574463), p, f, t[i + 11], 16, 1839030562), m, p, t[i + 14], 23, -35309556), h = c(h, m = c(m, p = c(p, f, h, m, t[i + 1], 4, -1530992060), f, h, t[i + 4], 11, 1272893353), p, f, t[i + 7], 16, -155497632), m, p, t[i + 10], 23, -1094730640), h = c(h, m = c(m, p = c(p, f, h, m, t[i + 13], 4, 681279174), f, h, t[i], 11, -358537222), p, f, t[i + 3], 16, -722521979), m, p, t[i + 6], 23, 76029189), h = c(h, m = c(m, p = c(p, f, h, m, t[i + 9], 4, -640364487), f, h, t[i + 12], 11, -421815835), p, f, t[i + 15], 16, 530742520), m, p, t[i + 2], 23, -995338651), h = l(h, m = l(m, p = l(p, f, h, m, t[i], 6, -198630844), f, h, t[i + 7], 10, 1126891415), p, f, t[i + 14], 15, -1416354905), m, p, t[i + 5], 21, -57434055), h = l(h, m = l(m, p = l(p, f, h, m, t[i + 12], 6, 1700485571), f, h, t[i + 3], 10, -1894986606), p, f, t[i + 10], 15, -1051523), m, p, t[i + 1], 21, -2054922799), h = l(h, m = l(m, p = l(p, f, h, m, t[i + 8], 6, 1873313359), f, h, t[i + 15], 10, -30611744), p, f, t[i + 6], 15, -1560198380), m, p, t[i + 13], 21, 1309151649), h = l(h, m = l(m, p = l(p, f, h, m, t[i + 4], 6, -145523070), f, h, t[i + 11], 10, -1120210379), p, f, t[i + 2], 15, 718787259), m, p, t[i + 9], 21, -343485551),
                            p = s(p, a),
                            f = s(f, r),
                            h = s(h, d),
                            m = s(m, u);
                    return [p, f, h, m]
                }
                function u(t) {
                    var e, i = "", a = 32 * t.length;
                    for (e = 0; e < a; e += 8)
                        i += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
                    return i
                }
                function p(t) {
                    var e, i = [];
                    for (i[(t.length >> 2) - 1] = void 0,
                        e = 0; e < i.length; e += 1)
                        i[e] = 0;
                    var a = 8 * t.length;
                    for (e = 0; e < a; e += 8)
                        i[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
                    return i
                }
                function f(t) {
                    var e, i, a = "";
                    for (i = 0; i < t.length; i += 1)
                        e = t.charCodeAt(i),
                            a += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(15 & e);
                    return a
                }
                function h(t) {
                    return unescape(encodeURIComponent(t))
                }
                function m(t) {
                    return function (t) {
                        return u(d(p(t), 8 * t.length))
                    }(h(t))
                }
                function v(t, e) {
                    return function (t, e) {
                        var i, a, s = p(t), r = [], n = [];
                        for (r[15] = n[15] = void 0,
                            s.length > 16 && (s = d(s, 8 * t.length)),
                            i = 0; i < 16; i += 1)
                            r[i] = 909522486 ^ s[i],
                                n[i] = 1549556828 ^ s[i];
                        return a = d(r.concat(p(e)), 512 + 8 * e.length),
                            u(d(n.concat(a), 640))
                    }(h(t), h(e))
                }
                function sign(t) {
                    return f(m(t));
                }
                '''
        js = js2py.EvalJs()
        js.execute(js_script)
        data = {"departCode": "SHA", "destCode": "XMN", "departDate": "2019-11-19", "trip": 0, "adultNums": 1,
                "hasChildren": False, "queryTimes": 0, "signKey": "7d13933b454ebb40b0d6b911e11f1a29", "depDateAndFlightNo": ""}
        t = '%s%s%s%s%s' % (data['departCode'], data['destCode'],
                            data['signKey'], data['departDate'], data['signKey'])
        sign = js.sign(t)
        data['sign'] = sign
        while_cond = False
        r = requests.post(
            'https://fdspl-traffic.mafengwo.cn/fdspl/v1/flightList/search', json=data)
        result = r.json()
        if not result['data']['needQueryMore']:
            log(result)
        else:
            while_cond = True
        while while_cond:
            time.sleep(0.3)
            data['queryTimes'] += 1
            print(data['queryTimes'])
            r = requests.post(
                'https://fdspl-traffic.mafengwo.cn/fdspl/v1/flightList/search', json=data)
            result = r.json()
            if not result['data']['needQueryMore']:
                log(result)
                break

## 数据结果

![](/img/post-29/result.jpg)


# 结束

    至此作案已经结束，欢迎大家多多交流。