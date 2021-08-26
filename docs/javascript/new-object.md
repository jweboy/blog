---
title: new Object() 做了什么
---

当 `new Foo(...)` 执行时，实际做了以下事情：

```js
var obj = new Object();
obj.__proto__ = Foo.prototype;
Foo.call(obj);
```

最后返回的时候会进行一个判断，如果构造器函数（`Foo`）设置了返回值且返回值是一个 `Object` 类型，则直接返回该 `Object` ，否则就返回新创建的空对象（`obj`）。