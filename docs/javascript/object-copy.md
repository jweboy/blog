---
title: 对象拷贝
---

#

## 浅拷贝

```js
const foo = { a: 1 }
const bar = { b: 1 }
const test = Object.assign(foo, bar)

console.log(test === foo) // true
// test的指针指向了foo,被认为是同一个对象，即修改foo同时test也会被修改
```

## 深拷贝

```js
JSON.parse(JSON.stringify(obj));
```

```js
function Person(name) {
    this.name = name
}

const oneMan = new Person('Jhon')

const oldObj = {
    say:function() {},
    list: new Array(1),
    reg: new RegExp('a'),
    obj: oneMan,
    a: oldObj
}

const cloneObj = JSON.parse(JSON.stringify(oldObj))

console.log(cloneObj.say) // undefined => 无法复制函数
console.log(cloneObj.list) // null => 稀疏数组复制错误
console.log(cloneObj.reg) // {} => 无法复制正则对象
console.log(cloneObj.obj.constructor) // Object => 构造函数指向错误
console.log(cloneObj.a) // Converting circular structure to JSON => 对象的循环引用出错
```

## 优化方案

```js
// https://segmentfault.com/a/1190000008637489

function initialPlainObject(source) {
  return (source.constructor === Array) ? [] : {};
}

function deepCopy(source) {
  var obj = initialPlainObject(source);
  for (var key in source) {
      if(source.hasOwnProperty(key)) {
          if (typeof source[key] === 'object') {
            const value = source[key];
            if(Object.prototype.toString.call(value) === '[object RegExp]') {
              const copyFlags = /\w*$/;
              const result = new value.constructor(value.source, copyFlags.exec(value));
              result.lastIndex = value.lastIndex;
              obj[key] = result;
            } else {
              obj[key] = initialPlainObject(source[key]);
              obj[key] = deepCopy(source[key]);
            }
          } else {
            obj[key] = source[key];
          }
      }
  }
  return obj;
}

// var obj = {
// reg: /\.js$/,
//   arr: [1, 2, 3],
//   obj: {
//     key: 'value'
//   },
//   func: function(){
//     return 1;
//   },
// }
```