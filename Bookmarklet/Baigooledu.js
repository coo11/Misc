(() => {
  let { href, hostname, search } = location,
    selected = getSelection().toString(),
    pre = hostname.match(/(?:\/|\.)(baidu|google)\./),
    google = "https://www.google.com/search?safe=off&q=";
  if (selected) {
    location.href = `${google}${encodeURIComponent(selected)}`;
  } else if (pre) {
    pre = pre[1] === "baidu" ? google : "https://www.baidu.com/s?word=";
    let keyword = search.match(/(?:q|word|wd)=([^&#]+)/);
    if (keyword) location.href = `${pre}${keyword[1]}`;
  } else if (href === "about:blank") {
    location.href = "https://www.google.com/ncr?safe=off";
  }
})();