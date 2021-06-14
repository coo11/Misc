## 部署 Python3.8 Embeddable 实践记录

### 需要下载的资源
- 本体在这里找：
    <https://www.python.org/ftp/python/>
	<https://www.python.org/downloads/windows/>
- `get-pip.py` 安装脚本在[这里](https://pip.pypa.io/en/stable/installing/#installing-with-get-pip-py)：
    <https://bootstrap.pypa.io/get-pip.py>
	该直链非常慢，下载后保存在 python3 的目录中。
- 三个批处理脚本。也需要保存在 python3 的目录中。[下载链接](https://rgb.coding.net/p/emp/d/emp/git/raw/master/Python/pye-setup.zip)

### 设置环境变量
> 需要设置 python 部署目录以及安装完 pip 后的下级目录 Scripts。

运行批处理 `pyp-setpath.bat` 解决前者，后者再运行 `pyp-getpip.bat`即可。

### 安装 pip
运行 `pyp-getpip.bat`即可，然后根据提示完成 pip 环境变量的设定。
- 该步骤先是运行 `python get-pip.py`，然后修改目录中的 `python3?._pth` 文件（将 `import site` 前的 `#` 号去掉这一步较为关键）。

### 修改为国内源
运行 `pyp-changesource.bat` 即可。
- 可选 [清华](https://mirror.tuna.tsinghua.edu.cn/help/pypi/) 或者 *阿里巴巴* 的镜像源
    - <https://pypi.tuna.tsinghua.edu.cn/simple>
	- <ttps://mirrors.aliyun.com/pypi/simple>
