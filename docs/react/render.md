---
author: jweboy
title: 组件挂载
---

在 `React` 中是通过 `ReactDOM.render(component, mountNode)` 来实现自定义组件/原生DOM/字符串来进行挂载，那么挂载具体是如何实现的呢？

在源码中找到 `ReactMount.js` 文件可以发现实际上 `ReactDOM.render` 调用的是 `ReactMount.render`，从而可以看到内部调用的是 `ReactMount._renderSubtreeIntoContainer`，源码实现如下：

```js
render: function(nextElement, container, callback) {
  return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
}
```

`_renderSubtreeIntoContainer` 参数说明：

| 参数 | 说明 |
:-- |:--
parentComponent | 当前组件的父组件，初次渲染为 null
nextElement | 要插入到 DOM 容器中的组件
container | DOM 容器
callback | 渲染完成后的 callback

`_renderSubtreeIntoContainer` 执行主要是以下几个步骤：

1. 各个参数校验是否符合定义的格式。
2. 加工生成新的 `ReactElement`。
3. 判断当前容器中是否已经生成了 `React` 组件。
    - 如果已有生成的 `React` 组件且已存在的组件和新生成的组件是两个完全不同的组件，就执行更新操作 （`_updateRootComponent`）。
    - 如果已有生成的 `React` 组件且已存在的组件和新生成的组件完全相同，就执行卸载操作（ `unmountComponentAtNode`）。
4. 执行将 `React` 组件挂载到真实 `DOM`操作（`_renderNewRootComponent`）。
5. 如果存在 `callback` 渲染完成之后执行 `callback`。

```js

_renderSubtreeIntoContainer: function(parentComponent, nextElement, container, callback) {
  // 验证 callback 是否为 function
  ReactUpdateQueue.validateCallback(callback, 'ReactDOM.render');

  // 生成新的 ReactElement
  // TODO: ReactElement、TopLevelWrapper函数了解
  var nextWrappedElement = ReactElement(
    TopLevelWrapper,
    null,
    null,
    null,
    null,
    null,
    nextElement
  );

  var nextContext;
  if (parentComponent) {
    var parentInst = ReactInstanceMap.get(parentComponent);
    nextContext = parentInst._processChildContext(parentInst._context);
  } else {
    nextContext = emptyObject;
  }

  // 判断容器中是否生成了 React 组件
  var prevComponent = getTopLevelWrapperInContainer(container);

  if (prevComponent) {
    var prevWrappedElement = prevComponent._currentElement;
    var prevElement = prevWrappedElement.props;

    // 将已有组件的 element 和 props 和当前组件的 element 和 props 进行比较
    if (shouldUpdateReactComponent(prevElement, nextElement)) {
      var publicInst = prevComponent._renderedComponent.getPublicInstance();
      var updatedCallback = callback && function() {
        callback.call(publicInst);
      };

      // 更新 React 组件
      ReactMount._updateRootComponent(
        prevComponent,
        nextWrappedElement,
        nextContext,
        container,
        updatedCallback
      );
      return publicInst;
    } else {
      // 卸载 React 组件
      ReactMount.unmountComponentAtNode(container);
    }
  }

  var reactRootElement = getReactRootElementInContainer(container);
  var containerHasReactMarkup =
    reactRootElement && !!internalGetID(reactRootElement);
  var containerHasNonRootReactChild = hasNonRootReactChild(container);

  var shouldReuseMarkup =
    containerHasReactMarkup &&
    !prevComponent &&
    !containerHasNonRootReactChild;

  // React 组件挂载到真实 DOM
  var component = ReactMount._renderNewRootComponent(
    nextWrappedElement,
    container,
    shouldReuseMarkup,
    nextContext
  )._renderedComponent.getPublicInstance();

  // 渲染完成之后执行的 callback
  if (callback) {
    callback.call(component);
  }

  return component;
}
```

`_renderNewRootComponent`参数说明如下：

| 参数 | 说明 |
:-- |:--
nextElement | 要插入到 DOM 容器中的组件
container | DOM 容器
shouldReuseMarkup | 是否需要给组件做标记（给组件标记独立的ID）

`_renderNewRootComponent` 函数执行组件装载操作，在这个函数中，`instantiateReactComponent` 和 `batchedUpdates`这两个函数是执行的关键点。

```js
_renderNewRootComponent: function(
  nextElement,
  container,
  shouldReuseMarkup,
  context
) {

  ReactBrowserEventEmitter.ensureScrollValueMonitoring();

  // 生成 React 组件实例
  var componentInstance = instantiateReactComponent(nextElement, false);

  // 初次渲染是同步的，但是在这期间发生的任何更新将会在 componentWillMount 或者 componentDidMount 中进行渲染，并通过事务的形式更新。
  ReactUpdates.batchedUpdates(
    batchedMountComponentIntoNode,
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  );

  // 记录组件实例的 ID
  var wrapperID = componentInstance._instance.rootID;
  instancesByReactRootID[wrapperID] = componentInstance;

  return componentInstance;
}
```

首先我们来看 `instantiateReactComponent` 这个函数，它会将传入的组件经过加工转换成对应的 `React` 组件类型。该函数返回的加工对象有以下几种类型：

| node | 结果 |
:-- |:--
`null` / `false` | `ReactDOMEmptyComponent` 组件
`object` && `type === string` | `ReactDOMComponent` 组件（最常用的组件，包含完整的生命周期）
`object` && `type !== string` | `ReactCompositeComponent` 组件
`string` / `number` | `ReactDOMTextComponent` 组件

```js
function instantiateReactComponent(node, shouldHaveDebugID) {
  var instance;

  // ReactDOMEmptyComponent
  if (node === null || node === false) {
    instance = ReactEmptyComponent.create(instantiateReactComponent);
  } else if (typeof node === 'object') {
    var element = node;
    invariant(
      element && (typeof element.type === 'function' ||
                  typeof element.type === 'string'),
      'Element type is invalid: expected a string (for built-in components) ' +
      'or a class/function (for composite components) but got: %s.%s',
      element.type == null ? element.type : typeof element.type,
      getDeclarationErrorAddendum(element._owner)
    );

    // ReactDOMComponent
    if (typeof element.type === 'string') {
      instance = ReactHostComponent.createInternalComponent(element);
    } else if (isInternalComponentType(element.type)) {
      // This is temporarily available for custom components that are not string
      // representations. I.e. ART. Once those are updated to use the string
      // representation, we can drop this code path.
      instance = new element.type(element);

      // We renamed this. Allow the old name for compat. :(
      if (!instance.getHostNode) {
        instance.getHostNode = instance.getNativeNode;
      }
    } else {
      // ReactCompositeComponent
      instance = new ReactCompositeComponentWrapper(element);
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
    // ReactDOMTextComponent
    instance = ReactHostComponent.createInstanceForText(node);
  } else {
    invariant(
      false,
      'Encountered invalid React node of type %s',
      typeof node
    );
  }

  return instance;
}
```