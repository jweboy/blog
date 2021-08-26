<!--
 * @Author: jweboy
 * @Date: 2019-11-19 00:01:06
 * @LastEditors: jweboy
 * @LastEditTime: 2019-11-20 23:53:15
 -->

首先我们从 `ReactDOM.js` 文件中找到 `ReactDOM` 对象，这个对象用于组件的渲染相关，并拥有 `render`、`hydrate`（服务端渲染）、`findDOMNode` 等方法。在本章节中我们只解析最重要的 `render` 方法。

⚠ 注意：以下所有示例代码只保留核心部分，如需阅读完整代码可以到 [官方仓库](https://github.com/facebook/react/tree/16.8.5) 进行查看。

## 初次渲染

首先是`render`函数，它会将组件挂载在对应的容器节点进行渲染，以下是具体的参数说明：

- `element` ReactElement 元素
- `container` 需要挂载的 dom 节点
- `callback` 渲染成功后的回调函数

```js

render(
  element: React$Element<any>,
  container: DOMContainer,
  callback: ?Function,
) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false, // 默认写死是因为 legacyRenderSubtreeIntoContainer 会被 SSR 的情况下调用，默认不复用原来的节点
    callback,
  );
},
```

通过分析 `render` 函数，我们可以看到这个函数最终返回的是对`legacyRenderSubtreeIntoContainer` 函数的调用,那么我们继续分析 `legacyRenderSubtreeIntoContainer` 函数。

```js
let root: Root = (container._reactRootContainer: any);
if (!root) {
  // Initial mount
  root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
    container,
    forceHydrate, // false
  );
}
```

初次渲染的时候，`container` 是一个节点对象，但是不存在私有的 `_reactRootContainer` 属性，因此 `root` 变量初始值是 `undefined`，会进入 `if` 条件判断语句。进入判断之后，首先会创建一个 `ReactRoot` 赋值给 `container._reactRootContainer`。

```js
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>, // null
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean, // false
  callback: ?Function,
) {
  //  初次渲染 root = undefined
  let root: Root = (container._reactRootContainer: any);
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate, // false
    );
}
```

那么创建 `ReactRoot` 的 `legacyCreateRootFromDOMContainer` 又是什么作用呢？

## legacyCreateRootFromDOMContainer

```js
function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean, // false
): Root {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  // Legacy roots are not async by default.
  const isConcurrent = false;
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}
```

首先创建了一个 `shouldHydrate` 变量，由于 `forceHydrate` 在常规 `render` 中是 `false`， 所以 `shouldHydrate` 的值实际上是由 `shouldHydrateDueToLegacyHeuristic` 函数所得到的，接下来我们来看这个函数具体的定义。

```js
function getReactRootElementInContainer(container: any) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

function shouldHydrateDueToLegacyHeuristic(container) {
  const rootElement = getReactRootElementInContainer(container);
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&
    rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
  );
}
```

在 `getReactRootElementInContainer` 函数中，判断当前需要挂载 `DOM` 的节点类型是否为 `document`，如果是的话就获取 `document` 中的第一个子节点 `html`，反之则获取当前 `DOM` 节点的第一个子节点，并赋值给 `roxi zotElement` 变量。在函数最后判断并返回了节点是否为 `Node Elemnent` 元素，由于此时的 `render` 并不是用于服务端渲染，因此 `rootElement` 并不存在 `ROOT_ATTRIBUTE_NAME` 属性（该属性主要用于 `SSR`），因此函数返回的值是 `false`。现在我们返回到 `legacyCreateRootFromDOMContainer` 继续往下看

```js
const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
// First clear any existing content.

if (!shouldHydrate) {
  let warned = false;
  let rootSibling;
  while ((rootSibling = container.lastChild)) {
    container.removeChild(rootSibling);
  }
}
```

， 此时 `shouldHydrate` 变量值为 `false`，进入到 `if` 判断语句中。在判断语句中我们发现有一个 `while` 循环，由于初次渲染不需要复用任何子节点，因此需要删除当前节点中的所有子节点。

```js
  // Legacy roots are not async by default.
  const isConcurrent = false;
  return new ReactRoot(container, isConcurrent, shouldHydrate);
```

接下来我们可以看到函数最后创建了一个 `ReactRoot` 对象实例，由于初次渲染应该是同步进行的，因此 `isConcurrent` 默认是 `false`，接下来我们来看 `ReactRoot` 构造函数。

## ReactRoot

这里截取了关键的 `render` 部分。

```js
function ReactRoot(
  container: DOMContainer,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  const root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}
ReactRoot.prototype.render = function(
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'render');
  }
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(children, root, null, work._onCommit);
  return work;
};
```