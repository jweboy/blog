---
title: 手撕 call 实现
---

```js
/* eslint-disable */
Function.prototype._call = function (context, ...args) {
  // 创建 symbol 类型的 key，保证此键值唯一不被 context 原有属性覆盖
  const key = Symbol("key");
  // 在 context 新增一个 Symbol(key) 临时属性，对应的值指向绑定函数（this）
  context[key] = this;
  // 执行绑定函数，动态传入参数集合，返回函数执行的结果
  const result = context[key](...args);
  // 临时属性 Symbol(key) 使用完成后删除，确保不影响 context 原有数据结构
  delete context[key];
  // 抛出函数执行结果
  return result;
};

const me = { name: "Jack" };
function say(...args) {
  console.log(
    `My name is ${this.name || "default"}. Desc: ${args.join(",") || "init"}`
  );
  return "test is ok";
}
const result = say._call(me, "sunshine", "sunner");
console.log("resilt=>", result);

```
