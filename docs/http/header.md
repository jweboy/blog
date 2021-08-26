---
title: 首部字段
---

## 请求报文

请求报文由方法、`URI` 、 `HTTP` 版本和 `HTTP` 首部字段组成。

## 响应报文

响应报文由 `HTTP`版本、状态码（数字和原因短语）、`HTTP` 首部字段组成。

## HTTP首部字段

首部字段有以下四种类型：

- 通用首部字段
- 请求首部字段
- 响应首部字段
- 实体首部字段

## 通用首部

通用首部指的是请求报文和响应报文都会使用的首部。

### Cache-Control

```js
Cache-Control：private，max-age=0, no-cache
```
#### public指令

```js
Cache-Control：public
```

可向任意方提供响应的缓存

#### private指令

```js
Cache-Control：private
```

向特定用户提供响应的缓存。缓存服务器只对特定用户提供资源缓存服务，对于其他用户则不会缓存。

#### no-cache指令

```js
Cache-Control：no-cache
```

不缓存过期的资源。客户端发送请求包含 `no-cache` 指令，则客户端不会接收缓存过的响应，”中间“缓存服务器必须把客户端请求转发给源服务器。
如果服务器返回的响应中包含 `no-cache` 指令，则缓存服务器不能对资源进行缓存。源服务器不会对缓存服务器请求中的资源进行确认，且禁止对其响应资源进行缓存操作。

```js
Cache-Control: no-cache=Location
```

如果响应报文首部字段 `Cache-Control` 中对 `no-cache` 字段名具体指定参数值，则客户端接收到这个响应报文后，就不能使用缓存。

#### no-store指令

```js
Cache-Control：no-store
```

指定缓存不能再本地存储请求或响应的任何部分。

#### s-maxage指令

资源保存为缓存的最长时间。

```js
Cache-Control：s-maxage=604800（单位：秒）
```

- 该指令只适用于供多位用户使用的公共缓存服务器。
- 当使用 `s-maxage` 指令后，将忽略 `Expires` 首部字段和 `max-age` 指令处理。
- 当指定 `max-age` 值为 `0`，缓存服务器会将请求转发到源服务器。
- `HTTP/1.1` 版本的缓存服务器在同时存在 `Expires` 首部字段时会优先处理 `max-age` 指令，而 `HTTP/1.0` 版本则相反。

#### min-fresh指令

```js
Cache-Control：min-fresh=60（单位：秒）
```

指定缓存服务器返回至少还未过指定时间的缓存资源。

#### max-stale指令

```js
Cache-Control：max-stale=3600（单位：秒）
```

指定缓存资源即使过期也照常接收。

#### only-if-cached指令

```js
Cache-Control： only-if-cached
```

指定客户端仅在服务器本地缓存目标资源的情况下才会返回。若发生请求的缓存服务器的本地缓存无响应，则返回状态码 `504`(`Gateway Timeout`)。

#### must-revalidate指令

```js
Cache-Control： must-revalidate
```

指定代理向源服务器再次验证即将返回的响应缓存目前是否仍然有效。若代理无法连通源服务器，则返回状态码 `504`(`Gateway Timeout`)。

#### proxy-revalidate指令

```js
Cache-Control： proxy-revalidate
```

指定所有缓存服务器在接收到客户端带有指令的请求返回之前，必须再次验证缓存的有效性。

#### no-transform指令

```js
Cache-Control： no-transform
```

指定缓存不能改变实体主题的媒体类型。

### Cache-Control扩展

.... TODO

### Connection

- 控制不再转发给代理的首部字段

    ```js
    Connection:不再转发的首部字段
    ```

- 管理持久连接

    ```js
    Connection: Keep-Alive / Close
    ```

### Date

创建 `HTTP` 报文的日期和时间。

### Pragma

`HTTP/1.1` 之前版本的历史遗留字段，仅作为 `HTTP/1.0` 向后兼容定义。

### Trailer


