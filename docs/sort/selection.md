---
title: 选择排序
---

选择排序平均时间复杂度为 `O(n2)` 。

具体步骤

- 先在未排序序列中找到最小（大）的元素，存放到序列的开始位置，记为已排序序列。
- 继续在剩余未排序的序列中寻找最小（大）的元素，放入到已排序序列的末尾。
- 重复执行第二步操作，直到所有元素完成了排序。

代码示例

```js
function selectionSort(array) {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i

        // 每一轮循环完成一次排序,其中会有一个元素会排列到对应位置，那么剩余元素会依次减少一个
        for (let j = i + 1; j < array.length; j++) {
            // 记录每次在未排序序列中找到最小元素的位置
            if(array[j] < array[minIndex]) {
                minIndex = j
            }
        }

        // 交换最小元素和当前排序元素的位置
        if(minIndex !== i) {
            const tmp = array[i]
            array[i] = array[minIndex]
            array[minIndex] = tmp
        }
    }
    return array
}
```