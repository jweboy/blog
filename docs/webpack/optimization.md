---
title: 打包优化
---

## 减少文件搜索范围

`resolve` 用于配置模块该如何解析，这个过程中就可以进行适当的优化。

### resolve.alias

配置指定目录的路径或第三方库的路径。如果是三方库，可以告知 `webpack` 使用库的 `min` 文件从而避免内部库解析。

```js
module.exports = {
  //...
  resolve: {
    alias: {
      react: patch.resolve(__dirname, "./node_modules/react/dist/react.min.js");
    }
  }
}
```

> 这种方式会影响 Tree Shaking

### resolve.modules

通知 `webpack` 解析模块时应该搜索的目录，默认是 `node_modules`。从当前目录出发依次向上递归查找（即 `./node_modules`, `../node_modules` 等等），可设置当前目录的 `node_modules` 从而避免层层查找减少查询时间。

```js
module.exports = {
  //...
  resolve: {
    modules: {
      react: patch.resolve(__dirname, "node_modules");
    }
  }
}
```

### resolve.extensions

配置文件名后缀，默认是 `['.js', '.json', '.wasm']`，可添加常用文件配置（如：`.ts`），从而减少文件查询时间。在配置列表中，建议列表值尽量少，且使用频次高的文件后缀放在列表头部。

```js
module.exports = {
  //...
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"];
  }
}
```

### module.noParse

命中匹配防止 `webpack` 进行解析，适用于大型库提高构建性能。

```js
module.exports = {
  //...
  module: {
    noParse: (content) => /jquery|lodash/.test(content),
  },
};
```

### loader

配置 `loader` 的 `test`、`include`、`exclude` 可减少查询时间。

## DLLPlugin 减少编译次数

// TODO

## HappyPack 多进程编译

// TODO

## ParallelUglify 多进程压缩

// TODO
