# IPA 抓包

1. 安装特定的 iTunes 版本
 
> [使用 iTunes 在业务环境中部署应用](https://support.apple.com/zh-cn/HT208079)

截止至 2021-3-20，可用的最新版本是 12.6.5。

直链下载：[Mac](https://secure-appldnld.apple.com/itunes12/091-87821-20180912-69177170-B085-11E8-B6AB-C1D03409AD2A/iTunes12.6.5.dmg) | [x86](https://secure-appldnld.apple.com/itunes12/091-87820-20180912-69177170-B085-11E8-B6AB-C1D03409AD2A5/iTunesSetup.exe) | [x64](https://secure-appldnld.apple.com/itunes12/091-87819-20180912-69177170-B085-11E8-B6AB-C1D03409AD2A6/iTunes64Setup.exe)

2. 安装抓包软件 Fiddler 并安装证书

下载：[Official](https://www.telerik.com/download/fiddler) | [腾讯](https://pc.qq.com/detail/10/detail_3330.html)

打开安装后的 Fiddler ，点击 Tools → Options → HTTPS，依次次勾选 `Capture HTTPS CONNECTs` 和 `Decrypt HTTPS traffic`，然后点击 `Action` 选择 `Trust Root Certificate`（信任根证书）。

有时候 Fiddler 安装后，使用 `Trust Root Certificate` 出现无法获取证书的情况，这个时候需要先关闭 Fiddler，[下载](http://www.telerik.com/docs/default-source/fiddler/addons/fiddlercertmaker.exe?sfvrsn=2) 并安装「Fiddler 证书生成器」。

Fiddler 证书生成器安装完毕后，运行并点击 Tools → Options → HTTPS → Action → Export Root Certificate to Desktop（将根证书导出到桌面）
然后找到证书安装

注意事项：
- 如果没有安装证书，开启 Fiddler 抓包状态，iTunes 是无法连接网络的
- 部分电脑安装 Fiddler 证书生成器后，也可以直接点击Trust Root Certificate 信任根证书
- 如果 Trust Root Certificate 无法信任根证书，请安装 Fiddler 证书生成器试试看

3. 获取应用旧版本 ID

- 自查：
    
  `https://tools.lancely.tech/apple/app-search?country={cn,jp,us,tw,hk,ca,gb,kr}&query={keyword}`

- 解压 IPA 安装包后，在文件 `iTunesMetadata.plist` 中的 `softwareVersionExternalIdentifier` 一栏查看。

4. Fiddler 抓包详细步骤

    1. 打开 iTunes，搜索并找到要下载的 APP
    
    2. 设置断点：打开 Fiddler，在左下角黑色输入框内输入 `bpu MZBuy.woa` 然后按回车键

    3. 断点设置完成后，打开 iTunes，点击下载 APP，这个是会一直显示“正在下载”，但是暂时无法下载的

    4. 点击下载后，立即打开 Fiddler，可以看到暂时被断点拦截的，含有类似 `p43-buy` 字样的请求。需确保 `Capturing`（抓取）开关是打开状态

    5. 点击此条请求并在右边的分析界面选择 `Inspectors`，然后选择 `TextView`

    6. 找到 `<key>AppExtVsID<key>`, 替换中间的数字为欲抓取的版本 ID

    7. 点击 `Run to Completion` 即可完成下载。