// ==UserScript==
// @name         PixivImageCDN
// @namespace         https://github.com/coo11/Backup/tree/master/UserScript
// @version         0.0.1
// @description         Development failure
// @author         coo11
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @icon64         https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @run-at         document-start
// @match         *://www.pixiv.net/*
// @grant             none
// ==/UserScript==

(function () {
  "use strict";
  if (location.hostname === "www.pixiv.net") {
    // NOT WORK
    document.head.innerHTML = document.head.innerHTML.replace(
        "https://i.pximg.net",
        "https://i-cf.pximg.net"
      );

    // ⚠️ If @grant IS NOT "none", You must use `unsafeWindow` here!
    // https://stackoverflow.com/a/25226796/14168341
    let originalFetch = window.fetch;
    window.fetch = (url, init) => {
      let matched = url.match(/\/ajax\//);
      if (matched) {
        return originalFetch(url, init).then(response => {
          return new Promise(resolve => {
            response.text().then(text => {
              console.log(text.length);
              text = text.replace(
                /"https:\\\/\\\/i\.pximg\.net/g,
                '"https:\\/\\/i-cf.pximg.net'
              );
              resolve(
                new Response(text, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers
                })
              );
            });
          });
        });
      } else return originalFetch(url, init);
    };

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(e => {
          if (e.tagName === "IMG" || e.tagName === "A") {
            let key = e.tagName === "IMG" ? "src" : "href",
              src = e[key];
            if (src.indexOf("https://i.pximg.net") === 0) {
              e[key] = src.replace(
                "https://i.pximg.net",
                "https://i-cf.pximg.net"
              );
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
