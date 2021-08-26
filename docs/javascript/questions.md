---
title: 题目积累
---

#

## 数组扁平化

将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组

```js
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

// flat去扁平化
var arr1 = [...new Set(arr.flat(Infinity))].sort((a, b) => a - b);

// 字符串转换
var arr1 = [...new Set(arr.toString().split(","))]
  .sort((a, b) => {
    return a - b;
  })
  .map(Number);

// reduce去扁平化
function flatten(arr) {
  return arr.reduce((_arr, item) => {
    const temp = Array.isArray(item) ? flatten(item) : [item];
    _arr = [..._arr, ...temp];
    return _arr;
  }, []);
}
var arr1 = [...new Set(flatten(arr))].sort((a, b) => a - b);
```

## `++i` 和 `i++` 的区别

```js
// i++
var a = 0;

var b = a++;

console.log(a); // 1
console.log(b); // 0

// ++i
var a = 0;

var b = ++a;

console.log(a); // 1
console.log(b); // 1
```

参考 ecma 文档

`++i` 返回计算结果的新值
![++i](http://assets.jweboy.com/blog-front-unary-operators.png)
`i++` 返回计算结果的旧值
![i++](http://assets.jweboy.com/blog-rear-unary-operators.png)

## 防抖

### 定义

对于短时间持续触发事件，防抖函数将该事件在指定时间内只触发一次。

### 应用场景

防抖函数分为 `延迟执行函数` 和 `立即执行函数`，分别针对以下两种情况：

- 例如浏览器窗口通过鼠标拖拽不断变化，需要读取窗口的某些信息来作计算，此时采用`延迟执行` 的防抖函数更合适。这个函数会在窗口大小不再变化时再进行计算，从而避免实时计算造成的页面卡顿问题。
- 例如表单提交的时候，用户可能会重复点击提交按钮，此时采用 `立即执行` 的防抖函数更合适。这个函数会在按钮事件触发后立即发送请求，请求成功之后用户会立即得到反馈。如果当用户重复点击按钮的时间间隔小于定时器的延迟时间则不会触发提交事件，只有当上一次调用时间与下一次调用时间间隔大于定时器的延迟时间才会重新触发提交事件。

### 具体实现

```js
function debounce(func, wait = 100, immediate = false) {
  let timer = null;

  function later(...args) {
    return setTimeout(() => {
      timer = null;

      // 延迟情况下调用函数
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
  }

  // 这个函数是实际调用的函数
  return function actualCallFunc(...args) {
    // 如果没有延迟执行函数就创建一个
    if (!timer) {
      timer = later.apply(this, ...args);

      // 如果是立即执行就调用函数
      if (immediate) {
        func.apply(this, args);
      }
    } else {
      // 如果存在延迟定时器，调用的时候会清除原来的定时器重新设定一个新的定时器开始重新计时
      clearTimeout(timer);
      timer = later.apply(this, ...args);
    }
  };
}
```

## 节流

### 定义

对于短时间持续触发事件，节流可以让函数在指定间隔的时间段不断执行。节流函数有以下三种情况，但是不能同时设置 `leading` 和 `trailing` 属性：

- 有头有尾：鼠标移入后立即执行，停止触发的时候还能再执行一次（不传入 `leading` 和 `trailing`）
- 无头有尾：鼠标移入后不会立即执行，停止触发的时候还能再执行一次（`leading: false`）
- 有头无尾：鼠标移入后立即执行，停止触发的时候不会再执行一次 （`trailing: false`）

### 应用场景

- `input` 搜索框的实时搜索功能，会在用户输入文字后不断触发请求，此时并发请求存在的 `竞态` 问题可能会导致数据返回次序不一致，从而使得用户不能得到准确的信息。

### 具体实现

```js
function throttle(func, wait, options = {}) {
  // 保存定时器
  let timer = null;
  // 保存之前的时间戳
  let previous = 0;
  // 保存函数参数
  let args;

  // 定时器的回调函数
  function later() {
    previous = +new Date();
    // 每次设置完定时器之后清空 timer 是为了给下一次定时器做判断，同时避免内存泄漏
    timer = null;
    func.apply(this, args);
  }

  return function actualCallFunc(...params) {
    // 获取当前时间戳
    const now = +new Date();
    // 首次进入的时候 previous 肯定是不存在的
    // 那么表达式 !previous 肯定是为 true
    // 如果需要第一次不执行函数，就把上一次的时间戳设置为当前时间戳
    // 那么此时的计算结果 remaining 肯定是和 wait 相等且大于 0， 不会进入下面的 if 语句
    if (!previous && options.leading === false) {
      previous = now;
    }

    // 触发 func 剩余时间
    const remaining = wait - (now - previous);

    args = params;

    // 触发这个条件有以下几种情况：
    // 1.用户手动更改了系统时间，此时 remaining > wait
    // 2.当前调用时间大于上次调用时间加上间隔时间或者两者正好相等，此时 remaining <= 0
    // 3.如果设置了 trailing 那么只会进入这个条件
    // 4.如果没有设置了 leading 那么第一次会进入这个条件
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timer && options.trailing !== false) {
      // 判断是否设置了定时器和 trailing
      // trailing 为 false 的时候不开启定时器
      timer = setTimeout(later, remaining);
    }
  };
}
```

## 参考

[Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/8)  
[ECMAScript® 2015 Language Specification](https://www.ecma-international.org/ecma-262/6.0/)
