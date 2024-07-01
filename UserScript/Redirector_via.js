// ==UserScript==
// @name         Excalibur
// @namespace         https://github.com/coo11/Backup/tree/master/UserScript
// @version         0.1.75
// @description         Start taking over the world for Via!
// @author         coo11
// @run-at         document-start
// @ ----EnhanceStart----
// @match         *://saucenao.com/search.php*
// @match         *://x.com/*
// @match         *://www.pixiv.net/*
// @ ----EnhanceEnd------
// @
// @ ----GetOriginalSrcStart----
// @ Weibo, Zhihu, Bilibili, Alibaba, Baidu, NGA, Tencent, Lofter, Mihuashi, BCY
// @match         *://*.sinaimg.cn/*
// @match         *://*.zhimg.com/*
// @match         *://*.hdslb.com/*
// @match         *://*.biliimg.com/*
// @match         *://*.alicdn.com/*
// @match         *://imgsrc.baidu.com/*
// @match         *://tiebapic.baidu.com/*
// @match         *://imgsa.baidu.com/*
// @match         *://*.hiphotos.baidu.com/*
// @match         *://img.nga.178.com/*
// @match         *://*.qpic.cn/*
// @match         *://*.lf127.net/*
// @match         *://pic-bucket.ws.126.net/*
// @match         *://image-assets.mihuashi.com/*
// @match         *://*.bcyimg.com/*
// @ Pixiv, Twitter, Youtube, Artstation, Steam, Pinterest, reddit, Discord, NicoSeiga, Google, tumblr
// @match         *://i.pximg.net/*
// @match         *://i-f.pximg.net/*
// @match         *://i-cf.pximg.net/*
// @match         *://pixiv.pximg.net/*
// @match         *://*.twimg.com/*
// @match         *://m.youtube.com/watch?v=*
// @match         *://m.youtube.com/shorts/*
// @match         *://ytimg.googleusercontent.com/*
// @match         *://*.ytimg.com/*
// @match         *://img.youtube.com/*
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
// @match         *://*.discordapp.net/*
// @match         *://*.discordapp.com/*
// @match         *://lohas.nicoseiga.jp/*
// @exclude-match         *://lohas.nicoseiga.jp/priv/*
// @match         *://*.googleusercontent.com/*
// @match         *://64.media.tumblr.com/*
// @ Apple Music, iTunes
// @match         *://*.mzstatic.com/*
// @ Web Archive
// @match         *://*.us.archive.org/*
// @ TODO: Tumblr
// @ ----GetOriginalSrcEnd------
// @
// @ ----RewriteURLStart----
// @ NGA
// @match         *://nga.178.com/*
// @match         *://ngabbs.com/*
// @match         *://g.nga.cn/*
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
// @match         *://*.blue-plus.net/*
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
// @match         *://weibo.cn/sinaurl?*
// @ ----RewriteURLEnd------
// @
// @ ----OtherStart----
// @match         *://tieba.baidu.com/mo/q/posts*
// @match         *://m.weibo.cn/*
// @match         *://video.h5.weibo.cn/1034:*
// @match         *://h5.video.weibo.com/show/*
// @match         *://weibo.com/*
// @match         *://*.bilibili.com/video/*
// @match         *://*.bilibili.com/s/video/*
// @match         *://www.google.com/search*tbs=sbi:*
// @match         *://www.google.com/search*tbs=sbi%3A*
// @match         *://*.fanbox.cc/*
// @match         *://fantia.jp/posts/*
// @match         *://fantia.jp/fanclubs/*
// @match         *://www.patreon.com/*
// @match         *://*.gumroad.com/*
// @match         *://exhentai.org/*
// @match         *://e-hentai.org/*
// @match         *://*.nhentai.net/*
// @match         *://danbooru.donmai.us/*
// @match         *://files.yande.re/*
// @match         *://webcache.googleusercontent.com/search*
// @ ----OtherEnd-----
// @grant             GM_setClipboard
// @grant             GM_registerMenuCommand
// @grant             GM_xmlhttpRequest
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

  const Logger = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop in window.console) {
          return function (arg1, ...args) {
            let pre = `%c${GM_info.script.name}%c`,
              style = "color: #3c89e8; padding: 1px 5px; border-radius: 4px; border: 1px solid #91caff;";
            if (typeof arg1 === "string") {
              console[prop](`${pre} ${arg1}`, style, null, ...args);
            } else console[prop](pre, style, null, arg1, ...args);
          };
        } else return target[prop];
      }
    }
  );
  //unsafeWindow.Logger = Logger;

  /*! js-cookie v3.0.5 | MIT */
  /* prettier-ignore */
  const Cookie = (function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}var t=function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});return t})();

  // prettier-ignore
  const weiboFn = {alphabet:"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",mid2id(r){let s="";for(let n=r.length-4;-4<n;n-=4){let e=n<0?0:n,t=n+4,o=r.substring(e,t);if(o=this.decodeBase62(o).toString(),0<e)for(;o.length<7;)o="0"+o;s=o+s}return s},id2mid(r){let s="";for(let n=(r=String(r)).length-7;-7<n;n-=7){let e=n<0?0:n,t=n+7,o=r.substring(e,t);if(o=this.encodeBase62(o),0<e)for(;o.length<4;)o="0"+o;s=o+s}return s},encodeBase62(e){let t="";for(;0!=e;)t=this.alphabet[e%62]+t,e=Math.floor(e/62);return t},decodeBase62(t){let o=0,n=t.length-1;for(let e=0;e<=n;e++)o+=this.alphabet.indexOf(t.substr(e,1))*Math.pow(62,n-e);return o},openHomepageFromSinaimg(e){const t=e.substr(0,8),o=t.startsWith("00")?this.decodeBase62(t):parseInt(t,16);window.open("https://weibo.com/u/"+o)}};

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
  } else if (hostname === "www.pixiv.net" && src.indexOf("/jump.php?http") > -1) {
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
  } else if (hostname === "t.cn" || hostname === "sinaurl.cn" || /^https?:\/\/weibo\.cn\/sinaurl\?(toasturl|u)=/.test(src)) {
    const div = document.querySelector("div.desc");
    if (div && div.innerText.startsWith("http")) {
      return redirect(div.innerText);
    } else {
      let usp = new URL(location);
      let target = usp.searchParams.get("toasturl") || usp.searchParams.get("u");
      if (target) return redirect(target);
      else if (hostname === "t.cn" && !target) {
        let rp = await fetch(usp);
        let url = rp.headers.get("Location");
        if (url) return redirect(url);
      }
    }
    return;
  }

  // Weibo Client Switch
  else if (hostname.endsWith("weibo.cn") || hostname.endsWith("weibo.com")) {
    if (hostname === "m.weibo.cn")
      // Prevent from popuping PWA installation
      document.head.querySelector('link[rel="manifest"]').remove();
    GM_registerMenuCommand("Weibo Base62", () => {
      const input = prompt("Input String to execute Base 62 encode/decode:");
      if (!input) {
        return;
      }
      const isEncoded = /\D/.test(input);
      const output = isEncoded ? weiboFn.mid2id(input) : weiboFn.id2mid(input),
        tip = isEncoded ? "解码" : "编码";
      GM_setClipboard(output);
      GM_toast(`${tip}结果已复制\n${output}`);
    });
    const regex = [
      /\/\/m\.weibo\.cn\/(?:status|detail|\d+)\/([A-z0-9]+)/i,
      /\/\/m\.weibo\.cn\/s\/video\/index.*?(?:blog_mid|segment_id)=(\d+)/i,
      /\/\/video\.h5\.weibo\.cn\/1034:(\d+)\/\d+/i,
      /\/\/h5\.video\.weibo\.com\/show\/1034:(\d+)/i
    ];
    let i = 0;
    while (!(matched = src.match(regex[i]))) i++;
    // Logger.log(i);
    switch (i) {
      case 0:
        return GM_registerMenuCommand("Copy Base62 URL", () => {
          let currentPid = window.location.href.match(/\/\/m\.weibo\.cn\/(?:status|detail|\d+)\/([A-z0-9]+)/i)?.[1];
          if (!currentPid) return;
          if (/^\d+$/.test(currentPid)) currentPid = weiboFn.id2mid(currentPid);
          const avatar = document.querySelector("div.main div.m-avatar-box a");
          // https://m.weibo.cn/profile/00000000
          const uid = avatar.href.split("/")[4];
          GM_setClipboard(`https://weibo.com/${uid}/${currentPid}`);
          GM_toast("桌面版链接已复制");
        });
      case 1:
        return redirect(`https://m.weibo.cn/status/${matched[1]}`);
      case 2:
        return redirect(`https://h5.video.weibo.com/show/1034:${matched[1]}`);
      case 3:
        return GM_registerMenuCommand("Open Weibo URL", () => getInfoByOid(matched[1]));
    }

    function getInfoByOid(oid) {
      //DOM may be changed
      let currentOid = window.location.href.match(regex[3]);
      if (currentOid && currentOid[1] !== oid) {
        oid = currentOid[1];
      }
      fetch(`https://h5.video.weibo.com/api/component?page=%2Fshow%2F1034%3A${oid}`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: `data={"Component_Play_Playinfo":{"oid":"1034:${oid}"}}`,
        method: "POST"
      })
        .then(resp => {
          if (resp && resp.status == 200) {
            return resp.json();
          }
        })
        .then(resp => {
          if (resp) {
            const info = resp.data.Component_Play_Playinfo;
            window.open(`https://m.weibo.cn/status/${info.mid}`);
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

  // Fanbox add entry to Pixiv & Kemono
  else if (hostname.endsWith(".fanbox.cc")) {
    if (hostname.startsWith("downloads.")) {
      newSrc = src.replace(/\/(c|w)\/\d+(x\d+)?\//, "/");
      if (newSrc !== src) return redirect(addExts(newSrc, ["png", "jpeg"]));
    } else {
      const getUID = () => {
        let bg = document.querySelector(
          'div[class^="CreatorHeader__IsNotMobileSmallWrapper-sc"] div[class*="UserIcon__Icon-sc-"], div[class^="styled__Wrapper-sc-"] div[style^="background-image"]'
        )?.style?.backgroundImage;
        return bg?.match(/(?:user|creator)\/(\d+)\/(?:icon|cover)/)?.[1];
      };
      GM_registerMenuCommand("View Author on Kemono", () => {
        let uid = getUID();
        if (uid) window.open(`https://kemono.party/fanbox/user/${uid}`, "_blank");
      });
      GM_registerMenuCommand("View Author on Pixiv", () => {
        let uid = getUID();
        if (uid) window.open(`https://www.pixiv.net/users/${uid}`, "_blank");
      });
    }
  }

  // Fantia add entry to Kemono
  else if (hostname === "fantia.jp") {
    let getUID = () => {
      return document.querySelector("div.fanclub-header > a")?.href?.match(/fanclubs\/(\d+)/)?.[1];
    };
    GM_registerMenuCommand("View Author on Kemono", () => {
      let uid = getUID();
      if (uid) window.open(`https://kemono.party/fantia/user/${uid}`, "_blank");
    });
  }

  // Patreon redirect to number ID homepage
  else if (hostname === "www.patreon.com") {
    if (pathname.startsWith("/posts/")) return;
    document.addEventListener("DOMContentLoaded", () => {
      const userData = unsafeWindow.patreon?.bootstrap?.campaign?.data;
      if (!userData) return;
      if (pathname === "/user") {
        const sp = new URL(src).searchParams;
        if (sp.get("u")) {
          GM_registerMenuCommand("View vanity page", () => {
            location.href = `/user?v=${userData.attributes.vanity}`;
          });
        }
        if (sp.get("v")) {
          GM_registerMenuCommand("View user ID page", () => {
            location.href = `/user?u=${userData.relationships.creator.data.id}`;
          });
        }
        GM_registerMenuCommand("View user on Kemono", () => {
          window.open(`https://kemono.party/patreon/user/${userData.relationships.creator.data.id}`, "_blank");
        });
        return;
      }
      return redirect(`/user?u=${userData.relationships.creator.data.id}`);
    });
  }

  // Gumroad add entry to Kemono
  else if (hostname.endsWith(".gumroad.com")) {
    document.addEventListener("DOMContentLoaded", () => {
      const getInfoComponent = () => {
        return JSON.parse(document.querySelector("script.js-react-on-rails-component")?.textContent);
      };
      GM_registerMenuCommand("View Author on Kemono", () => {
        let uid = getInfoComponent()?.creator_profile.external_id;
        if (uid) window.open(`https://kemono.party/gumroad/user/${uid}`, "_blank");
      });
    });
  }

  // Add Read Status To E-Hentai
  else if (hostname === "exhentai.org" || hostname === "e-hentai.org") {
    return document.addEventListener("DOMContentLoaded", () => {
      if (src.indexOf("gallerytorrents.php") > -1) {
        return document.querySelectorAll("#torrentinfo form table tr:nth-child(2)").forEach(tr => {
          let magnet,
            a = tr.nextElementSibling.querySelector("a");
          if (a) {
            magnet = a.href.replace(/.*?([0-9a-f]{40}).*$/i, "magnet:?xt=urn:btih:$1");
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
        // Add double click tag to open in new tab
        document.querySelectorAll("#taglist div > a").forEach(e => {
          e.addEventListener("dblclick", event => {
            event.preventDefault();
            window.open(event.target.href, "_blank");
          });
        });
        // Add comment URL hash
        document.querySelectorAll("div.gdtm > div > a, div.gdtl > a").forEach(a => {
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
      } else if (/^\/(mpv\/|torrents\.php|upld\/|mytags)/.test(pathname));
      else {
        // Open Gallery in New Tab
        [].forEach.call(document.getElementsByClassName("itg"), table => {
          table.querySelectorAll("a").forEach(a => a.setAttribute("target", "_blank"));
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
        const pageMode = document.querySelector("#dms select")?.selectedIndex || document.querySelector("div.searchnav select")?.selectedIndex;
        // Fix Tap link not show preview on Android
        if (pageMode < 3) {
          document.querySelectorAll("table.itg td[onmouseover] a").forEach(a => {
            const td = a.parentElement;
            a.addEventListener("click", e => {
              if (!td.canClick) {
                e.preventDefault();
                td.canClick = true;
              }
            });
            td.addEventListener("mouseleave", () => {
              td.canClick = false;
            });
          });
        }
        // Add bouncing animation for title
        if (pageMode < 3) {
          const hookedFn = unsafeWindow.show_image_pane;
          unsafeWindow.show_image_pane = function (a) {
            const tr = document.querySelector("div#ic" + a).parentNode.parentNode.closest("tr");
            const container = tr.querySelector("td.glname");
            const text = tr.querySelector("div.glink");
            if (container.clientWidth < text.scrollWidth && !text.classList.contains("bouncing")) text.classList.add("bouncing");
            else if (container.clientWidth >= text.scrollWidth && text.classList.contains("bouncing")) text.classList.remove("bouncing");
            hookedFn(a);
          };
        }
        document.head.appendChild(customStyle);
        {
          // Show translator meta: Not good if use Extended or Thumbnail mode.
          let needCheckedGalleries = {};
          let translateRegex = /\s*\[[^\[]*?(?:汉化|漢化|翻译|翻譯|製作室|機翻|机翻|重嵌|渣翻)[^\[]*?\]\s*/;
          let translateRegexIrregular = /\s*(\(|（|【|\[)(Chinese|中文)(\)|）|】|\])\s*/i;
          let cnTsGalleriesRegex = /\s*\[中国翻訳\]\s*/;
          let aiRegex = /\s*(\(|（|【|\[)(AI\s?生成|AI(-|\s)Generated?)(\)|）|】|\])\s*/i;
          const defaultColor = hostname === "e-hentai.org" ? "blueviolet" : "cyan";
          let addColor = (text, color = defaultColor) => `&nbsp;<span style="color:${color};">${text.trim()}</span>`;
          document.querySelectorAll("div.glink").forEach(e => {
            let jpTitle = e.innerText;
            jpTitle = jpTitle.replace(/］/g, "]").replace(/［/g, "[");
            let matched = jpTitle.match(translateRegex)?.[0];
            if (matched) {
              e.innerHTML = jpTitle.replace(matched, " ").trim() + addColor(matched);
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
              e.innerHTML = jpTitle.replace(matched, " ").trim() + addColor("[中文]", "#EF5FA7");
              return;
            }
            matched = jpTitle.match(/\s*\[中国語\]\s*/)?.[0];
            if (matched) {
              e.innerHTML = jpTitle.replace(matched, " ").trim() + addColor(matched, "#EF5FA7");
              return;
            }
            matched = jpTitle.match(aiRegex)?.[0];
            if (matched) {
              e.innerHTML = jpTitle.replace(matched, " ").trim() + addColor("[AI Generated]", "#FF0000");
              return;
            }
            if (e.nextElementSibling?.querySelector("div.gt[title='language:chinese']")) {
              e.innerHTML = e.innerHTML.trim();
              needCheckedGalleries[e.parentNode.href] = e;
            }
          });
          let gidList = Object.keys(needCheckedGalleries).map(url => url.split("/").splice(4, 2));
          if (gidList.length === 0) return;
          let groupedList = [];
          gidList.forEach((gt, n) => {
            let g = parseInt(n / 25);
            if (groupedList[g]) groupedList[g].push(gt);
            else groupedList[g] = [gt];
          });
          let hash = Cookie.get("ipb_pass_hash");
          if (!hash) {
            Logger.warn("NO IPB_PASS_HASH FOUND.");
            return;
          }
          for (let group of groupedList) {
            GM_fetch("https://api.e-hentai.org/api.php", {
              method: "POST",
              headers: { Authorization: `Basic ${btoa(hash)}` },
              body: JSON.stringify({
                method: "gdata",
                gidlist: group
              })
            }).then(resp => {
              let json = JSON.parse(resp.responseText);
              json?.gmetadata?.forEach(({ gid, token, title }) => {
                let e = needCheckedGalleries[`https://${hostname}/g/${gid}/${token}/`];
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

  // Danbooru Ehance
  else if (hostname.endsWith(".donmai.us")) {
    return document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("a.post-preview-link").forEach(a => (a.draggable = true)); // Fix for gesture plugin
      document.addEventListener("click", event => {
        const el = event.target;
        if (el.tagName === "A" && (el.parentElement.classList.contains("post-score") || el.parentElement.classList.contains("post-favcount"))) {
          if (!el.focused) {
            event.preventDefault();
            el.focused = true;
            el.addEventListener("blur", () => {
              el.focused = false;
            });
          }
        } else if (el.tagName === "SPAN" && el.classList.contains("post-count") && !el.parentElement.classList.contains("ui-menu-item-wrapper")) {
          const tagStr = el.parentElement.dataset.tagName || el.previousElementSibling.innerText.replace(/\s+/g, "_");
          if (tagStr) {
            const msg = `Tag <b><i>${tagStr}</i></b> copied.`;
            unsafeWindow.Danbooru.Utility.copyToClipboard(tagStr, msg);
          }
        }
      });
      // Convert full-width characters to half-width in search bar or tag edit textbox
      {
        function hasFullWidthSearchChar(data) {
          return (
            data &&
            (data.indexOf("\uFF1A") > -1 ||
              data.indexOf("\uFF08") > -1 ||
              data.indexOf("\uFF09") > -1 ||
              data.indexOf("\u201C") > -1 ||
              data.indexOf("\u201D") > -1 ||
              data.indexOf("\u2018") > -1 ||
              data.indexOf("\u2019") > -1 ||
              data.indexOf("\u2014\u2014") > -1)
          );
        }
        function replaceFullWidthChar(data) {
          return data
            .replace(/\uFF1A/g, ":")
            .replace(/\uFF08/g, "(")
            .replace(/\uFF09/g, ")")
            .replace(/\u201C|\u201D/g, '"')
            .replace(/\u2018|\u2019/g, "'")
            .replace(/\u2014\u2014/g, "_");
        }

        const contentEditableElements = document.querySelectorAll("input[data-autocomplete='tag-query'], textarea[data-autocomplete='tag-edit']");

        contentEditableElements.forEach(el => {
          el.addEventListener("beforeinput", e => {
            const { inputType, data, target } = e;
            const { value, selectionStart, selectionEnd } = target;
            let beginning = value.slice(0, selectionStart);
            let ending = value.slice(selectionEnd);
            console.log(e);

            if (inputType === "insertFromPaste" && data && hasFullWidthSearchChar(data)) {
              let newData = replaceFullWidthChar(data);
              let cursor = beginning.length + newData.length;
              inputElement.value = beginning + newData + ending;
              inputElement.selectionStart = inputElement.selectionEnd = cursor;
              return false;
            }
          });
          el.addEventListener("input", e => {
            // data here is null if inputType is insertFromPaste in Windows Chrome.
            // So we need to replace it in beforeinput event.
            const { inputType, data, target } = e;
            const { value, selectionStart, selectionEnd } = target;
            let beginning = value.slice(0, selectionStart);
            let ending = value.slice(selectionEnd);

            if (inputType.startsWith("insert") && data && hasFullWidthSearchChar(data)) {
              beginning = beginning.slice(0, -data.length);
              let newData = replaceFullWidthChar(data);
              let cursor = beginning.length + newData.length;
              target.value = beginning + newData + ending;

              // Android Webview and Chrome for Android has no insertCompositionText inputType.
              if (inputType === "insertCompositionText") target.hasInsertCompositionText = true;
              // An extra insertText event will be triggered in Windows Chrome.
              if (inputType === "insertText" && target.hasInsertCompositionText) {
                cursor = beginning.length;
                target.value = beginning + ending;
              }

              target.selectionStart = target.selectionEnd = cursor;
            }
          });
        });
      }
      if (pathname.startsWith("/posts/")) {
        const postId = document.body?.dataset["postId"] || document.head.querySelector("meta[name='post-id']").getAttribute("content");
        const size = document.querySelector("#post-info-size > a:last-child");
        size.previousSibling.data = size.previousSibling.data.replace("x", "×");
        const md5 = size.previousElementSibling.href?.match(/([a-z0-9]{32})\./)[1];
        document
          .querySelector("#post-info-id")
          .insertAdjacentHTML(
            "beforeend",
            `<div>&nbsp;<a id="post-on-g" target="_blank" href="https://gelbooru.com/index.php?page=post&s=list&md5=${md5}" style="color:#FFF;background-color:#2A88FE;">&nbsp;G&nbsp;</a>&nbsp;|&nbsp;<a id="post-on-y" target="_blank" href="https://yande.re/post?tags=holds%3Aall+md5%3A${md5}" style="color:#EE8887;background-color:#222;">&nbsp;Y&nbsp;</a>&nbsp;|&nbsp;<a id="post-on-s" target="_blank" href="https://sankaku.app/zh-CN?tags=md5%3A${md5}" style="color:#FFF;background-color:#FF761C;">&nbsp;S&nbsp;</a>&nbsp;|&nbsp;<a id="post-on-l" target="_blank" href="https://lolibooru.moe/post?tags=md5%3A${md5}" style="color:#E0B9B9;background-color:#222;">&nbsp;L&nbsp;</a></div>`
          );
        document.head.insertAdjacentHTML(
          "beforeend",
          `<style>body[data-current-user-theme=light],html{--booru-border:1px}body[data-current-user-theme=dark]{--booru-border:1px dotted}@media (prefers-color-scheme:dark){body{--booru-border:1px dotted}}#post-info-id>div{display:none}#post-info-id:hover>div{display:inline-block}#post-info-id a{font-weight:700;border:var(--booru-border);border-radius:3px}#post-info-id a:hover{filter:opacity(50%)}</style>`
        );
        const time = document.querySelector("#post-info-date time"),
          title = time.innerText;
        time.innerText = time.title;
        time.title = title;
        // Add post views
        {
          if (postId) {
            fetch("https://isshiki.donmai.us/post_views/" + postId)
              .then(resp => resp.text())
              .then(text => {
                if (/^\d+$/.test(text)) {
                  document.getElementById("post-info-score")?.insertAdjacentHTML("afterend", `<li id="post-info-views">Views: ${text}</li>`);
                }
              });
            fetch("/favorite_groups.json?only=id&limit=100&search%5Bpost_ids_include_all%5D=" + postId)
              .then(resp => resp.json())
              .then(json => {
                if (Array.isArray(json)) {
                  let len = json.length;
                  len = len > 100 ? len + "+" : len;
                  document
                    .getElementById("post-info-favorites")
                    ?.insertAdjacentHTML(
                      "afterend",
                      `<li id="post-info-favgroups">Favgroups: <a href="/favorite_groups?search%5Bpost_ids_include_all%5D=${postId}" target="_blank">${len}</a></li>`
                    );
                }
              });
          }
        }
        // Add a button to remove post in a favorite group to the end of the favorite group navi bar
        {
          let noticeSearchBar = document.querySelector(".post-notice-search"),
            favBars = noticeSearchBar?.querySelectorAll(".favgroup-navbar") || [],
            headers = {
              "X-CSRF-Token": window.Danbooru.Utility.meta("csrf-token")
            };
          if (favBars.length) {
            document.head.insertAdjacentHTML(
              "beforeend",
              `<style>.post-notice-search>.favgroup-navbar{display:flex;align-items:center}.favgroup-navbar>.favgroup-name{white-space:normal!important}.fav-remove-link{color:var(--button-danger-background-color)}</style>`
            );
            let xhref = document.querySelector("#close-news-ticker-link > svg > use").href.baseVal;
            favBars.forEach(fav => {
              let favName = fav.querySelector(".favgroup-name");
              let pre = favName.children[0].href;
              favName.insertAdjacentHTML(
                "beforeend",
                '&nbsp;<a class="fav-remove-link text-lg" title="Remove from this group"><svg class="icon svg-icon close-icon" viewBox="0 0 320 512"><use fill="currentColor" href="' +
                  xhref +
                  '"></use></svg></a>'
              );
              favName.lastElementChild.addEventListener("click", () => {
                fetch(`${pre}/remove_post.js?post_id=${postId}`, {
                  method: "PUT",
                  headers
                })
                  .then(resp => resp.text())
                  .then(text => {
                    const matched = text.match(/"(Removed post from favorite group )(.+?)"\);/);
                    if (matched) {
                      const url = encodeURI(`https://danbooru.donmai.us/posts?tags=favgroup:"${matched[2]}"`);
                      const text = matched[1] + `<a href="${url}">${matched[2]}</a>`;
                      window.Danbooru.notice(text);
                      fav.remove();
                      if (noticeSearchBar.children.length === 0) noticeSearchBar.remove();
                    }
                  });
              });
            });
          }
        }
      } else if (pathname.startsWith("/artists/")) {
        if (document.body.dataset["artistId"]) {
          const el = document.querySelector("li#subnav-posts");
          const url = el.children[0].href.replace("posts?tags=", "post_versions?search%5Bchanged_tags%5D=");
          if (url) el.insertAdjacentHTML("afterend", '<li id="subnav-postchanges"><a id="subnav-postchanges-link" href="' + url + '">Post changes</a></li>');
        }
      } else if (pathname.startsWith("/uploads/")) {
        wait(1000).then(() => document.querySelector(".ai-tags-related-tags-column")?.classList?.remove("hidden"));
        const hint = document.querySelector("div.post_tag_string span.hint");
        hint.insertAdjacentHTML("beforeend", "<br /><a class='cursor-pointer'>View detials for current tag in related tags page »</a>");
        hint.querySelector("a").addEventListener("click", () => {
          const currentTag = unsafeWindow.Danbooru.RelatedTag.current_tag();
          const url = `/related_tag?commit=Search&search%5Border%5D=Overlap&search%5Bquery%5D=${currentTag}`;
          if (currentTag) window.open(url, "_blank");
        });
      } else if (/\/favorite_groups\/\d+\/edit/.test(pathname)) {
        let textAreaLabel = document.querySelector(".favorite_group_post_ids_string > label");
        textAreaLabel.insertAdjacentHTML(
          "beforeend",
          `<span class="text-xxs text-center" style="font-weight:normal;">&nbsp;&nbsp;<a class="ids_ascending">Ascending</a>&nbsp;|&nbsp;<a class="ids_descending">Descending</a></span>`
        );
        textAreaLabel.querySelector("a.ids_ascending").addEventListener("click", () => sortIds());
        textAreaLabel.querySelector("a.ids_descending").addEventListener("click", () => sortIds(false));
        function sortIds(ascending = true) {
          let tArea = document.querySelector("#favorite_group_post_ids_string"),
            ids = tArea.value.trim(),
            idsArr = ids.split(/\s+/).filter(id => /^\d+$/.test(id));
          idsArr = [...new Set(idsArr)];
          idsArr.sort((a, b) => (ascending ? a - b : b - a));
          tArea.value = idsArr.join(" ");
          unsafeWindow.Danbooru.notice(`Sort in ${ascending ? "ascending" : "descending"} order.`);
        }
      } else if (/\/posts\?.*?\btags=/.test(src)) {
        const p = document.querySelector("#page > p:last-child");
        if (p && p.innerText.indexOf("takedown request") > -1) {
          let tag = new URL(src).searchParams.get("tags")?.trim();
          if (tag) {
            let url = new URL("https://danbooru.donmai.us/artists/show_or_new");
            url.searchParams.set("name", tag);
            location.href = url;
          }
        }
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
    if (document.contentType.startsWith("text")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        '<hr><center><h1><a href="https://weibo.cn/sinaurl?toasturl=' + encodeURIComponent(src) + '">Try</a> to add Weibo referer</h1></center>'
      );
    }
    if (hostname.startsWith("ss")) {
      newSrc = src.replace(/\.sinaimg\.cn\/[^/]*\/+([^/]*)/i, ".sinaimg.cn/orignal/$1");
    } else if (hostname.startsWith("n.")) {
      newSrc = newSrc.replace(/(\/ent\/+[0-9]+_)img(\/+upload\/)/, "$1ori$2");
    } else if (hostname.match(/^([a-z]{2,4}\d|wxt)\./)) {
      /* tvax2.sinaimg.cn */
      newSrc = src.replace(/\.sinaimg\.cn\/[^/]*\/+([^/]*)/i, ".sinaimg.cn/large/$1");
      GM_registerMenuCommand("Image Publisher Homepage", () => {
        const hash = src.match(/\/([a-z0-9]{32,})\./i);
        if (hash) weiboFn.openHomepageFromSinaimg(hash[1]);
      });
    } else return;
    return redirect(newSrc.replace(/^http:/, "https:"));
  }

  // Zhihu
  else if (hostname.match(/pic[0-9]\.zhimg\.com/)) {
    return redirect(src.replace(/\/((?:v[0-9]*-)?[0-9a-f]+)(?:_[^/._]*)?(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i, "/$1_r$2"));
  }

  // Bilibili
  else if (hostname.match(/(i[0-9]*\.hdslb|\w+\.biliimg)\.com/)) {
    return redirect(
      src
        .replace(/(:\/\/[^/]*\/)\d+_\d+\//, "$1")
        .replace(/(?:@|%40)[^/]*$/, "")
        .replace(/(\/[0-9a-f]{20,}\.[^/._]+)_\d+x\d+\.[^/]+(?:[?#].*)?$/, "$1")
    );
  }

  // Alibaba
  else if (hostname.endsWith("alicdn.com")) {
    newSrc = src;
    if (hostname === "img-tmdetail.alicdn.com") {
      newSrc = src.replace(/^[a-z]+:\/\/[^/]+\/+bao\/+uploaded\/+([^/]+\.[^/]+\/+)/, "$1");
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
  else if (hostname === "imgsrc.baidu.com" || hostname === "tiebapic.baidu.com" || hostname.endsWith(".hiphotos.baidu.com") || hostname === "imgsa.baidu.com") {
    newSrc = decodeURIComponent(src.replace(/.*\/[^/]*[?&]src=([^&]*).*/, "$1"));
    if (newSrc !== src) return redirect(newSrc);
    newSrc = src.replace("/abpic/item/", "/pic/item/").replace(/\/[^/]*(?:=|%3D)[^/]*\/sign=[^/]*\//, "/pic/item/");
    if (newSrc !== src) return redirect(newSrc);
    if (hostname !== "imgsrc.baidu.com") {
      newSrc = src.replace(/:\/\/[^/]+\/+/, "://imgsrc.baidu.com/");
      newSrc = new URL(newSrc);
      newSrc.searchParams.delete("tbpicau");
      return redirect(newSrc);
    }
  }

  // NGA
  else if (hostname === "img.nga.178.com") {
    return redirect(src.replace(/(\/attachments\/+[^/]*_[0-9]{6}\/+[0-9]+\/+[^/]*)\.(?:thumb|medium)(?:_[a-z])?\.[^/.]*(?:[?#].*)?$/, "$1"));
  }

  // Tencent
  else if (hostname.endsWith(".qpic.cn")) {
    if (src.match(/\/mblogpic\//)) {
      return redirect(src.replace(/\/[0-9]*(?:\.[^/.]*)?(?:\?.*)?$/, "/2000"));
    }
    return redirect(src.replace(/\/[0-9]*(?:\.[^/.]*)?(?:\?.*)?$/, "/0"));
  }

  // Lofter
  else if ((hostname.endsWith(".lf127.net") && /^imglf\d+\./.test(hostname)) || hostname === "pic-bucket.ws.126.net") {
    newSrc = src.replace(/\?.*$/, "");
    if (newSrc !== src) return redirect(newSrc);
  }

  // Mihuashi
  else if (hostname === "image-assets.mihuashi.com") {
    newSrc = src.split("!")[0];
    if (newSrc !== src) return redirect(newSrc);
  }

  // Banciyuan
  else if (hostname.endsWith(".bcyimg.com")) {
    newSrc = src.replace(/p\d-bcy-sign(.*?~).*/, "p3-bcy$1tplv-banciyuan-obj.image");
    if (newSrc !== src) return redirect(newSrc);
  }

  // Bilibili Video
  else if (hostname.endsWith(".bilibili.com")) {
    if (/\/video\/(av|BV|bv)\w+/.test(pathname)) {
      // https://github.com/mrhso/IshisashiWebsite/blob/4108b25d9be21ce3925d88259f6b0fddaf594217/BVwhodoneit/index.html#L24C1-L101C3
      // prettier-ignore
      const abv={table:[..."FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"],base:58n,xor:23442827791579n,rangeLeft:1n,rangeRight:2n**51n,av2bv(t){let i=t;if("[object String]"===Object.prototype.toString.call(i)&&(i=parseInt(i.replace(/^[Aa][Vv]/u,""))),("[object BigInt]"===Object.prototype.toString.call(i)||Number.isInteger(i))&&!((i=BigInt(i))<this.rangeLeft||i>=this.rangeRight)){i=i+this.rangeRight^this.xor;let t=[..."BV1000000000"],e=11;for(;2<e;)t[e]=this.table[Number(i%this.base)],i/=this.base,--e;return[t[3],t[9]]=[t[9],t[3]],[t[4],t[7]]=[t[7],t[4]],t.join("")}},bv2av(t){let i="";if(12===t.length)i=t;else if(10===t.length)i="BV"+t;else{if(9!==t.length)return;i="BV1"+t}if(i.match(/^bv1[1-9A-z]{9}$/iu)){i=[...i],[i[3],i[9]]=[i[9],i[3]],[i[4],i[7]]=[i[7],i[4]];let t=0n,e=3;for(;e<12;)t=(t*=this.base)+BigInt(this.table.indexOf(i[e])),e+=1;if(!(t<this.rangeRight||t>=2n*this.rangeRight||(t=t-this.rangeRight^this.xor)<this.rangeLeft))return"av"+t}}};
      ////////////////////////////////////////////
      function getInfoFromPathname() {
        if (/\/video\/(av|BV|bv)(\w+)/.test(location.pathname)) {
          return {
            type: RegExp.$1 === "av" ? "av" : "bv",
            id: RegExp.$2
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
        let newId = type === "av" ? abv.av2bv(id) : abv.bv2av(id);
        if (!newId) return;
        else {
          let newl = new URL("https://b23.tv");
          p && newl.searchParams.set("p", p);
          t && newl.searchParams.set("t", t);
          if (targetType === type.toLowerCase()) {
            newl.pathname = location.pathname.replace(/(\/s)?\/video/, "").replace(/\/$/, "");
          } else newl.pathname = "/" + newId;
          return newl.href;
        }
      }
      // Use bilibiliq.com for more cover type
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
        if (link) {
          GM_setClipboard(link);
          GM_toast("已复制：" + link);
        } else GM_toast("无法获取短链接");
      }
      GM_registerMenuCommand("复制 AV 短链接", () => notify("av"));
      GM_registerMenuCommand("复制 BV 短链接", () => notify("bv"));
      GM_registerMenuCommand("查看视频封面", getVideoCover);
    }
  }

  // Pixiv
  else if (/i(-c?f)?\.pximg\.net/.test(hostname) || hostname === "pixiv.pximg.net") {
    if (document.contentType.startsWith("text")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        '<hr><center><h1><a href="https://www.pixiv.net/jump.php?url=' + encodeURIComponent(src) + '">Try</a> to add Pixiv referer</h1></center>'
      );
    }
    newSrc = src
      .replace(/(\/user-profile\/+img\/.*\/[0-9]+_[0-9a-f]{20,})_[0-9]+(\.[^/.]+)(?:[?#].*)?$/, "$1$2")
      .replace(/\/c\/(?:\d+x\d+(?:_\d+)?(?:_[a-z0-9]+){0,2}|ic\d+:\d+:\d+|([aghquw]\d+_){5}cr[\d.]+:[\d.]+:[\d.]+:[\d.]+)\//, "/")
      .replace(/\/(?:img-master|custom-thumb)\//, "/img-original/")
      .replace(/\/novel-cover-master\//, "/novel-cover-original/")
      .replace(/(\/\d+_)(?:square|master)[0-9]+(\.[^/.]*)$/, "$1ugoira0$2")
      //.replace(/(\/[0-9]+_p[0-9]+)_[^/]*(\.[^/.]*)$/, "$1$2")
      .replace(/_(master|custom|square)1200\./, ".");
    //https://i.pximg.net/c/w1200_q80_a2_g1_u1_cr0:0.025:1:0.98/img-original/img/2023/07/15/00/00/04/109914935_p0.png
    //https://i.pximg.net/c/ic5120:1075:6400/img-original/img/2022/11/27/13/56/44/103137994_p0.jpg
    //https://i.pximg.net/c/384x280_80_a2_g2/img-master/img/2018/12/30/23/23/32/72389353_p0_master1200.jpg
    //https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2020/12/08/00/00/18/86162834_p0_custom1200.jpg
    //https://i.pximg.net/c/250x250_80_a2/img-master/img/2015/12/27/23/24/55/54282140_square1200.jpg
    //https://i.pximg.net/c/240x480/img-master/img/2023/07/24/13/08/57/110194401_master1200.jpg
    //https://i.pximg.net/img-original/img/2023/07/26/20/08/18/110258558_p0.gif
    //https://i.pximg.net/c/600x1200_90_webp/img-master/img/2023/12/31/23/16/57/114743969_p0_master1200.jpg
    return redirect(addExts(newSrc, [hostname === "pixiv.pximg.net" ? "jpeg" : "jpg", "png", "gif"]));
  }

  // Twitter
  else if (hostname === "pbs.twimg.com" || (hostname === "ton.twitter.com" && src.indexOf("/ton/data/dm/") > -1)) {
    if (src.indexOf("/profile_images/") > -1) {
      return redirect(src.replace(/[?#].*$/, "").replace(/_(?:bigger|normal|mini|reasonably_small|[0-9]+x[0-9]+)(\.[^/_]*)$/, "$1"));
    } else if (src.indexOf("/profile_banners/") > -1) {
      //https://pbs.twimg.com/profile_banners/247054763/1348017380/600x200
      return redirect([src.replace(/\/[0-9]+x[0-9]+(?:[?#].*)?$/, ""), src]);
    }

    newSrc = src.replace(/:([^/?]+)(.*)?$/, "$2?name=$1").replace(/(\?.*)\?name=/, "$1&name=");

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
      newSrc = newSrc.replace(/(\.[a-z]+)\?(?:(.*)&)?format=[^&]+/, "$1?$2&").replace(/&$/, "");

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

  // Youtube
  else if (hostname === "m.youtube.com") {
    if (pathname === "/watch" || pathname.startsWith("/shorts/")) {
      const matchInfo = () => {
        return window.location.href.match(/\/+(watch\?v=|shorts\/)([\w-]+)/);
      };
      GM_registerMenuCommand("View cover", () => {
        const matched = matchInfo();
        let pre = `https://i.ytimg.com/vi/${matched[2]}/`;
        window.open(matched[1] === "shorts/" ? pre + "oar2.jpg" : pre + "0.jpg");
      });
      GM_registerMenuCommand("View upload time", () => {
        const matched = matchInfo();
        window.open("https://youdate.beren.dev/api/v1?q=" + matched[2]);
      });
    }
  } else if (/^i\d*\.ytimg\.com/.test(hostname) || hostname === "ytimg.googleusercontent.com" || hostname === "img.youtube.com") {
    newSrc = src.replace(/^(https?:\/\/)i\d+(\.ytimg\.com\/vi(?:_webp)?\/+[^/]+\/+[0-9a-z]+\.)/, "$1i$2");
    if (newSrc !== src) return redirect(newSrc);
    newSrc = src.replace(/\/an(_webp)?\/+/, "/vi$1/");
    const matched = newSrc.match(/^(.+\/+vi(?:_webp)?\/+([^/]+)\/+)([a-z]*)(default|\d+)(?:_(?:live|\d+s))?(\.[^/.?#]*)(?:[?#].*)?$/);
    if (!matched) return;
    let vid = matched[2];
    GM_registerMenuCommand("View video", () => {
      window.open("https://www.youtube.com/watch?v=" + vid);
    });
    GM_registerMenuCommand("View cover", () => {
      window.open(`https://i.ytimg.com/vi/${vid}/0.jpg`);
    });
    [1, 2, 3].forEach(i => {
      GM_registerMenuCommand("View key frame " + i, () => {
        window.open(`https://i.ytimg.com/vi/${vid}/${i}.jpg`);
      });
      GM_registerMenuCommand(`View key frame ${i} (Shorts)`, () => {
        window.open(`https://i.ytimg.com/vi/${vid}/oar${i}.jpg`);
      });
    });
    GM_registerMenuCommand("View 1st frame", () => {
      window.open(`https://i.ytimg.com/vi/${vid}/frame0.jpg`);
    });
    let sizes = ["maxres", "sd", "hq", "mq"],
      newSrcs = [],
      num = matched[4];
    if ((matched[3] === "oar" || matched[3] === "frame") && num.length === 1) {
      let midPart = matched[3] === "frame" ? "frame0" : "oar" + num;
      newSrc = matched[1] + midPart + matched[5];
      if (newSrc === src) return;
      else return redirect(newSrc);
    }
    if (num.length > 1 || num === "0") {
      num = "default";
    }
    sizes.forEach(size => {
      newSrcs.push(matched[1] + size + num + matched[5]);
    });
    return redirect(newSrcs);
  }

  // Artstation
  else if (/^cdn(?:a|b)\.artstation\.com$/.test(hostname)) {
    const regex =
      /(\/assets\/+(?:images|covers)\/+images\/+[0-9]{3}\/+[0-9]{3}\/+[0-9]{3}\/+)(?:[0-9]+\/+)?(?:small(?:er)?|micro|medium|large|4k)(?:_square)?\/([^/]*)$/;
    if (regex.test(src)) {
      return redirect([src.replace(regex, "$1original/$2"), src.replace(regex, "$14k/$2"), src.replace(regex, "$1large/$2")]);
    }
  }

  // Steam
  else if (hostname.match(/cdn\.[^.]*\.steamstatic\.com/) || hostname.match(/steamcdn(?:-[a-z]*)?\.akamaihd\.net/)) {
    newSrc = src.replace(/(\/steam\/+apps\/+[0-9]+\/+movie)[0-9]+(?:_vp9)?(\.[^/.]+)(?:[?#].*)?$/, "$1_max$2");
    if (newSrc !== src) {
      return redirect(newSrc);
    }

    newSrc = src.replace(/(\/steam\/+apps\/+[0-9]+\/+movie)\.(?:jpg|JPG|jpeg|JPEG|png|PNG)(?:[?#].*)?$/, "$1_max.webm");
    if (newSrc !== src) {
      return redirect(newSrc);
    }

    newSrc = src.replace(/(\/steamcommunity\/+public\/+images\/+clans\/+[0-9]+\/+[0-9a-f]{20,})_[0-9]+x[0-9]+(\.[^/.]+)(?:[?#].*)?$/, "$1$2");
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
    (hostname.endsWith("pinimg.com") && hostname.match(/^(?:i|(?:s-)?media-cache)-[^.]*\.pinimg/)) ||
    (hostname.endsWith("s3.amazonaws.com") && src.indexOf("media.pinterest.com") > -1)
    /**
     * http://s3.amazonaws.com/media.pinterest.com/640x/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     * http://s3.amazonaws.com/media.pinterest.com/originals/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     * http://media.pinterest.com.s3.amazonaws.com/640x/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     * http://media.pinterest.com.s3.amazonaws.com/originals/c9/68/4a/c9684afc422e69662bed9f59835d2001.jpg
     */
  ) {
    const noSuffix = src.replace(/[?#].*$/, "");
    if (noSuffix.match(/:\/\/[^/]*\/media\.pinterest\.com\//)) {
      newSrc = noSuffix.replace(/(:\/\/[^/]*\/media\.pinterest\.com\/)[^/]*(\/.*\/[^/]*\.[^/.]*)$/, "$1originals$2");
    } else {
      newSrc = noSuffix.replace(/(:\/\/[^/]*\/)[^/]*(\/.*\/[^/]*\.[^/.]*)$/, "$1originals$2");
    }
    /**
     * https://i.pinimg.com/640x/1f/3f/ed/1f3fed6c284955934c7d724d2fe13ecb.jpg
     * https://i.pinimg.com/originals/1f/3f/ed/1f3fed6c284955934c7d724d2fe13ecb.png
     * https://i.pinimg.com/640x/a7/db/c3/a7dbc392372f1ca8f744032ba3c5ade1.jpg
     * https://i.pinimg.com/originals/a7/db/c3/a7dbc392372f1ca8f744032ba3c5ade1.gif */
    return redirect(addExts(newSrc));
  }

  // Reddit
  else if (hostname === "preview.redd.it") {
    return redirect(src.replace(/:\/\/preview\.redd\.it\/((?:award_images\/+t[0-9]*_[0-9a-z]+\/+)?[^/.]*\.[^/.?]*)\?.*$/, "://i.redd.it/$1"));
  }

  // Discord
  else if (/\bdiscordapp\b/.test(hostname)) {
    if ((hostname === "media.discordapp.net" && /\/attachments\//.test(src)) || hostname === "images.discordapp.net") {
      return redirect(src.replace(/\?.*$/, ""));
    }
    if (hostname === "cdn.discordapp.com") {
      return redirect(
        src
          .replace(/(\/emojis\/+[0-9]+\.[^/.?#]+)(?:[?#].*)?$/, "$1?size=4096")
          .replace(/(\/[-a-z]+\/+[0-9]{5,}\/+(?:users\/+[0-9]+\/+avatars\/+)?[^/]+\.[^/.?#]+)(?:[?#].*)?$/, "$1?size=4096")
      );
    }
    if (hostname === "media.discordapp.net") {
      return redirect(src.replace(/(\/stickers\/+[0-9]{5,}\.[^/.?#]+)(?:[?#].*)?$/, "$1?size=4096"));
    }
    if (hostname.endsWith("discordapp.net") && hostname.match(/images-ext-[0-9]*\.discordapp\.net/)) {
      return redirect(decodeURIComponent(src.replace(/.*\/external\/[^/]*\/(?:([^/]*)\/)?(https?)\/(.*?)(?:\?[^/]*)?$/, "$2://$3$1")));
    }
  }

  // Nico Seiga
  else if (hostname === "lohas.nicoseiga.jp") {
    let pid = pathname.match(/thumb\/(\d+)/)?.[1];
    if (pid) {
      let origSrc = "https://sp.seiga.nicovideo.jp/image/source/" + pid;
      let largeThumbSrc = `https://lohas.nicoseiga.jp/thumb/${pid}i`;
      if (!window.via?.toast) {
        let resp = await GM_fetch(origSrc);
        if (resp.readyState === 4 && resp.status === 200) {
          let finalUrl = resp.finalUrl;
          if (finalUrl.indexOf("jp/priv") > -1) return redirect(origSrc);
          else if (finalUrl.indexOf("account.nicovideo.jp") > -1);
        }
      }
      if (largeThumbSrc !== src) return redirect(largeThumbSrc);
      else {
        GM_toast("Current page is a large thumbnail (Login to view original)");
        if (window.via?.toast)
          GM_registerMenuCommand("View original (Need log in)", () => {
            location.href = origSrc;
          });
      }
    }
  }

  // Google
  else if (hostname.endsWith(".googleusercontent.com")) {
    if (/^(?:yt|ci|lh|gp)[0-9](?:-[a-z]{2})?\./.test(hostname) || /^play-lh\./.test(hostname) || hostname === "blogger.googleusercontent.com") {
      if (!/^[a-z]+:\/\/[^/]+\/+[^/?#=]{30,}=x[0-9]+-y[0-9]+-z[0-9]+-t[^-/?#]{23,}(?:[?#].*)?$/.test(src)) {
        return redirect(
          src
            .replace(/#.*$/, "")
            .replace(/\?.*$/, "")
            .replace(/\/[swh][0-9]*(-[^/]*]*)?\/([^/]*)$/, "/s0/$2")
            .replace(/(=[^/]*)?$/, "=s0?imgmax=0")
        );
      }
    }
  }

  // tumblr (new URL only)
  else if (hostname.endsWith(".tumblr.com")) {
    if (hostname === "64.media.tumblr.com") {
      newSrc = src.replace(/(\/[0-9a-f]{32}\/[0-9a-f]{16}-[0-9a-f]{2})\/s\d+x\d+/, "$1/s99999x99999");
      if (src !== newSrc) return redirect(newSrc);
      document.addEventListener("DOMContentLoaded", () => {
        const imgSrc = document.querySelector("div#base-container img[src^='https://64.media.tumblr.com/']")?.src;
        if (imgSrc && src !== imgSrc) return redirect(imgSrc);
      });
    }
  }

  // yande.re
  else if (hostname === "files.yande.re") {
    if (pathname.startsWith("/image/") || pathname.startsWith("/sample/")) {
      newSrc = src.replace(/(\/[a-z0-9]{32}\/).*(\..+)/, "$1$2");
      if (newSrc != src) return redirect("https://href.li/?" + newSrc);
    }
  }

  // Apple Music, iTunes
  else if (hostname.endsWith(".mzstatic.com")) {
    if (/is\d(-ssl)?\.mzstatic\.com/.test(hostname) && src.indexOf("/image/thumb/") > -1) {
      if (src.endsWith("1200x1200.jpg")) return;
      newSrc = src.replace(/\/[0-9]*x[0-9]*[a-z]*(?:-[0-9]+)?(\.[^/.]*)$/, "/999999999x0w-999$1");
      if (/\.png(?:[?#].*)?$/i.test(newSrc)) {
        let matched = src.match(/\/([^/]+\/+v4\/+(?:[a-f0-9]{2}\/+){3}[-0-9a-f]{20,}\/[^/]+)\//);
        if (matched) {
          return redirect("https://a1.mzstatic.com/us/r1000/063/" + matched[1]);
        }
      }
      return redirect(addExts(newSrc, ["png", "jpg"]));
    }
    if (/^[as][0-9]+\./.test(hostname)) {
      return redirect([src.replace(/(\/v4\/+(?:[a-f0-9]{2}\/+){3}[-0-9a-f]{20,}\/+)[^/]+(?:[?#].*)?$/, "$1source"), src]);
    }
  }

  // Web Archive
  else if (hostname.endsWith(".archive.org") && /^ia[0-9]*\./.test(hostname)) {
    newSrc = src.replace(/(\/items\/+mbid-[-0-9a-f]+\/+mbid-[-0-9a-f]+)_(?:thumb[0-9]+|itemimage)(\.[^/.]*)(?:[?#].*)?$/, "$1$2");
    if (newSrc !== src) {
      return redirect(addExts(newSrc, ["png", "jpg"]));
    }
  }

  // NGA
  else if (hostname === "nga.178.com" || hostname === "ngabbs.com" || hostname === "g.nga.cn") {
    window.location.hostname = "bbs.nga.cn";
    return;
  }

  // SouthPlus
  else if (/\b(spring|summer|white|north|south|east|soul|level|snow|blue)-plus\.net$/i.test(hostname) || hostname.endsWith("south-plus.org")) {
    window.location.hostname = "bbs.imoutolove.me";
    return;
  } else if (hostname === "bbs.imoutolove.me") {
    if (location.href.indexOf("/simple/index.php?t") > -1) {
      const tUrl = document.querySelector(".fas.fa-desktop")?.parentNode?.href;
      if (!tUrl) return;
      fetch(tUrl)
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
              document.querySelectorAll(".col-12 > a").forEach(a => {
                if (a.href.endsWith(opUid)) {
                  a.appendChild(document.createTextNode(" "));
                  a.insertAdjacentElement("afterend", opEl.cloneNode(true));
                }
              });
            }
          }
        });
    }
  }

  // SauceNAO
  else if (hostname === "saucenao.com") {
    document.head.insertAdjacentHTML("afterBegin", '<meta name="viewport" content="width=device-width,initial-scale=1">');
    document.head.insertAdjacentHTML(
      "beforeEnd",
      "<style>" +
        '#headerbarright,.resultimage{float:unset;text-align:center}body{font-size:87.5%;font-family:source-sans-pro,sans-serif}#headerarea,#mainarea{width:100%;min-width:unset}#headerbarright{width:100%;direction:unset}#mainarea,.resultmatchinfo,.resulttable tr,.resulttablecontent{display:flex;flex-direction:column;align-items:center}#left{width:100%;background-color:#1d1d1d}#yourimagecontainer{padding-top:0;text-align:center}#yourimage{display:inline-block;float:none;position:relative;min-height:150px}#yourimage::before{content:"click to edit your image";position:absolute;bottom:0;left:0;font-size:smaller;background-color:rgba(0,0,0,.5);backdrop-filter:blur(2px)}#yourimageretrylinks{display:flex;justify-content:center;flex-direction:row;margin:8px;gap:16px}#middle{margin:unset;width:100%}.result{margin:0 5px 5px}.resulttableimage{background-color:unset}.resultimage{min-width:unset}.resultimage_showmessage::after{left:0;padding:unset;font-size:smaller}.pixelated{width:unset;min-height:150px}.resultmatchinfo{row-gap:4px;margin:0}.resultmiscinfo{display:flex;flex-direction:row;align-items:flex-start;gap:8px}.resultcontent{width:100%}.resulttitle{margin-bottom:0}#footerarea,#headerbarleft,#headerbarmiddle,#smalllogo,#yourimageretrylinks>div,#yourimagetext,.resultcontentcolumn br:last-child{display:none}' +
        "</style></head>"
    );
    const body = document.body;
    if (body.innerText.indexOf("Access to specified file was denied") > -1) {
      body.innerText += "\nGO BACK TO START IN 3S...";
      setTimeout(() => {
        location.href = "/";
      }, 3000);
      return;
    }
    document
      .querySelectorAll("img[src*='static/patreon'], img[src*='static/btn_donate'], img[src*='static/bannersmall'], img[src*='static/yourimage270']")
      .forEach(img => (img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="));
    // Search in new tab
    document.querySelectorAll("div#yourimageretrylinks > a").forEach(a => {
      if (a.children[0].title.indexOf("Google") > -1) {
        a.href = a.href.replace(/^.*?=/, "https://www.google.com/searchbyimage?client=Chrome&image_url=");
      }
      a.setAttribute("target", "_blank");
    });
    // Add result link for Fanbox, Fantia, Patreon, *hentai and Kemono
    document.querySelectorAll("div:not(#result-hidden-notification).result").forEach(e => {
      let img = e.querySelector(".resultimage img"),
        desc = img.title,
        isSourceFromHentai = /hentai/i.test(desc),
        isSourceFromKemono = /Kemono/i.test(desc),
        content = e.querySelector(".resultcontentcolumn"),
        titleUrl = e.querySelector(".resulttitle a")?.href,
        miscinfo = e.querySelector(".resultmiscinfo");
      e.querySelectorAll(".resulttablecontent a:not([href*='saucenao.com'])").forEach(a => a.setAttribute("target", "_blank"));
      if (isSourceFromHentai && content) {
        let src = img.src;
        desc = desc.replace(/.*?#\d+:\s/, "");
        content.innerHTML = content.innerHTML.replace(/<(small)>\s*?<\/\1>\s*?<br>/, "") + `<small style="color: #999;">${desc}</small><br>`;
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
              let matched = titleUrl?.match(/creator\/(\d+)\/post\/(\d+)/) || [];
              uid = matched[1];
              pid = matched[2];
            }
            break;
          case titleUrl.indexOf("fantia") > -1:
            {
              site = "fantia";
              pid = titleUrl?.match(/posts\/(\d+)/)?.[1];
              uid = content.querySelector("a")?.href?.match(/fanclubs\/(\d+)/)?.[1];
            }
            break;
          case titleUrl.indexOf("patreon") > -1:
            {
              site = "patreon";
              pid = titleUrl?.match(/posts\/(\d+)/)?.[1];
              uid = content.querySelector("a")?.href?.match(/user\?u=(\d+)/)?.[1];
            }
            break;
          default:
            Logger.warn(desc);
            break;
        }
        if (uid && pid && miscInfoA) {
          miscInfoA.href = `https://kemono.su/${site}/user/${uid}/post/${pid}`;
        }
      }
    });
  }

  // Twitter
  else if (hostname === "x.com") {
    pathname = pathname.replace(/^\/i\/web/, "/user");
    newSrc = `https://x.com${pathname}`;
    if (newSrc != src && /^\/\w+\/status\/\d+/.test(pathname)) {
      return redirect(newSrc);
    }
    {
      document.head.insertAdjacentHTML(
        "beforeend",
        "<style>" +
          // Hide annoying button or tab
          'a[href="/i/grok"], a[href="/i/premium_sign_up"], a[href="/jobs"], a[href="/settings/monetization"], a[href="https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb"], div[role=presentation]:has(a[href*="/highlights"]), div[data-testid=sidebarColumn] div[tabindex="0"] > div > div:has(a[href="/i/verified-choose"]), div[data-testid=sidebarColumn] div[tabindex="0"] > div > div:has(a[href="/i/trends"]) { display: none !important; } ' +
          // Blink multiple images media grid
          '@keyframes colorCycle{0%,100%{fill:black}50%{fill:white}}[id^=verticalGridItem-][id$="-profile-grid-0"] a svg{animation:2s infinite colorCycle}' +
          "</style>"
      );
    }
    const getUID = (short = true) => {
      const id = JSON.parse(document.head.querySelector('script[data-testid="UserProfileSchema-test"]')?.textContent || null)?.author?.identifier;
      if (id) {
        const preifx = short ? "https://x.com/i/user/" : "https://x.com/intent/user?user_id=";
        const url = preifx + id;
        GM_setClipboard(url);
        GM_toast(url + " Copied.");
      } else GM_toast("UID not found.");
    };
    GM_registerMenuCommand("Get user permanent link", () => getUID());
    GM_registerMenuCommand("Get user permanent linkᴸ", () => getUID(0));
  }

  // Pixiv
  else if (hostname === "www.pixiv.net") {
    const getUID = () => location.href.match(/\/users\/(\d+)/)?.[1];
    GM_registerMenuCommand("Copy stacc URL", () => {
      const uid = getUID();
      if (uid)
        fetch("https://www.pixiv.net/stacc/id/" + uid).then(r => {
          GM_setClipboard(r.url);
          GM_toast(r.url + " copied.");
        });
    });
    GM_registerMenuCommand("View Artist on Fanbox", () => {
      const uid = getUID();
      if (uid) window.open("https://www.pixiv.net/fanbox/creator/" + uid);
    });
  }

  function scriptTagModify(cb) {
    // https://stackoverflow.com/a/11577730
    let xhr = new XMLHttpRequest();
    xhr.open("GET", src, false);
    xhr.send(null);
    let content = xhr.responseText,
      doc = document.implementation.createHTMLDocument("" + (document.title || ""));

    doc.open();
    doc.write(content);
    doc.close();

    let scripts = doc.getElementsByTagName("script");
    [].forEach.call(scripts, cb);

    document.replaceChild(document.importNode(doc.documentElement, true), document.documentElement);
  }

  function findObjAtKeys(obj, keys) {
    let found = [];
    let stack = Object.entries(obj);
    while (stack.length > 0) {
      let current = stack.pop();
      if (keys.indexOf(current[0] != -1)) {
        found.push(current[1]);
      }
      if (current[1] && typeof current[1] == "object") {
        stack = stack.concat(Object.entries(current[1]));
      }
    }
    return found;
  }

  function GM_fetch(url, options = {}) {
    options.data = options.body;
    delete options.body;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: "GET",
        ...options,
        onload: response => resolve(response),
        onerror: error => reject(error)
      });
    });
  }

  /**
   * @param {string | {title: string, text: string, timeout: number}} input - Toast message, or toast title, mssage & duration.
   */
  function GM_toast(input) {
    input = typeof input === "string" ? { text: input } : input;
    if (window.GM_notification) {
      return GM_notification(input);
    } else if (window.via?.toast) {
      return window.via.toast(input.text);
    }

    // https://gist.github.com/superRaytin/d06faea2072dc1836e3d2558cdfc942a
    // prettier-ignore
    {window.simpleToastTimer&&clearTimeout(window.simpleToastTimer);const wrapStyle="display: flex; justify-content: center; padding: 0.6rem 1rem; font-size: 1.5rem; color: #fff; background: rgba(0, 0, 0, 0.7); border-radius: 0.4rem; position: fixed; top: 50%; left: 50%; z-index: 100; transform: translate3d(-50%, -50%, 1px);",contentStyle="display: flex; flex-direction: column; align-items: center; text-align: center;",toastEleId="__GM_toast",toastInnerHTML=`<div style="${wrapStyle}"><div style="${contentStyle}">${input.text}</div></div>`,toastEl=document.getElementById(toastEleId);if(toastEl)toastEl.innerHTML=toastInnerHTML;else{const a=document.createElement("div");a.setAttribute("id",toastEleId),a.innerHTML=toastInnerHTML,document.body.appendChild(a)}window.simpleToastTimer=setTimeout(()=>{const t=document.getElementById(toastEleId);t&&t.parentNode.removeChild(t)},input.timeout||2e3);}
  }
})();
