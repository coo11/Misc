(() => {
  let url = $request.url,
    headers = $response.headers;
  if (/toasturl=([^&]+)/.test(url)) {
    headers["Location"] = decodeURIComponent(RegExp.$1)
    $done({ status: "HTTP/1.1 302 Found", headers });
  } else if (/^https?:\/\/(t|sinaurl)\.cn\//.test(url)) {
    if ("Location" in headers && $response.statusCode != 302) {
      $done({ status: "HTTP/1.1 302 Found" });
    } else $done();
  } else $done();
})();