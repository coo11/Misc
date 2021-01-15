(() => {
  let headers = $response.headers;
  headers = JSON.stringify(headers);
  if ("Location" in headers) {
    headers["Http-Status-Code"] = 302;
  }
  console.log("新浪短链接重定向", headers)
  headers = JSON.parse(headers);
  $done({ headers });
})();
