---
title: 快速理解 typeof 的实现
---

```js
function typeOf(value) {
  const key = Object.prototype.toString.call(value);
  return key.slice(8, -1).toLowerCase();
}

console.log(typeOf(undefined));
console.log(typeOf(null));
console.log(typeOf(1));
console.log(typeOf(""));
console.log(typeOf(false));
console.log(typeOf(Symbol("1")));

```
