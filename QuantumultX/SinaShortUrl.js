(() => {
  let headers = $response.headers;
  if ("Location" in headers && $response.statusCode != 302) {
    $done({ status: "HTTP/1.1 302 Found" });
    return;
  } else $done({});
})();
