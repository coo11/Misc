(() => {
  let body = $response.body,
    url = $request.url,
    headers = $response.headers;
  switch (true) {
    // Short link redirect
    case /toasturl=([^&]+)/.test(url):
      headers["Location"] = decodeURIComponent(RegExp.$1)
      $done({ status: "HTTP/1.1 302 Found", headers });
    case /^https?:\/\/(t|sinaurl)\.cn\//.test(url):
      if ("Location" in headers && $response.statusCode != 302) {
        $done({ status: "HTTP/1.1 302 Found" });
      } else $done();
    case /^https?:\/\/service\.account\.weibo\.com\/reportspamobile\?.*?rid=(\d+)/.test(url):
      body = body.replace(/c_c_a">/, $ & <a href="javascript:navigator.share({title: 'Weibo Share', url: 'https://m.weibo.cn/status/${RegExp.$1}'})" class="m-btn-orange" style="line-height: 0.5rem; border-radius: 2px; padding: 0px 8px; float: right; margin: 0.12rem 0; font-size: 0.24rem;">\u4e0d\u6295\u8bc9\uff0c\u4ec5\u5206\u4eab</a>);
      $done({ body });
    default:
      $done()
  }
})();