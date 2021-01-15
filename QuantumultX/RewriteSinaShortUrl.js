(() => {
  let headers = $response.headers;
  if ("Location" in headers) {
    headers["Http-Status-Code"] = 302;
    console.log("新浪短链接重定向", JSON.stringify(headers));
    const status = "HTTP/1.1 302 Found";
    $done({ status, headers });
  } else $done({});
})();
