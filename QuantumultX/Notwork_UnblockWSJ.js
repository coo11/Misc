/**
 * Unblock WSJ paid content
 * ^https?://.*?\.wsj\.com/(amp/)?articles/[^#?]+ url script-response-header UnblockWSJ.js
 * hostname = *.wsj.com
 */
(() => {
  const code = $response.statusCode;
  if (code != 302 && code != 301) {
    let headers = $response.headers,
      url = $request.url;
    headers["Location"] = encodeURI(
      url.replace(
        /^https?:\/\/(.*?\.wsj\.com\/)(?:amp\/)?articles\/([^#?]+)/,
        "https://www.google.com/amp/s/$1amp/articles/$2"
      )
    );
    $done({ status: "HTTP/1.1 302 Found", headers: headers });
    return;
  } else $done({});
})();
