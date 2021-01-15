(() => {
  let headers = $response.headers,
    url = $response.url;
  if ("Location" in headers && $response.statusCode != 302) {
    $done({ status: "HTTP/1.1 302 Found" });
    return;
  }
  if (/toasturl=([^&#]*?)/.test(url)) {
    headers["Location"] = decodeURIComponent(RegExp.$1);
    $done({ status: "HTTP/1.1 302 Found", headers });
    return;
  }
  $done({});
})();
