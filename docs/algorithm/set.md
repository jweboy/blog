---
title: 集合
---

```js
/**
 * 集合 -> [值，值]存储
 */
function Set() {
    this.items = {}
}
Set.prototype = {
    has(value) {
        return value in this.items
    },
    add(value) {
        if(!this.items[value]) {
            this.items[value] = value
            return true
        }
        return false
    },
    remove(value) {
        if(this.has(value)) {
            delete this.items[value]
            return true
        }
        return false
    },
    clear() {
        this.items = {}
    },
    size() {
        return Object.keys(this.items).length
    },
    values() {
        return Object.keys(this.items)
    },
    // 并集 -> 返回一个包含两个集合中所有元素的新集合
    union(otherSet) {
        const unionSet = new Set()
        let values = this.values()

        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i])
        }
        values = otherSet.values()
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i])
        }
        return unionSet
    },
    // 交集 -> 返回一个包含两个集合中共有元素的新集合
    intersection(otherSet) {
        const intersectionSet = new Set()
        const values = this.values()

        for (let i = 0; i < values.length; i++) {
            if(otherSet.has(values[i])) {
                intersectionSet.add(values[i])
            }
        }
        return intersectionSet
    },
    // 差集 -> 返回一个包含左右存在于第一个集合并且不存在于第二个集合的元素的新集合。
    difference(otherSet) {
        const differenceSet = new Set()
        const values = this.values()

        for (let i = 0; i < values.length; i++) {
            if(!otherSet.has(values[i])) {
                differenceSet.add(values[i])
            }
        }
        return differenceSet
    },
    // 子集 -> 验证一个给定集合是否是另一个集合的子集
    subset(otherSet) {
        if(this.size() > otherSet.size()) {
            return false
        } else {
            const values = this.values()
            for (let i = 0; i < values.length; i++) {
                if(!otherSet.has(values[i])) {
                    return false
                }
            }
        }
        return true
    }
}
const set = new Set();
// set.add(1);
// console.log(set.values()); // ["1"]
// console.log(set.has(1)); // true
// console.log(set.size()); // 1
// set.add(2);
// console.log(set.values()); // ["1","2"]
// console.log(set.has(2)); // true
// console.log(set.size()); // 2
// set.remove(2);
// console.log(set.values());
// 并集测试
let setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
let setB = new Set();
setB.add(3);
setB.add(4);
setB.add(5);
setB.add(6);
const setAB = setA.union(setB);
// console.log(setAB.values()) // ["1", "2", "3", "4", "5", "6"]
// 交集测试
setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);
const intersectionAB = setA.intersection(setB);
// console.log(intersectionAB.values()); // ["2", "3"]
// 差集测试
setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);
const differenceAB = setA.difference(setB);
// console.log(differenceAB.values()); // ["1"]
// 子集测试
setA = new Set();
setA.add(1);
setA.add(2);
setB = new Set();
setB.add(1);
setB.add(2);
setB.add(3);
setC = new Set();
setC.add(2);
setC.add(3);
setC.add(4);
// console.log(setA.subset(setB)); // true
// console.log(setA.subset(setC)); // false

```