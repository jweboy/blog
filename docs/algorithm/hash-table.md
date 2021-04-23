---
title: 散列
---

```js
/**
 * @name 散列（字典类一种散列表实现方式）给定一个键值，返回值的地址
 * @param {String} key 
 */
function loseloseHashCode(key) {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
        hash += key.charCodeAt(i)
    }
    return hash % 37
}
function HashTable() {
    this.table = []
}
HashTable.prototype = {
    put(key, value) {
        const position = loseloseHashCode(key)
        // console.log(`${position}-${key}`)
        this.table[position] = value
    },
    get(key) {
        return this.table[loseloseHashCode(key)]
    },
    remove(key) {
        this.table[loseloseHashCode[key]] = undefined
    }
}
const hash = new HashTable();
// hash.put('Gandalf', 'gandalf@email.com');
// hash.put('John', 'johnsnow@email.com');
// hash.put('Tyrion', 'tyrion@email.com');
// console.log(hash.get('Gandalf')); // gandalf@email.com
// console.log(hash.get('Loiane')); // undefined
// hash.remove('Gandalf');
// console.log(hash.get('Gandalf')); // undefined

// FIXME: 冲突：散列表中的不同值对应相同的位置

/**
 * @name 分离链接散列表
 * @description 为散列表的每一个位置创建一个链表并将元素存储在里面
 * @description 缺点就是除了SeparateHashTable实例之外还需要额外的存储空间
 */
function SeparateHashTable() {
    this.table = []
}

SeparateHashTable.prototype = {
    put(key, value) {
        const position = loseloseHashCode(key)

        // 每个存储新值的初始赋值
        if(this.table[position] === undefined) {
            this.table[position] = new LinkedList()
        }
        // 在链表中插入数据
        this.table[position].append(valuePair(key, value))
    },
    get(key) {
        const position = loseloseHashCode(key)
        
        if(this.table[position] !== undefined) {
            let current = this.table[position].getHead()

            // 中间元素
            while(!!current.next) {
                if(current.element.key === key) {
                    return current.element.value
                }
                // 没找到匹配值就继续往下查找
                current = current.next
            }
            // 第一个或者最后一个元素
            if(current.element.key === key) {
                return current.element.value
            }
        }
        return undefined
    },
    remove(key) {
        const position = loseloseHashCode(key)
        const _remove = (current) => {
            // 当前元素是LinkedList对象实例
            this.table[position].remove(current.element)
            // 当前元素为空就置为初始值
            if(this.table[position].isEmpty()) {
                this.table[position] = undefined
            }
        }
        if(this.table[position] !== undefined) {
            let current = this.table[position].getHead()

            while(!!current.next) {
                if(current.element.key === key) {
                    _remove(current)
                    return true
                }
                // 没找到匹配值就继续往下查找
                current = current.next
            }

            // 第一个或者最后一个元素
            if(current.element.key === key) {
                _remove(current)
                return true
            }
        }
        return false
    },
}

const valuePair = (key, value) => ({ key, value })

const separateHash = new SeparateHashTable();
separateHash.put('Gandalf', 'gandalf@email.com')
separateHash.put('John', 'johnsnow@email.com')
// 下面两个hash值相同
separateHash.put('Aaron', 'huang@gmail.com')
separateHash.put('Tyrion', 'tyrion@email.com')
// console.log(separateHash)
// console.log(separateHash.get('Gandalf')); // gandalf@email.com
// console.log(separateHash.get('Loiane')); // undefined
// console.log(separateHash.remove('Tyrion'))
// console.log(separateHash.remove('Gandalf'))

/**
 * @name 线性探查散列表
 * @description 增加一个新元素,如果索引为index的位置已经被占据了,就尝试index+1的位置，以此类推。
 */
function LinearExploreHashTable() {
    this.table = []
}
LinearExploreHashTable.prototype = {
    put(key, value) {
        let position = loseloseHashCode(key)

        // 每个存储新值的初始赋值
        if(this.table[position] === undefined) {
            this.table[position] = valuePair(key, value)
        } else {
            let index = position++
            // 当前索引位置已有值占用,继续往下递增查找
            while(this.table[index] !== undefined) {
                index ++
            }
            this.table[index] = valuePair(key, value)
        }
    },
    get(key) {
        let position = loseloseHashCode(key)
        
        if(this.table[position] !== undefined) {
            if(this.table[position].key === key) {
                return this.table[position].value
            } else {
                let index = position ++

                // index不超出数组长度或者index位置的值还不存在
                while((this.table[index].key !== key && index < this.table.length) || this.table[index] === undefined) {
                    index ++
                }
                // 匹配到对应值
                if(!!this.table[index] && (this.table[index].key === key)) {
                    return this.table[index].value
                }
                return undefined
            }
        }
        return undefined
    },
    remove(key) {
        let position = loseloseHashCode(key)
        
        if(this.table[position] !== undefined) {
            if(this.table[position].key === key) {
                this.table[position] = undefined
                return true
            } else {
                let index = position ++
                
                // index位置值不存在或者对应节点的值不相等时继续递增 
                while(this.table[index] === undefined || this.table[index].key !== key) {
                    index ++
                }
                // 匹配到对应值
                if(!this.table[index] && this.table[index].key === key) {
                    this.table[index] = undefined
                    return true
                }
            }
        }
        return false
    },
}
const linearExploreHashTable = new LinearExploreHashTable();
linearExploreHashTable.put('Gandalf', 'gandalf@email.com');
linearExploreHashTable.put('John', 'johnsnow@email.com');
// 下面两个hash值相同
linearExploreHashTable.put('Aaron', 'huang@gmail.com');
linearExploreHashTable.put('Tyrion', 'tyrion@email.com');
// console.log(linearExploreHashTable);
// console.log(linearExploreHashTable.get('Gandalf')); // gandalf@email.com
// console.log(linearExploreHashTable.get('Loiane')); // undefined
// console.log(linearExploreHashTable.remove('Gandalf')); // true

```