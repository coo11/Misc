# Chrome Search Engine & Bookmarks Helper
一个可以进行半自动备份或恢复 Chromium 内核浏览器搜索引擎和书签数据的批处理脚本。

## 需求背景

去年 3 月份，Google 开始 [禁止](https://blog.chromium.org/2021/01/limiting-private-api-availability-in.html) 第三方 Chromium 浏览器使用 Google 账户同步用户数据，同时，Cent browser 在此之后并未更新或提供任何同步书签和搜索引擎数据的解决方案（虽然但是，只要不更新同步功能依然是正常的，无论如何，感谢 Cent 开发者多年的付出）。

## 使用说明

运行批处理 `Helper.cmd`，根据需求提供需要进行导出或导入的搜索引擎数据（文件 `Web Data`）或书签数据（文件 `Bookmarks`），也可将上述数据拖拽到该脚本上运行即可。

上述文件均在 [用户数据目录](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/user_data_dir.md#windows) 下。原版 Chrome 浏览器默认账户的默认用户数据储存目录在 `%LOCALAPPDATA%\Google\Chrome\User Data\Default`。

如果你不确定上述文件在哪里，或者使用了第三方 Chrome，可以使用想要导出或导入的数据的账户身份运行浏览器，然后进入 `chrome://version`，查看 `Profile Path` 或 「个人资料路径」即可。

![](https://mapp.alicdn.com/1641658866037fjcSYlk2yHj2ETU.png)

## 解决痛点

> 个人认为最理想的同步方式便是像 Tempermonkey 那样可以通过 WebDAV 同步数据而不是浏览器开发者自建一个账号系统。但写了这个批处理出来，对自己来说应该会用好一阵子了——谷歌这种大厂不值得信赖，我只需同步书签和搜索引擎；即便 Cent 开发者自建一个账号系统，也会因小团队的稳定性产生疑虑；而拥有稳定云同步服务的 Edge 的本地化程度远不及 Cent，用是不可能用的。

本人算是 Cent Browser 的重度用户，Google 禁止第三方同步后带来了极大的不便。

当然，Chrome 应用商店早有第三方同步书签服务的插件，但这类插件从来不能解决「同步搜索引擎」这个刚需。

大概 2011 年已经有人写了一个可以导入导出搜索引擎的脚本，[Chrome-Search-Engine-Sync](https://github.com/ludovicchabant/Chrome-Search-Engine-Sync)，但是自从 Chromium 86（截止至此次 commit，最新的 Cent 使用的内核）之后的某个版本失效。

所以就 Fork 过来更新了一下。

现在，你可以借助一个批处理，同时备份书签和搜索引擎。注意，该批处理只是一个备份或恢复书签和搜索引擎数据的折中方案，导出导入的数据仍需自行管理。因此，那些不信赖云同步的用户也可考虑使用这个脚本。

## 参考
- https://github.com/ludovicchabant/Chrome-Search-Engine-Sync
- https://superuser.com/questions/280694/