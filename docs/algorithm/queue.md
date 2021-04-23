---
title: 队列
---

```js
/**
 * 队列（先进先出） - 尾部添加新元素,顶部移除元素
 */
function Queue() {
    this.items = []
}

Queue.prototype = {
    enqueue(element) {
        this.items.push(element)
    },
    dequeue(element) {
        // 顶部删除
        return this.items.shift(element)
    },
    front() {
        return this.items[0]
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

const queue = new Queue();
// console.log(queue.isEmpty()); // true
// queue.enqueue('huang');
// queue.enqueue('cheng');
// console.log(queue.print()); // huang,cheng
// console.log(queue.size()); // 2
// console.log(queue.isEmpty()); // false
// queue.enqueue('du');
// console.log(queue.dequeue('cheng')) // cheng
// console.log(queue.print()); // cheng,du

/**
 * 2.1 优先队列
 */
function PriorityQueue() {
    Queue.call(this)
}
PriorityQueue.prototype = new Queue()
PriorityQueue.prototype.constructor = PriorityQueue
/**
 * 
 * @param {String} element 插入元素
 * @param {String} priority 元素优先级
 */
PriorityQueue.prototype.enqueue = function(element, priority) {
    const queueElement = { element, priority }
    if (this.isEmpty()) {
        this.items.push(queueElement)
    } else {
        let added = false
        for (let i = 0; i < this.items.length; i++) {
            if(this.items[i].priority > queueElement.priority) {
                // 当前i之前插入元素
                this.items.splice(i, 0 , queueElement)
                added = true
                break
            }
        }
        if(!added) {
            this.items.push(queueElement)
        }
    }
    // console.table(this.items)
}
PriorityQueue.prototype.print = function() {
    return this.items.reduce(function(str, item) {
        str += JSON.stringify(item)
        return str
    }, '')
}

const priorityQueue = new PriorityQueue()
priorityQueue.enqueue("cheng", 2)
priorityQueue.enqueue("du", 1)
priorityQueue.enqueue("du", 4)
// console.log(priorityQueue.print()) // {"element":"du","priority":1}{"element":"cheng","priority":2}{"element":"du","priority":4}
// console.log(priorityQueue.size()); // 3
// console.log(priorityQueue.dequeue()); // { element="du",  priority=1}
// console.log(priorityQueue.size()); // 2

```