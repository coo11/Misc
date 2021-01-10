# Setting Proxy & Changing Source for some ware on Windows

> Given to awful internet environment, you should always do this in a certain area.

## Git

- Use `--global` for all repositories or `--local` for current.
```
# Add
git config --global http.proxy http://[user:passwd@]proxy.server:port

# Cancel
git config --global --unset http.proxy
```
- You can also specify domain:
```
# Just for github.com
git config --global http.https://github.com.proxy socks5://127.0.0.1:1080

# Cancel
git config --global --unset http.https://github.com.proxy
```
- Edit file ` ~/.git/config` or `%HOMEPATH%\.gitconfig` (Global) is OK.
- As for accessing to Github.com via SSH, you should edit or create a file `%HOMEPATH%\.ssh\config` with following code:
```
ProxyCommand connect -S 127.0.0.1:1080 -a none %h %p

Host github.com
  User git
  Port 22
  Hostname github.com
  IdentityFile "C:\Users\****\.ssh\id_rsa"
  TCPKeepAlive yes
  ServerAliveInterval 600
  IPQoS=throughput
  ServerAliveCountMax 120

Host ssh.github.com
  User git
  Port 443
  Hostname ssh.github.com
  IdentityFile "C:\Users\****\.ssh\id_rsa"
  TCPKeepAlive yes
  ServerAliveInterval 600
  IPQoS=throughput
  ServerAliveCountMax 120
```
- If you want the host name to be resolved using proxy, yout should use protocol `socks5h://` instead of `socks5://`.

### Reference
- [git-config](https://git-scm.com/docs/git-config)
- [git 设置和取消代理](https://gist.github.com/laispace/666dd7b27e9116faece6)
- [Windows 下 Git SSH 连接方式配置 Socks 代理](https://upupming.site/2019/05/09/git-ssh-socks-proxy/)

## NPM
- Add & Cancel Proxy
```
# Add
npm config set proxy http://[user:passwd@]proxy.server:port
npm config set https-proxy http://http://127.0.0.1:1080

# Cancel
npm config delete proxy
npm config delete https-proxy
```
- Change Source
  - Default: `https://registry.npmjs.org/`
  - Taobao: `http://registry.npm.taobao.org/`
```
npm config set registry http://registry.cnpmjs.org

# Test
npm info underscore

# If error with credentials occurred
npm set strict-ssl false
npm config set registry http://registry.cnpmjs.org
```
- You can also use `nrm` ([npm registry manager](https://github.com/Pana/nrm)) to switch to different sources fastly.

## PIP
- For temporary use, set proxy via `--porxy <proxy_server>` and set source via `-i, --index-url <url>`. If it **doesn't work**, try to set command line environment variables, or use `setx` for system environment.
```
# For temporary use
pip install -i <source> <package> --proxy http://[user:passwd@]proxy.server:port


# Set command line environment variables
set http_proxy=http://192.168.1.1:8080
set https_proxy=https://192.168.1.1:8080
set http_proxy_user=name
set http_proxy_pass=pwd

# Leave blank for no proxy
set http_proxy=
```
- Add source
```
# Add
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
pip config set install.trusted-host mirrors.aliyun.com

# Cancel
pip config unset global.index-url
pip config unset install.trusted-host
```
- You can also edit configuration file `%APPDATA%\pip\pip.ini` for source.
```
[global]
index-url = https://pypi.org/simple/
[install]
trusted-host = pypi.org
```
- Some sources
  - Alibaba: `https://mirrors.aliyun.com/pypi/simple/`
  - Douban: `https://pypi.doubanio.com/simple/`
  - Tsinghua: `https://pypi.tuna.tsinghua.edu.cn/simple/`

### Reference
- [pip documentation](https://pip.pypa.io/en/stable/user_guide/)