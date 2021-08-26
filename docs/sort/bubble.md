---
title: 冒泡排序
---

冒泡排序平均时间复杂度为 `O(n2)` 。

具体步骤

- 分别比较相邻的两个元素，如果前面的元素大于后面的元素，就互相交换双方的位置。
- 针对每个相邻元素执行相同的比较，直到没有任何数字可以进行比较，那么最后的元素就是最大的数。

代码示例

```js
function bubbleSort(array) {
    let swapped = false

    for (let i = 0; i < array.length; i++) {
        // 交换标记，如果为 `false`，则表示这个待排序列已经完成了所有的排序操作。
        swapped = false

        // 每一轮循环完成一次排序,其中会有一个元素会排列到对应位置，那么剩余元素会依次减少一个。
        for (let j = 0; j < array.length - i; j++) {
            if(array[j] > array[j + 1]) {
                const tmp = array[j + 1]
                array[j + 1] = array[j]
                array[j] = tmp
            }
            swapped = true
        }

        // 排序全部完成
        if(!swapped) {
            return array
        }
    }
    return array
}
```