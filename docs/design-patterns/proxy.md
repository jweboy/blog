---
title: 代理模式
---

## 定义

`代理模式` 是为一个对象提供一个代用品或者占位符，以便控制对它的访问。`代理模式` 的关键在于当需求方不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，需求方实际上访问的是这个替身对象，替身对象在对请求做出一些处理之后，再把请求转交给本体对象。

## 模式

在通用的 `代理模式` 中有多种变体类型，不过在 `Javascript` 中常用的主要是 **虚拟代理** 和 **缓存代理**，接下来让我们围绕这两个主题展开讨论。

### 虚拟代理

在 `web应用` 开发过程中，`图片预加载` 是一项实用有效的技术手段，通过用一张 loading 图片占位，等待异步加载图片完成之后再将新的图片填充到 img 标签里。那么在这个业务场景中，通过 `图片预加载` 技术提高了不仅用户的使用体验，同时又给 `虚拟代理` 模式带来了技术可行性。

以下是使用 `虚拟代理` 实现的 `图片预加载` 示例：

```js
var myImage = (function () {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);

  return {
    setSrc: function(src) {
      imgNode.src = src;
    },
  };
})();

var proxyImage = (function () {
  var img = new Image();
  img.onload = function() {
    myImage.setSrc(this.src);
  };

  return {
    setSrc: function(src) {
      myImage.setSrc('/Users/biubiubiu/projects/blog/static/loading.gif');
      img.src = src;
    },
  };
})();

proxyImage.setSrc('https://ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/e4dde71190ef76c6ac26b6319516fdfaaf516737.jpg')
```

### 缓存代理

`缓存代理` 的目的是为一些开销大的运算结果提供暂时存储，以便下次调用时，在参数与结果不变情况下，直接从缓存返回结果，而不是重新进行本体运算，减少本体调用次数。

#### 示例

假设有一个计算总和的 `sum` 函数，同时有一个对应 `proxySum` 代理函数通过**内存缓存**来控制结果集，我们会发现当 `proxySum(2, 3, 4)` 第二次被调用时，本体 `sum` 函数并没有被计算，而是直接返回已缓存好的计算结果。从这个例子中，我们可以看到 `缓存代理` 发挥了自身的优势，从而让 `sum` 函数能够更专注自身的计算职责，缓存由代理代理对象来实现，这也很好地应证了 `关注点分离` 和 `单一职责` 原则。

```js
var sum = function (...args) {
  console.log("开始计算总和");
  var a = 0;
  for (let i = 0; i < args.length; i++) {
    a += args[i];
  }
  return a;
};

var proxySum = (function () {
  var cache = {};
  return function (...args) {
    console.log(args);
    const key = args.join(",");
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      return cache[key];
    }
    
    cache[key] = sum.apply(this, args);
    return cache[key];
  };
})();

console.log(proxySum(2, 3));
console.log(proxySum(2, 3, 4));
console.log(proxySum(2, 3, 4));

```
