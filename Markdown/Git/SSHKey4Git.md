# Git管理多个SSH密钥，Git多帐号配置

- 原文地址：<https://blog.csdn.net/yanzhenjie1003/article/details/69487932> (有修改)

- 版权声明：转载必须注明本文转自严振杰的博客：<http://blog.yanzhenjie.com>

首先这篇文章适用于 `Windows` 和 `Linux` 的配置，本人没有条件去验证 Mac，所以不确定是否可以，不过和 `Linux` 一样属于 `Unix` 系统，应该理论上都是可以的，如果有人实验了可以给我个反馈。

这段时间在 `Ubuntu` 上做开发，又一次发现命令是真好用，加上这段时间把服务器从 `Windows` 迁到 `CentOS` ，也渐渐习惯了 `Vim` 。

之前一直在 `Winodws` 下开发，开发中使用的版本管理工具是 `SVN` 和 `Git` ，不过都会使用 `Tortoise` 类似的客户端工具，对于 `Git` 多帐号的情况，它可以动态管理 `SSH-KEY` 。不顾我在在 `Ubuntu` 下开发时没有发现这样的工具，几个 IDE 也需要配置 `SSH` ，于是干脆用命令了，在配置多个 `SSH-KEY` 花了我一个多小时才搞定，中间也由于细节不熟悉浪费了点时间，现在仅仅做个记录，如果能帮到其它遇到同样问题的同学也就更棒了。

---

## SSH 之于 Git 的原理

 `Git` 提交时有 `Https` 和 `SSH` 两种验证方式， `Https` 的方式需要帐号和密码比较好理解，不过它需要在每次提交时输入帐号和密码，有点麻烦；而 SSH 的功能可以粗暴的理解为记住帐号密码，不过对这个过程有人会有点疑惑。首先，我们用 `SSH` 命令生成一个公钥-私钥对，我们会把公钥添加到 `Git` 的服务器，把私钥放在本地。提交文件的时候 `Git` 服务器会用公钥和客户端提交私钥做验证（具体细节不究），如果验证通过则提交成功，那么我们在把公钥添加到服务器的时候肯定是需要登录 `Git` 服务器的，这个过程其实可以理解为帐号和密码托管 `给SSH` 了，所以也是相当于输入了帐号密码，但是由 `SSH` 帮你记住了。这么理解是可以，但是 `SSH` 的意义不仅仅是这样，关于 SSH 的更详细内容看客可以自行再了解。

## 生成 SSH-KEY

打开命令行、终端，用命令进入到你要保存 `SSH-KEY` 文件的文件夹，我们先用命令测试下终端是否支持 `SSH` ：

```
ssh -V
```

如果你的终端支持 SSH，那么你可能看到类似如下的版本信息：

```
OpenSSH_7.3p1, OpenSSL 1.0.2j  26 Sep 2016
```

测试时如果提示不识别 `SSH` 命令，需要安装 `SSH` 。

 `Ubuntu` 安装 `SSH` ：

```
sudo apt-get install openssh-client openssh-server
```

 `CentOS` 安装 `SSH` ：

```
yum install openssh-client openssh-server
```

 `Windows` 可以在当前文件夹右键，选择** `Git Bash Here` **，会自动在当前文件夹打开一个 `MINGW` 的命令行窗体，它是自带 `SSH` 的。

接下来在刚才的文件夹，使用 SSH 命令在当前文件夹生成一对 SSH-KEY：

```bash
ssh-keygen -t rsa -C "邮箱地址"
```

例如：

```bash
ssh-keygen -t rsa -C "smallajax@foxmail.com"
```

接下来会出来提示信息，完整的大概是这样：

```
$ ssh-keygen -t rsa -C "smallajax@foxmail.com"
Generating public/private rsa key pair.
Enter file in which to save the key (~/.ssh/id_rsa):
```

这里需要输入 `SSH-KEY` 的文件名字，这里名字理论上可以随便取，但是我们今天要说配置多个 `SSH-KEY` ，所以请分别查看以下两节：

- 单个 `Git` 帐号的配置——全局 `Git` 配置
- 多个 `Git` 帐号的配置——局部 `Git` 配置

## 单个 Git 帐号的配置——全局 Git 配置

大部分人使用 `Git` 一般是一个帐号，所以接着上面的讲。

上面说到输入 `ssh-keygen` 命令生成 `SSH-KEY` 密钥对文件时需要输入文件名称，如果你仅仅要配置一个帐号，那么我们输入默认名称即可：`id_rsa` 。

接着会要求输入私钥的密码，并且需要确认密码，为了安全在密码输入的时候不会反显，什么都看不到，这个密码你自己设置，但是你一定要记住：

```
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

到这里生成 `SSH-KEY` 的事就完成了，你在当前文件夹会看到两个文件：

    id_rsa  id_rsa.pub

SSH-KEY 生成了，接着给服务器和客户端配置 `SSH-KEY` 。

1. 把 `id_rsa.pub` 中的公钥内容添加到 `Git` 的 `SSH` 中，如果你使用 `Github` 或者 `Gitlib` ，在个人设置中会找到。
2. 把 `SSH-KEY` 配置给 `SSH` ，让系统的 `SSH` 知道这个 `KEY` 。

 `Linux` 把 `id_rsa` 文件拷贝到 `~/.ssh` 文件夹下，命令如下：

```
cp id_rsa ~/.ssh/
```

 `Window` 把 `id_rsa` 文件拷贝到 `C:/Users/你的用户名/.ssh` 文件夹下。

拷贝完成后，把 `.ssh` 文件夹下的 `id_rsa` 文件添加到 `SSH-Agent` ，命令如下：

```
ssh-add id_rsa文件的路径
```

例如 `Linux` ：`ssh-add ~/.ssh/id_rsa` ，如果命令行此时正在 `.ssh` 文件夹下：`ssh-add id_rsa` 即可， `Windows` 同理。

此时添加时如果遇到错误，请参考本文最后一节：**添加 SSH 到 SSH-Agent 时报错**。

最后，执行以下命名配置 `Git` 全局用户和邮箱：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

例如：

```bash
git config --global user.name "YanZhenjie"
git config --global user.email "smallajax@foxmail.com"
```

配置全局用户和邮箱完成后，我们可以查看：  
 `Linux` 用户打开 `~/.gitconfig` 文件即可看到配置：

```
vim ~/.gitconfig
```

 `Windows` 用户打开 `C:/Users/你的用户名/.git/config` 即可看到配置，内容大概如下：

```Properties
[user]
name = YanZhenjie
email = smallajax@foxmail.com
```

此时配置全部结束，请查看下方**测试 SSH-KEY 配置是否成功**进行测试。

## 多个 Git 帐号的配置——局部 Git 配置

又有很多人同时使用多个 `Git` 帐号，比如 `Github`、`OSChina`、`Gitlib` 等，再接着上面讲配置多个 `Git` 帐号。

上面说到输入 `ssh-keygen` 命令生成 `SSH-KEY` 密钥对文件时需要输入文件名称，如果你要配置多个帐号，就根据爱好输入 `KEY` 文件的名字吧，例如为 `Github` 配置就输入：`id_rsa_github`，为 `OSChina` 配置就输入：`id_rsa_oschina` 。

接着会要求输入私钥的密码，并且需要确认密码，为了安全在密码输入的时候不会反显，什么都看不到，这个密码你自己设置，但是你一定要记住：

```
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

到这里生成 `SSH-KEY` 的事就完成了，你在当前文件夹会看到两个文件：

```
id_rsa_github  id_rsa_github.pub
```

 `SSH-KEY` 生成了，接着给服务器和客户端配置 `SSH-KEY` 。

1. 把 `id_rsa_github.pub` 中的公钥内容添加到 `Git` 的 `SSH` 中，如果你使用 `Github` 或者 `Gitlib` ，在个人设置中会找到。
2. 为 `SSH` 配置私钥位置，这里和上面配置单个 `Git` 帐号不一样，不过单个帐号也可以按照多个帐号的配置方法来配置。

下面我们需要在 `.ssh` 文件夹新建一个名为 `config` 的文件，用它来配置多个 `SSH-KEY` 的管理。

 `Linux` 进入 `.ssh` 文件夹：`cd ~/.ssh` ，新建 `config` 文件：`touch config` ；或者：`touch ~/.ssh/config` 。这里要注意，没有 `.ssh` 文件夹的要新建一个 `.ssh` 名的文件夹。

 `Window` 进入 `C:/Users/你的用户名/.ssh` 文件夹，右键新建一个文本文件，改名为 `config` 即可。这里要注意，没有 `.ssh` 文件夹的要新建一个 `.ssh` 名的文件夹。

下面来填写 `config` 文件的内容，我以 `Github`、`Gitlib`、`OSChina`，局域网为例：

```
Host github.com
    HostName github.com
    User github
    PreferredAuthentications publickey
    IdentityFile /home/Workspace/ssh/id_rsa_github
Host gitlib.com
    HostName gitlib.com
    User gitlib
    PreferredAuthentications publickey
    IdentityFile id_rsa_gitlib
Host oschina.com
    HostName oschina.com
    User oschina
    PreferredAuthentications publickey
    IdentityFile /D/Workspace/ssh/id_rsa_oschina
Host 192.168.1.222
    HostName 192.168.1.222
    User 192
    PreferredAuthentications publickey
    IdentityFile /D/Workspace/ssh/id_rsa_oschina
```

解释一下， `HostName` 是服务器的地址， `User` 是用户名， `PreferredAuthentications` 照抄即可，这里主要说的是 `IdentityFile` ，上面我们看到了三种情况，所以它的书写原则是：

1. 填私钥文件的本地路径。
2. 不论是 `Linux` 还是 `Windows` 都可以写相对路径，比如把 `id_rsa_xxx` 私钥文件放在 `.ssh` 文件夹下。
3. 文件放在不同跟路径下时，需要写绝对路径
4.  `Linux` 中没有放在 `.ssh` 文件夹内或者子文件夹。
5.  `Windows` 中没有放在 `C` 盘下时。注意据对路径变化，比如 C 盘下是 `/C/abc` 、比如 D 盘下 `/D/ssh/id_rsa` 这样，还看不懂请参考上方例子。

拷贝完成后，把所有的 `id_rsa` 私钥文件添加到 `SSH-Agent` ，命令如下：

```bash
ssh-add id_rsa_file_path
```

例如添加 `.ssh` 文件夹下的， `Linux` 这样做：`ssh-add ~/.ssh/id_rsa` ，如果你在 `.ssh` 文件夹下：`ssh-add id_rsa` 即可， `Windows` 同理。

此时添加时如果遇到错误，请参考本文最后一节：**添加 SSH 到 SSH-Agent 时报错**。

最后，还剩下项目的用户和邮箱没有配置，和配个单个 `Git` 帐号的方式不同，这里我们需要为每个项目分别配置，所以要命令行进入仓库文件夹再设置。第一种情况是先从 `Git` 上 `pull` 仓库下来，第二种情况是本地初始化 `Git` 仓库，总之进入改仓库文件夹后：

```bash
git config --local user.name "你的名字"
git config --local user.email "你的邮箱"
```

例如：

```bash
git config --local user.name "YanZhenjie"
git config --local user.email "smallajax@foxmail.com"
```

不过麻烦的一点是如果是多个项目就需要挨个配置，不过我们一般是 `pull` 一个项目就配置一下，也仅仅需要配置一次即可。

注意配置单个 `Git` 帐号时，是不进入项目文件夹就可以，不过不是使用 `--local` ，而是使用 `--global` 就可以全局配置。

配置项目用户和邮箱完成后，我们可以进入项目文件夹下的 `.git` 文件夹查看 `config` 文件内容，大概内容如下：

```Properties
...
[user]
name = YanZhenjie
email = smallajax@foxmail.com
```

此时配置全部结束，请查看下方**测试 SSH-KEY 配置是否成功**进行测试。如果配置成功，你就可以 clone 和 commit 了。

## 测试 SSH-KEY 配置是否成功

配置全部结束，我们来测试一下配置是否成功：

- 如果你是 Github：

  `ssh -T git@github.com`

- 如果是你 Gitlib：

  `ssh -T git@gitlib.com`

- 如果你是局域网 192.168.1.222：

  `ssh -T git@192.168.1.222`

- 其它自行举一反三吧。

此时需要输入刚才生成 SSH-KEY 时输入的私钥密码，输入后自行观察信息判断是否连接成功。

- 比如 Github 的信息是：

    ```
    Hi yanzhenjie! You've successfully authenticated, but GitHub does not provide shell access.
    ```

- 比如 Gitlib 的信息是：

    ```
    Welcome to GitLab, YanZhenjie!
    ```

如果不能执行测试命令或者提示什么错误了，请执行 `ssh-agent bash` 完后再执行测试命令，如果还不行就是配置有问题了。

## 添加 SSH 到 SSH-Agent 时报错

如果执行 `ssh-add ...` 命令提示如下错误：

```
Could not open a connection to your authentication agent.
```

那么请执行 `eval $(ssh-agent)` 命令后再重试，如果还不行，请再执行 `ssh-agent bash` 命令后再执行 `eval $(ssh-agent)` 后执行添加命令。另外上述测试配置的命令不能执行时也可以在 `ssh-agent bash` 执行完后再测试。

- 参考：[StackOverFlow·ssh-Could not open a…](http://stackoverflow.com/questions/17846529/could-not-open-a-connection-to-your-authentication-agent)

## 每次打开 bash 后都要执行 `ssh-add` 命令

> 自己在 Windows 下使用遇到的问题

原因是沒有编写 config 文件（网上亦存在其它解决方案，个人认为不是最佳实践，在没有改动 Git 程序文件的前提下，请仔细检查 `IdentityFile` 的路径语法是否正确）。