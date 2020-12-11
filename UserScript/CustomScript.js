// ==UserScript==
// @name         CustomScript
// @namespace         https://github.com/coo11/Backup/tree/master/UserScript
// @version         0.1.3
// @description         My fitst user script
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
// Facebook
// Instagram
// Tumblr
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
// ----RewriteURLEnd------
// @grant             GM_setValue
// @grant             GM_getValue
// ==/UserScript==

/**
 * Reference:
 *     https://github.com/qsniyg/maxurl
 *     https://greasyfork.org/users/2646
 * Documentation:
 *     https://www.tampermonkey.net/documentation.php
 */

(() => {
  "use strict";
  let newSrc,
    matched,
    src = window.location.toString(),
    domain = window.location.hostname,
    xhr = new XMLHttpRequest();

  // These universal links need pretreatment.
  if (
    // Steam
    domain === "steamusercontent-a.akamaihd.net" ||
    domain === "steamuserimages-a.akamaihd.net"
  ) {
    return redirect(src.replace(/\?.*$/, ""));
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
    } else if (domain.match(/^([a-z]{2,3}\d|wxt)\./)) {
      newSrc = src.replace(
        /\.sinaimg\.cn\/[^/]*\/+([^/]*)/i,
        ".sinaimg.cn/large/$1"
      );
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
    return redirect(
      src
        .replace(
          /(\/user-profile\/+img\/.*\/[0-9]+_[0-9a-f]{20,})_[0-9]+(\.[^/.]+)(?:[?#].*)?$/,
          "$1$2"
        )
        .replace(/\/c\/[0-9]+x[0-9]+(?:_[0-9]+)?(?:_[a-z]+[0-9]+)?\//, "/")
        .replace(/\/img-master\//, "/img-original/")
        .replace(/(\/[0-9]+_p[0-9]+)_[^/]*(\.[^/.]*)$/, "$1$2")
    );
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
     * http://media.pinterest.com.s3.amazonaws.com/originals/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg */
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
    return redirect(
      ["gif", "png", "jpg"].map(i => `${newSrc.slice(0, -3)}${i}`)
    );
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
    document.addEventListener("DOMContentLoaded", saucenao);
    return;
  }

  function saucenao() {
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
})();
