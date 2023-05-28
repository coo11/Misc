(() => {
  let url = $request.url;
  switch (true) {
    /**
     * ^https://d\.bilibili\.com/download_app\.html\?.*?preUrl= url script-request-header THIS_FILE_URL
     */
    case /preUrl=/.test(url): {
      url = new URL(url);
      let t = url.searchParams.get("preUrl");
      if (t) {
        headers["Location"] = decodeURIComponent(t);
        $done({ status: "HTTP/1.1 302 Found", headers });
      } else $done();
      break;
    }
    default:
      $done();
      break;
  }
})();
