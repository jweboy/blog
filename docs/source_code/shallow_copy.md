---
title: 探究浅拷贝的实现
---

```js
function shallowCopy(obj) {
  let data = obj instanceof Array ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      data[key] = obj[key];
    }
  }

  return data;
}

console.log(shallowCopy({ a: 1, b: 2 }));
console.log(shallowCopy([2, 34, 65]));

```
