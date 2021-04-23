---
title: 学习记录
---

#

## 状态简览

使用 `git status` 命令查看文件状态， 使用更简短的命令 `git status -s` 查看紧凑的格式输出。

- `??`标记：新添加的未跟踪文件。
- `A`标记：新添加到暂存区的文件。
- `M`标记：修改过的文件，`M` 有两个可以出现的位置，出现的右边的 `M` 表示该文件被修改了但还没放入暂存区，出现在靠左边的 `M` 表示该文件被修改了并放入了暂存区。

```js
$ git status -s
 M README
MM Rakefile
A lib/git.rb
M lib/simplegit.rb
?? LICENSE.txt
```

## 忽略文件

增加 `.gitignore` 文件列出要忽略的文件列表。[具体参考](https://github.com/github/gitignore)

- 所有空行或者以 `#` 开头的行都会被 Git 忽略。
- 匹配模式以 `/` 开头防止递归。
- 匹配模式可以以 `/` 结尾指定目录。
- 使用标准的 glob 模式匹配。
  - `*` 匹配零个或多个任意字符。
  - `[abc]` 匹配任何一个列在括号中的字符（如：要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）。
  - `[a-b]` 匹配两个字符范围内的字符。（如：`[0-9]` 表示匹配所有 0 到 9 的数字）
  - `?` 只匹配一个任意字符。
  - `**` 匹配任意中间目录。（如：如`a/**/z` 可以匹配 a/z, a/b/z 或 `a/b/c/z`等）

## 查看已暂存的修改

```js
git diff --cached || git diff --staged
```

## 跳过暂存区

给 `git commit` 增加一个 `-a` 选项，Git就会自动把 **已跟踪过的文件** 暂存起来一并提交,无需在使用  
 `git add` 命令。

```js
git commit -a -m <commit message>
```

## 暂存区移除文件

从暂存区移除文件，但文件仍保留在磁盘中，并且不会被Git继续跟踪。

```js
git rm --cached <file>
```

## 暂存区文件重命名

```js
git mv file_from file_to
```

实际上 `git mv` 会自动检测执行三次命令。

```js
mv README README.md
git rm README
git add README.md
```

## 查看提交历史

`git log` 常用选项说明：

- `-p` 显示每次更新之间的差异
- `--stat` 显示每次更新文件的修改统计信息
- `--shortstat` 只显示 `--stat` 中最后的行数修改移除统计
- `--pretty` 定制显示提交历史的展示方式
  - `oneline` 每个提交都放在一行展示
  - `short`
  - `full`
  - `fuller`
  - `format`

    常用选项
    选项 | 说明
    ------------ | ------------
    **%H** | 提交对象（commint）的完整哈希字符串
    **%h** | 提交对象（commint）的简短哈希字符串
    **%T** | 树对象（tree）的完整哈希字符串
    **%t** | 树对象（tree）的简短哈希字符串
    **%P** | 父对象（parent）的完整哈希字符串
    **%p** | 父对象（parent）的简短哈希字符串
    **%an** | 作者（author）的名字
    **%ae** | 作者的电子邮件地址（email）
    **%ad** | 作者修订日期（可以用 **--date=** 选项定制格式）
    **%ar** | 作者修订日期，按多久以前显示
    **%cn** | 提交者（committer）的名字
    **%ce** | 提交者的电子邮件地址（email）
    **%cd** | 提交日期
    **%cr** | 提交日期，按多久以前显示
    **%s** | 提交说明

    作者指的是实际作出修改的人，提交者指的是最后提交修改到仓库的人。 例子如下：

    ```js
    git log --pretty=format="%h - %an, %ar : %s"
    ```
- `--name-only` 只在提交信息后显示已修改的文件列表
- `--name-status` 显示新增、修改、删除的文件列表
- `--abbrev-commit` 仅显示 SHA-1 的前几个字符
- `--graph` 显示 ASCII 图形表示的分支合并历史
- `-n` 仅显示最近 `n` 条的提交，`n` 为任何整数
- `--since, --after` 仅显示指定时间之后的提交

    如：显示最近两周内的提交信息
    ```js
    git log --since=2.weeks
    ```

- `--until, --before` 仅显示指定时间之前的提交
- `--author` 仅显示指定作者相关的提交
- `--committer` 仅显示指定提交者相关的提交
- `--grep` 仅显示指定关键词的提交

    如：用 `--author`显示指定作者的提交， `--grep` 搜索提交中的关键字，如果要得到同时满足这两个搜索条件的提交，就必须用 `--all-match` 选项，反之满足任意一个条件都会被匹配。

- `-S` 仅显示添加或移除了某个关键字的提交

// TODO: 增加 git log path, 理解 go log -S
