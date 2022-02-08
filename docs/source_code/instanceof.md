---
title: 揭秘 instanceof 背后的秘密
---

```js
const _instanceof = (instance, target) => {
  // 获取实例原型，__proto__ 后续可能会被废弃可改用 getPrototypeOf
  let proto = instance.__proto__;
  // let proto = Object.getPrototypeOf(instance);

  // 获取构造函数的原型
  let prototype = target.prototype;

  while (true) {
    // 向上依次遍历，比较原型链上的实例原型是否与构造函数原型一致，直到最顶层原型链为 null 后就结束退出。
    if (proto === null) return false;
    if (proto === prototype) return true;

    // 依次记录每一层的实例原型
    proto = proto.__proto__;
  }
};

class Parent {}
class Child extends Parent {}
const child = new Child();
const obj = Object.create(null);

console.log(
  _instanceof(child, Parent),
  _instanceof(child, Child),
  _instanceof(child, Array),
  _instanceof([], Array),
  _instanceof(function () {}, Function),
  _instanceof({}, Object),
  _instanceof(obj, {})
);

```
