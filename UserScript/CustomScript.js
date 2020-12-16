// ==UserScript==
// @name         Redirector
// @namespace         https://github.com/coo11/Backup/tree/master/UserScript
// @version         0.1.6
// @description         My first user script
// @author         coo11
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @icon64         https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @run-at         document-start
// ----EnhanceStart----
// SauceNAO
// @match         *://saucenao.com/search.php*
// ----EnhanceEnd------
//
// ----GetOriginalSrcDomainStart----
// Weibo
// @match         *://*.sinaimg.cn/*
// Zhihu
// @match         *://*.zhimg.com/*
// Bilibili
// @match         *://*.hdslb.com/*
// Pixiv
// @match         *://i.pximg.net/*
// Twitter
// @match         *://*.twimg.com/*
// Artstation
// @match         *://cdna.artstation.com/*
// @match         *://cdnb.artstation.com/*
// Steam
// @match         *://*.steamstatic.com/*
// @match         *://steamusercontent-a.akamaihd.net/*
// @match         *://steamuserimages-a.akamaihd.net/*
// @match         *://steamcdn-a.akamaihd.net/*
// Pinterest
// @match         *://*.pinimg.com/*
// @match         *://s3.amazonaws.com/media.pinterest.com/*
// @match         *://media.pinterest.com.s3.amazonaws.com/*
// TODO: Tumblr
// ----GetOriginalSrcDomainEnd------
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
// Others
// @match         *://link.zhihu.com/?target=*
// @match         *://www.pixiv.net/jump.php?url=*
// @match         *://www.inoreader.com/*
// ----RewriteURLEnd------
//
// ----OtherStart----
// @match         *://m.weibo.cn/*
// @match         *://video.h5.weibo.cn/1034:*
// @match         *://h5.video.weibo.com/show/*
// @match         *://weibo.com/*
// @include         *://*.google.tld/search*tbs=sbi:*
// @match         *://exhentai.org/*
// @match         *://e-hentai.org/*
// ----OtherEnd-----
// @grant             GM_setValue
// @grant             GM_getValue
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
    src = window.location.toString(),
    domain = window.location.hostname,
    xhr = new XMLHttpRequest();

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
    },
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

  function guessUrl(urls, cb) {
    const count = guessUrl.count;
    xhr.open("GET", urls[count], true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        xhr.abort();
        return cb(urls[count]);
      } else {
        guessUrl.count++;
        if (count === urls.length - 1) {
          return cb(null);
        } else {
          return guessUrl(urls, cb);
        }
      }
    };
    xhr.send();
  }

  function redirect(newSrc) {
    if (newSrc === src) return;
    if (Array.isArray(newSrc)) {
      let _url = GM_getValue("lastMaxUrl");
      if (_url && _url === src) {
        GM_setValue("lastMaxUrl", null);
        return;
      }
      guessUrl.count = 0;
      guessUrl(newSrc, url => {
        if (url) {
          GM_setValue("lastMaxUrl", url);
          window.location.assign(url);
        } else return;
      });
    } else window.location.replace(newSrc);
  }

  // These universal links need pretreatment.
  if (
    // Steam
    domain === "steamusercontent-a.akamaihd.net" ||
    domain === "steamuserimages-a.akamaihd.net"
  ) {
    return redirect(src.replace(/\?.*$/, ""));
  }

  // Jump to 3rd website
  else if (
    domain === "link.zhihu.com" ||
    (domain === "www.pixiv.net" &&
      src.indexOf("www.pixiv.net/jump.php?url=") > -1)
  ) {
    matched = src.match(/.*?=(.*)/);
    if (matched && matched[1]) {
      return redirect(decodeURIComponent(matched[1]));
    } else return;
  } else if (domain === "www.inoreader.com") {
    window.location.hostname = "jp.inoreader.com";
    return;
  }

  // Weibo Client Switch
  else if (domain.endsWith("weibo.cn") || domain.endsWith("weibo.com")) {
    const regex = [
      /\/\/m\.weibo\.cn\/(status|detail|\d+)\/([a-z0-9]+)/i,
      /\/\/m\.weibo\.cn\/s\/video\/index.*?blog_mid=(\d+)/i,
      /\/\/video\.h5\.weibo\.cn\/1034:(\d+)\/\d+/i,
      /\/\/h5\.video\.weibo\.com\/show\/1034:(\d+)/i,
      /\/\/weibo\.com\/tv\/show\/1034:(\d+)/i,
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
            "content-type": "application/x-www-form-urlencoded",
          },
          body: `data={"Component_Play_Playinfo":{"oid":"1034:${oid}"}}`,
          method: "POST",
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
            window.open(`https://weibo.com/${mid}/${uid}`);
          }
        });
      return;
    }
  }

  // Google Image Search's images from result list
  else if (/\.google\./.test(domain) > -1 && src.indexOf("tbs=sbi:") > -1) {
    document.addEventListener("DOMContentLoaded", () => {
      document
        .querySelectorAll("div.g > div.rc > div:last-child a")
        .forEach(a => {
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
  else if (domain === "exhentai.org" || domain === "e-hentai.org") {
    document.addEventListener("DOMContentLoaded", () => {
      const customStyle = document.createElement("style");
      customStyle.innerText =
        ".itg a .glink::before { content: '●'; color: #28C940; padding-right: 4px; } .itg a:visited .glink::before { color: #AAA; }";
      document.head.appendChild(customStyle);
      return;
    });
  }

  // Weibo
  else if (domain.endsWith("sinaimg.cn")) {
    if (domain.startsWith("ss")) {
      newSrc = src.replace(
        /\.sinaimg\.cn\/[^/]*\/+([^/]*)/i,
        ".sinaimg.cn/orignal/$1"
      );
    } else if (domain.startsWith("n.")) {
      newSrc = newSrc.replace(/(\/ent\/+[0-9]+_)img(\/+upload\/)/, "$1ori$2");
    } else if (domain.match(/^([a-z]{2,4}\d|wxt)\./)) {
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
  else if (domain.match(/pic[0-9]\.zhimg\.com/)) {
    return redirect(
      src.replace(
        /\/((?:v[0-9]*-)?[0-9a-f]+)(?:_[^/._]*)?(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i,
        "/$1_r$2"
      )
    );
  }

  // Bilibili
  else if (domain.match(/i[0-9]*\.hdslb\.com/)) {
    return redirect(
      src.indexOf("videoshot") > -1 // No Check
        ? src
        : src.replace(
            /^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i,
            "$1"
          )
    );
  }

  // Pixiv
  else if (domain === "i.pximg.net") {
    newSrc = src
      .replace(
        /(\/user-profile\/+img\/.*\/[0-9]+_[0-9a-f]{20,})_[0-9]+(\.[^/.]+)(?:[?#].*)?$/,
        "$1$2"
      )
      .replace(/\/c\/[0-9]+x[0-9]+(?:_[0-9]+)?(?:_[a-z]+[0-9]+)?\//, "/")
      .replace(/\/(?:img-master|custom-thumb)\//, "/img-original/")
      .replace(/(\/[0-9]+_p[0-9]+)_[^/]*(\.[^/.]*)$/, "$1$2");
    //https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2020/12/08/00/00/18/86162834_p0_custom1200.jpg
    return redirect(addExts(newSrc, ["jpg", "png"]));
  }

  // Twitter
  else if (
    domain === "pbs.twimg.com" ||
    (domain === "ton.twitter.com" && src.indexOf("/ton/data/dm/") > -1)
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
      return redirect(src.replace(/\/[0-9]+x[0-9]+(?:[?#].*)?$/, ""));
    }

    newSrc = src
      .replace(/:([^/?]+)(.*)?$/, "$2?name=$1")
      .replace(/(\?.*)\?name=/, "$1&name=");

    if (/:\/\/[^/]+\/media\//.test(newSrc)) {
      matched = newSrc.match(/^([^?#]+\/[^/.?#]+)\.([^/.?#]+)([?#].*)?$/);
      if (matched) {
        newSrc = addQueries(matched[1] + (matched[3] || ""), {
          format: matched[2],
        });
      }
      newSrc = newSrc.replace(/([?&]format=)webp(&.*)?$/, "$1jpg$2");
    }

    /* https://pbs.twimg.com/tweet_video_thumb/EmCgOz9U4AA0bib.jpg
     * https://pbs.twimg.com/tweet_video/EmCgOz9U4AA0bib.mp4 */
    matched = newSrc.match(/\/tweet_video_thumb\/+([^/.?#]+)\./);
    if (matched) {
      return redirect(
        newSrc.replace(
          /\/tweet_video_thumb\/+[^/]+\.[^/.]+(?:[?#].*)?$/,
          "/tweet_video/" + matched[1] + ".mp4"
        )
      );
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
  else if (domain.endsWith("media.tumblr.com")) {
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
  else if (/^cdn(?:a|b)\.artstation\.com$/.test(domain)) {
    const regex = /(\/assets\/+(?:images|covers)\/+images\/+[0-9]{3}\/+[0-9]{3}\/+[0-9]{3}\/+)(?:[0-9]+\/+)?(?:small(?:er)?|micro|medium|large|4k)(?:_square)?\/([^/]*)$/;
    if (regex.test(src)) {
      return redirect([
        src.replace(regex, "$1original/$2"),
        src.replace(regex, "$14k/$2"),
        src.replace(regex, "$1large/$2"),
      ]);
    }
  }

  // Steam
  else if (
    domain.match(/cdn\.[^.]*\.steamstatic\.com/) ||
    domain.match(/steamcdn(?:-[a-z]*)?\.akamaihd\.net/)
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
    domain === "i.pinimg.com" ||
    (domain.endsWith("pinimg.com") &&
      domain.match(/^(?:i|(?:s-)?media-cache)-[^.]*\.pinimg/)) ||
    (domain.endsWith("s3.amazonaws.com") &&
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
  else if (domain === "chan.sankakucomplex.com") {
    return redirect(
      src.replace(/(:\/\/[^/]*\/)(.*?)(?=post\/show\/)/, "$1cn/")
    );
  }

  // SouthPlus
  else if (
    /(summer|white|north|south|soul|level)-plus\.net$/i.test(domain) ||
    domain.endsWith("south-plus.org")
  ) {
    window.location.hostname = "bbs.imoutolove.me";
    return;
  }

  // SauceNAO
  else if (domain === "saucenao.com") {
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
          let desc = e.querySelector("img[title]").title,
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
            if (/E-Hentai/i.test(desc)) {
              let sha1 = desc.match(/[0-9A-z]{40}/i);
              if (sha1) {
                let href = `https://exhentai.org/?f_cats=0&fs_similar=1&f_shash=${sha1[0]}`;
                miscinfo.innerHTML += `<a href="${href}" target="_blank" ><img src="images/static/siteicons/e-hentai.ico" style="background-color: #E3E0D1" width="16" height="16" border="0" alt=""></a><br>`;
              }
            }
          }
        });
    });
    return;
  }
})();
