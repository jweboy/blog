---
title: 字典 
---

```js
/**
 * 字典 -> [键,值]存储
 */
function Dictionary() {
    this.items = {}
}
Dictionary.prototype = {
    has(key) {
        return key in this.items
    },
    set(key, value) {
        this.items[key] = value
    },
    remove(key) {
        if(this.has(key)) {
            delete this.items[key]
            return true
        }
        return false
    },
    get(key) {
        return this.has(key) ? this.items[key] : undefined
    },
    values() {
        return Object.keys(this.items).reduce(function(arr, key) {
            arr.push(key)
            return arr
        }, [])
    },
    clear() {
        this.items = {}
    },
    size() {
        return Object.keys(this.items).length
    },
    keys() {
        return Object.keys(this.items)
    },
    getItems() {
        return this.items
    }
}

const dictionary = new Dictionary();
// console.log(dictionary.size()); // 0
// dictionary.set('first', 'huang');
// dictionary.set('second', 'cheng');
// dictionary.set('third', 'du');
// console.log(dictionary.has('first')); // true
// console.log(dictionary.get('second')); // cheng
// console.log(dictionary.values()); // ["first", "second", "third"]
// dictionary.remove('second');
// console.log(dictionary.keys()); // ["first", "third"]
// console.log(dictionary.getItems()); // { first="huang",  third="du"}

```