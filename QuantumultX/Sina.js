(() => {
  let body = $response.body,
    url = $request.url,
    headers = $response.headers;
  switch (true) {
    // Short link redirect
    case /toasturl=([^&]+)/.test(url):
      headers["Location"] = decodeURIComponent(RegExp.$1)
      $done({ status: "HTTP/1.1 302 Found", headers });
      break;
    case /^https?:\/\/(t|sinaurl)\.cn\//.test(url):
      if ("Location" in headers && $response.statusCode != 302) {
        $done({ status: "HTTP/1.1 302 Found" });
      } else $done();
      break;
    case /^https?:\/\/service\.account\.weibo\.com\/reportspamobile\?.*?rid=(\d+)/.test(url):
      body = body.replace(/c_c_a">/, `$&<a href="javascript:navigator.share({title: 'Weibo Share', url: 'https://m.weibo.cn/status/${RegExp.$1}'})" class="m-btn-orange" style="line-height: 0.5rem; border-radius: 2px; padding: 0px 8px; float: right; margin: 0.12rem 0; font-size: 0.24rem;">\u4e0d\u6295\u8bc9\uff0c\u4ec5\u5206\u4eab</a>`);
      $done({ body });
      break;
    case /^https?:\/\/m\.weibo\.cn\/(?:status|detail)\/(\w+)/.test(url): {
      let weiboId = RegExp.$1;
      if (!weiboId) $done();
      const weiboFn = {
        alphabet: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        mid2id(mid) {
          let id = "";
          for (
            let i = mid.length - 4;
            i > -4;
            i = i - 4 //从最后往前以4字节为一组读取URL字符
          ) {
            let offset1 = i < 0 ? 0 : i,
              offset2 = i + 4,
              str = mid.substring(offset1, offset2);
            str = this.decodeBase62(str).toString();
            if (offset1 > 0) {
              //若不是第一组则不足7位补0
              while (str.length < 7) {
                str = "0" + str;
              }
            }
            id = str + id;
          }
          return id;
        },
        decodeBase62(number) {
          let out = 0,
            len = number.length - 1;
          for (let t = 0; t <= len; t++) {
            out +=
              this.alphabet.indexOf(number.substr(t, 1)) * Math.pow(62, len - t);
          }
          return out;
        }
      };
      if (!/^\d+$/.test(weiboId)) weiboId = weiboFn.mid2id(weiboId);
      body = body.replace("<head>", `<head><meta name="apple-itunes-app" content="app-id=1215210046, app-argument='weibointernational://detail?weiboid=${weiboId}'">`);
      $done({ body });
      break;
    }
    default:
      $done()
      break;
  }
})();