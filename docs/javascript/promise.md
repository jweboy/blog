---
title: Promise学习总结
---
#

## Promise测试

### 回调函数风格测试

这是错误的测试demo, 在 *assert* 失败之后，测试并不会结束，直到超时。

```js
it("should use 'done' for test", function (done) {
    const promise = Promise.resolve(1)
    promise.then(function(value) {
        assert(false) // throw AssertionError
        done()
    })
})
```

这是正确的测试demo， *assert* 成功之后会调用 *done()*， 失败之后会调用 *done(error)*。

```js
it("should use 'done' for test", function (done) {
    const promise = Promise.resolve(1)
    promise.then(function(value) {
        assert(false) // throw AssertionError
    }).then(done, done)
})
```

### promise风格测试

这是错误的测试demo， *mayBeRejected* 函数返回一个 *FullFilled* 或者 *Rejected* 状态的 *promise* 对象，从而忽略 *promise* 的正常处理流程，测试始终成功。

```js
function mayBeRejected() {
    return Promise.resolve()
}
// function mayBeRejected() {
//     return Promise.reject(new Error('err'))
// }

it('is bad pattern', function () {
    return mayBeRejected().catch(function(err) {
        assert(err.message === 'err')
    }) // catch会直接被忽略
})
```

这是正确的解决方案，在 *catch* 之前加一个 *.then* 调用。

```js
function mayBeRejected() {
    return Promise.resolve()
}
// function mayBeRejected() {
//     return Promise.reject(new Error('err'))
// }
function failTest() {
    throw new Error('failed')
}

it('is bad pattern', function () {
    return mayBeRejected().then(failTest).catch(function(err) {
        assert(err.message === 'err')
    })
})
```

这是改善的测试demo，明确在 *Fulfilled* 和 *Rejected* 这两种状态下编写对应的测试代码。

```js
function mayBeRejected() {
    return Promise.resolve()
}
// function mayBeRejected() {
//     return Promise.reject(new Error('err'))
// }
function failTest() {
    throw new Error('failed')
}

it('is bad pattern', function () {
    return mayBeRejected().then(failTest, function(err) {
        assert(err.message === 'err')
    })
})
```

## 可控测试优化

一个测试用例包括以下两点：

- 结果满足 *Fullfilled* 或者 *Rejected*
- 对传递给 *assertion* 的值进行检查

编写有效的测试代码，可以定义一个 *helper* 函数，用来明确定义 *promise* 期望的状态。

```js
function shouldReject(promise) {
    return {
        catch: function (fn) {
            return promise.then(function() {
                throw new Error('Expected promise to be rejected')
            }, function (err) {
                fn.call(promise, err)
            })
        }
    }
}

it('should be rejeced', function () {
    const promise = Promise.reject(new Error('err lalala!!!'))
    return shouldReject(promise).catch(function(error) => {
        assert(error.message === 'err lalala!!!')
    })
})
```

## 注意点

### Promise.all

- 参数传递的 *promise* 数组中的所有 *promise* 对象全部变为 *resolve* 的时候，方法才会返回。
- 如果参数中任何一个 *promise* 为 *reject*， 那么整个 *Promise.all* 就会立即终止。

### Promise.race

- 参数传递的 *promise* 数组中的任何一个 *promise* 对象全部变为 *resolve* 或者 *reject* 的时候，方法会立即返回。

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.race([p1, p2, p3]).then((value) => {
    console.log(value); // 1
});
```


## 参考

- [promise-test-helper](https://github.com/azu/promise-test-helper)