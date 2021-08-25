---
title: 单例模式
---

## 定义

`单例模式` 是基本设计模式之一，其核心在于 **确保只有一个实例，并提供全局访问**。在 `JS` 中虽然全局变量不是`单例模式` ，但是日常开发中经常会把它当作 `单例模式` 来看待。
![单例模式](https://refactoringguru.cn/images/patterns/content/singleton/singleton.png?id=108a0b9b5ea5c4426e0a)

## 示例

```js
var singleton = {
  age: 0,
  getName() {
    return 'biubiubiu';
  },
  setAge() {
    this.age = 22;
  }
}
```

## 创建方式

### 命名空间

适当使用命名空间，可以减少全局变量的使用次数。

```js
var namespace = {
  a: function() {
    alert(1);
  },
  b: function() {
    alert(2);
  },
}
```

### 闭包

以闭包的方式创建可以将变量封装在闭包内部，只暴露特定接口与外界通信。

```js
var user = (function() {
  var _name = 'biubiubiu';
      _age = 36;
    
  return {
    getUserInfo: function() {
      return _name + '-' + _age;
    },
  }
})();
```

## 延伸

### 惰性闭包
