(() => {
  let { headers, path } = $request;
  headers["User-Agent"] =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15";
  if (/imgurl=https?%3A%2F%2F(i(?:-c?f)?\.pximg\.net)%2F/.test(path))
    $done({ path: path.replace(RegExp.$1, "i.pximg.cat"), headers });
  else $done({});
})();
