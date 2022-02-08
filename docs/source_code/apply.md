---
title: 手写 apply
---

```js
/* eslint-disable */
Function.prototype._call = function (context, ...args) {
  let result;
  // 创建 symbol 类型的 key，保证此键值唯一不被 context 原有属性覆盖
  const key = Symbol("key");
  // 在 context 新增一个 Symbol(key) 临时属性，对应的值指向绑定函数（this）
  context[key] = this;

  // 获取动态参数集合第一项
  const firstParams = args[0];

  // 执行绑定函数，传入参数集合（只传入第一项），返回函数执行的结果
  if (firstParams) {
    result = context[key](...firstParams);
  } else {
    result = context[key]();
  }

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
}
const result = say._call(me, ["sunshine", "sunner"], "today");

```
