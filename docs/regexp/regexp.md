---
title: 详解
---

## 定义

正则表达式是一个描述字符模式的对象，Javascript的正则表达式用RegExp对象表示。ECMAScript规定，同一段代码的正则表达式直接量的每次运算都返回新对象。

```js
const pattern = /^s$/
console.log(pattern.test('k8s')) // true

$ 匹配字符的结束
^ 匹配字符的开始
```

## 直接量字符

| 字符 | 匹配 |
| :---- | :--- |
| \t | 制表符(\u0009) |
| \n | 换行符(\u000A) |
| \r | 回车符(\u000D) |
| \o | NUL字符(\u0000) |
| \v | 垂直制表符(\u000B) |
| \f | 换页符(\u000C) |
| \xnn | 由十六进制数nn指定的拉丁字符，如：\x0A等价于\n
| \uxxxx | 由十六进制数xxxx指定的Unicode字符，如：\u0009等价于\t
| \cX | 控制字符^X，如：\cJ等价于\n

在正则表达式中，使用如下字符进行匹配，必须使用前缀 \

```js
// 加上前缀 \ 进行匹配
^ $ . * + ? = ! : | \ / ( ) [ ] { }

// 不需要前缀 \
@ 引号

// 特殊情况
// 字母和数字再有反斜线做前缀有特殊含义，因此尽量不要使用反斜线对其转义。

// 如：匹配反斜线本身
const pattern = /\\/ // ✅
```

## 字符类

字符类就是将直接量字符和方括号组织在一块。

```js
const pattern = /[abc]/
pattern.test('aks') // ✅
pattern.test('jhon') // ❌
```

| 字符 | 匹配 |
| :---- | :--- |
| [...] | 方括号内的任意字符 |
| [^...] | 不在方括号内的任意字符 |
| . | 除换行符和其他Unicode行终止符之外的任意字符 |
| \w | 任何ASCII字符组成的单词，等价于 [a-zA-Z0-9] |
| \W | 任何不是ASCII字符组成的单词，等价于 [^a-zA-Z0-9] |
| \d | 任何ASCII数字，等价于[0-9] |
| \D | 除了ASCII数字数字之外的任何字符，等价于[^0-9] |
| \s | 任何Unicode空白符 |
| \S | 任何非Unicode空白符的字符，\S 和 \w 不同 |
| \b | 退格直接量（特例）|

## 贪婪重复

| 字符 | 匹配 |
| :---- | :--- |
| {n,m} | 匹配前一项至少n次，但不能超过m次 |
| {n,} | 匹配前一项n次或者更多次 |
| {n} | 匹配前一项n次 |
| ? | 匹配前一项0次或者1次，前一项可选，等价于{0,1} |
| + | 匹配前一项1次或多次,等价于{1,} |
| * | 匹配前一项0次或多次,等价于{0,} |

举例说明

```js
// {n,m}
let pattern = /^\d{3,5}$/
console.log(pattern.test('12')) // ❌
console.log(pattern.test('123')) // ✅
console.log(pattern.test('1234')) // ✅
console.log(pattern.test('12345')) // ✅
console.log(pattern.test('123456')) // ❌

let pattern = /^\d{3,}$/
console.log(pattern.test('12')) // ❌
console.log(pattern.test('123')) // ✅
console.log(pattern.test('1234')) // ✅
console.log(pattern.test('12345')) // ✅

// {n}
let pattern = /^\d{3}$/
console.log(pattern.test('123')) // ✅
console.log(pattern.test('12')) // ❌
console.log(pattern.test('1234')) // ❌

// +
let pattern = /^\d+$/
console.log(pattern.test('1')) // ✅
console.log(pattern.test('12')) // ✅
console.log(pattern.test('123')) // ✅
console.log(pattern.test('')) // ❌
console.log(pattern.test('1s')) // ❌

// *
let pattern = /^\d*$/
console.log(pattern.test('1')) // ✅
console.log(pattern.test('12')) // ✅
console.log(pattern.test('123')) // ✅
console.log(pattern.test('')) // ✅
console.log(pattern.test('1s')) // ❌

// ?
let pattern = /^\d{3}\w?$/ // 匹配开始位置的3位数字，结束位置匹配字母或者数字，可选1个或者0个。
console.log(pattern.test('123')) // ✅
console.log(pattern.test('1234')) // ✅
console.log(pattern.test('123a')) // ✅
console.log(pattern.test('123ab')) // ❌
```

注意：* 和 ？可以匹配0个字符，因此允许什么都不匹配。

```js
/a*/.test('bbb') // ✅
/a?/.test('bbb') // ✅
```

## 非贪婪匹配

在待匹配的字符后加一个问号，如：“??”、"+?"、"*?"或者“{1,5}?”

```js
/a+/.exec('aaa')[0] // 'aaa' 匹配三个连续字母a
/a+?/.exec('aaa')[0] // 'a' 匹配第一个字母a
```

注意：模式匹配总是会寻找字符串的第一个可能匹配的位置。

```js
/a+b/.exec('aaab')[0] // 'aaab'
/a+?b/.exec('aaab')[0] // 'aaab' 第一个匹配到就不考虑子串更短的匹配
```

## 选择项

选择项用 “|” 分隔，匹配次序从左到右，直到发现匹配项，如果左边选择项匹配，就会忽略右边的匹配项。

```js
/a|ab/.exec('ab')[0] // 'a'
```

## 分组

| 字符 | 匹配 |
| :---- | :--- |
| &#124; | 选择，匹配的是该符号左边的子表达式或右边的子表达式 |
| (...) | 组合，将几个项组合成一个单元，这个单元通过 "*"、"+"、"?" 和 "&#124;" 等符号加以修饰，可以记住和这个组合相匹配的字符串以供此后的引用使用 |
| (?...) | 只组合，把项组合到一个单元，但不记忆与该组相匹配的字符 |
| \n | 和第n组第一次匹配的字符相匹配，组是圆括号的表达式（可能是嵌套的），组索引是从左到右的括号数，"(?:" 形式的分组不编码

通过圆括号进行分组，有以下几点作用：

- 将单独的项组合成子表达式

  ```js
    // 匹配字符串'java','script'可选。
    /java(script)?/.test('java') // ✅
    /java(script)?/.test('javascript') // ✅
    /java(script)?/.test('javascr') // ✅
    /java(script)?/.test('savas') // ❌
  ```

- 在完整模式中定义子模式，如：/[a-z]+(\d+)/

- 允许同个正则表达式后部引用前部，通过字符 "\" 加数字实现，数字指定带圆括号的子表达式在正则中的位置（如：\1引用第一个带圆括号的子表达式）。引用指的是与模式匹配的文本引用。

  ⚠️ 子表达式可以相互嵌套，因此数字的位置是参与计数的左括号的位置。

  ```js
  /([Jj]ava([Ss]cript)?)\sis\s(fun\w*)/
  ```

正则表达式也可以不同创建数字编码的引用对字表达式进行分组，而是通过 "(?:" 和 ")" 进行分组。

```js
/([Js]ava(?:[Ss]cript)?)\sis\s(fun\w*)/

// 子表达式(?:[Ss]cript)仅仅用于分组
// (?: ... )不会生成引用
// 因为 \2 引用了 (fun\w*) 匹配的文本
```

## 匹配位置

```js
// \B
/\B[Ss]cript/.test('javascript') // ✅
/\B[Ss]cript/.test('JavaScript') // ✅
/\B[Ss]cript/.test('postscript') // ✅
/\B[Ss]cript/.test('script') // ❌
/\B[Ss]cript/.test('scripthing') // ❌

// (?=p)
/[Jj]ava([Ss]cript)?(?=\:)/.test('javascript: awesome.') // ✅
/[Jj]ava([Ss]cript)?(?=\:)/.test('javascript is awesome.') // ❌ - 冒号匹配不到

// (?!p)
/Java(?!Script)([A-Z]\w*)/.test('JavaBeans') // ✅
/Java(?!Script)([A-Z]\w*)/.test('JavaWOW2333') // ✅
/Java(?!Script)([A-Z]\w*)/.test('JavaWOW') // ✅
/Java(?!Script)([A-Z]\w*)/.test('JavaWow') // ✅
/Java(?!Script)([A-Z]\w*)/.test('Javaerror') // ❌ - 匹配不到大写字母
/Java(?!Script)([A-Z]\w*)/.test('JavaScript') // ❌ - 不能匹配含Script
/Java(?!Script)([A-Z]\w*)/.test('JavaScript') // ❌ - 不能匹配含Script

```

| 字符 | 匹配 |
| :---- | :--- |
| ^ | 匹配字符串的开头，多行检索中匹配一行的开头 |
| $ | 匹配字符串的结尾，多行检索中匹配一行的结尾 |
| \b | 匹配一个单词的边界，即位于字符 \w 和 \W 之间的位置，或位于字符 \w 和字符串的开头或结尾之间的位置（⚠️ [\b]匹配的是退格符）|
| \B | 匹配非单词边界的位置 |
| (?=p) | 零宽正向先行断言，要求接下来的字符都与p匹配，但不能包括匹配p的那些字符 |
| (?!p) | 零宽负向先行断言，要求接下来的字符不与p匹配 |

## 修饰符

放在 “/” 之外，即在第二条斜线之后。

```js
/\bjava\b/i.test('java') // ✅
/\bjava\b/i.test('Java') // ✅
/\bjava\b/i.test('JAVA') // ✅
/\bjava\b/i.test('JA') // ❌
```

| 字符 | 匹配 |
| :---- | :--- |
| i | 执行不区分大小写的匹配 |
| g | 执行一个全局匹配，即所有匹配 |
| m | 多行匹配模式，^匹配一行的开头和字符串的开头，$匹配行的结束和字符串的结束 |

## 匹配方法

- search() 参数是一个正则表达式，返回第一个与之匹配的子串的起始位置，如果找不到匹配的子串，将返回 -1。

  ```js
    'javascript'.search(/script/i) // 4
  ```