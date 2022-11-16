// ==UserScript==
// @name         Redirector
// @namespace         https://github.com/coo11/Backup/tree/master/UserScript
// @version         0.1.49
// @description         My first user script
// @author         coo11
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @icon64         https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @run-at         document-start
// @ ----EnhanceStart----
// @match         *://*.tsdm39.net/*
// @match         *://saucenao.com/search.php*
// @match         *://*.twitter.com/*
// @match         *://www.nicovideo.jp/watch/sm*
// @ ----EnhanceEnd------
// @
// @ ----GetOriginalSrcStart----
// @ Weibo, Zhihu, Bilibili, Alibaba, Baidu, NGA, Tencent
// @match         *://*.sinaimg.cn/*
// @match         *://*.zhimg.com/*
// @match         *://*.hdslb.com/*
// @match         *://*.alicdn.com/*
// @match         *://imgsa.baidu.com/*
// @match         *://imgsrc.baidu.com/*
// @match         *://tiebapic.baidu.com/*
// @match         *://*.himg.baidu.com/*
// @match         *://*.hiphotos.baidu.com/*
// @match         *://img.nga.178.com/*
// @match         *://*.qpic.cn/*
// @ Pixiv, Twitter, Artstation, Steam, Pinterest, reddit
// @match         *://i.pximg.net/*
// @match         *://i-f.pximg.net/*
// @match         *://i-cf.pximg.net/*
// @match         *://pixiv.pximg.net/*
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
// @match         *://www.reddit.com/r/*
// @ Apple Music, iTunes
// @match         *://*.mzstatic.com/*
// @ Web Archive
// @match         *://*.us.archive.org/*
// @match         *://coverartarchive.org/*
// @ TODO: Tumblr
// @ ----GetOriginalSrcEnd------
// @
// @ ----RewriteURLStart----
// @ SankakuComplex
// @match         *://chan.sankakucomplex.com/*
// @ SouthPlus
// @match         *://bbs.imoutolove.me/read.php*
// @match         *://bbs.imoutolove.me/simple/index.php*
// @match         *://*.soul-plus.net/*
// @match         *://*.south-plus.net/*
// @match         *://*.south-plus.org/*
// @match         *://*.north-plus.net/*
// @match         *://*.east-plus.net/*
// @match         *://*.level-plus.net/*
// @match         *://*.white-plus.net/*
// @match         *://*.summer-plus.net/*
// @match         *://*.snow-plus.net/*
// @match         *://*.spring-plus.net/*
// @ Others
// @match         *://link.zhihu.com/?target=*
// @match         *://link.csdn.net/?target=*
// @match         *://www.oschina.net/action/GoToLink?url=*
// @match         *://www.pixiv.net/jump.php?*
// @match         *://www.jianshu.com/go-wild*
// @match         *://www.inoreader.com/*
// @match         *://*.moegirl.org/*
// @match         *://bangumi.tv/*
// @match         *://chii.in/*
// @match         *://t.cn/*
// @match         *://sinaurl.cn/*
// @match         *://weibo.cn/sinaurl?toasturl=*
// @ ----RewriteURLEnd------
// @
// @ ----OtherStart----
// @match         *://tieba.baidu.com/mo/q/posts*
// @match         *://m.weibo.cn/*
// @match         *://video.h5.weibo.cn/1034:*
// @match         *://h5.video.weibo.com/show/*
// @match         *://weibo.com/*
// @match         *://www.bilibili.com/video/*
// @match         *://www.bilibili.com/s/video/*
// @match         *://www.google.com/search*tbs=sbi:*
// @match         *://www.google.com/search*tbs=sbi%3A*
// @match         *://exhentai.org/*
// @match         *://e-hentai.org/*
// @match         *://*.nhentai.net/*
// @match         *://lolibooru.moe/*
// @match         *://danbooru.donmai.us/*
// @match         *://hijiribe.donmai.us/*
// @match         *://sonohara.donmai.us/*
// @match         *://safebooru.donmai.us/*
// @match         *://*.dbsearch.net/*
// @match         *://www.ptt.cc/bbs/*
// @match         *://webcache.googleusercontent.com/search*
// @ ----OtherEnd-----
// @grant             GM_setClipboard
// @grant             GM_registerMenuCommand
// @grant             GM_notification
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
        return guessUrl(urls, cb, "GET");
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

  function scriptTagModify(cb) {
    // https://stackoverflow.com/a/11577730
    let xhr = new XMLHttpRequest();
    xhr.open("GET", src, false);
    xhr.send(null);
    let content = xhr.responseText,
      doc = document.implementation.createHTMLDocument(
        "" + (document.title || "")
      );

    doc.open();
    doc.write(content);
    doc.close();

    let scripts = doc.getElementsByTagName("script");
    [].forEach.call(scripts, cb);

    document.replaceChild(
      document.importNode(doc.documentElement, true),
      document.documentElement
    );
  }

  function parseCookie(str) {
    const output = {};
    str.split(/\s*;\s*/).forEach(pair => {
      pair = pair.split(/\s*=\s*/);
      output[pair[0]] = pair.splice(1).join("=");
    });
    return output;
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
    hostname === "www.oschina.net" ||
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
      } else {
        fetch(location.href).then(resp => {
          let target = resp?.headers?.get("Location");
          if (target) return redirect(target);
        });
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
            window.open(`https://weibo.com/${uid}/${mid}`);
          }
        });
      return;
    }
  }

  // Close Safe Search & Show Image Direct Link
  else if (/www\.google\./.test(hostname) && /tbs=sbi(:|%3A)/.test(src)) {
    if (src.indexOf("safe=off") === -1) {
      return redirect(addQueries(src, { safe: "off" }));
    }
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
      } else if (pathname.startsWith("/g/")) {
        // Add Comment URL hash
        document
          .querySelectorAll("div.gdtm > div > a, div.gdtl > a")
          .forEach(a => {
            if (a.href.indexOf("hentai.org/s/") > -1) {
              a.setAttribute("target", "_blank");
            }
          });
        document.querySelectorAll("#cdiv div.c3").forEach(el => {
          let a = el.closest("div.c1").previousSibling;
          if (a && a.name) {
            el.innerHTML += ` &nbsp; <a href="#${a.name}">#</a>`;
          }
        });
      } else if (pathname.startsWith("/s/")) {
        const galleryUrl = document.querySelector("div.sb > a").href,
          h1 = document.querySelector("h1");
        h1.outerHTML = `<a href="${galleryUrl}" target="_blank" style="text-decoration:none;">${h1.outerHTML}</a>`;
        let img = document.getElementById("img"),
          a = img.parentNode,
          i3 = document.getElementById("i3");
        i3.style.cssText = "text-align: center; position: relative;";
        i3.append(img);
        a.removeAttribute("href");
        let ap = a.cloneNode(),
          apCss =
            "width: 42%; height: 70%; position: absolute; left: 0; top: 15%; z-index: 12; cursor: url(//ehgt.org/g/p.png),auto;",
          aCss =
            "width: 42%; height: 70%; position: absolute; right: 0; top: 15%; z-index: 12; cursor: url(//ehgt.org/g/n.png),auto;";
        ap.onclick = document.querySelector("a#prev").onclick;
        a.style.cssText = aCss;
        ap.style.cssText = apCss;
        i3.prepend(ap);
        let hookedFn = unsafeWindow.apply_json_state;
        unsafeWindow.apply_json_state = function (a) {
          let apOnClikck = a.n.match(/prev.*?(return.*?)"/)[1];
          a.i3 = a.i3
            .replace(/href.*?"/, "")
            .replace(
              /(^.*?onclick.*?\)")(.*?>)(<img.*?\/>)(.*?$)/,
              `<a onclick="${apOnClikck}" style="${apCss}">$4$1 style="${aCss}"$2$4$3`
            );
          hookedFn(a);
        };
      } else if (/^\/(mpv\/|torrents\.php|upld\/|mytags)/.test(pathname));
      else {
        // Open Gallery in New Tab
        [].forEach.call(document.getElementsByClassName("itg"), table => {
          table
            .querySelectorAll("a")
            .forEach(a => a.setAttribute("target", "_blank"));
        });
        // Add Search in South Plus
        const inputArea = document.getElementById("f_search");
        if (inputArea) {
          inputArea.style.width = "400px";
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
        }
        // Add Status
        const customStyle = document.createElement("style");
        customStyle.innerText =
          ".itg a .glink::before { content: '●'; color: #28C940; padding-right: 4px; } .itg a:visited .glink::before { color: #AAA; } " +
          ".glink { max-width: 1200px !important; display: inline-block; position: relative; padding-right: 4px; } " +
          "td.glname { max-width: 300px; white-space: nowrap; overflow: hidden; position: relative; } " +
          ".bouncing { animation: bc 2s infinite alternate linear; } .bouncing:hover { animation-play-state: paused; }" +
          "@keyframes bc { 0%, 10% { transform: translateX(0%); left: 0%; } 90%, 100% { transform: translateX(-100%); left: 100%; } }";
        const pageMode =
          document.querySelector("#dms select")?.selectedIndex ||
          document.querySelector("div.searchnav select")?.selectedIndex;
        // Add bouncing animation for title
        if (pageMode < 3) {
          const hookedFn = unsafeWindow.show_image_pane;
          unsafeWindow.show_image_pane = function (a) {
            const tr = document
              .querySelector("div#ic" + a)
              .parentNode.parentNode.closest("tr");
            const container = tr.querySelector("td.glname");
            const text = tr.querySelector("div.glink");
            if (
              container.clientWidth < text.scrollWidth &&
              !text.classList.contains("bouncing")
            )
              text.classList.add("bouncing");
            else if (
              container.clientWidth >= text.scrollWidth &&
              text.classList.contains("bouncing")
            )
              text.classList.remove("bouncing");
            hookedFn(a);
          };
        }
        document.head.appendChild(customStyle);
        {
          // Show translator meta: Not good if use Extended or Thumbnail mode.
          let needCheckedGalleries = {};
          let translateRegex =
            /\s*\[[^\[]*?(?:汉化|漢化|翻译|翻譯|製作室|機翻|机翻|重嵌|渣翻)[^\[]*?\]\s*/;
          let translateRegexIrregular =
            /\s*(\(|（|【|\[)(Chinese|中文)(\)|）|】|\])\s*/i;
          let cnTsGalleriesRegex = /\s*\[中国翻訳\]\s*/;
          const defaultColor =
            hostname === "e-hentai.org" ? "blueviolet" : "cyan";
          let addColor = (text, color = defaultColor) =>
            `&nbsp;<span style="color:${color};">${text.trim()}</span>`;
          document.querySelectorAll("div.glink").forEach(e => {
            let jpTitle = e.innerText;
            jpTitle = jpTitle.replace(/］/g, "]").replace(/［/g, "[");
            let matched = jpTitle.match(translateRegex)?.[0];
            if (matched) {
              e.innerHTML =
                jpTitle.replace(matched, " ").trim() + addColor(matched);
              return;
            }
            matched = jpTitle.match(cnTsGalleriesRegex)?.[0];
            if (matched) {
              e.innerHTML = jpTitle.replace(matched, " ").trim();
              needCheckedGalleries[e.parentNode.href] = e;
              return;
            }
            matched = jpTitle.match(translateRegexIrregular)?.[0];
            if (matched) {
              e.innerHTML =
                jpTitle.replace(matched, " ").trim() +
                addColor("[中文]", "#EF5FA7");
              return;
            }
            matched = jpTitle.match(/\s*\[中国語\]\s*/)?.[0];
            if (matched) {
              e.innerHTML =
                jpTitle.replace(matched, " ").trim() +
                addColor(matched, "#EF5FA7");
              return;
            }
            if (
              e.nextElementSibling?.querySelector(
                "div.gt[title='language:chinese']"
              )
            ) {
              e.innerHTML = e.innerHTML.trim();
              needCheckedGalleries[e.parentNode.href] = e;
            }
          });
          let gidList = Object.keys(needCheckedGalleries).map(url =>
            url.split("/").splice(4, 2)
          );
          if (gidList.length === 0) return;
          let groupedList = [];
          gidList.forEach((gt, n) => {
            let g = parseInt(n / 25);
            if (groupedList[g]) groupedList[g].push(gt);
            else groupedList[g] = [gt];
          });
          let cookie = parseCookie(document.cookie),
            hash = cookie.ipb_pass_hash;
          if (!hash) {
            console.warn("NO IPB_PASS_HASH FOUND.");
            return;
          }
          for (let group of groupedList) {
            fetch("https://api.coo11.workers.dev/ehapi", {
              method: "POST",
              headers: { Authorization: `Basic ${btoa(hash)}` },
              body: JSON.stringify({
                method: "gdata",
                gidlist: group,
              }),
            })
              .then(resp => resp.json())
              .then(json => {
                json?.gmetadata?.forEach(({ gid, token, title }) => {
                  let e =
                    needCheckedGalleries[
                      `https://${hostname}/g/${gid}/${token}/`
                    ];
                  let matched = title.match(translateRegex)?.[0];
                  if (matched) {
                    e.innerHTML += addColor(matched);
                    return;
                  }
                  /* e.innerHTML += addColor("[中国翻訳]", "#EF5FA7"); */
                });
              });
          }
        }
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
      document.body.insertAdjacentElement("beforeend", script);
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

  // Danbooru Ehance
  else if (hostname.endsWith(".donmai.us")) {
    return document.addEventListener("DOMContentLoaded", () => {
      document
        .querySelectorAll("a.post-preview-link")
        .forEach(a => (a.draggable = true));
      if (pathname.startsWith("/posts/")) {
        let image = document.querySelector("picture > img#image");
        if (image) {
          dragElement(image);
          image.style.paddingRight = "10px";
        }
        document.querySelector("div#a-show")?.addEventListener("click", e => {
          if (e.target.classList.contains("image-view-original-link")) {
            document
              .querySelector("picture > img#image")
              .classList.remove("fit-width");
          }
        });
        const size = document.querySelector("#post-info-size > a:last-child");
        size.previousSibling.data = size.previousSibling.data.replace("x", "×");
        const md5 = size.previousElementSibling?.href
          ?.split(/\/|\./)
          .reverse()?.[1];
        document
          .querySelector("#post-info-id")
          .insertAdjacentHTML(
            "beforeend",
            ` » <a id="post-on-g" target="_blank" href="https://gelbooru.com/index.php?page=post&s=list&md5=${md5}" style="color:#FFF;background-color:#2A88FE;">&nbsp;G&nbsp;</a>&nbsp;|&nbsp;<a id="post-on-y" target="_blank" href="https://yande.re/post?tags=holds%3Aall+md5%3A${md5}" style="color:#EE8887;background-color:#222;">&nbsp;Y&nbsp;</a>&nbsp;|&nbsp;<a id="post-on-s" target="_blank" href="https://beta.sankakucomplex.com/zh-CN?tags=md5%3A${md5}" style="color:#FFF;background-color:#FF761C;">&nbsp;S&nbsp;</a>`
          );
        document.head.insertAdjacentHTML(
          "beforeend",
          `<style>body[data-current-user-theme=dark]{--booru-border:1px dotted;}body[data-current-user-theme=light]{--booru-border:1px;}#post-info-id>a{font-weight:bold;} #post-info-id>a {border:var(--booru-border);border-radius:3px;} #post-info-id>a:hover{filter:opacity(50%);}</style>`
        );
        const time = document.querySelector("#post-info-date time"),
          title = time.innerText;
        if (!/(?:minutes?|hours?|(^|\D)\d days?) ago$/.test(title)) {
          time.innerText = time.title;
          time.title = title;
        }
      }
      /*
    document.querySelectorAll("a.comment-copy-link").forEach(a => {
      a.className = "real-comment-copy-link";
      a.lastChild.textContent = " Copy URL";
      a.onclick = function (e) {
        e.preventDefault();
        let url = new URL(location);
        url.search = "";
        url.hash = this.closest("article").id;
        navigator.clipboard.writeText(url.href);
        Danbooru.notice(`Copied comment ${url.hash} to clipboard.`);
      };
    }); */
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
        window.location.href =
          document.querySelector("ul#select > li > a").href;
        return;
      } else return;
    } else return;
  }

  // ptt
  else if (hostname === "www.ptt.cc") {
    return document.addEventListener("DOMContentLoaded", () => {
      let a = document.querySelector("a.small.right");
      if (a) {
        let a1 = a.cloneNode();
        a1.innerText = "在 PTTWEB 中打开";
        let url = new URL(location.href);
        url.host = "www.pttweb.cc";
        a1.href = url.href;
        a.parentNode.insertAdjacentElement("beforeend", a1);
      }
      return;
    });
  }

  // Google Web Cache
  else if (hostname === "webcache.googleusercontent.com") {
    if (src.indexOf(".zhihu.com") > -1) {
      scriptTagModify(script => {
        if (script.src.indexOf("heifetz/vendor") > -1) {
          script.removeAttribute("src");
        }
      });
      document.querySelectorAll("img").forEach(img => {
        if (img.getAttribute("data-actualsrc")) {
          img.src = img.getAttribute("data-actualsrc");
        }
      });
    }
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
    return redirect(newSrc.replace(/^http:/, "https:"));
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

  // Baidu
  else if (hostname === "tieba.baidu.com") {
    if (pathname === "/mo/q/posts") {
      let url = new URL(src);
      if (url.searchParams.has("tid")) {
        location.href =
          "https://tieba.baidu.com/p/" + url.searchParams.get("tid");
      }
      return;
    }
  } else if (
    hostname === "imgsrc.baidu.com" ||
    hostname === "tiebapic.baidu.com" ||
    hostname === "imgsa.baidu.com" ||
    hostname.endsWith(".hiphotos.baidu.com")
  ) {
    newSrc = decodeURIComponent(
      src.replace(/.*\/[^/]*[?&]src=([^&]*).*/, "$1")
    );
    if (newSrc !== src) {
      return redirect(newSrc);
    }
    newSrc = src
      .replace("/abpic/item/", "/pic/item/")
      .replace(/\/[^/]*(?:=|%3D)[^/]*\/sign=[^/]*\//, "/pic/item/");
    return redirect(newSrc);
  } else if (hostname.endsWith("himg.baidu.com")) {
    // http://tb.himg.baidu.com/sys/portrait/item/57cf0859
    // http://tb.himg.baidu.com/sys/portraitn/item/57cf0859
    // http://tb.himg.baidu.com/sys/portraitm/item/57cf0859
    // http://tb.himg.baidu.com/sys/portraitl/item/57cf0859
    // http://tb.himg.baidu.com/sys/original/item/57cf0859
    // http://himg.baidu.com/sys/original/item/57cf4b616e6748796559656f6e0859
    return redirect(
      src.replace(/\/sys\/[^/]*\/item\//, "/sys/portraitl/item/")
    );
  }

  // NGA
  else if (hostname === "img.nga.178.com") {
    return redirect(
      src.replace(
        /(\/attachments\/+[^/]*_[0-9]{6}\/+[0-9]+\/+[^/]*)\.(?:thumb|medium)(?:_[a-z])?\.[^/.]*(?:[?#].*)?$/,
        "$1"
      )
    );
  }

  // Tencent
  else if (hostname.endsWith(".qpic.cn")) {
    if (src.match(/\/mblogpic\//)) {
      return redirect(src.replace(/\/[0-9]*(?:\.[^/.]*)?(?:\?.*)?$/, "/2000"));
    }
    return redirect(src.replace(/\/[0-9]*(?:\.[^/.]*)?(?:\?.*)?$/, "/0"));
  }

  // Bilibili Video
  else if (hostname === "www.bilibili.com") {
    if (/(?:\/s)?\/video\/(av|BV|bv)(\w+)/.test(pathname)) {
      document.addEventListener("DOMContentLoaded", () => {
        // Remove redundant element
        document.querySelector("#reco_list").style.display = "none";
        document.querySelector("#right-bottom-banner").style.display = "none";
        // TODO: https://www.bilibili.com/blackboard/newplayer.html?autoplay=0&&musth5=1aid=...&page=...&cid=...
        document
          .querySelector("video")
          .addEventListener(
            "play",
            () =>
              document
                .querySelector("div.bilibili-player-video-btn-widescreen")
                .click(),
            { once: true }
          );
      });
      //https://github.com/mrhso/IshisashiWebsite/blob/master/BVwhodoneit/index.html#L20-L76
      const table = [
        ..."fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF",
      ];
      const s = [11, 10, 3, 8, 4, 6];
      const xor = 177451812;
      const add = 8728348608;
      const av2bv = av => {
        let num = NaN;
        if (Object.prototype.toString.call(av) === "[object Number]") {
          num = av;
        } else if (Object.prototype.toString.call(av) === "[object String]") {
          num = parseInt(av.replace(/[^0-9]/gu, ""));
        }
        if (isNaN(num) || num <= 0) {
          // 网页版直接输出这个结果了
          return;
        }

        num = (num ^ xor) + add;
        let result = [..."BV1  4 1 7  "];
        let i = 0;
        while (i < 6) {
          // 这里改写差点犯了运算符优先级的坑
          // 果然 Python 也不是特别熟练
          // 说起来 ** 按照传统语法应该写成 Math.pow()，但是我个人更喜欢 ** 一些
          result[s[i]] = table[Math.floor(num / 58 ** i) % 58];
          i += 1;
        }
        return result.join("");
      };
      const bv2av = bv => {
        let str = "";
        if (bv.length === 12) {
          str = bv;
        } else if (bv.length === 10) {
          str = `BV${bv}`;
          // 根据官方 API，BV 号开头的 BV1 其实可以省略
          // 不过单独省略个 B 又不行（
        } else if (bv.length === 9) {
          str = `BV1${bv}`;
        } else return;
        if (
          !str.match(
            /[Bb][Vv][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/gu
          )
        ) {
          return;
        }

        let result = 0;
        let i = 0;
        while (i < 6) {
          result += table.indexOf(str[s[i]]) * 58 ** i;
          i += 1;
        }
        return `av${(result - add) ^ xor}`;
      };
      ////////////////////////////////////////////
      function getInfoFromPathname() {
        if (/(?:\/s)?\/video\/(av|BV|bv)(\w+)/.test(location.pathname)) {
          return {
            type: RegExp.$1 === "av" ? "av" : "bv",
            id: RegExp.$2,
          };
        }
        return {};
      }
      function getLink(targetType = "av") {
        let { type, id } = getInfoFromPathname();
        if (!type) return;
        let u = new URL(location.href),
          p = u.searchParams.get("p"),
          t = u.searchParams.get("t");
        let newId = type === "av" ? av2bv(id) : bv2av(id);
        if (!newId) return;
        else {
          let newl = new URL("https://b23.tv");
          p && newl.searchParams.set("p", p);
          t && newl.searchParams.set("t", t);
          if (targetType === type.toLowerCase()) {
            newl.pathname = location.pathname
              .replace(/(\/s)?\/video/, "")
              .replace(/\/$/, "");
          } else newl.pathname = "/" + newId;
          return newl.href;
        }
      }
      function getVideoCover() {
        let { type, id } = getInfoFromPathname();
        if (!type) return;
        type = type === "av" ? "aid" : "bvid";
        fetch(`https://api.bilibili.com/x/web-interface/view?${type}=${id}`)
          .then(resp => {
            if (resp && resp.status == 200) {
              return resp.json();
            }
          })
          .then(resp => {
            if (resp) {
              let pic = resp.data.pic;
              if (pic) window.open(pic);
            }
          });
        return;
      }
      function notify(targetType) {
        let link = getLink(targetType);
        let title = `复制 ${targetType.toUpperCase()} 短链接`;
        if (link) {
          GM_setClipboard(link);
          GM_notification({
            title,
            text: "已复制：" + link,
            timeout: 2000,
          });
        } else {
          GM_notification({
            title,
            text: "无法获取短链接",
            timeout: 2000,
          });
        }
      }
      GM_registerMenuCommand("复制 AV 短链接", () => notify("av"));
      GM_registerMenuCommand("复制 BV 短链接", () => notify("bv"));
      GM_registerMenuCommand("查看视频封面", getVideoCover);
    }
  }

  // Pixiv
  else if (
    /i(-c?f)?\.pximg\.net/.test(hostname) ||
    hostname === "pixiv.pximg.net"
  ) {
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
    return redirect(
      addExts(newSrc, [hostname === "pixiv.pximg.net" ? "jpeg" : "jpg", "png"])
    );
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
          format: matched[2],
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
    const regex =
      /(\/assets\/+(?:images|covers)\/+images\/+[0-9]{3}\/+[0-9]{3}\/+[0-9]{3}\/+)(?:[0-9]+\/+)?(?:small(?:er)?|micro|medium|large|4k)(?:_square)?\/([^/]*)$/;
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
      src.replace(
        /:\/\/preview\.redd\.it\/((?:award_images\/+t[0-9]*_[0-9a-z]+\/+)?[^/.]*\.[^/.?]*)\?.*$/,
        "://i.redd.it/$1"
      )
    );
  } else if (hostname === "www.reddit.com") {
    let regex = /\/r\/.*?\/comments\/(\w+)/;
    if (regex.test(pathname)) {
      GM_registerMenuCommand("Copy post shortlink", () =>
        GM_setClipboard(`https://redd.it/${regex.exec(pathname)[1]}`)
      );
    }
  }

  // Apple Music, iTunes
  else if (hostname.endsWith(".mzstatic.com")) {
    if (
      /is\d(-ssl)?\.mzstatic\.com/.test(hostname) &&
      src.indexOf("/image/thumb/") > -1
    ) {
      if (src.endsWith("1200x1200.jpg")) return;
      newSrc = src.replace(
        /\/[0-9]*x[0-9]*[a-z]*(?:-[0-9]+)?(\.[^/.]*)$/,
        "/999999999x0w-999$1"
      );
      if (/\.png(?:[?#].*)?$/i.test(newSrc)) {
        let matched = src.match(
          /\/([^/]+\/+v4\/+(?:[a-f0-9]{2}\/+){3}[-0-9a-f]{20,}\/[^/]+)\//
        );
        if (matched) {
          return redirect("https://a1.mzstatic.com/us/r1000/063/" + matched[1]);
        }
      }
      return redirect(addExts(newSrc, ["png", "jpg"]));
    }
    if (/^[as][0-9]+\./.test(hostname)) {
      return redirect([
        src.replace(
          /(\/v4\/+(?:[a-f0-9]{2}\/+){3}[-0-9a-f]{20,}\/+)[^/]+(?:[?#].*)?$/,
          "$1source"
        ),
        src,
      ]);
    }
  }

  // Web Archive
  else if (hostname.endsWith(".archive.org") && /^ia[0-9]*\./.test(hostname)) {
    newSrc = src.replace(
      /(\/items\/+mbid-[-0-9a-f]+\/+mbid-[-0-9a-f]+)_(?:thumb[0-9]+|itemimage)(\.[^/.]*)(?:[?#].*)?$/,
      "$1$2"
    );
    if (newSrc !== src) {
      return redirect(addExts(newSrc, ["png", "jpg"]));
    }
  } else if (hostname === "coverartarchive.org") {
    return redirect(
      src.replace(/(\/[0-9]+)-[0-9]+(\.[^/.]*)(?:[?#].*)?$/, "$1$2")
    );
  }

  // SouthPlus
  else if (
    /(spring|summer|white|north|south|east|soul|level|snow)-plus\.net$/i.test(
      hostname
    ) ||
    hostname.endsWith("south-plus.org")
  ) {
    window.location.hostname = "bbs.imoutolove.me";
    return;
  } else if (hostname === "bbs.imoutolove.me") {
    return document.addEventListener("DOMContentLoaded", () => {
      if (location.pathname === "/read.php") {
        let newUrl = new URL("https:" + unsafeWindow.copyurl);
        newUrl.search = "?tid=" + newUrl.searchParams.get("tid");
        fetch(newUrl.href)
          .then(resp => {
            if (resp && resp.status === 200) return resp.text();
          })
          .then(resp => {
            if (resp) {
              let opUid = resp.match(/uid-(\d+).*?只看GF/)?.[1];
              if (opUid) {
                const customStyle = document.createElement("style");
                customStyle.innerText =
                  ".op { border: 1px solid #1484cd; border-radius: 3px; line-height: 1; width: auto; font-size: 12px; padding: 1px 3px; color: #1484cd; display: inline-flex; }";
                document.head.appendChild(customStyle);
                const opEl = document.createElement("div");
                opEl.classList.add("op");
                opEl.textContent = "OP";
                document
                  .querySelectorAll(".r_two > div[align='center'] > a")
                  .forEach(a => {
                    if (a.href.endsWith(`-${opUid}.html`)) {
                      a.appendChild(document.createTextNode(" "));
                      a.insertAdjacentElement("afterend", opEl.cloneNode(true));
                    }
                  });
              }
            }
          });
        document
          .querySelectorAll(".quote.jumbotron>.btn.btn-danger")
          .forEach(button => {
            let url = button
              .getAttribute("onclick")
              .replace(/location\.href='(.+)'/, "$1");
            // Get comment ID
            let post_id = button.closest("div").id;
            // Prevent page from redirecting when clicking button
            button.removeAttribute("onclick");
            button.addEventListener("click", e => {
              let btn = e.target;
              btn.setAttribute("value", "正在购买，请稍等");
              try {
                fetch(url, {
                  credentials: "include",
                  mode: "no-cors",
                })
                  .then(resp => resp.text())
                  .then(text => {
                    if (text.indexOf("操作完成") === -1) {
                      alert("购买失败！");
                    }
                    fetch(document.URL, {
                      credentials: "include",
                      mode: "no-cors",
                    })
                      .then(resp => resp.text())
                      .then(html => {
                        let dummy = document.createElement("html");
                        dummy.innerHTML = html;
                        let purchased = dummy.querySelector("#" + post_id);
                        let notPurchased = document.querySelector(
                          "#" + post_id
                        );
                        notPurchased.parentNode.replaceChild(
                          purchased,
                          notPurchased
                        );
                        dummy = null;
                        btn.remove();
                        if (window.history && unsafeWindow.copyurl) {
                          window.history.pushState(
                            {},
                            document.title,
                            unsafeWindow.copyurl + post_id.split("_")[1]
                          );
                        }
                      });
                  });
              } catch (error) {
                alert(`发送请求出错，购买失败！\n${error}`);
                console.log("Request Failed", error);
              }
            });
          });
      }
    });
  }

  // TSDM 天使动漫
  else if (/\btsdm39\.net$/.test(hostname)) {
    if (
      pathname.indexOf(".php") === -1 ||
      pathname.indexOf("mobile=yes") > -1 ||
      pathname.startsWith("/archiver")
    ) {
      return;
    }
    document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("ts_sidebar_base")?.remove();
      document.getElementById("tsdmbgpic")?.remove();
      document.querySelectorAll("div.qdsmile")?.forEach(e => e.remove());
      document.querySelectorAll("div.pls").forEach(e => {
        e.style.backgroundImage = "";
      });
    });
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
      document.querySelectorAll("div#yourimageretrylinks > a").forEach(a => {
        if (a.children[0].title === "Search Google") {
          a.href = a.href.replace(
            /^.*?=/,
            "https://lens.google.com/uploadbyurl?url="
          );
        }
        a.setAttribute("target", "_blank");
      });
      document
        .querySelectorAll("div:not(#result-hidden-notification).result")
        .forEach(e => {
          let img = e.querySelector(".resultimage img"),
            desc = img.title,
            isSourceFromHentai = /hentai/i.test(desc),
            isSourceFromKemono = /Kemono/i.test(desc),
            content = e.querySelector(".resultcontentcolumn"),
            titleUrl = e.querySelector(".resulttitle a")?.href,
            miscinfo = e.querySelector(".resultmiscinfo");
          e.querySelectorAll("a:not([href*='saucenao.com'])").forEach(a =>
            a.setAttribute("target", "_blank")
          );
          if (isSourceFromHentai && content) {
            let src = img.src;
            desc = desc.replace(/.*?#\d+:\s/, "");
            content.innerHTML =
              content.innerHTML.replace(/<(small)>\s*?<\/\1>\s*?<br>/, "") +
              `<small style="color: #999;">${desc}</small><br>`;
            if (desc.indexOf("E-Hentai") > -1) {
              const sha1 = src.match(/[0-9A-z]{40}/i);
              if (sha1) {
                const href = `https://exhentai.org/?f_cats=0&fs_similar=1&fs_exp=on&f_sft=on&f_shash=${sha1[0]}`;
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
          if (isSourceFromKemono && titleUrl) {
            const miscInfoA = miscinfo.querySelector("a");
            let uid, pid, site;
            switch (true) {
              case titleUrl.indexOf("fanbox") > -1:
                {
                  site = "fanbox";
                  let matched =
                    titleUrl?.match(/creator\/(\d+)\/post\/(\d+)/) || [];
                  uid = matched[1];
                  pid = matched[2];
                }
                break;
              case titleUrl.indexOf("fantia") > -1:
                {
                  site = "fantia";
                  pid = titleUrl?.match(/posts\/(\d+)/)?.[1];
                  uid = content
                    .querySelector("a")
                    ?.href?.match(/fanclubs\/(\d+)/)?.[1];
                }
                break;
              case titleUrl.indexOf("patreon") > -1:
                {
                  site = "patreon";
                  pid = titleUrl?.match(/posts\/(\d+)/)?.[1];
                  uid = content
                    .querySelector("a")
                    ?.href?.match(/user\?u=(\d+)/)?.[1];
                }
                break;
              default:
                console.warn(desc);
                break;
            }
            if (uid && pid && miscInfoA) {
              miscInfoA.href = `https://kemono.party/${site}/user/${uid}/post/${pid}`;
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
    if (newSrc != src && /^\/\w+\/status\/\d+/.test(pathname)) {
      return redirect(newSrc);
    }
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
          console.warn("Something wrong with new API");
          /* this._resp.id = this.tid; */
        }
        return this._resp || {};
      },
      set resp({ id, tweet }) {
        if (id === this.tid) {
          // console.log(tweet);
          if (!this._resp) this._resp = { tweet: {} };
          this._resp.id = id;
          this._resp.tweet = tweet;
          this.add();
        }
      },
      add() {
        const { id, target } = this.elem,
          { id: _id, tweet } = this.resp;
        if (id && id === _id) {
          // Elements to add
          let div = target.parentElement;
          if (div.querySelector(".LinkAdded")) return;
          let dot = div.children[div.childElementCount - 2],
            a = div.lastChild;
          // Video url to add, maybe more than 1: https://twitter.com/n_atsuna74cos/status/1581517853957574656
          let info = [];
          try {
            let result = tweet.content.itemContent.tweet_results.result;
            let { extended_entities, card } =
              result?.legacy || result?.tweet?.legacy; // https://twitter.com/MAPPA_Info/status/1591393136475246592
            if (extended_entities) {
              info = extended_entities.media
                .filter(i => i.type === "video" || i.type === "animated_gif")
                .map(i => i.video_info.variants);
            } else if (card) {
              // Maybe only show 1 video in cart type tweet
              info = JSON.parse(
                card.binding_values.unified_card.string_value
              ).media_entities;
              const keyName = Object.keys(info)[0];
              info = [info[keyName].video_info.variants];
            } else {
              console.log("No source found in API response.");
              return;
            }
          } catch (e) {
            console.log(e);
            return;
          }
          // Add
          info.forEach((meta, i) => {
            let url = meta
                .filter(i => i.content_type === "video/mp4")
                .sort((a, b) => b.bitrate - a.bitrate)[0].url,
              newDot = dot.cloneNode(true),
              newA = a.cloneNode(true);
            newA.classList.add("LinkAdded");
            newA.target = "_blank";
            newA.innerText = `下载视频${i + 1}`;
            newA.href = url;
            div.appendChild(newDot);
            div.appendChild(newA);
            if (!info[1]) newA.innerText = "下载视频";
          });
          this.added = true;
        } else return;
      },
      hookXHR() {
        let proxied = window.XMLHttpRequest.prototype.open,
          that = this;
        window.XMLHttpRequest.prototype.open = function (method, url) {
          let matched = url.match(
            /\/i\/api\/graphql\/.*?\/TweetDetail\?.*?focalTweetId%22%3A%22(\d*?)%22/
          );
          if (matched && !that.added && that.tid) {
            let id = matched[1];
            this.addEventListener(
              "readystatechange",
              function () {
                if (this.readyState != XMLHttpRequest.DONE) {
                  return;
                }
                let resp = this.response;
                resp = typeof resp === "string" ? JSON.parse(resp) : resp;
                that.resp = {
                  id,
                  tweet:
                    resp.data.threaded_conversation_with_injections_v2.instructions[0].entries.filter(
                      i => i.entryId == `tweet-${id}`
                    )[0],
                };
              },
              false
            );
          }
          // Independent part: Show deleted tweets id ↓↓↓
          matched = url.match(/\/i\/api\/graphql\/.*?\/Bookmarks\?/);
          if (matched) {
            this.addEventListener(
              "readystatechange",
              function () {
                if (this.readyState != XMLHttpRequest.DONE) {
                  return;
                }
                let resp = this.response;
                resp = typeof resp === "string" ? JSON.parse(resp) : resp;
                let entries =
                  resp.data.bookmark_timeline.timeline?.instructions?.[0]
                    ?.entries;
                if (!entries) return;
                entries.forEach(t => {
                  let res = t.content?.itemContent?.tweet_results?.result;
                  if (res && res.__typename === "TweetTombstone") {
                    res.tombstone.text.text += " " + t.entryId.split("-")[1];
                  }
                });
                resp.data.bookmark_timeline.timeline.instructions[0].entries =
                  entries;
                Object.defineProperty(this, "responseText", { writable: true });
                this.responseText = JSON.stringify(resp);
              },
              false
            );
          }
          // Independent part: Show deleted tweets id ↑↑↑
          return proxied.apply(this, [].slice.call(arguments));
        };
      },
      async findTarget(times = 50) {
        const id = this.tid;
        if (this.updating && !id) return;
        this.updating = true;
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
      },
    };
    addVideoLink.init();
  }

  // Niconico Video Cover
  else if (hostname === "www.nicovideo.jp") {
    const getCoverUrl = async (id, htmlStr, t = 0) => {
      let coverUrlRegExp = new RegExp(
        `https[^"]+\\/${id}\\/${id}\\.\\d+\\.original[^"]+`
      );
      let coverUrl = htmlStr.match(coverUrlRegExp)?.[0];
      if (!coverUrl) {
        if (t) return;
        let req = await fetch(`https://www.nicovideo.jp/watch/sm${id}`);
        if (req.status === 200) {
          return getCoverUrl(
            id,
            (await req.text()).replace(/&quot;/g, '"').replace(/\\\//g, "/"),
            ++t
          );
        }
      }
      return coverUrl;
    };
    GM_registerMenuCommand("View Video Cover", async () => {
      let smId = location.pathname.match(/sm(\d+)/)?.[1];
      if (smId) {
        let coverUrl = await getCoverUrl(smId, document.head.outerHTML);
        coverUrl && window.open(coverUrl, "_blank");
      }
    });
  }

  function dragElement(el) {
    let prevPos = [];

    const current = (x, y) => {
      const windowOffset = [
        window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft,
        window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop,
      ];
      const offset = [
        windowOffset[0] + prevPos[0] - x,
        windowOffset[1] + prevPos[1] - y,
      ];
      prevPos[0] = x;
      prevPos[1] = y;
      return offset;
    };

    el.addEventListener("dragstart", () => false);

    return el.addEventListener("mousedown", e => {
      if (
        e.button !== 0 ||
        e.altKey /* conflict with CB saving image fn */ ||
        e.ctrlKey
      ) {
        return;
      }

      e.preventDefault();
      const pageScroller = function (e) {
        const scroll = current(e.clientX, e.clientY);
        window.scrollTo(scroll[0], scroll[1]);
        el.setAttribute("data-drag-element", "1");
        return false;
      };

      const unsetAttr = () => el.removeAttribute("data-drag-element");

      el.style.cursor = "grabbing";
      prevPos = [e.clientX, e.clientY];

      document.addEventListener("mousemove", pageScroller);

      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", pageScroller);
          setTimeout(unsetAttr, 0);
          el.style.cursor = "auto";
          return false;
        },
        {
          once: true,
        }
      );
      return false;
    });
  }
})();
