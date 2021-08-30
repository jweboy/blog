---
title: 迭代器模式
---

## 定义

`迭代器模式` 是提供一种方法顺序访问一个聚合对象的各个元素，而又不需要暴露该对象的内部表示。基于这一点，`迭代器模式` 在业务迭代的过程中起到了抽离迭代过程的作用，使得使用者无需关心对象的内部构造，也能顺序访问其中的每个元素。

接下来我们来看一个 `迭代器模式` 的基础示例：

```js
var each = function (arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback.call(this, i, arr[i]);
  }
};

each([1, 2, 3], function (i, n) {
  console.log([i, n]);
});

```

## 分类

### 内部迭代器

`内部迭代器` 模式会在其内部定义好迭代规则，外部只需要调用一次即可，那么它的缺点也很明显，由于内部的迭代规则已被提前约定，那么将无法适用于多个相类似的。（如：上面的示例无法迭代多个数组）

### 外部迭代器

`外部迭代器` 目的在于显式地请求迭代下一个元素。

接下来我们借助 `es6` 的 `Generator`来看具体实现：

```js
function* generatorEach(arr) {
  for (let [index, value] of arr.entries()) {
    yield console.log([index, value]);
  }
}

let each = generatorEach([1, 2, 3]);
each.next();
each.next();
each.next();
```
