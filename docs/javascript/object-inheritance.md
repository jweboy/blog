---
title: 对象继承
---

#

## 原型链继承

将子类的原型指向父类的实例实现继承。子类继承父类的属性和方法是将父类的私有属性和公有方法都作为自己的公有属性和方法，**如果父类的私有属性有引用类型的属性，那么这个属性被子类继承作为公有属性的时候，所有子类都共享这个属性，任意一个子类改变当前属性都会影响其他继承的所有子类**。

### 优点

- 子类能访问父类新增的原型方法和属性。
- 简单易用。

### 缺点

- 子类只能继承单一父类，无法实现多继承。
- 原型对象的属性被所有实例共享。
- 子类实例无法向父类构造函数动态传参。
- 子类新增方法必须放在原型替换之后。

### 实例

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.children = [1, 2];
    this.setName = function() {};
}

Person.prototype.addChild = function() {};

function Student(score) {
    this.score = score;
    this.setScore = function() {};
}


// 子类的原型作为父类的实例对象实现继承关系
Student.prototype = new Person();
// 原型会被重写，新定义的方法需要放在原型替换之后。
Student.prototype.sayName = function() {};

var student1 = new Student(1000);
var student2 = new Student(2500);

student1.children.push(3);

console.log(student1);
console.log(student2);
console.log(student1.children); // [1, 2, 3]
console.log(student2.children); // [1, 2, 3]
console.log(student1.__proto__ === student2.__proto__); // true 指向 Student
console.log(student1.__proto__.__proto__ === student2.__proto__.__proto__); // true 指向 Person
```

## 构造函数继承

子类型构造函数内通过 `call()` 调用父类构造函数。

### 优点

- 解决了原型链继承中子类实例共享父类引用属性的问题。
- 实现了单一子类继承多个父类。
- 子类实例可以向父类动态传递参数。

### 缺点

- 函数无复用性差，每个子类都创建了父类实例函数的副本，影响性能。
- 实例只是子类的实例而不是父类的实例。
- 子类只能继承父类的实例属性和方法，无法继承原型上的属性和方法。

### 例子

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.children = [1, 2];
    this.setName = function() {};
}

Person.prototype.addChild = function() {};

function Student(name, age, score) {
    Person.call(this, name, age);
    this.score = score;
    this.setScore = function() {};
}

var student1 = new Student('Jhon', 26, 1000);
console.log(student1);
console.log(student1.addChild); // undefined
console.log(student1.__proto__); // Student
console.log(student1.__proto__.__proto__); // Object
```

## 组合继承（原型链+构造函数组合继承）

组合继承就是使用原型链对原型属性和方法的继承，使用构造函数对实例属性的继承。

### 缺点

- 子类型无法动态给超类型传递参数。
- 超类型构造函数会被调用两次。

### 例子

```js
function Parent(username, password) {
    this.password = password
    this.username = username
}

Parent.prototype = {
    login() {
        console.log(`login as , ${this.username}, password is ${this.password}.`)
    }
}

function Child(username, password) {
    Parent.call(this, username, password) // 第二次调用
    this.articles = 30
}
Child.prototype = new Parent() // 第一次调用
// Child.prototype = Object.create(Parent.prototype) // 这种做法能够避免当前继承方式存在的问题

const user = new Child('jweboy', 'jl0630')
// user.login()
// console.log(user.articles)
```

## 原型式继承

原型式继承就是先创建一个临时的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的一个新实例。`ECMAScript5` 新增 `Object.create` 方法规范了原形式继承。

```js
// 以下方法也是 Object.create 具体实现
function object(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}
```

## 寄生式继承

寄生式继承就是创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后返回这个对象。

### 缺点

- 和构造函数类似，函数难复用。

```js
function createObject(obj) {
    const clone = Object.create(obj); // 创建一个新对象
    clone.run = function() { // 某种方式增强对象
        return this.name;
    };
    return clone; // 返回对象
}
const obj = createObject({ name: 'tao' });
// obj.run(); // 'tao'
// console.dir(obj);
```

## 寄生组合继承

寄生组合继承就是通过构造函数来继承属性，通过原型链来继承方法。

### 优点

- 子类型可以动态传递参数给超类型。
- 超类型的构造函数只执行一次。
- 子类型属性创建在各自的原型链，子类型之间不共享属性。

```js
function inheritPrototype(child, parent) {
    // 创建超类型原型副本
    const prototype = Object.create(parent.prototype)
    // 为创建的副本重写丢失的 constructor 属性
    prototype.constructor = child
    // 创建的副本赋值给子类型的原型
    child.prototype = prototype
}

function Parent(username, password) {
    this.password = password
    this.username = username
}

Parent.prototype.login = function() {
    console.log(`login as , ${this.username}, password is ${this.password}.`)
}

function Child(username, password) {
    Parent.call(this, username, password) // 属性继承
    this.articles = 30
}

// 继承
inheritPrototype(Child, Parent)

Child.prototype.read = function() {
    console.log('read article at', this.articles)
}

const user = new Child('jweboy', 'jl0630')
// console.dir(user)
```

## 参考资源

- [深入JavaScript继承原理](https://juejin.im/post/5a96d78ef265da4e9311b4d8?utm_medium=fe&utm_source=weixinqun#heading-7)
- [JavaScript继承方式详解](https://segmentfault.com/a/1190000002440502#articleHeader10)