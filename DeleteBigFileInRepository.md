## 删除 Git 仓库大文件

- 原文链接：<https://www.cnblogs.com/amiezhang/p/11337095.html>
- 其它参考：[为Git仓库瘦身](http://archive.is/5kTkp) | 出处：<http://www.huamo.online> | *Archived*

有时候我们不小心提交了一些大文件上去，后来删除了，但是已经于事无补了，整个 git 的提及已经蹭蹭上去了。

这个时候怎么办呢？

**1. 查看有哪些大文件（TOP 5）**

```bash
git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -5 | awk '{print$1}')"
```

**2. git filter-branch**

```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch <filename>' --prune-empty --tag-name-filter cat -- --all
```

- `git filter-branch --index-filter` 让每个提交的文件都复制到索引 `.git/index` 中

- 然后运行过滤器命令 `git rm --cached --ignore-unmatch <filename>` 让每个提交都删除掉「filename」文件

- 然后 `--prune-empty` 把空的提交「修剪」掉

- 然后 `--tag-name-filter cat` 把每个 tag 保持原名字，指向修改后的对应提交

- 最后 `-- --all` 将所有 ref（包括 branch、tag）都执行上面的重写

**3. 删除缓存下来的 ref 和 git 操作记录**

```bash
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
```

**4. 垃圾回收**

上面两步把大文件的索引都切断了，这个时候进行垃圾回收，就可以很明显看到效果了

```bash
git gc --prune=now
```

**5. 把 .git 里面的修改推上去**

这个时候普通的 `git push` 是不行的，需要强推

```bash
git push origin --force --all
```
