// ==UserScript==
// @name         Redirector
// @namespace         https://github.com/coo11/Backup/tree/master/UserScript
// @version         0.1.23
// @description         My first user script
// @author         coo11
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @icon64         https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @run-at         document-start
// ----EnhanceStart----
// @match         *://saucenao.com/search.php*
// @match         *://*.twitter.com/*
// ----EnhanceEnd------
//
// ----GetOriginalSrcStart----
// Weibo, Zhihu, Bilibili, Alibaba
// @match         *://*.sinaimg.cn/*
// @match         *://*.zhimg.com/*
// @match         *://*.hdslb.com/*
// @match         *://*.alicdn.com/*
// Pixiv, Twitter, Artstation, Steam, Pinterest
// @match         *://i.pximg.net/*
// @match         *://i-f.pximg.net/*
// @match         *://i-cf.pximg.net/*
// @match         *://*.twimg.com/*
// @match         *://cdna.artstation.com/*
// @match         *://cdnb.artstation.com/*
// @match         *://*.steamstatic.com/*
// @match         *://steamusercontent-a.akamaihd.net/*
// @match         *://steamuserimages-a.akamaihd.net/*
// @match         *://steamcdn-a.akamaihd.net/*
// @match         *://*.pinimg.com/*
// @match         *://s3.amazonaws.com/media.pinterest.com/*
// @match         *://media.pinterest.com.s3.amazonaws.com/*
// @match         *://preview.redd.it/*
// @match         *://www.reddit.com/*
// TODO: Tumblr
// ----GetOriginalSrcEnd------
//
// ----RewriteURLStart----
// SankakuComplex
// @match         *://chan.sankakucomplex.com/*
// SouthPlus
// @match         *://*.soul-plus.net/*
// @match         *://*.south-plus.net/*
// @match         *://*.south-plus.org/*
// @match         *://*.north-plus.net/*
// @match         *://*.level-plus.net/*
// @match         *://*.white-plus.net/*
// @match         *://*.summer-plus.net/*
// @match         *://*.spring-plus.net/*
// Others
// @match         *://link.zhihu.com/?target=*
// @match         *://link.csdn.net/?target=*
// @match         *://www.pixiv.net/jump.php?*
// @match         *://www.jianshu.com/go-wild*
// @match         *://www.inoreader.com/*
// @match         *://*.moegirl.org/*
// @match         *://bangumi.tv/*
// @match         *://chii.in/*
// @match         *://t.cn/*
// @match         *://sinaurl.cn/*
// @match         *://weibo.cn/sinaurl?toasturl=*
// ----RewriteURLEnd------
//
// ----OtherStart----
// @match         *://m.weibo.cn/*
// @match         *://video.h5.weibo.cn/1034:*
// @match         *://h5.video.weibo.com/show/*
// @match         *://weibo.com/*
// @match         *://www.google.com/search*tbs=sbi:*
// @match         *://exhentai.org/*
// @match         *://e-hentai.org/*
// @match         *://nhentai.net/*
// @match         *://lolibooru.moe/*
// @match         *://danbooru.donmai.us/*
// @match         *://hijiribe.donmai.us/*
// @match         *://sonohara.donmai.us/*
// @match         *://safebooru.donmai.us/*
// @match         *://*.dbsearch.net/*
// ----OtherEnd-----
// @grant             GM_setClipboard
// @grant             GM_registerMenuCommand
// ==/UserScript==

/**
 * Reference:
 *     https://github.com/qsniyg/maxurl
 *     https://greasyfork.org/users/2646
 * Documentation:
 *     https://www.tampermonkey.net/documentation.php
 */

(async () => {
  "use strict";
  let newSrc,
    matched,
    { hostname, protocol, pathname } = window.location,
    xhr = new XMLHttpRequest();
  const src = window.location.href;

  const weiboFn = {
    alphabet: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    /**
     * mid字符转换为id
     * @param {String} mid - 微博mid，Base62，如 "wr4mOFqpbO"
     * @returns {String} id - 微博id，如 "201110410216293360"
     */
    mid2id(mid) {
      let id = "";
      for (
        let i = mid.length - 4;
        i > -4;
        i = i - 4 //从最后往前以4字节为一组读取URL字符
      ) {
        let offset1 = i < 0 ? 0 : i,
          offset2 = i + 4,
          str = mid.substring(offset1, offset2);

        str = this.decodeBase62(str).toString();
        if (offset1 > 0) {
          //若不是第一组则不足7位补0
          while (str.length < 7) {
            str = "0" + str;
          }
        }
        id = str + id;
      }
      return id;
    },
    /**
     * id转换为mid字符
     * @param {string} id - 微博id，如 "201110410216293360"
     * @returns {string} mid - 微博mid，Base62，如 "wr4mOFqpbO"
     */
    id2mid(id) {
      id = String(id);
      let mid = "";
      for (
        let i = id.length - 7;
        i > -7;
        i = i - 7 //从最后往前以7字节为一组读取id
      ) {
        let offset1 = i < 0 ? 0 : i,
          offset2 = i + 7,
          num = id.substring(offset1, offset2);
        num = this.encodeBase62(num);
        if (offset1 > 0) {
          //若不足4位补0
          while (num.length < 4) {
            num = "0" + num;
          }
        }
        mid = num + mid;
      }
      return mid;
    },
    encodeBase62(int10) {
      let s62 = "",
        r = 0;
      while (int10 != 0) {
        r = int10 % 62;
        s62 = this.alphabet[r] + s62;
        int10 = Math.floor(int10 / 62);
      }
      return s62;
    },
    decodeBase62(number) {
      let out = 0,
        len = number.length - 1;
      for (let t = 0; t <= len; t++) {
        out +=
          this.alphabet.indexOf(number.substr(t, 1)) * Math.pow(62, len - t);
      }
      return out;
    },
    openHomepageFromSinaimg(hash) {
      const pre = hash.substr(0, 8),
        uid = pre.startsWith("00") ? this.decodeBase62(pre) : parseInt(pre, 16);
      window.open(`https://weibo.com/u/${uid}`);
      return;
    }
  };

  /**
   * Add multiple extensions for guessing real url.
   * @param {String} obj - url(s) to edit suffix
   * @param {Array} extList - Extensions list
   */
  function addExts(obj, extList = ["gif", "png", "jpg"]) {
    let results = [];
    if (!Array.isArray(obj)) {
      obj = [obj];
    }
    const regex = /(.*)\.([^/.]*?)([?#].*)?$/;
    for (let i = 0; i < obj.length; i++) {
      let url = obj[i];
      if (!url.match(regex)) {
        results.push(url);
        continue;
      }
      extList.forEach(ext => {
        results.push(`${RegExp.$1}.${ext}${RegExp.$3}`);
      });
    }
    return results;
  }

  function getQueries(url, decode = false) {
    const querystring = url.replace(/^[^#]*?\?/, "");
    if (!querystring || querystring === url) return {};
    else {
      const splitted = querystring.split("&");
      return Object.fromEntries(
        splitted.map(i => {
          let [k, v] = i.split("=");
          if (decode) v = decodeURIComponent(v);
          return [k, v];
        })
      );
    }
  }

  function addQueries(url, queries) {
    const parsed = getQueries(url),
      allQueries = [];

    for (let i in queries) {
      parsed[i] = queries[i];
    }

    for (let i in parsed) {
      allQueries.push(`${i}=${parsed[i]}`);
    }

    const newQueryStr = allQueries.join("&");
    if (newQueryStr) {
      return url.replace(/^([^#]*?)(?:\?.*)?$/, "$1?" + newQueryStr);
    } else return url;
  }

  function wait(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function guessUrl(urls, cb, method = "HEAD") {
    const count = guessUrl.count;
    xhr.open(method, urls[count], true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        xhr.abort();
        return cb(urls[count]);
      } else if (xhr.status === 503) {
        //For twimg always respose 503 if method is "HEAD"
        return guessUrl(urls, cb, "GET")
      } else {
        guessUrl.count++;
        if (count === urls.length - 1) {
          return cb(null);
        } else {
          return guessUrl(urls, cb, method);
        }
      }
    };
    xhr.send();
  }

  function redirect(newSrc) {
    if (newSrc === src) return;
    if (Array.isArray(newSrc)) {
      guessUrl.count = 0;
      guessUrl(newSrc, url => {
        if (url) {
          if (url === src) return;
          return window.location.assign(url);
        } else return;
      });
    } else window.location.replace(newSrc);
  }

  // These universal links need pretreatment.
  if (
    // Steam
    hostname === "steamusercontent-a.akamaihd.net" ||
    hostname === "steamuserimages-a.akamaihd.net"
  ) {
    return redirect(src.replace(/\?.*$/, ""));
  }

  // Jump to 3rd website
  else if (
    hostname === "link.zhihu.com" ||
    hostname === "link.csdn.net" ||
    (hostname === "www.pixiv.net" && src.indexOf("/jump.php?url=") > -1) ||
    (hostname === "www.jianshu.com" && src.indexOf("/go-wild?") > -1)
  ) {
    matched = src.match(/.*?(?:target|url)=(.*)/);
    if (matched && matched[1]) {
      return redirect(decodeURIComponent(matched[1]));
    } else return;
  } else if (
    hostname === "www.pixiv.net" &&
    src.indexOf("/jump.php?http") > -1
  ) {
    matched = src.match(/\?(http[^#&]*)/);
    if (matched && matched[1]) {
      return redirect(decodeURIComponent(matched[1]));
    } else return;
  }

  // Rewrite
  else if (hostname === "www.inoreader.com") {
    window.location.hostname = "jp.inoreader.com";
    return;
  } else if (hostname.endsWith("moegirl.org")) {
    window.location.hostname = hostname + ".cn";
    return;
  } else if (hostname === "chii.in" || hostname === "bangumi.tv") {
    window.location.hostname = "bgm.tv";
    if (protocol === "http:") {
      window.location.protocol = "https:";
    }
    return;
  } else if (
    hostname === "t.cn" ||
    hostname === "sinaurl.cn" ||
    /^https?:\/\/weibo\.cn\/sinaurl\?toasturl=/.test(src)
  ) {
    document.addEventListener("DOMContentLoaded", () => {
      const div = document.querySelector("div.desc");
      if (div && div.innerText.startsWith("http")) {
        return redirect(div.innerText);
      }
    });
    return;
  }

  // Weibo Client Switch
  else if (hostname.endsWith("weibo.cn") || hostname.endsWith("weibo.com")) {
    const regex = [
      /\/\/m\.weibo\.cn\/(status|detail|\d+)\/([a-z0-9]+)/i,
      /\/\/m\.weibo\.cn\/s\/video\/index.*?blog_mid=(\d+)/i,
      /\/\/video\.h5\.weibo\.cn\/1034:(\d+)\/\d+/i,
      /\/\/h5\.video\.weibo\.com\/show\/1034:(\d+)/i,
      /\/\/weibo\.com\/tv\/show\/1034:(\d+)/i
    ];
    let i = 0;
    while (!(matched = src.match(regex[i]))) i++;
    console.log(i);
    switch (i) {
      case 0:
      case 1:
        return fetch(
          `https://m.weibo.cn/statuses/show?id=${matched[i === 0 ? 2 : 1]}`
        )
          .then(resp => {
            if (resp && resp.status == 200) {
              return resp.json();
            }
          })
          .then(resp => {
            let mid, uid;
            if (resp) {
              const info = resp.data;
              mid = weiboFn.id2mid(info.mid);
              uid = info.user.id;
            } else if (i === 0 && /^\d+$/.test(matched[1])) {
              uid = matched[1];
              mid = weiboFn.id2mid(matched[2]);
            }
            GM_registerMenuCommand("Open Base62 URL", () =>
              window.open(`https://weibo.com/${uid}/${mid}`)
            );
          });
      case 2:
      case 3:
        return redirect(`https://weibo.com/tv/show/1034:${matched[1]}`);
      case 4:
        return GM_registerMenuCommand("Open Base62 URL", () =>
          getInfoByOid(matched[1])
        );
      case 5:
        return GM_registerMenuCommand("Weibo Base62", () => {
          const input = prompt(
            "Input String to execute Base 62 encode/decode:"
          );
          if (!input) {
            return;
          }
          const isEncoded = /\D/.test(input);
          const output = isEncoded
            ? weiboFn.mid2id(input)
            : weiboFn.id2mid(input),
            tip = isEncoded ? "Decoded" : "Encoded";
          return prompt(`${tip} result:`, output);
        });
    }

    function getInfoByOid(oid) {
      //DOM may be changed
      let currentOid = window.location.href.match(regex[4]);
      if (currentOid && currentOid[1] !== oid) {
        oid = currentOid[1];
      }
      fetch(
        `https://weibo.com/tv/api/component?page=%2Ftv%2Fshow%2F1034%3A${oid}`,
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          body: `data={"Component_Play_Playinfo":{"oid":"1034:${oid}"}}`,
          method: "POST"
        }
      )
        .then(resp => {
          if (resp && resp.status == 200) {
            return resp.json();
          }
        })
        .then(resp => {
          if (resp) {
            const info = resp.data.Component_Play_Playinfo,
              mid = weiboFn.id2mid(info.mid),
              uid = info.user.id;
            window.open(`https://weibo.com/${uid}/${mid}`);
          }
        });
      return;
    }
  }

  // Close Safe Search & Show Image Direct Link
  else if (/www\.google\./.test(hostname) && src.indexOf("tbs=sbi:") > -1) {
    if (src.indexOf("safe=off") === -1) {
      return redirect(addQueries(src, { safe: "off" }));
    }
    return document.addEventListener("DOMContentLoaded", () => {
      document
        .querySelectorAll("div.g > div:last-child a > g-img")
        .forEach(g => {
          let a = g.parentElement;
          a.setAttribute("target", "_blank");
          const obj = getQueries(a.href, true);
          if ("imgurl" in obj) {
            a.href = obj.imgurl;
          }
        });
      return;
    });
  }

  // Add Read Status To E-Hentai
  else if (hostname === "exhentai.org" || hostname === "e-hentai.org") {
    return document.addEventListener("DOMContentLoaded", () => {
      if (src.indexOf("gallerytorrents.php") > -1) {
        return document
          .querySelectorAll("#torrentinfo form table tr:nth-child(2)")
          .forEach(tr => {
            let magnet,
              a = tr.nextElementSibling.querySelector("a");
            if (a) {
              magnet = a.href.replace(
                /.*?([0-9a-f]{40}).*$/i,
                "magnet:?xt=urn:btih:$1"
              );
              if (!magnet || magnet.length !== 60) return;
            }
            let td = tr.querySelector("td[rowspan='2']");
            if (td) {
              td.setAttribute("rowspan", "1");
              const newTd = td.cloneNode(true),
                input = newTd.children[0];
              input.type = "button";
              input.value = "Magnet";
              input.onclick = function () {
                input.blur();
                if (input.value === "Copied!") return;
                GM_setClipboard(magnet);
                input.value = "Copied!";
                wait(2000).then(() => (input.value = "Magnet"));
              };
              tr.appendChild(newTd);
            }
          });
      } else if (src.indexOf("hentai.org/g/") > -1) {
        document
          .querySelectorAll("div.gdtm > div > a, div.gdtl > a")
          .forEach(a => {
            if (a.href.indexOf("hentai.org/s/") > -1) {
              a.setAttribute("target", "_blank");
            }
          });
      } else if (src.indexOf("hentai.org/s/") > -1) {
        const galleryUrl = document.querySelector("div.sb > a").href,
          h1 = document.querySelector("h1");
        h1.outerHTML = `<a href="${galleryUrl}" style="text-decoration:none;">${h1.outerHTML}</a>`;
      } else {
        // Open Gallery in New Tab
        [].forEach.call(document.getElementsByClassName("itg"), table => {
          table
            .querySelectorAll("a")
            .forEach(a => a.setAttribute("target", "_blank"));
        });
        // Add Search in South Plus
        const inputArea = document.getElementById("f_search");
        if (!inputArea) return;
        inputArea.size = 40;
        const input = document.createElement("input");
        input.type = "button";
        input.value = "South Plus";
        input.onclick = () => {
          const text = inputArea.value;
          if (text) {
            window.open(
              "https://bbs.imoutolove.me/search.php?step=2&method=AND&sch_area=0&f_fid=all&sch_time=all&orderway=postdate&asc=DESC&keyword=" +
              encodeURIComponent(text),
              "_blank"
            );
          }
        };
        inputArea.parentNode.appendChild(input);
        // Add Status
        const customStyle = document.createElement("style");
        customStyle.innerText =
          ".itg a .glink::before { content: '●'; color: #28C940; padding-right: 4px; } .itg a:visited .glink::before { color: #AAA; }";
        document.head.appendChild(customStyle);
        return;
      }
    });
  }

  // Restore the overwritten `window.open` for nHentai
  else if (hostname.endsWith("nhentai.net")) {
    return document.addEventListener("DOMContentLoaded", () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.text =
        '(()=>{const e=document.createElement("iframe");document.body.appendChild(e),window.open=e.contentWindow.open,document.body.removeChild(e)})();';
      document.body.insertAdjacentElement("afterend", script);
      return;
    });
  }

  // Auto expand hidden posts for Lolibooru
  else if (hostname === "lolibooru.moe") {
    return document.addEventListener("DOMContentLoaded", () => {
      try {
        const n = document.getElementById("blacklist-count").innerText;
        if (n !== "0") {
          document
            .querySelectorAll(
              "ul#blacklisted-list a.no-focus-outline:not(.blacklisted-tags-disabled)"
            )
            .forEach(e => e.click());
        }
      } catch (e) {
        console.log(e);
      }
      return;
    });
  }

  // Auto expand blacklisted for Danbooru
  else if (hostname.endsWith(".donmai.us")) {
    return document.addEventListener("DOMContentLoaded", () => {
      try {
        const disable = document.getElementById("disable-all-blacklists"),
          enable = document.getElementById("re-enable-all-blacklists");
        if (
          disable.style.display !== "none" &&
          enable.style.display === "none"
        ) {
          disable.click();
        }
      } catch (e) {
        console.log(e);
      }
      return;
    });
  }

  // Auto skip R18 warning for dbsearach
  else if (hostname.endsWith("dbsearch.net")) {
    if (/^(adult(comic|novel|anime)|erogame)\./.test(hostname)) {
      let r18Warning =
        document.querySelector("div#warning-box > p:first-of-type") ||
        document.querySelector("div#contents > p:first-of-type");
      if (
        r18Warning &&
        r18Warning.innerText.indexOf("Adults only, or 18 and older.") > -1
      ) {
        window.location.href = document.querySelector(
          "ul#select > li > a"
        ).href;
        return;
      } else return;
    } else return;
  }

  // Weibo
  else if (hostname.endsWith("sinaimg.cn")) {
    if (hostname.startsWith("ss")) {
      newSrc = src.replace(
        /\.sinaimg\.cn\/[^/]*\/+([^/]*)/i,
        ".sinaimg.cn/orignal/$1"
      );
    } else if (hostname.startsWith("n.")) {
      newSrc = newSrc.replace(/(\/ent\/+[0-9]+_)img(\/+upload\/)/, "$1ori$2");
    } else if (hostname.match(/^([a-z]{2,4}\d|wxt)\./)) {
      /* tvax2.sinaimg.cn */
      newSrc = src.replace(
        /\.sinaimg\.cn\/[^/]*\/+([^/]*)/i,
        ".sinaimg.cn/large/$1"
      );
      GM_registerMenuCommand("Image Publisher Homepage", () => {
        const hash = src.match(/\/([a-z0-9]{32,})\./i);
        if (hash) weiboFn.openHomepageFromSinaimg(hash[1]);
      });
    } else return;
    return redirect(newSrc);
  }

  // Zhihu
  else if (hostname.match(/pic[0-9]\.zhimg\.com/)) {
    return redirect(
      src.replace(
        /\/((?:v[0-9]*-)?[0-9a-f]+)(?:_[^/._]*)?(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i,
        "/$1_r$2"
      )
    );
  }

  // Bilibili
  else if (hostname.match(/i[0-9]*\.hdslb\.com/)) {
    return redirect(
      src.indexOf("videoshot") > -1 // No Check
        ? src
        : src.replace(
          /^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i,
          "$1"
        )
    );
  }

  // Alibaba
  else if (hostname.endsWith("alicdn.com")) {
    newSrc = src;
    if (hostname === "img-tmdetail.alicdn.com") {
      newSrc = src.replace(
        /^[a-z]+:\/\/[^/]+\/+bao\/+uploaded\/+([^/]+\.[^/]+\/+)/,
        "$1"
      );
      if (!newSrc.match(/^https?:\/\//)) {
        newSrc = "https://" + newSrc;
      }
    }
    if (/[0-9]*\.alicdn\.com/.test(hostname) || hostname === "img.alicdn.com") {
      return redirect(
        newSrc
          .replace(/\.[0-9]+x[0-9]+(\.[^/.]*)(?:[?#].*)?$/, "$1")
          .replace(/(\.[^/._?#]+)_(?:\d+x\d+|Q\d+|\d+x\d+q\d+)\.[^/.]+$/i, "$1")
          .replace(/(\.[^/._?#]+)_\.webp(?:[?#].*)?$/, "$1")
          .replace(/\?.*/, "")
      );
    }
  }

  // Pixiv
  else if (/i(-c?f)?\.pximg\.net/.test(hostname)) {
    newSrc = src
      .replace(
        /(\/user-profile\/+img\/.*\/[0-9]+_[0-9a-f]{20,})_[0-9]+(\.[^/.]+)(?:[?#].*)?$/,
        "$1$2"
      )
      .replace(/\/c\/[0-9]+x[0-9]+(?:_[0-9]+)?(?:_[a-z]+[0-9]+){0,2}\//, "/")
      .replace(/\/(?:img-master|custom-thumb)\//, "/img-original/")
      .replace(/(\/[0-9]+_p[0-9]+)_[^/]*(\.[^/.]*)$/, "$1$2")
      .replace(/(\/[0-9]+_)square[0-9]+(\.[^/.]*)$/, "$1ugoira0$2");
    //https://i.pximg.net/c/384x280_80_a2_g2/img-master/img/2018/12/30/23/23/32/72389353_p0_master1200.jpg
    //https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2020/12/08/00/00/18/86162834_p0_custom1200.jpg
    //https://i.pximg.net/c/250x250_80_a2/img-master/img/2015/12/27/23/24/55/54282140_square1200.jpg
    return redirect(addExts(newSrc, ["jpg", "png"]));
  }

  // Twitter
  else if (
    hostname === "pbs.twimg.com" ||
    (hostname === "ton.twitter.com" && src.indexOf("/ton/data/dm/") > -1)
  ) {
    if (src.indexOf("/profile_images/") > -1) {
      return redirect(
        src
          .replace(/[?#].*$/, "")
          .replace(
            /_(?:bigger|normal|mini|reasonably_small|[0-9]+x[0-9]+)(\.[^/_]*)$/,
            "$1"
          )
      );
    } else if (src.indexOf("/profile_banners/") > -1) {
      //https://pbs.twimg.com/profile_banners/247054763/1348017380/600x200
      return redirect([src.replace(/\/[0-9]+x[0-9]+(?:[?#].*)?$/, ""), src]);
    }

    newSrc = src
      .replace(/:([^/?]+)(.*)?$/, "$2?name=$1")
      .replace(/(\?.*)\?name=/, "$1&name=");

    if (/:\/\/[^/]+\/media\//.test(newSrc)) {
      matched = newSrc.match(/^([^?#]+\/[^/.?#]+)\.([^/.?#]+)([?#].*)?$/);
      if (matched) {
        newSrc = addQueries(matched[1] + (matched[3] || ""), {
          format: matched[2]
        });
      }
      newSrc = newSrc.replace(/([?&]format=)webp(&.*)?$/, "$1jpg$2");
    }

    /* https://pbs.twimg.com/tweet_video_thumb/EmCgOz9U4AA0bib.jpg
     * https://pbs.twimg.com/tweet_video/EmCgOz9U4AA0bib.mp4 */
    matched = newSrc.match(/\/tweet_video(?:_thumb)?\/+([^/.?#]+)\./);
    if (matched) {
      return redirect(`https://video.twimg.com/tweet_video/${matched[1]}.mp4`);
    }

    /**
     * https://pbs.twimg.com/media/Bu4G7k3CcAA6Nx7.jpg
     * https://pbs.twimg.com/media/Bu4G7k3CcAA6Nx7.jpg?name=medium
     * @constant {Array} names All str in this array could be the maxmium size suffix of image url.
     */
    let names = ["orig", "4096x4096", "large", "medium"],
      newSrcs = [],
      baseUrl = newSrc,
      name = newSrc.match(/[?&]name=([^&]+)/);
    if (name) name = name[1];
    let end = names.indexOf(name);
    if (end < 0) end = names.length;

    for (let i = 0; i < end; i++) {
      newSrc = newSrc
        .replace(/(\.[a-z]+)\?(?:(.*)&)?format=[^&]+/, "$1?$2&")
        .replace(/&$/, "");

      newSrc = addQueries(newSrc, { name: names[i] });
      let { format } = getQueries(newSrc);
      if (format === "png") {
        newSrcs.push(newSrc);
        newSrcs.push(addQueries(newSrc, { format: "jpg" }));
      } else if (format === "jpg") {
        newSrcs.push(addQueries(newSrc, { format: "png" }));
        newSrcs.push(newSrc);
      } else newSrcs.push(newSrc);
    }
    newSrcs.push(baseUrl);
    if (newSrcs.length > 1) return redirect(newSrcs);
  }

  // Tumblr
  else if (hostname.endsWith("media.tumblr.com")) {
    newSrc = src
      .replace(/\.pnj(\?.*)?$/, ".png$1")
      .replace(/\.gifv(\?.*)?$/, ".gif$1");
    if (newSrc !== src) return redirect(newSrc);

    if (src.match(/\/avatar_[0-9a-f]+_(?:16|64|128)\./)) {
      return redirect(newSrc);
    }

    newSrc = src.replace(
      /(\/(?:tumblr(?:_(?:static|inline))?_)?[0-9a-zA-Z]+(?:_og)?(?:_r[0-9]*)?)_[0-9]+(?:sq)?(\.[^/.]*)$/,
      "$1_1280$2"
    );
    if (newSrc !== src) return redirect(newSrc);

    newSrc = src.replace(
      /^[a-z]+:\/\/[^/]+\/+(?:previews\/+)?(tumblr_[^/_.]+)_(?:filmstrip|(?:frame|smart)1)\.jpg(?:[?#].*)?$/,
      "https://ve.media.tumblr.com/$1.mp4"
    );
    if (newSrc !== src) return redirect(newSrc);
  }

  // Artstation
  else if (/^cdn(?:a|b)\.artstation\.com$/.test(hostname)) {
    const regex = /(\/assets\/+(?:images|covers)\/+images\/+[0-9]{3}\/+[0-9]{3}\/+[0-9]{3}\/+)(?:[0-9]+\/+)?(?:small(?:er)?|micro|medium|large|4k)(?:_square)?\/([^/]*)$/;
    if (regex.test(src)) {
      return redirect([
        src.replace(regex, "$1original/$2"),
        src.replace(regex, "$14k/$2"),
        src.replace(regex, "$1large/$2")
      ]);
    }
  }

  // Steam
  else if (
    hostname.match(/cdn\.[^.]*\.steamstatic\.com/) ||
    hostname.match(/steamcdn(?:-[a-z]*)?\.akamaihd\.net/)
  ) {
    newSrc = src.replace(
      /(\/steam\/+apps\/+[0-9]+\/+movie)[0-9]+(?:_vp9)?(\.[^/.]+)(?:[?#].*)?$/,
      "$1_max$2"
    );
    if (newSrc !== src) {
      return redirect(newSrc);
    }

    newSrc = src.replace(
      /(\/steam\/+apps\/+[0-9]+\/+movie)\.(?:jpg|JPG|jpeg|JPEG|png|PNG)(?:[?#].*)?$/,
      "$1_max.webm"
    );
    if (newSrc !== src) {
      return redirect(newSrc);
    }

    newSrc = src.replace(
      /(\/steamcommunity\/+public\/+images\/+clans\/+[0-9]+\/+[0-9a-f]{20,})_[0-9]+x[0-9]+(\.[^/.]+)(?:[?#].*)?$/,
      "$1$2"
    );
    if (newSrc !== src) {
      return redirect(newSrc);
    }

    newSrc = src;
    if (src.indexOf("/public/images/avatars/") > -1) {
      newSrc = src.replace(/(?:_[^/.]*)?(\.[^/.]*)$/, "_full$1");
    }
    return redirect(newSrc.replace(/\.[0-9]+x[0-9]+(\.[^/]*)$/, "$1"));
  }

  // Pinterest
  else if (
    hostname === "i.pinimg.com" ||
    (hostname.endsWith("pinimg.com") &&
      hostname.match(/^(?:i|(?:s-)?media-cache)-[^.]*\.pinimg/)) ||
    (hostname.endsWith("s3.amazonaws.com") &&
      src.indexOf("media.pinterest.com") > -1)
    /**
     * http://s3.amazonaws.com/media.pinterest.com/640x/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     * http://s3.amazonaws.com/media.pinterest.com/originals/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     * http://media.pinterest.com.s3.amazonaws.com/640x/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     * http://media.pinterest.com.s3.amazonaws.com/originals/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     */
  ) {
    const noSuffix = src.replace(/[?#].*$/, "");
    if (noSuffix.match(/:\/\/[^/]*\/media\.pinterest\.com\//)) {
      newSrc = noSuffix.replace(
        /(:\/\/[^/]*\/media\.pinterest\.com\/)[^/]*(\/.*\/[^/]*\.[^/.]*)$/,
        "$1originals$2"
      );
    } else {
      newSrc = noSuffix.replace(
        /(:\/\/[^/]*\/)[^/]*(\/.*\/[^/]*\.[^/.]*)$/,
        "$1originals$2"
      );
    }
    /**
     * https://i.pinimg.com/640x/1f/3f/ed/1f3fed6c284955934c7d724d2fe13ecb.jpg
     * https://i.pinimg.com/originals/1f/3f/ed/1f3fed6c284955934c7d724d2fe13ecb.png
     * https://i.pinimg.com/640x/a7/db/c3/a7dbc392372f1ca8f744032ba3c5ade1.jpg
     * https://i.pinimg.com/originals/a7/db/c3/a7dbc392372f1ca8f744032ba3c5ade1.gif */
    return redirect(addExts(newSrc));
  }

  // SankakuComplex
  else if (hostname === "chan.sankakucomplex.com") {
    return redirect(
      src.replace(/(:\/\/[^/]*\/)(.*?)(?=post\/show\/)/, "$1cn/")
    );
  }

  // Reddit
  else if (hostname === "preview.redd.it") {
    return redirect(
      src.replace(/:\/\/preview\.redd\.it\/((?:award_images\/+t[0-9]*_[0-9a-z]+\/+)?[^/.]*\.[^/.?]*)\?.*$/, "://i.redd.it/$1")
    )
  }

  else if (hostname === "www.reddit.com") {
    return document.addEventListener("DOMContentLoaded", () => {
      let bodyList = document.querySelector("body")
        , observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            const added = mutation.addedNodes;
            if (added.length) {
              added.forEach(e => {
                if (e.nodeType === 1) {
                  const userA = e.querySelector("div > a[href^=\"/user/\"]");
                  if (userA /* this element sometimes appears too late to overwrite added element */) {
                    const threadA = userA.parentElement.nextElementSibling;
                    if (threadA && threadA.hasAttribute("data-click-id")) {
                      const a = threadA.cloneNode();
                      a.href = threadA.href.replace(/^https?:\/\/www\.reddit\.com\/r\/\w+\/comments\/(\w+)\/.*/, "https://redd.it/$1");
                      threadA.parentElement.insertAdjacentElement("beforeend", a)
                      a.innerText = "[Short Link]";
                      a.addEventListener("click", function (e) {
                        e.preventDefault();
                        if (a.innerText === "[Copied!]") return;
                        GM_setClipboard(a.href);
                        a.innerText = "[Copied!]";
                        wait(2000).then(() => (a.innerText = "[Short Link]"));
                      }, false);
                    }
                  }
                }
              })
            }
          });
        });
      observer.observe(bodyList, { childList: true, subtree: true });
    });
  }

  // SouthPlus
  else if (
    /(spring|summer|white|north|south|soul|level)-plus\.net$/i.test(hostname) ||
    hostname.endsWith("south-plus.org")
  ) {
    window.location.hostname = "bbs.imoutolove.me";
    return;
  }

  // SauceNAO
  else if (hostname === "saucenao.com") {
    document.addEventListener("DOMContentLoaded", () => {
      const tBody = document.body;
      if (tBody.innerText.indexOf("Access to specified file was denied") > -1) {
        tBody.innerText += "\nGO BACK TO START IN 3S...";
        setTimeout(() => {
          location.href = "/";
        }, 3000);
      }
      document
        .querySelectorAll("div#yourimageretrylinks > a")
        .forEach(a => a.setAttribute("target", "_blank"));
      document
        .querySelectorAll("div:not(#result-hidden-notification).result")
        .forEach(e => {
          let img = e.querySelector(".resultimage img"),
            desc = img.title,
            src = img.src,
            isNeedShow = /hentai/i.test(desc),
            content = e.querySelector(".resultcontentcolumn"),
            miscinfo = e.querySelector(".resultmiscinfo");
          e.querySelectorAll("a:not([href*='saucenao.com'])").forEach(a =>
            a.setAttribute("target", "_blank")
          );
          if (content && isNeedShow) {
            desc = desc.replace(/.*?#\d+:\s/, "");
            content.innerHTML =
              content.innerHTML.replace(/<(small)>\s*?<\/\1>\s*?<br>/, "") +
              `<small style="color: #999;">${desc}</small><br>`;
            if (desc.indexOf("E-Hentai") > -1) {
              const sha1 = src.match(/[0-9A-z]{40}/i);
              if (sha1) {
                const href = `https://exhentai.org/?f_cats=0&fs_similar=1&fs_exp=on&f_shash=${sha1[0]}`;
                miscinfo.innerHTML += `<a href="${href}" target="_blank" ><img src="images/static/siteicons/e-hentai.ico" style="background-color: #E3E0D1" width="16" height="16" border="0" alt=""></a><br>`;
              }
            } else if (desc.indexOf("nhentai") > -1) {
              const id = src.match(/res\/nhentai\/(\d+)/);
              if (id) {
                const href = `https://nhentai.net/g/${id[1]}/`;
                miscinfo.innerHTML += `<a href="${href}" target="_blank" ><img src="images/static/siteicons/nhentai.ico" width="16" height="16" border="0" alt=""></a><br>`;
              }
            }
          }
        });
    });
    return;
  }

  // Twitter Video Direct Link
  else if (hostname.endsWith("twitter.com")) {
    pathname = pathname.replace(/^\/i\/web/, "/user");
    newSrc = `https://twitter.com${pathname}`;
    if (newSrc != src && /^\/\w+\/status\/\d+/.test(pathname)) { return redirect(newSrc); }
    /**
     * Reference:
     *   https://gist.github.com/mozurin/0c3bc302b1106f1adb7d31e616c7df9b
     *   https://greasyfork.org/zh-CN/scripts/384702/code
     *   https://stackoverflow.com/a/40624294/14168341
     */
    const addVideoLink = {
      current: src,
      added: false,
      hasVideo: true,
      updating: false,
      get href() {
        return window.location.href;
      },
      get tid() {
        const _ = this.href.match(/status\/(\d+)/);
        if (_ && _[1]) return _[1];
      },
      init() {
        this.hookXHR();
        this.findTarget();
        this.setMutation();
      },
      get elem() {
        return this._elem || {};
      },
      set elem({ id, target }) {
        if (id === this.tid) {
          this._elem = { id, target };
          this.add();
        }
      },
      get resp() {
        if (this._resp && this._resp.id !== this.tid) {
          this._resp.id = this.tid;
        }
        return this._resp || {};
      },
      set resp({ id, tweets }) {
        if (id === this.tid) {
          // console.log(tweets);
          if (!this._resp) this._resp = { tweets: {} };
          this._resp.id = id;
          this._resp.tweets[id] = tweets[id];
          this.add();
        }
      },
      add() {
        const { id, target } = this.elem,
          { id: _id, tweets } = this.resp;
        if (id && id === _id) {
          // Elements to add
          let div = target.parentElement;
          if (div.querySelector("#LinkAdded")) return;
          let dot = div.children[div.childElementCount - 2].cloneNode(true),
            a = div.lastChild.cloneNode(true);
          a.id = "LinkAdded";
          a.target = "_blank";
          a.innerText = "下载视频";
          // Video url to add
          let url;
          try {
            let info,
              { extended_entities, card } = tweets[id];
            if (extended_entities) {
              info = extended_entities.media[0].video_info.variants;
            } else if (card) {
              info = JSON.parse(card.binding_values.unified_card.string_value)
                .media_entities;
              const keyName = Object.keys(info)[0];
              info = info[keyName].video_info.variants;
            } else {
              console.log("No source found in API response.");
              return;
            }
            url = info
              .filter(i => i.content_type === "video/mp4")
              .sort((a, b) => b.bitrate - a.bitrate)[0].url;
            console.log(url);
          } catch (e) {
            console.log(e);
            return;
          }
          // Add
          a.href = url;
          div.appendChild(dot);
          div.appendChild(a);
          this.added = true;
        } else return;
      },
      hookXHR() {
        let proxied = window.XMLHttpRequest.prototype.open,
          that = this;
        window.XMLHttpRequest.prototype.open = function (method, url) {
          const matched = url.match(
            /\/api\/2\/timeline\/conversation\/(\d+)\.json/
          );
          if (matched && !that.added && that.tid) {
            this.addEventListener(
              "readystatechange",
              function () {
                if (this.readyState != XMLHttpRequest.DONE) {
                  return;
                }
                let resp = this.response;
                resp = typeof resp === "string" ? JSON.parse(resp) : resp;
                that.resp = {
                  id: matched[1],
                  tweets: resp.globalObjects.tweets
                };
              },
              false
            );
          }
          return proxied.apply(this, [].slice.call(arguments));
        };
      },
      async findTarget(times = 50) {
        if (this.updating && !this.tid) return;
        this.updating = true;
        const id = this.tid;
        for (let i = 0; i < times; i++) {
          const target = document.querySelector(`a[href*="${id}"]`);
          if (target) {
            const article = target.closest("article");
            if (article && article.querySelector("video")) {
              this.elem = { id, target };
              this.updating = false;
              return;
            }
          }
          await wait(500);
        }
        this.updating = false;
        this.hasVideo = false;
        return;
      },
      setMutation() {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(() => {
            const id = this.tid,
              href = this.href;
            if (!id) {
              this.current = href;
              return;
            }
            if (this.current !== href) {
              this.current = href;
              this.added = false;
              this.hasVideo = true;
              this.findTarget();
            }
            if (
              this.added &&
              this.hasVideo &&
              !document.querySelector(`a[href*="${id}"]`)
            ) {
              // Added elements might disappear after scroll to comment area.
              this.added = false;
              this.findTarget();
            }
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };
    addVideoLink.init();
  }
})();
