---
title: 链表
---

```js
/**
 * 链表 (单链表、双向链表、循环链表) 
 * TODO: 分类后续完善 参考http://huang303513.github.io/2016/12/08/Javascript%E7%9A%84%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95(%E4%B8%80).html
 * @description 
 * 优点：添加删除不需要移动其他元素
 * 缺点：访问中间一个元素，需要从头开始迭代直至找到对应元素
 */
function LinkedList() {
    this.getInitialNode = (element) => ({ element, next: null })
    this.head = null // 指针
    this.length = 0 // 长度
}
LinkedList.prototype = {
    append(element) {
        const node = this.getInitialNode(element)
        let current
        if(this.head === null) {
            // 初始head指向第一个节点
            this.head = node
        } else {
            current = this.head
            while(current.next !== null) {
                current = current.next
            }
            // 指定当前节点的next属性为下一个节点
            current.next = node
        }
        this.length ++
    },
    insert(position, element) {
        if(position > -1 && position < this.length) {
            const node = this.getInitialNode(element)
            let current = this.head
            let index = 0
            let previous = null
            
            if (position === 0) {
                // 顶部插入指定head为当前节点
                node.next = current
                this.head = node
            } else {
                // 遍历查找到合适的索引位置
                while(position > index++) {
                    // 原head节点
                    previous = current
                    // 原head中next节点
                    current = current.next
                }
                node.next = current
                previous.next = node
            }
            this.length ++
            return true
        }
        return false
    },
    removeAt(position) {
        if(position > -1 && position < this.length) {
            let current = this.head
            let index = 0
            let previous = null
        
            if(position === 0) {
                this.head = current.next
            } else {
                while(position > index++) {
                    // 原head节点
                    previous = current
                    // 原head中next节点
                    current = current.next
                }
                previous.next = current.next
            }
            this.length --
            return current.element
        }
        return null
    },
    remove(element) {
        const index = this.indexOf(element)
        return this.removeAt(index)
    },
    indexOf(element) {
        let current = this.head
        let index = 0

        while(!!current) {
            if(current.element === element) {
                return index
            }
            index ++
            current = current.next
        }
        return -1
    },
    toString() {
        let string = ''
        let current = this.head

        while(!!current) {
            string += `${current.element},`
            current = current.next
        }
        return string
    },
    isEmpty() {
        return this.length === 0
    },
    size() {
        return this.length
    },
    getHead() {
        return this.head
    }
}
const linkedList = new LinkedList();
// console.log(linkedList.isEmpty()); // true;
linkedList.append('huang');
linkedList.append('du')
linkedList.append('pei')
linkedList.append('zhang')
linkedList.insert(0,'jiang')
linkedList.insert(1,'cheng')
linkedList.removeAt(1)
linkedList.remove('huang')
// console.log(linkedList.getHead())
// console.log(linkedList.size())
// console.log(linkedList.toString())
// console.log(linkedList)

export default LinkedList

```