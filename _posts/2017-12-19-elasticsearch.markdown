---
layout:     post
title:      "elasticsearch入门(三)"
subtitle:   "python客户端操作"
date:       "2017-12-19"
author:     "TuoX"
header-img: "img/post-26/bg.png"
---

今天讲解下elasticsearch的python客户端的一些操作。

***

# 安装类库

    pip install elasticsearch

# 使用方法

客户端的官方api文档地址[点我](https://elasticsearch-py.readthedocs.io/en/master/api.html)

## 1.新增数据

```python
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': '10.1.26.59', 'port': 9200}])
es.index(
    index="test_index",
    doc_type="test_type",
    id=3,
    body={"name": "zhi",
          "age": 25})
```

表示新增一个内容为{"name": "zhi","age": 25}，type为test_type，index为test_index，id为3（可以作为自定义标识）的信息。

## 2.查询数据

```python
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': '10.1.26.59', 'port': 9200}])
result = es.search(
    index='test_index',
    body={
        'query': {
            'bool': {
                'must': [{
                    'term': {
                        'name': 'zhi'
                    }
                }, {
                    'term': {
                        'age': 25
                    }
                }]
            }
        }
    })
print result
```
表示搜索name为zhi，age为25的信息，body的检索方式称为DSL语句查询。

## DSL部分语句详解

### term过滤

    term 主要用于精确匹配哪些值，比如数字，日期，布尔值或not_analyzed的字符串(未经分析的文本数据类型)：

    {"term":{"age":26}}

### terms过滤
	
    terms跟term有点类似，但terms允许指定多个匹配条件。如果某个字段指定了多个值，那么文档需要一起去做匹配：

    {"terms":{"tag":["search","full_text","nosql"]}}
	
### range过滤

    range过滤允许我们按照指定范围查找一批数据：

    {"range":{"age":{"gte":20,"lt":30}}}

    范围操作符包含：
	gt	::	大于
	gte	::	大于等于
	lt	::	小于
	lte	::	小于等于

### exists和missing过滤

    exists和missing过滤可以用于查找文档中是否包含指定字段或没有某个字段，类似于SQL语句中的IS_NULL条件

    {"exists":{"field":"title"}}

    这两个过滤只是针对已经查出一批数据来，但是想区分出某个字段是否存在的时候使用。

### bool过滤

    bool过滤可以用来合并多个过滤条件查询结果的布尔逻辑，它包含一下操作符：

    must		::	多个查询条件的完全匹配,相当于	and	。
	must_not	::	多个查询条件的相反匹配，相当于	not	。
	should		::	至少有一个查询条件匹配,相当于	or	。
    这些参数可以分别继承一个过滤条件或者一个过滤条件的数组：

    {"bool":{"must":{"term":{"folder":"inbox"}},"must_not":{"term":{"tag":"spam"}},"should":[{"term":{"starred":true}},{"term":{"unread":true}}]}}

### match_all查询

    使用match_all可以查询到所有文档，是没有查询条件下的默认语句。

    {"match_all":{}}

    此查询常用于合并过滤条件。比如说你需要检索所有的邮箱,所有的文档相关性都是相同的，所以得到的_score为1
	
### multi_match查询

    multi_match	查询允许你做match查询的基础上同时搜索多个字段：

    {"multi_match":	{"query":"full text	search","fields":["title","body"]}}
	
### bool查询

    bool查询与bool过滤相似，用于合并多个查询子句。不同的是，bool过滤可以直接给出是否匹配成功，而bool查询要计算每一个查询子句的_score（相关性分值）。

    must	 ::	查询指定文档一定要被包含。
	must_not ::	查询指定文档一定不要被包含。
	should	 ::	查询指定文档，有则可以为文档相关性加分。

    以下查询将会找到title字段中包含"how to make millions"，并且"tag"字段没有被标为spam	。如果有标识为"starred"或者发布日期为2014年之前，那么这些匹配的文档将比同类网站等级高：

    {"bool":{"must":{"match":{"title":"how to make millions"}},"must_not":{"match":{"tag":"spam"}},"should":[{"match":{"tag":"starred"}},{"range":{"date":{"gte":"2014-01-01"}}}]}}

    提示：	如果bool查询下没有must子句，那至少应该有一个should子句。但是如果有must子句，那么没有should子句也可以进行查询。
	
### 更多

提供两个入口查询：
1.[官网](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
2.[PDF中文版](/file/elasticsearch.pdf)

# End

今天的讲解就到这里咯，都是大致的说明下，更加详细的信息还是得查询文档。