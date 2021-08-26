---
title: 探索class底层实现原理
---

`ECMAScript6` 实现了 [`class`](https://tc39.es/ecma262/#sec-class-definitions) ，实际上它是一个语法糖，但是它的出现能使 `JS` 编码更清晰，更接近 `面向对象编程`。

## 实现原理

首先我们来看 `ES6` 中 `class` 的实现和 `ES5` 构造函数的实现，两者相比较不难看出 `constructor` 其实就是构造方法，指向 `ES5` 的构造函数，那么 `class` 本身指向的是构造函数，换言之底层依旧是构造函数。

### ES6

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  static run() {
    console.log("run");
  }
  say() {
    console.log("hello!");
  }
}
```

### ES5

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.say = function () {
  console.log("hello!");
};

Person.run = function () {
  console.log("run");
};
```

### babel 编译分析

通过 `babel` 编译器将 `ES6` 代码 转换成 `ES5` 代码之后（代码转换可以试用 [babel 官方在线工具](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=entry&corejs=3.6&spec=false&loose=false&code_lz=MYGwhgzhAEAKCmAnCB7AdtA3gKGnvw6EALogK7DEqIAUaYAtvADTRgDm8AlFrvgJDEAFgEsIAOnpNoAXmhT4Abj75og0RI7xZbTstUBfPiugkwxEcGjk0NHjlUEiKEPHEgU7GgCIb3riZGqhBgAJ52vKr8hGioru6ePkLwIB4AhP6B2EbYQA&debug=false&forceAllTransforms=true&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=script&lineWrap=true&presets=env&prettier=true&targets=&version=7.13.17&externalPlugins=)），可得到这两个关键函数 `_defineProperties` 和 `_createClass`，现在我们来一一解析说明。

```js
...
var Person = /*#__PURE__*/ (function () {
  "use strict";

  function Person(name, age) {
    _classCallCheck(this, Person);

    this.name = name;
    this.age = age;
  }

  _createClass(
    Person,
    [
      {
        key: "say",
        value: function say() {
          console.log("hello!");
        },
      },
    ],
    [
      {
        key: "run",
        value: function run() {
          console.log("run");
        },
      },
    ]
  );

  return Person;
})();
```

#### \_createClass

`_createClass` 函数主要用于配置构造函数或构造函数原型上的公有函数和静态方法，并返回构造函数本身。

```js
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
```

#### \_defineProperties

`_defineProperties` 函数主要用于声明公有函数和静态方法的描述符，并将其挂载到当前的构造函数或构造函数原型。它接收两个参数 `target`（） 和 `props`。

- `target` 指向当前的构造函数或构造函数原型
- `props` 数组类型，指向公有函数和静态方法

在遍历数组时，我们可以看到 `enumerable` 默认是 `false`，也就是说 `class` 类上的内部属性默认是不可枚举的，不能使用 `Object.keys` 遍历，具体如下：

```js
Object.keys(Person.prototype); // []
Object.keys(Person); // []
```

同时在遍历的时候还会判断当前描述符是否存在 `value` 值，如果存在就设置可写属性 `writable` 为 `true`，反之就使用 `get` 和 `set` 属性。在遍历的末尾，通过 `Object.defineProperty` 将描述符配置到当前的构造函数或构造函数原型上，至此就是 `class` 的基本实现了。

```js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
```

## 构造函数的区别

### 暂时性死区

`class` 不会声明提升，存在 `暂时性死区`，构造函数的本质是函数，函数声明会有提升作用。

```js
// 👌
{
  const foo = new Foo();
  function Foo() {}
}

// error
{
  const foo = new Foo(); // Cannot access 'Foo' before initialization
  class Foo {}
}
```

### 严格模式

`class` 声明内部默认会启用 `严格模式`，构造函数默认 `非严格模式`。

```js
// 👌
{
  const foo = new Foo();
  function Foo() {
    size = 20;
  }
}

// error
{
  class Foo {
    constructor() {
      size = 20; //  size is not defined
    }
  }
  const foo = new Foo();
}
```

### 内部方法不可枚举

`class` 的所有方法（包括 `静态方法`、`实例方法`）都 `不可枚举`，上文的 `_defineProperties` 函数方法实现中有提到，具体可参照上文，构造函数可枚举所有方法。

```js
{
  function Foo() {}

  Foo.print = function () {};
  Foo.prototype.format = function () {};

  console.log(Object.keys(Foo)); //  [ "print" ]
  console.log(Object.keys(Foo.prototype)); //  [ "format" ]
}

{
  class Foo {
    constructor() {}

    static print() {}

    format() {}
  }
  console.log(Object.keys(Foo)); //  []
  console.log(Object.keys(Foo.prototype)); //  []
}
```

### 原型对象 prototype

`class` 的所有方法（包括 `静态方法`、`实例方法`）都没有原型对象 `prototype`，因此也没有 `[[construct]]`，不能通过 `new` 来调用，构造函数则支持 `new` 调用。

```js
// 👌
{
  function Foo() {}
  Foo.prototype.format = function () {};

  const foo = new Foo();
  const fooFormat = new foo.format();
}

// error
{
  class Foo {
    static print() {}
    format() {}
  }

  const foo = new Foo();
  const fooFormat = new foo.format(); // foo.format is not a constructor
  const fooPrint = new foo.print(); // foo.print is not a constructor
}
```

### new 调用

`class` 必须使用 `new` 调用，构造函数的本质是函数，支持直接调用。

```js
// 👌
{
  function Foo() {}

  const foo = Foo();
}

// error
{
  class Foo {}

  const foo = Foo(); //  Class constructor Foo cannot be invoked without 'new'
}
```

### 类名重写

`class` 内部无法重写类名，构造函数可任意更改。

```js
// 👌
{
  function Foo() {
    Foo = "yo";
  }
  const foo = new Foo();
}

// error
{
  class Foo {
    constructor() {
      // Foo = 'yo' // TypeError: Assignment to constant variable
    }
  }

  const foo = new Foo();
  Foo = "yo"; // 👌
}
```
