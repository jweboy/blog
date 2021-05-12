---
title: Map 和 Object 的区别
---

![ss](https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/blog/map-object-comparison.jpeg)

众所周知 `JavaScript` 的 `Object` 和 `Map` 这两种数据结构很相似，
但深究底层原理来看，这两者本质上还是存在了不少差异，通过区别比较能帮助我们更好地理解它们的用处和使用场景。

## 键类型

### Object

`Object` 的键必须是 `String` 或 `Symbol` 类型，并默认调用 `toString` 方法将键转化为 `String` 类型，因此可能会存在[同名键覆盖问题](#键唯一性)。

> 注：`Array` 和 `Function` 本质是对 `Object` 的继承，因此都有对应的 `toString` 方法。

#### 对象键

将对象作为键时会调用 `Object.toString` 方法将其转化为对象字符串 (`"[object Object]"`)。

```js
({}.toString()); // "[object Object]"

var obj = {};
obj[{}] = "ok";
console.log(JSON.stringifpwdy(obj)); // {"[object Object]":"ok"}
```

#### 数组键

将数组作为键时会调用 `Array.toString` 方法将其转化为空字符串 (`""`)。

```js
[].toString(); // ""

var obj = {};
obj[[]] = "ok";
console.log(JSON.stringify(obj)); // {"":"ok"}
```

#### 函数键

将函数作为键时会调用 `Function.toString` 方法将其转化为函数字符串 (`"() => {}"`)。

```js
(function test() => {}).toString(); // "() => {}"

var obj = {};
obj[() => {}] = "ok";
console.log(JSON.stringify(obj)); // {"() => {}":"ok"}
```

### Map

`Map` 支持任意类型的键。

> Map objects are collections of key/value pairs where both the keys and values may be arbitrary ECMAScript language values.

![map存储结构](https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/blog/map-structure.png)

## 键唯一性

### Object 同名键覆盖

由于 `Object` 的键默认会调用 `toString` 方法，因此当前键如果是空对象（`{}`）或者空数组（`[]`）的话，多次赋值会出现被覆盖的情况。

```js
var obj = {};
obj[{}] = "step1";
obj[{}] = "step2";
console.log(JSON.stringify(obj)); // {"[object Object]":"step2"}
```

### Map 唯一键

在 `Map` 中每个键都是唯一的，在存储过程中 `Map` 会对存入键的 `类型` 或 `引用` 进行比较。假设当前 `Map` 存入了两个空对象（`{}`），两者类型相同，但在 `栈` 中引用的内存地址不同，那么 `Map` 就会认定为是两个独立键，示例如下：

![Map唯一键](https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/blog/map-unique-key.png)

## 遍历次序

#### Object 无序

在遍历 `Object` 后得到的结果是一个无序列表。

```js
var obj = { 1: 1, 2: 2, a: "a", f: "f" };
console.log(Object.keys(obj)); // ["1", "2", "a", "f"]

obj = { a: "a", 1: 1, 2: 2, f: "f" };
console.log(Object.keys(obj)); // ["1", "2", "a", "f"]
```

#### Map 有序

在遍历 `Map` 后得到的结果是一个有序列表。

```js
var map = new Map();

map.set(1, 1);
map.set("a", "a");
map.set(2, 2);
console.log([...map.values()]); // [1, "a", 2]
```

## 可遍历

### Object

`Object` 没有实现遍历器（`@@iterator`）接口，无法使用 `for of` 遍历，但可以用 `for in` 等方法遍历。当然，`Object` 原生不支持但可以扩展 `@@iterator` 实现遍历，详见 [iterator](/docs/javascript/iterator)。

```js
var obj = { a: "a", 1: 1, 2: 2, f: "f" };

for (key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key);
  }
}

console.log(Object.keys(obj)); //  ["1", "2", "a", "f"]
```

### Map

`Map` 内部实现了遍历器（`@@iterator`）接口，可以使用 `for of` 遍历。

> Map.prototype [ @@iterator ] ( )

```js
var map = new Map();

map.set(1, 1);
map.set("a", "a");
map.set(2, 2);

for (item of map) {
  console.log(item);
}
```

## 继承关系

从原型链继承结构中，我们可以看到 `Map` 底层实际上是继承自 `Object` ，即 `Map` 是 `Object` 的实例对象，反之 `Object` 并不是 `Map` 的实例对象。

![map继承关系](https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/blog/map-extend.png)

## 参考文档

[ECMA 官方文档](https://262.ecma-international.org/10.0/#sec-keyed-collections)
