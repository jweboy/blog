---
title: 栈
---

```js
/**
 * 栈（先进后出）
 */
function Stack() {
    this.items = []
}

Stack.prototype = {
    push(item) {
        this.items.push(item)
    },
    // 尾部删除
    pop(item) {
        this.items.pop(item)
    },
    peek() {
        return this.items[this.items.length - 1]
    },
    isEmpty() {
        return this.items.length === 0
    },
    clear() {
        this.items.length = 0
    },
    size() {
        return this.items.length
    },
    print() {
        console.log(this.items.toString());
    }
}

const stack = new Stack();
// console.log(stack.isEmpty()); // true
// stack.push(5);
// stack.push(8);
// console.log(stack.peek()); // 8
// stack.push(11);
// console.log(stack.size()); // 3
// console.log(stack.isEmpty()); // false
// stack.push(15);
// stack.pop();
// stack.pop();
// console.log(stack.size()); // 2
// console.log(stack.print()); // 5,8

```