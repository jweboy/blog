---
title: 知识点收集
---

# 进程、线程、协程

- 进程是 cpu 资源分配的最小单位（是能拥有资源和独立运行的最小单位）
- 线程是 cpu 调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）

tips: **单线程与多线程**，都是指**在一个进程内**线程的单和多。（所以核心还是得属于一个进程才行）

- 浏览器是多进程。
- 每打开一个 Tab 页，就是创建了一个浏览器进程。

## 浏览器进程

1. Browser 进程（主进程），主要负责协调、主控。

   - 负责浏览器界面展示、用户交互。
   - 负责管理各个页面。
   - 负责管理网络资源。

2. 第三方插件进程

3. GPU 进程，负责 3D 绘制等。

4. Renderer 进程（浏览器内核），内部是多线程，负责页面渲染、脚本执行、事件处理等。

   Browser 进程和 Renderer 进程通信：首先需要获取页面内容（譬如通过网络下载资源），随后将该任务通过 RendererHost 接口传递给 Render 进程

## 前端而言对主要的是 渲染进程（Renderer 进程）

- GUI 渲染线程
  - 负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。
  - GUI 渲染线程与 JS 引擎线程是互斥的。
- JS 引擎线程（JS 内核）
  - 负责处理 Javascript 脚本程序
  - 负责解析 Javascript 脚本，运行代码。
  - 一个 Tab 页（renderer 进程）中无论什么时候都只有一个 JS 线程在运行 JS 程序。
  - GUI 渲染线程与 JS 引擎线程是互斥的。
- 事件触发线程
  - 归属于浏览器而不是 JS 引擎，用来控制事件循环。
  - 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理。
- 定时触发器线程
  - `setInterval`与`setTimeout`所在线程。
  - W3C 在 HTML 标准中规定，规定要求 setTimeout 中低于 4ms 的时间间隔算为 4ms。
- 异步 http 请求线程
  - 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求。
  - 将检测到状态变更时，如果设置有回调函数，异步线程就**产生状态变更事件**，将这个回调再放入事件队列中，由 JavaScript 引擎执行。

## Web Worker

- 创建 Worker 时，JS 引擎向浏览器申请开一个子线程（子线程是浏览器开的，完全受主线程控制，而且不能操作 DOM）。
- JS 引擎线程与 worker 线程间通过特定的方式通信（postMessage API，需要通过序列化对象来与线程交互特定的数据）。

## 浏览器渲染流程

1. 解析 html 建立 dom 树。
2. 解析 css 构建 render 树（将 CSS 代码解析成树形的数据结构，然后结合 DOM 合并成 render 树）。
3. 布局 render 树（Layout/reflow），负责各元素尺寸、位置的计算。
4. 绘制 render 树（paint），绘制页面像素信息。
5. 浏览器会将各层的信息发送给 GPU，GPU 会将各层合成（composite），显示在屏幕上。

<!-- ![](https://user-gold-cdn.xitu.io/2018/1/22/1611cb18d3a3938b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) -->

## css 加载是否会阻塞 dom 树渲染

**css 是由单独的下载线程异步下载**

- css 加载不会阻塞 DOM 树解析（异步加载时 DOM 照常构建）
- 但会阻塞 render 树渲染（渲染时需等 css 加载完毕，因为 render 树需要 css 信息）

## macrotask 和 microtask

- macrotask：主代码块，setTimeout，setInterval 等（可以看到，事件队列中的每一个事件都是一个 macrotask）
- microtask：Promise，process.nextTick 等（**在 node 环境下，process.nextTick 的优先级高于 Promise**）
- macrotask 中的事件都是放在一个事件队列中的，而这个队列由 **事件触发线程** 维护
- microtask 中的所有微任务都是添加到微任务队列（Job Queues）中，等待当前 macrotask 执行完毕后执行，而这个队列由 **JS 引擎线程** 维护 。

### 运行机制

- 执行一个宏任务（栈中没有就从事件队列中获取）
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染
- 渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取

### `Promise`的`polyfill`与官方版本的区别

- 官方版本中，是标准的 microtask 形式
- polyfill，一般都是通过 setTimeout 模拟的，所以是 macrotask 形式

# 从输入 URL 到页面加载的过程

1. 浏览器接收到 URL 开启一个网络线程。
2. 网络线程中发出完整的 http 请求。
   1. DNS 查询对应的 IP 地址（**域名查询时有可能是经过了 CDN 调度器的（如果有 cdn 存储功能的话）**）
      - 如果浏览器有缓存就用浏览器缓存，否则就用本机缓存，再没有就用 host
      - 如果本地没有就查询 DNS 服务器查询到对应的 IP 地址
   2. TCP / IP 请求（三次握手、四次挥手）
   3. 五层因特网协议
      1. 应用层发送 http 请求
      2. 传输层通过三次握手建立 tcp / ip 连接
      3. 网络层 ip 寻址
      4. 数据链路层封装成帧
      5. 物理层物质介质传输
3. 服务器接收到请求之后对应的后台对请求进行处理。
4. 前后端 http 交互。
5. 交互之间可能涉及到 http 缓存问题。
6. 浏览器解析接收到数据包。
   1. 解析 HTML 构建 DOM 树。
   2. 解析 CSS 生成 CSS 规则树。
   3. 将 HTML 树和 CSS 规则树合成 render 树。
   4. 将 render 树进行布局。
   5. 绘制 render 树。
   6. GPU 将图层展示在屏幕上。

# get 和 post 请求的区别

get 请求会产生一个数据包，post 请求会产生两个数据包。

- get 请求时，浏览器会把`headers`和`data`一起发送出去，服务器响应 200（返回数据）
- post 请求时，浏览器先发送`headers`，服务器响应`100 continue`， 浏览器再发送`data`，服务器响应 200（返回数据）

# cookie 用于身份校验的场景

1. 用户登录之后在服务端生成一个 `session` 保存当前用户信息。
2. 此时会有一个对应的 `sessionId`（相当于服务端这个 `session` 对应的 `key`）。
3. 然后服务端在请求头中写入这个 `session`。
4. 浏览器本地获取到 `session`之后，在同域名页面下就可以通过 `session`来访问，有效时间内无需二次验证。

# defer 和 async 区别

- `async`是异步执行，异步下载完毕后就会执行，不确保执行顺序，一定在`onload`前，但不确定在`DOMContentLoaded`事件的前或后
- `defer`是延迟执行，在浏览器看起来的效果像是将脚本放在了`body`后面一样（虽然按规范应该是在`DOMContentLoaded`事件前，但实际上不同浏览器的优化效果不一样，也有可能在它后面）

# JS 解释过程

1. 读取代码进行词法分析，然后将代码解释成词元。
2. 对词元进行语法分析，然后将代码转换成语法树。
3. 使用编译器将语法树转换成字节码。
4. 使用字节码编译器将字节码转换成机器码。

# 跨域

## JSONP

JSONP 只能用于 `GET` 请求，不能用于其他请求。

## CORS 请求

### 原理

`cors` 请求分为 `简单请求` 和 `非简单请求`，`非简单请求`会在请求发送之前发送一个 `option`请求。

### 简单请求

`简单请求` 就是浏览器直接发起 CORS 请求，在请求头信息中增加一个 `Origin` 字段。判定为该类型请求主要满足以下两点：

- 请求方法为 HEAD，GET，POST
- HTTP 请求头信息不超过以下几种字段：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type（只限于 `application/x-www-form-urlencoded`， `multipart/form-data`, `text/plain`）

### 非简单请求

`非简单请求` 就是对服务器有特殊要求，会在正式通信之前，发送一个 `预检请求`。判定为该类型请求主要满足以下两点：

- 请求方法为 PUT，DELETE
- HTTP 请求头信息中的 `Content-Type` 字段是 `application/json`

#### options 预检优化

```js
Access - Control - Max - Age;
```

加上这个请求头信息之后，在这个时间范围内，所有同类型的请求都将不再发送预检请求而是直接使用此次返回的头作为判断依据。

## 代理

# Web 安全

## CSRF

`csrf` 就是伪造用户身份进行恶意操作，它与 Ajax 请求无关。

### 防范措施

- 验证 HTTP 请求头中的 `Referer` 字段（无法保证浏览器的安全漏洞是否影响到该字段，因此不是最精准的方法）。
- 增加用户 token 进行验证。

## XSS

`xss` 就是跨域脚本恶意注入，它与 Ajax 请求无关，主要有以下三种类型：

- `cookie` 劫持
- 会话伪造
- 恶意代码

### 防范措施

- 过滤输入
- 输出编码
- `cookie` 设置 `httponly`
- `cookie` 防盗，避免在 `cookie` 中泄露用户隐私

## SQL 注入

`sql`注入与 `ajax` 无关。

# 判断数组的方法

1. `Object.prototype.toString.call()`，常用于判断浏览器内置对象。

```js
Object.prototype.toString.call("haha"); // "[object String]"
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call(Symbol(1)); // "[object Symbol]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(function () {}); // "[object Function]"
Object.prototype.toString.call({ name: "houhou" }); // "[object Object]"
```

2. `instanceof`，根据原型链中查找对应类型的 `prototype `，只能判断对象类型，不能判断原始类型。

```js
[] instanceof Array; // true
[] instanceof Object; // true
```

3. `Array.isArray()`，ES5 新增的方法。当检测 Array 实例的时候，`Array.isArray` 优于 `instanceof`，因为 `Array.isArray` 可以检测出 `iframe`。

# flex:1 扩展属性

Flex:1 是由 `flex-grow`、`flex-shrink` 和 `flex-basis` 三个属性组成。

# React 和 Vue 区别

1. 数据流：

   - `react` 是单向数据流。
   - `vue` 是双向绑定。vue1.0 支持父子组件之间的双向绑定，vue2.x 只支持组件和 DOM 之间的双向绑定。

2. 混入：

   - react 采用 hoc。
   - Vue 采用 mixins。

3. 通信：

   - vue 有以下几种方式
     - 父组件通过 props 给子组件传递数据。
     - 子组件通过 事件 向父组件传递数据。
     - 通过 prodive / inject 实现跨层级数据通信。
   - react 有以下几种方式
     - 父组件通过 props 给子组件传递数据。
     - 通过 context 进行跨层级数据通信。

4. 运行性能优化：

   - react 需要手动控制 `shouldComponentUpdate` 或者使用 `PureComponent` 来避免不必要的子组件重渲染。
   - Vue 自动跟踪组件的依赖，控制组件的渲染问题。

5. 渲染模版

   - react 采用 jsx 渲染模版。
   - Vue 采用扩展的 HTML 语法模版。

# React 函数组件和类组件的区别

1. 函数组件没有生命周期
2. 函数组件没有内部状态（`state`）
3. 函数组件没有 `this` 实例

# React 组件优化思路

1. shouldComponentUpdate
2. PureComponent
3. 容器组件、傻瓜组件
