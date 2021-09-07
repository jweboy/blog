---
title: 升级打怪
---

在现代前端工程化的历史中，`webpack` 这个炙手可热的模块打包工具占据着打包编译界的半壁江山，它拥有丰富的插件生态和强大的编译能力，也正因为其过于“强大”导致在升级时会出现各种各样的兼容等问题，这点想必有过升级经历的应该都印象深刻吧！那么今天我们就来聊聊升级到 `webpack5` 过程中出现的各类问题和相关解决方案。

## 起因

缘于公司项目重构和打包优化的需求，同时基于对架构统一和底层完善，决定采用 `webpack5` 作为打包工具来加速项目的打包编译效率。

## 说明

> 以下的所有贴图均为题主实际开发中遇到的错误信息，仅供参考使用。

## 问题

### 'locals' of undefined 报错

![20210707193422.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d866ad90d5a466e92970cf7c10c7f03~tplv-k3u1fbpfcp-watermark.image)

从上述的截图中提取到错误信息

```js
Uncaught TypeError: Cannot read property 'locals' of undefined
```

#### 原因

初看这个错误分析它大概意思之后，题主猜测可能跟 `loader` 的版本有关系（毕竟这是升级过程中的经典问题之一），然后在题主一顿 操作猛如虎之后发现确实由 `loader` 引起，大致问题是 `style-loader` 与 `mini-css-extract-plugin` 这俩货在打包过程中同时使用会有冲突。

#### 解决

在参考了相关解决方案之后，题主采用了 `去除style-loader` 的做法，贴一段示例代码作参考。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDev = /* your logic */ true;

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // 只在 dev 使用 style-loader
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
};
```

> 提示：很多 `webpack` 的 `loader` （如： `css-loader` ） 在新版发布后会出现 `breaking change` 的变动，因此如果遇到问题时最好先查阅一遍该 `loader` 的最新文档。

以下是题主解决过程中找到的相关方案可供参考

- [uncaught-typeerror-cannot-read-property-locals-of-undefined](https://stackoverflow.com/questions/65359841/uncaught-typeerror-cannot-read-property-locals-of-undefined)
- [mini-css-extract-plugin/issues](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/613)

### process is not defined

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c95ec82ac77845fb864256642f5b9586~tplv-k3u1fbpfcp-watermark.image)

#### 原因

这个问题基本上只要在项目中使用了 `process` 变量应该都会遇到，那么就会让人产生疑惑了，为什么明明我在 `webpack4` 都能用的，到 `webpack5` 就直接给干掉了？

带着这些疑问，我们来查阅下[官方文档](https://webpack.js.org/)，看看能不能找到一些注释马迹。果然，在 `迁移指南` 里官方爸爸已经对这个 `breaking change` 给出了详细的说明，这里题主把关键的内容贴出来。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/001b57b5bfe14259bbdac37acb2df4d7~tplv-k3u1fbpfcp-watermark.image)

从圈出的内容里可以看到 `webpack5` 为了提高 `web` 的兼容性，已不再自动引入 `Node` 模块相关的 `polyfill` 了，如需使用需要我们手动引入对应的依赖包，这也就是出现 `process` 变量未定义的原因。

#### 解决

那么我们还能继续使用 `process` 作为全局变量吗？答案当然是可以的，以下是题主结合其他方案采用的解决方式。

1. 手动安装 `process` 依赖包到项目中。
2. 将全局变量 `process` 指向 `process` 的 `browser` 目录主文件。
3. 引入 `ProvidePlugin` 插件，指定 `process` 指向。

```js
// step 1
yarn add process

// step 2
config.resolve.alias.set("process", "process/browser");

// step 3
config.plugin("processPolyfill").use(
  new webpack.ProvidePlugin({
    process: "process/browser",
  })
);
```

然后在题主实现完成后，开发运行时没问题，在打包构建时却出现了 `process.env.API` 这一类环境变量读取不到的问题（略无解）。 因此最终采用 `EnvironmentPlugin` 结合 `DotPlugin` 读取 `*.env` 文件来弥补这个缺陷，如有更好的方案可以告诉我。

```js
config.plugin("env").use(new webpack.EnvironmentPlugin(envKeys));

if (isProd) {
  config.plugin("DotPlugin").use(require.resolve("dotenv-webpack"), [
    {
      path: envFile,
    },
  ]);
}
```

以下是题主解决过程中找到的相关方案可供参考

- [webpack-bundle-js-uncaught-referenceerror-process-is-not-defined](https://stackoverflow.com/questions/41359504/webpack-bundle-js-uncaught-referenceerror-process-is-not-defined#)

### mini-css-extract-plugin 的 order 报错

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08e4ea07c88a46c79a2b3ca270a9d335~tplv-k3u1fbpfcp-watermark.image)

#### 原因

这个错误就比较显而易见了，应该是插件的排序引起。

#### 解决

直接通过 `mini-css-extract-plugin`配置项`ignoreOrder` 解决。

```js
config.optimization.minimizer("css").use(MiniCssExtractPlugin, [
  {
    filename: `css/[name].[contenthash:8].css`,
    chunkFilename: `css/[name].[contenthash:8].chunk.css`,
    ignoreOrder: true,
  },
]);
```

以下是题主解决过程中找到的相关方案可供参考

- [mini-css-extract-plugin/issue](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-550109645)
- [remove-order-warnings](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#remove-order-warnings)

### core-js 中 define-property 报错

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec21e6960ba44306bc41780250f2169d~tplv-k3u1fbpfcp-watermark.image)

从上述的截图中提取到错误信息

```js
webpack 5.0.0-beta.30 Module not found: Error: Can't resolve '../../core-js/object/define-property'
```

#### 原因

乍一看这个错误之后有点懵逼，不过在细心观察后可以发现错误来源于 `core-js`，猜测可能跟 `.(m)js` 文件编译有关系。

#### 解决

在题主的多方努力之后，找到了一个可行的解决方案，即设置 `fullySpecified` 为 `false`，可参考以下贴出的示例。

```js
config.module
  .rule("esmJs")
  .test(/\.m?js/)
  .resolve.set("fullySpecified", false);
```

以下是题主解决过程中找到的相关方案可供参考

- [webpack/issue](https://github.com/webpack/webpack/issues/11467#issuecomment-691702706)

### path-to-regexp export 错误

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8938d07f25884886899e389e89fe772b~tplv-k3u1fbpfcp-watermark.image)

从上述的截图中提取到错误信息

```js
Attempted import error: 'path-to-regexp' does not contain a default export (imported as 'pathToRegexp')
```

#### 原因

通过排查比对 `package.json` 中的依赖版本、 `node_modules` 中依赖的版本之后，题主发现在此次重构迁移的过程中，按照老项目的方式安装了两份 `path-to-regexp`，具体依赖包位置如下：

1. 项目安装的 `react-router` 已包含了 `path-to-regexp` 库，依赖版本为 `^1.7.0`
2. 项目又单独安装了 `path-to-regexp` 依赖，其版本为 `^6.1.0`

#### 解决

猜测到同时存在两个版本可能会有 `API` 差异，题主特意去查看了不同版本的说明文档，果然发现版本不同其导出的`export` 方式也发生了变化，因此这里采用删除单独安装 `path-to-regexp` 依赖（项目用这个库不多，同时 `react-router` 已包含了这个库，就不重复添加了），然后在项目中按照低版本的方式引入。

```js
// before
import { pathToRegexp } from "path-to-regexp";

// after
import pathToRegexp from "path-to-regexp";
```

以下是题主解决过程中找到的相关方案可供参考

- [attempted-import-error-path-to-regexp-does-not-contain-a-default-export-impo](https://stackoverflow.com/questions/59619237/attempted-import-error-path-to-regexp-does-not-contain-a-default-export-impo)

### .plugins[3][1] 报错

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb093bd1fcb145d08229ddb567ff900e~tplv-k3u1fbpfcp-watermark.image)

从上述的截图中提取到错误信息

```js
.plugins[3][1] must be an object, false, or undefined
```

这个问题一般是由于 `babel` 的配置文件（`.babelrc` 或 `babel.config.js`）中的 `plugin` 配置不当引起的，可参考 [plugins01-must-be-an-object-false-or-undefined](https://stackoverflow.com/questions/56775030/plugins01-must-be-an-object-false-or-undefined) 解决。

### @pmmmwh/react-refresh-webpack-plugin 报错 $RefreshReg$

题主在此次升级过程中引入了 `@pmmmwh/react-refresh-webpack-plugin` 这个全新的刷新库，这个库也是官方推荐替换 `react-hot-loader` 的刷新库，虽然目前还没到 `beta` 版本，不过可以先尝鲜（个人感觉还算稳定可以试用）。在一通魔改配置之后却并没有得到想要的刷新效果，而得到了如下的错误信息。

```js
$RefreshReg$ is not defined with ChildCompiler usage
```

#### 原因

在参考配置、分析刷新之后，题主基本确定了这个错误跟配置的处理位置有关系。

#### 解决

由于题主的项目将 `react` 等库抽离到 `CDN` 上，实现方式上有所差异，因此就不贴参考代码了，具体方案可参考 [react-re是fresh-webpack-plugin/issue](https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/176#issuecomment-683151985)。

### @babel/plugin-transform-typescript 不支持 export= 语法

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9296605cfa384935b2280d550594b91d~tplv-k3u1fbpfcp-watermark.image)

从上述的截图中提取到错误信息

```js
`export =` is not supported by @babel/plugin-transform-typescript Please consider using `export <value>;`
```

#### 原因

这个全新的项目统一采用了 `CSS Moudles` 的方式，同时结合 `@teamsupercell/typings-for-css-modules-loader` 生成 `*.module.less.d.ts` 文件以提高 `less` 文件的使用效率，
但是在 `*.module.less.d.ts` 文件中包含了 `export =` 的语法导致编译不识别。

#### 解决

在这个时候的 `babel` 的插件就很有用了，通过在插件将 `export =` 语法转换为
`export <value>;`，那么问题就迎刃而解了。 不过，题主正好在相关 [issue](https://github.com/babel/babel/issues/12345#issuecomment-725585579) 中找到了现成的插件就直接使用没有自己重复在轮子了，这里贴一下插件的具体代码。

```js
import { NodePath, PluginObj } from "@babel/core";
import { TemplateBuilder } from "@babel/template";
import { TSExportAssignment } from "@babel/types";

const babelPluginReplaceTsExportAssignment = ({
  template,
}: {
  template: TemplateBuilder<TSExportAssignment>,
}): PluginObj => {
  const moduleExportsDeclaration = template(`
    module.exports = ASSIGNMENT;
  `);

  return {
    name: "replace-ts-export-assignment",
    visitor: {
      TSExportAssignment(path: NodePath<TSExportAssignment>) {
        path.replaceWith(
          moduleExportsDeclaration({ ASSIGNMENT: path.node.expression })
        );
      },
    },
  };
};

export default babelPluginReplaceTsExportAssignment;
```
