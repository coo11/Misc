(() => {
  let headers = $request.headers;
  headers["User-Agent"] =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15";
  // if (path.startsWith("/images/"))
  $done({ headers });
})();
