---
title: 组件规范
---

## 组件

### 基础

一个基础的组件包含以下这些准则：

- 文件名以 `camelCase` 大驼峰形式命名，目录中包含 `index.tsx` `index.less` `index.md` 等文件。
- 代码以 `2个空格` 间隔，文件行数建议在 `300行` 以内，如果超出太多，可以考虑拆分代码多文件管理。

### 注释

在组件开发的过程中，组件定义的 `props` 属性的 `ts` 类型需要加上相关的注释说明，这样能够让当前的组件代码更加清晰，同时在后续 `dumi` 框架升级之后自动生成 `API` 文档也有一定作用。以下是其中一个组件的示例：

```js
export interface CopyClipboardProps {
  /**
   * @description 复制成功后的提示信息
   * @default true
   */
  toast: boolean | string;
  /**
   * @description 外部覆盖样式名
   * @default
   */
  className?: string;
  /**
   * @description 外部覆盖行内样式
   * @default
   */
  style?: CSSProperties;
  /**
   * @description 复制事件回调
   * @default
   */
  onCopy?: () => void;
  /**
   * @description 需要复制的文本
   * @default
   */
  text: string;
  /**
   * @description 复制图标
   * @default
   */
  icon?: boolean | ReactNode;
}
```

### 默认值

在组件开发过程中，如果定义了 `props` 属性，尽可能的在 `defaultProps` 上定义对应的默认值。假如在实际组件代码中使用了一个 `props` 值，当前 `props` 是一个 `Array`，但是代码中没有做任何判断就使用了 `map` 方法，在直接调用组件不传入任何参数的情况下就会直接导致页面错误，因此在编写组件过程中需要尽可能考虑代码的健壮性。以下是一个错误的示例：

```js
const Test = (props) => {
  return props.data.map((item) => (
    <span>{item}</span>
  ))
}

<Test /> // undefiend 报错
<Test data={[]} />
```

### 事件绑定

组件绑定的自定义事件遵循 `on` 前缀开头加上对应的事件名称，即 `onEventName`。事件名尽可能简洁易懂，以 `camelCase` 小驼峰形式命名。以下是一些示例：

```js
changeCalendarChange; // change单词重复
onSearchTypeChange; // ok
onTreeClick; // ok
```

## 样式

### 基础

在开发过程中，如果遇到组件样式存在共通性，可以抽离公共样式到 `styles` 目录里。目前 `styles` 目录包含`mixins`目录 和 `global.less`文件, 放置文件内容遵循以下两点：

- 将公共的方法提取到 `mixins` 目录里，保持 `单文件单功能` 的单一职责原则。
- 全局变量放到 `global.less` 文件里。

```js
├── global.less
└── mixins
    ├── index.less
    ├── position.less
    └── text.less
```

### 通用

公共样式目前只支持 `Function` 的形式来避免现有业务场景的样式冲突问题，后续会扩展更多的功能。

```js
// 水平垂直居中
.horizontal-vertical-center() {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

如果是抽离通用样式，在打包过程中会将这部分的样式和其他样式一并打包进去，在引用组件的过程中如果存在同名样式就会出现样式覆盖问题。例如以下这个通用样式：

```js
.vertical-center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

当其中某个组件引入它作为复用时，实际上也默认导入了这部分的样式。

```js
@import ('~@/xx/xx/xx.less');
```

那么当前组件打包之后的样式文件就会包含这部分的样式。

```js
xxx

xxx {
  xxx
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.vertical-center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

xxx
```

如果是 `Function` 复用函数的话，打包后的样式文件里复用并融合了函数样式，而不会生成多余的样式名。

```js
xxx

xxx {
  xxx
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

xxx

```
