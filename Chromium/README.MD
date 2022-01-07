# Chrome Search Engine & Bookmarks Helper
一个可以进行半自动备份或恢复 Chromium 搜索引擎和书签的批处理脚本。

## 需求背景

去年 3 月份，Google 开始 [禁止](https://blog.chromium.org/2021/01/limiting-private-api-availability-in.html) 第三方 Chromium 浏览器使用 Google 账户同步用户数据，同时，Cent browser 在此之后并未更新或提供任何同步书签和搜索引擎数据的解决方案（虽然但是，只要不更新同步功能依然是正常的，无论如何，感谢 Cent 开发者多年的付出）。

## 解决痛点

本人算是 Cent Browser 的重度用户，Google 禁止后个人认为最理想的同步方式便是像 Tempermonkey 那样可以通过 WebDAV 同步数据而不是浏览器开发者自建一个账号系统。

当然，Chrome 应用商店早有第三方同步书签服务的插件，但这类插件从来不能解决「同步搜索引擎」这个刚需。

大概 2011 年已经有人写了一个可以导入导出搜索引擎的脚本，[Chrome-Search-Engine-Sync](https://github.com/ludovicchabant/Chrome-Search-Engine-Sync)，但是自从 Chrome 88 之后的某个版本失效。

所以就 Fork 过来更新了一下。

现在，你可以借助一个脚本，同时备份书签和搜索引擎。注意，该脚本只是一个备份或恢复书签和搜索引擎数据的折中方案，导出导入的数据仍需自行管理。

## 参考
- https://github.com/ludovicchabant/Chrome-Search-Engine-Sync
- https://superuser.com/questions/280694/