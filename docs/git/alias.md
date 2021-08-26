---
title: 常用的别名
---

使用别名有助于提高Git版本控制的效率。
下面是我在使用Git过程中一些常用的别名。
设置这些Git别名需要在 .zshrc 或者 .bashrc 中设置(windows特殊)，这个文件通常位于计算机的 HOME 目录。

## gaa
```js
git add .
```

## gcm
```js
// 将所有更改添加到暂存
git commit -m
```

## gca
```js
// 将当前保存的文件移动到上一个提交信息中，`--no-edit`表示保留以前提交的信息，即当前保存文件中新加的内容不会被删除。
git commit --amend --no-edit
```

## gwait
```js
// 取消所有暂存的文件
git reset HEAD
```

## gundo
```js
// 取消上次提交并将提交中的文件移动到暂存区。
git reset --soft HEAD^
```

## gl
```js
// 显示提交信息(提交哈希，提交日期，分支名称，提交记录和作者)
git log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph
```

## gco
```js
// 分支切换
git checkout
```

## gps
```js
// 更新远端
git push
```

## gpsf
```js
// 强制使用本地分支覆盖远端分支，它被认定为比 git push --force 更安全。
git push --focre-with-lease
```

## gpl
```js
// 从远端获取更新并用上游分支重新绑定本地分支，清除多余的merge commit信息
git pull --rebase
```

## grb
```js
// 使用另一个分支重新绑定当前分支
git rebase
```

## grba
```js
// 终止 git rebase操作并将 git 状态恢复到 git rebase 命令开始运行的那个时刻
git rebase --abort
```

## grbc
```js
// 一般用于解决提交冲突之后继续执行 git rebase
git rebase --continue
```

## gdno
```js
// 比对文件修改记录，只显示对应的文件列表
git diff --name-only
```

## gd
```js
// 比对文件修改记录
git diff
```

## gss
```js
// 显示精简版的文件修改状态
git status -s
```

## gmnf
```js
// 正常合并（不快进）
git merge --no-ff
```

## Windows 系统 Git 别名清单
```js
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

## Linux / Mac 系统 Git 别名清单
```js
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

## 参考
[在 Windows 上打造体验绝佳的 Linux 终端（非 wsl）](https://juejin.im/post/5bd5a08cf265da0add520772)