---
title: 模拟 new Object 过程
---

```js
function newObject(Func, ...args) {
  // let instance;
  const instance = {};

  // 将新对象通过 [[Prototype]] 链实现对 Func.prototype 继承，否则就默认继承自 Object.prototype
  if (Func.prototype) {
    // instance = Object.create(Func.prototype);
    // 指定对象 [[Prototype]] 属性，但是无论在 JS 引擎还是浏览器中这都会是个耗费性能的操作，考虑性能的话可以用 Object.create https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
    Object.setPrototypeOf(instance, Func.prototype);
  }

  // 绑定 this 指向新对象，传递外部参数，返回 Func 函数的执行结果
  const result = Func.apply(instance, args);
  console.log("result=>", result, typeof result);

  // 返回函数或者对象类型，不包括 null
  if (
    typeof result === "function" ||
    (typeof result === "object" && result !== null)
  ) {
    return result;
  }

  // 返回非对象类型（如：Date、Symbol 等）
  return instance;
}

function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  console.log(`My name is ${this.name}`);
};

const person = newObject(Person, "biubiubiu");
person.sayName();
console.log(person);

function Test() {
  return "test";
}

function returnObject() {
  return { obj: "ok" };
}

function returnNull() {
  return null;
}

function returnFunc() {
  return () => {
    console.log("func");
  };
}

function returnArray() {
  return new Array(4);
}

function returnDate() {
  return Date();
}

function returnSymbol() {
  return Symbol("uniqe");
}

newObject(Test);
newObject(returnObject);
newObject(returnNull);
newObject(returnArray);
newObject(returnDate);
newObject(returnFunc);
newObject(returnSymbol);
// console.log(Person.prototype);
// console.log(Person.prototype.constructor === Person);
// console.log(person.__proto__ === Person.prototype);

```
