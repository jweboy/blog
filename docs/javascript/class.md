---
title: class类
---

// TODO: 添加完善

# 

## 定义

`class` 是现有基于原型继承的语法糖。类声明和类表达式的主体都执行在严格模式下。比如，`构造函数`，`静态方法`，`原型方法`，`getter` 和 `setter` 都在严格模式下执行。

## `ES5` 和 `ES6` 对象继承的区别

1. `class` 不会声明提升，存在 “暂时性死区”。

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

2. `class` 声明内部会启用 **严格模式**。

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

3. `class` 的所有方法（包括 `静态方法`、`实例方法`）都 **不可枚举**。

```js
{
    function Foo() {}

    Foo.print = function() {}
    Foo.prototype.format = function() {}

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

4. `class` 的所有方法（包括 `静态方法`、`实例方法`）都没有原型对象 `prototype`，因为也没有 `[[construct]]`，不能通过 `new` 来调用。

```js
// 👌
{
    function Foo() {}
    Foo.prototype.format = function() {}

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

5. `class` 必须使用 `new` 调用。

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

6. `class` 内部无法重写类名。

```js
// 👌
{
    function Foo() {
        Foo = 'yo'
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
    Foo = 'yo' // 👌
}
```
