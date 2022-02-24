<!--
 * @Author: jweboy
 * @Date: 2022-02-24 14:26:52
 * @LastEditors: jweboy
 * @LastEditTime: 2022-02-24 14:38:56
-->
---

title: Redux 源码
---

`redux` 的核心 `API` 有以下几个：

- dispatch 用于分发事件
- subscribe
- getState
- replaceReducer

## dispatch

以下主要是 `dispatch` 实现的基本讲解

```js
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  // if (typeof enhancer !== 'undefined') {
  //   if (typeof enhancer !== 'function') {
  //     throw new Error('Expected the enhancer to be a function.')
  //   }
  //   return enhancer(createStore)(reducer, preloadedState)
  // }
  ...此处省略多余代码

  // 当前 store 中的 reducer
  var currentReducer = reducer
  // 当前 store 存储的各个状态
  var currentState = preloadedState
  // 监听当前 dispatch 的任务队列
  var currentListeners = []
  // 监听下一次 dispatch 的任务队列
  var nextListeners = currentListeners
  // 判断当前是否处于正在分发事件的状态
  var isDispatching = false

  function dispatch(action) {
    // 判断当前是否处于正在进行 dispatch 的状态，以保证 dispatch 串联调用
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    // 结合当前的 store 和 action，并通过 reducer 处理得到最新的 store
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // 获取当前的监听任务队列
    var listeners = currentListeners = nextListeners

    // 执行队列中的所有监听任务
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      listener()
    }

    return action
  }

  // 默认调用一次 dispatch，分发一个初始化 store 事件
  dispatch({ type: ActionTypes.INIT })

  ...此处省略多余代码
}
```
