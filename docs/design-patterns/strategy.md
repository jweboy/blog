---
title: 策略模式
---

## 定义

`策略模式` 是一种常见且有效的设计模式。它指的是定义一系列的算法，把它们一个个封装起来，并且使他们能够相互替换。`策略模式` 的本质在于将 **算法的使用和算法的实现分离开来**。一个基本的 `策略模式` 有以下两部分组成：

1. 一组策略类，其内部封装了具体的算法，并负责算法的具体实现。
2. 环境类 `Context`，其接受客户的请求，并将请求委托给某一个策略类。

## 优缺点

`策略模式` 有如下几点优势：

- 利用 `组合`、`委托`、`多态` 等技术，有效避免了多重条件选择语句。
- 提供了对 `开放-封闭` 原则的完美支持，使用策略分支函数易于理解和扩展。
- `组合`、`委托` 的方式也让 `Context` 拥有了执行算法的基础能力。
- 复用性比较高。

`策略模式` 的缺点并不是很明显，主要表现在应用需要维护更多的策略对象，但是从本质上来说，其优点还是大于缺点的。

## 示例

在 `Javascript`中，函数作为一等公民其本身也是对象，因此我们用对象来实现 `策略模式`。

```js
// part 1
var strategies = {
  S: function(salary) {
    return salary * 4;
  },
  A: function(salary) {
    return salary * 3;
  },
  B: function(salary) {
    return salary * 2;
  },
}

// part 2
var calculateBouns = function(level, salary) {
  return strategies[level](salary);
};

console.log(calculateBouns('S', 2000));
console.log(calculateBouns('A', 800));
```

## 场景

### 表单校验

在日常的表单交互中，我们会遇到各种输入项绑定对应的表单校验规则，如果给每个输入项一一写上对应规则会比较费时且冗余，此时我们可以采用 `策略模式` 来进行改造。

```js
var strategies = {
  isNonEmpty(value, errorMsg) {
    if(value === '' || value == null) {
      return errorMsg;
    }
  },
  minLength(value, length, errorMsg) {
    if(value.length < length) {
      return errorMsg;
    }
  },
  isMobile(value, errorMsg) {
    if(!/1[3][5][8][0-9]{9}$/.test(value)) {
      return errorMsg;
    }
  },
}
```

在完成了表单的规则映射表之后，再新建一个规则校验的 `Validator` 类。`Validator` 类在这里是作为 `Context` 的作用，负责接收用户的请求并委托给 `strategies` 以匹配对应的规则。

```js
var Validator = function() {
  this.cache = [];
}

Validator.prototype.add = function(value, rule, errorMsg) {
  var arr = rule.split(':');
  this.cache.push(
    function() {
      var stratery = arr.shift();
      arr.unshift(value);
      arr.push(errorMsg); // [44, "isMobile", '手机号格式不正确']
      return strategies[stratery].apply(this, arr)
    }
  )
}

Validator.prototype.start = function(value, rule, errorMsg) {
  for(let i = 0; i < this.cache.length; i++) {
    var validator = this.cache[i];
    var msg = validator();
    if(msg) {
      return msg
    }
  }
}

// 使用
var validator = new Validator();

validator.add('13136199370', 'isMobile', '手机号格式不正确');
validator.add('12', 'minLength: 6', '密码长度不能少于6位');

var errMsg = validator.start();
console.log(errMsg);

```
