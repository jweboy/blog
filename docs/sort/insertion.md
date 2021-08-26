---
title: 插入排序
---

插入排序平均时间复杂度为 `O(n2)` 。

具体步骤

- 将第一个元素当作有序序列，第二个元素到最后一个元素当作未排序序列。
- 取出一个未排序序列的元素，依次遍历有序序列的元素进行比较，将未排序序列的元素插入到有序序列的对应位置。
- 重复执行第二步，直到所有数值都已排序。

代码示例

```js
function insertionSort(array) {
    for (let i = 0; i < array.length; i++) {
        // 保存当前的index
        let currentIndex = i

        while(
            // 当前不是第一个元素
            array[currentIndex -1] !== undefined && 
            (array[currentIndex] < array[currentIndex - 1])
        ) {
            const tmp = array[currentIndex - 1]
            array[currentIndex - 1] = array[currentIndex]
            array[currentIndex] = tmp

            // 元素前移之后，保证index位置准确
            currentIndex -= 1
        }
    }

    return array
}
```