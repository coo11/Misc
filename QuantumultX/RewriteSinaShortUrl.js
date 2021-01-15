(() => {
  let headers = $response.headers;
  headers = JSON.parse(headers);
  if ("Location" in headers) {
    headers["Http-Status-Code"] = 302;
  }
  console.log("新浪短链接重定向", headers)
  headers = JSON.stringify(headers);
  $done({ headers });
})();
