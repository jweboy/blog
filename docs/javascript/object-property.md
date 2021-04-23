---
title: 对象属性
---

# 

## 属性特征

对象属性除了包括名字和值之外，每个属性都有相关联的 “属性特性”。

- `可写` 表示可以设置该属性值
- `可枚举` 表示是否可以通过 `for/in` 循环返回该属性
- `可配置` 表示是否可以删除或者修改该属性

## 属性访问

`null` 和 `undefined` 都没有属性，因为查询属性会报错。

```js
var num;
console.log(num.length); // Cannot read property 'length' of undefined
```

以下几种情况在给对象 `object` 设置 `prop` 属性会失败：

- `object` 的属性 `prop` 只读，不能给只读属性重新赋值（`defineProperty()`方法中有个例外）// TODO: 例外的🌰
