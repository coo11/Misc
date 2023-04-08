(() => {
  let body = $request.body,
    url = $request.url;
  switch (true) {
    /**
     * ^https?://pan\.baidu\.com/share/wxlist\? url script-request-body THIS_FILE_URL
     */
    case /\/share\/wxlist\?/.test(url):
      try {
        let newUrl = new URL("http://exmaple.com");
        newUrl.search = body;
        let hash = newUrl.searchParams.get("shorturl"),
          pwd = newUrl.searchParams.get("pwd");
        if (!hash) throw new Error("Hash not found");
        if (!pwd) throw new Error("Pwd not found");
        $notify(
          "百度网盘微信小程序",
          "分享链接提取成功",
          `https://pan.baidu.com/s/${hash}?pwd=${pwd}`
        );
      } catch (e) {
        console.log(`百度网盘微信小程序提取分享链接失败：${e}`);
      }
      break;
    default:
      console.log("触发意外的请求处理，请确认脚本或复写配置正常。");
      break;
  }
  $done();
})();
