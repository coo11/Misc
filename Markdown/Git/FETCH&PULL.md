## git fetch 和 git pull 的差别

> [来源](https://www.cnblogs.com/qiu-Ann/p/7902855.html)

1. `git fetch` 相当于是从远程获取最新到本地，不会自动 merge：

```
git fetch orgin master //将远程仓库的 master 分支下载到本地当前 branch 中

git log -p master  ..origin/master //比较本地的 master 分支和 origin/master 分支的差别

git merge origin/master //进行合并
```
也可以用以下指令：

```
git fetch origin master:tmp //从远程仓库 master 分支获取最新，在本地建立 tmp 分支

git diff tmp //將當前分支和 tmp 進行對比

git merge tmp //合并 tmp 分支到当前分支
```

2. `git pull` 相当于是从远程获取最新版本并 merge 到本地:

```
git pull origin master
```
`git pull` 相当于从远程获取最新版本并 merge 到本地

在实际使用中，`git fetch` 更安全一些