---
title: 摸索对象深拷贝的玄学
---

```js
const deepClone = (obj) => {
  const cache = new Map();

  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // console.log("obj=>", obj);

  // 处理函数
  if (obj instanceof Function) {
    return (...args) => {
      obj.apply(this, args);
    };
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  const res = Array.isArray(obj) ? [] : {};

  cache.set(obj, res);
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (obj[key] instanceof Object) {
      res[key] = deepClone(obj[key]);
    } else {
      res[key] = obj[key];
    }
  }

  console.log([...cache.values()]);

  return res;
};

const source = {
  name: "biubiubiu",
  meta: {
    age: 38,
    birth: new Date("1997-10-10"),
    ary: [1, 2, { a: 1 }],
    say(name) {
      console.log(`Hello ${name}`);
    }
  }
};

source.mirror = source;

const copyObj = deepClone(source);

copyObj.meta.say("jweboy");
console.log(deepClone(source));

```
