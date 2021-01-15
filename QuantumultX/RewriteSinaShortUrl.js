(() => {
  let headers = $response.headers;
  if ("Location" in headers) {
    $done({ status: "HTTP/1.1 302 Found" });
  } else $done({});
})();
