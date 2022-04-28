---
title: 常用别名
---

使用简短的 `Git别名` 有助于提高日常使用 `Git` 的工作效率，
在 `mac` 的极致 `linux` 环境中已内置了非常丰富的 `alias` 命名，那么以下是我在使用 `Git` 过程中总结的一些常用别名。

:::tip
设置这些Git别名需要在 .zshrc 或者 .bashrc 中设置(windows特殊)，这个文件通常位于计算机的 HOME 目录。
:::

## 别名缩写

### gaa

```bash
git add .
```

### gcm

将所有更改添加到暂存区

```bash
git commit -m
```

### gca

将当前保存的文件移动到上一个提交信息中，`--no-edit` 表示保留以前提交的信息，即当前保存文件中新加的内容不会被删除

```bash
git commit --amend --no-edit
```

### gwait

取消所有暂存的文件

```bash
git reset HEAD
```

### gundo

取消上次提交并将提交中的文件移动到暂存区。

```bash
git reset --soft HEAD^
```

### gl

显示提交信息(提交哈希，提交日期，分支名称，提交记录和作者)

```bash
git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph
```

### gco

分支切换

```bash
git checkout
```

### gps

更新远端

```bash
git push
```

### gpsf

强制使用本地分支覆盖远端分支，它被认定为比 `git push --force` 更安全。

```bash
git push --focre-with-lease
```

### gpl

从远端获取更新并用上游分支重新绑定本地分支，清除多余的 `merge commit` 信息

```bash
git pull --rebase
```

### grb

使用另一个分支重新绑定当前分支

```bash
git rebase
```

### grba

终止 `git rebase` 操作并将 `git` 状态恢复到 `git rebase` 命令开始运行的那个时刻

```bash
git rebase --abort
```

### grbc

一般用于解决提交冲突之后继续执行 `git rebase`

```bash
git rebase --continue
```

### gdno

比对文件修改记录，只显示对应的文件列表

```bash
git diff --name-only
```

### gd

比对文件修改记录

```bash
git diff
```

### gss

显示精简版的文件修改状态

```bash
git status -s
```

### gmnf

正常合并（不快进）

```bash
git merge --no-ff
```

## 默认别名

在 `windows` 、`macos` 等系统中已有比较丰富的 `git` 别名默认值可以选用。

### windows

```bash
[alias]
 aa = add -A
 cm = commit -m
 ca = commit --amend --no-edit
 wait = reset HEAD
 undo = reset --soft HEAD^
 lg = log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph
 co = checkout
 ps = push
 psf = push --force-with-lease
 pl = pull --rebase
 rb = rebase
 rba = rebase --abort
 rbc = rebase --continue
 dno = diff --name-only
 d = diff
 ss = status -s
 mnf = merge --no-ff
```

### macos

```bash
alias gaa='git add -A'
alias gcm='git commit -m'
alias gca='git commit --amend --no-edit'
alias gwait='git reset HEAD'
alias gundo='git reset --soft HEAD^'
alias glg='git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph'
alias gco='git checkout'
alias gps='git push'
alias gpsf='git push --force-with-lease'
alias gpl='git pull --rebase'
alias grb='git rebase'
alias grba='git rebase --abort'
alias grbc='git rebase --continue'
alias gdno='git diff --name-only'
alias gd='git diff'
alias gss='git status -s'
alias gm='git merge --no-ff'
```
