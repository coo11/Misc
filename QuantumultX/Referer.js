(() => {
  let url = $request.url,
    headers = $request.headers;
  if (headers.Host.endsWith(".pximg.net")) {
    headers.Host = 'i-cf.pximg.net';
    headers["Referer"] = "https://www.pixiv.net/";
    $done({ headers });
  } else $done({});
})();
