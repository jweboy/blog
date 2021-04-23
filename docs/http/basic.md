---
title: 协议说明
---

# http协议

## 定义

- http是无状态协议,不做持久化处理。
- 使用URI定位资源,不特定指定资源可用 * 代替

## 请求报文

由请求方法、请求URI、协议版本、可选的请求首部字段和内容实体组成。

```js
GET /api HTTP/1.1

Host: 118.24.155.105
User-Agent: curl/7.54.0
Accept: */*

```

## 响应报文

由协议版本、状态码、解释状态码的原因短语、可选的响应首部字段和实体主体组成。

```js
HTTP/1.1 200 OK

access-control-allow-origin: *
access-control-allow-methods: GET,PUT,POST,DELETE
content-type: application/json; charset=utf-8
content-length: 21
Date: Sat, 09 Jun 2018 15:55:11 GMT
Connection: keep-alive

fastify RESTful API
```

## 请求方法

- GET 获取资源
- POST 传输实体主体
- PUT 传输文件
- HEAD 获得报文首部
- DELETE 删除文件
- OPTIONS 查询针对请求URI指定的资源支持的方法
- TRACE 跟踪路径
- CONNECT 要求使用隧道(TCP通信),采用SSL和TLS协议把通信内容加密进行网络隧道传输。
- LINK 建立和资源之间的联系
- UNLINK 断开链接关系

## 持久连接

- 持久连接：只要一端没有明确断开连接，则保持TCP连接状态。(http1.1默认持久连接)。
- 管线化：同时并行请求。