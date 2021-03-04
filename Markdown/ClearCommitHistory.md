# 如何清空所有的 commit 记录？

## 问题背景

使用 `git config user.email` 在本地 Git 客户端填写的地址可能会导致邮箱地址泄漏：
  - 在网页端不仅可以查看到公开仓库的 commit 历史记录，还可以获取 commit 信息中的邮箱地址，比如：
    
    一条 commit 记录链接，在后缀添加 `.patch`：

    ```
    https://github.com/walterlv/Whitman/commit/1088973f71466aaed1eff7a5fdf00eb7f4604620  

    https://github.com/walterlv/Whitman/commit/1088973f71466aaed1eff7a5fdf00eb7f4604620.patch
    ```

    即可查看到邮箱地址。测试发现 Github 和 Coding 均有该问题。

## 解决方案

  - 使用 Github，可在 <https://github.com/settings/emails> 设置 Github 提供的私有邮箱地址。
  - 如果已经提交过了，清空 commit 历史记录即可。
  - 不要在本地的 config 中添加真实的邮箱信息，依然可以正常提交。

### 清空 commit 记录方法

```sh
# 基于当前分支创建一个独立的分支new_branch：
git checkout --orphan  new_branch

# 添加所有文件变化至暂存空间：
git add -A

# 提交并添加提交记录：
git commit -am "commit"

# 删除当前分支（master 谨慎删除）：
git branch -D master

# 重新命名当前独立分支为 master：
git branch -m master

# 推送到远端分支，f 是 --force 缩写，谨慎：
git push -f origin master
```