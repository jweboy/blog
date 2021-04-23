---
title: 数组去重
---

#

---

## index + filter

```js
var exampleArray = [{value: 1}, {value: 2}, 1, '1', '', '', 'e', 'E', true, 'true', true, false, false, 'false', undefined, 'undefined', undefined, null, 'null', null]
// var temp = []
// for (let i = 0; i < exampleArray.length; i++) {
//   if (temp.indexOf(exampleArray[i]) === -1) {
//     temp.push(exampleArray[i])
//   }
// }
// console.log(temp)
var unique = (arr) => arr.filter(function (element, index) {
    // indexOf根据数组索引index来排列
    return arr.indexOf(element) === index
})
// console.log(JSON.stringify(unique(exampleArray)))
```

## object键值对

```js
var exampleArray = [{value: 1}, {value: 2}, 1, '1', '', '', 'e', 'E', true, 'true', true, false, false, 'false', undefined, 'undefined', undefined, null, 'null', null]
function unique(array) {
    var hash = {}
    return array.filter(function (element) {
        // type + json
        // 解决 number 1和 string 1判定为同一属性
        // 解决 obj1 {a: 1}和 obj2 {a: 1}判定为同一属性
        var newKey = typeof element + JSON.stringify(element)
        if (!hash.hasOwnProperty(newKey)) {
            hash[newKey] = true
            return true
        }
        return false
    })
}
// console.log(JSON.stringify(unique(exampleArray)))
```