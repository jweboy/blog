---
title: 手撕 bind 原理
---

```js
/**
 * 1. 可以指定this
 * 2. 返回一个函数
 * 3. 可以传入参数
 * 4. 函数柯里化
 */

Function.prototype._bind = function (context, ...args) {
  // 需要绑定 this 的原函数
  const self = this;
  // 保存原函数在 bind 时传入的参数集合
  const bindParams = [...args];

  const bindFunc = function (...args) {
    // 保存 bind 后函数调用传入的参数集合
    const params = [...args];

    console.log("this => ", bindParams, params);

    // 非 new 普通函数调用，this 默认指向 window，则将绑定函数（context） 的 this 绑定给原函数（self）
    // new 构造函数调用，this 默认指向构造函数实例，则将构造函数实例的 this 绑定给原函数（self）
    return self.apply(this instanceof bindFunc ? this : context, [
      ...bindParams,
      ...params
    ]);
  };

  // 继承绑定函数的 [[prototype]]，以访问绑定函数原型上的值
  bindFunc.prototype = Object.create(this.prototype);
  return bindFunc;
};

var value = 2;
var foo = {
  value: 1
};

function bar(...args) {
  return this.value + args.join("/");
}

var bindFoo = bar._bind(foo, "bind", "data");
console.log(bindFoo("bindFoo"));

// function bar(name, age) {
//   this.habit = "shopping";
//   console.log(this.value);
//   console.log(name);
//   console.log(age);
// }
// bar.prototype.friend = "kevin";

// var bindFoo = bar.bind(foo, "Jack");
// var obj = new bindFoo(20);
// console.log(obj, obj.friend);

```
