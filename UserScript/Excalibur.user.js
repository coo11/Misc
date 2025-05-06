// ==UserScript==
// @name        Excalibur
// @namespace   https://github.com/coo11/Backup/tree/master/UserScript
// @version     0.1.89
// @description Start taking over the world!
// @author      coo11
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI2VmNDU0NiIgZD0iTTQxIDdhMjMuODEgMjMuODEgMCAwIDAtMTctN3YyNFoiLz48cGF0aCBmaWxsPSIjZjc3NzI2IiBkPSJNNDggMjRhMjQgMjQgMCAwIDAtNy0xN0wyNCAyNFoiLz48cGF0aCBmaWxsPSIjZmZkYzM5IiBkPSJNNDEgNDFhMjMuODEgMjMuODEgMCAwIDAgNy0xN0gyNFoiLz48cGF0aCBmaWxsPSIjNTlkNDY0IiBkPSJNMjQgNDhhMjQgMjQgMCAwIDAgMTctN0wyNCAyNFoiLz48cGF0aCBmaWxsPSIjNDg5MGYxIiBkPSJNNyA0MWEyMy44MSAyMy44MSAwIDAgMCAxNyA3VjI0WiIvPjxwYXRoIGZpbGw9IiM1NzcxZWMiIGQ9Ik0wIDI0YTI0IDI0IDAgMCAwIDcgMTdsMTctMTdaIi8+PHBhdGggZmlsbD0iI2E2NDNlNyIgZD0iTTcgN2EyMy44MSAyMy44MSAwIDAgMC03IDE3aDI0WiIvPjxwYXRoIGZpbGw9IiNkYzNmZTciIGQ9Ik0yNCAwQTIzLjgxIDIzLjgxIDAgMCAwIDcgN2wxNyAxN1oiLz48L3N2Zz4=
// @run-at      document-end
// @match       *://mp.weixin.qq.com/*
// @match       *://*.bilibili.com/video/*
// @match       *://*.bilibili.com/s/video/*
// @match       *://space.bilibili.com/*
// @match       *://live.bilibili.com/*
// @match       *://*.lofter.com/*
// @match       *://www.xiaohongshu.com/*
// @match       *://www.pixiv.net/*
// @match       *://*.fanbox.cc/*
// @match       *://fantia.jp/posts/*
// @match       *://fantia.jp/fanclubs/*
// @match       *://*.gumroad.com/*
// @match       *://www.patreon.com/*
// @match       *://x.com/*
// @match       *://github.com/*
// @match       *://m.facebook.com/*
// @match       *://www.facebook.com/*
// @match       *://saucenao.com/search.php*
// @match       *://yandex.com/images/*
// @match       *://danbooru.donmai.us/*
// @match       *://betabooru.donmai.us/*
// @match       *://yande.re/*
// @match       *://files.yande.re/*
// @match       *://bbs.imoutolove.me/read.php*
// @match       *://bbs.imoutolove.me/simple/index.php*
// @match       *://exhentai.org/*
// @match       *://e-hentai.org/*
// @match       *://bsky.app/*
// @match       *://web-cdn.bsky.app/*
// @match       *://www.nicovideo.jp/watch/sm*
// @match       *://skeb.jp/@*
// @match       *://*.dbsearch.net/*
// @match       *://poipiku.com/*
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/* prettier-ignore */
const Logger = new Proxy({},{get:(o,n)=>n in window.console?function(o,...e){let c=`%c${GM_info.script.name}%c`,l="color: #3c89e8; padding: 1px 5px; border-radius: 4px; border: 1px solid #91caff;";"string"==typeof o?console[n](`${c} ${o}`,l,null,...e):console[n](c,l,null,o,...e)}:o[n]});

/*! js-cookie v3.0.5 | MIT */
/* prettier-ignore */
const Cookie = (function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}var t=function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});return t})();

const GM_fetch = (url, options = {}) => {
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
};

/**
 * @param {string | {title: string, text: string, timeout: number}} input - Toast message, or toast title, mssage & duration.
 */
const GM_toast = input => {
  input = typeof input === "string" ? { text: input } : input;
  if (globalThis.GM_notification) {
    return GM_notification(input);
  } else if (!input.timeout) {
    if (window.via?.toast) {
      return window.via.toast(input.text);
    }
  }
  // https://gist.github.com/superRaytin/d06faea2072dc1836e3d2558cdfc942a
  // prettier-ignore
  {window.simpleToastTimer&&clearTimeout(window.simpleToastTimer);const wrapStyle="display: flex; justify-content: center; padding: 0.6rem 1rem; font-size: 1.5rem; color: #fff; background: rgba(0, 0, 0, 0.7); border-radius: 0.4rem; position: fixed; top: 50%; left: 50%; z-index: 100; transform: translate3d(-50%, -50%, 1px); min-width: 60vw; line-height: 1.2; word-break: break-word;",contentStyle="display: flex; flex-direction: column; align-items: center; text-align: center;",toastEleId="__GM_toast",toastInnerHTML=`<div style="${wrapStyle}"><div style="${contentStyle}">${input.text}</div></div>`,toastEl=document.getElementById(toastEleId);if(toastEl)toastEl.innerHTML=toastInnerHTML;else{const a=document.createElement("div");a.setAttribute("id",toastEleId),a.innerHTML=toastInnerHTML,document.body.appendChild(a)}window.simpleToastTimer=setTimeout(()=>{const t=document.getElementById(toastEleId);t&&t.parentNode.removeChild(t)},input.timeout||2e3);}
};

const disableWebRTC = () => {
  navigator.getUserMedia = void 0;
  unsafeWindow.MediaStreamTrack = void 0;
  unsafeWindow.RTCPeerConnection = void 0;
  unsafeWindow.RTCSessionDescription = void 0;
  navigator.mozGetUserMedia = void 0;
  unsafeWindow.mozMediaStreamTrack = void 0;
  unsafeWindow.mozRTCPeerConnection = void 0;
  unsafeWindow.mozRTCSessionDescription = void 0;
  navigator.webkitGetUserMedia = void 0;
  unsafeWindow.webkitMediaStreamTrack = void 0;
  unsafeWindow.webkitRTCPeerConnection = void 0;
  unsafeWindow.webkitRTCSessionDescription = void 0;
  Logger.log("WebRTC has been overwriten.");
};

const dragElement = el => {
  let prevPos = [];

  const current = (x, y) => {
    const windowOffset = [
      window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
    ];
    const offset = [windowOffset[0] + prevPos[0] - x, windowOffset[1] + prevPos[1] - y];
    prevPos[0] = x;
    prevPos[1] = y;
    return offset;
  };

  el.addEventListener("dragstart", () => false);

  return el.addEventListener("mousedown", e => {
    if (e.button !== 0 || e.altKey /* conflict with CB saving image fn */ || e.ctrlKey) return;

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
        once: true
      }
    );
    return false;
  });
};

const wait = (ms = 1e3) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  "use strict";
  let newSrc,
    { hostname, pathname } = window.location;
  const src = window.location.href;

  const redirect = newSrc => {
    if (newSrc === src) return;
    window.location.replace(newSrc);
  };

  // WeChat Official Account
  if (hostname === "mp.weixin.qq.com") {
    GM_registerMenuCommand("Copy permanent/purged URL", () => {
      const { biz, mid, idx, sn } = unsafeWindow;
      const newUrl = `https://mp.weixin.qq.com/s?__biz=${biz}&mid=${mid}&idx=${idx}&sn=${sn}`;
      GM_setClipboard(newUrl);
      GM_toast("Permanent / Purged URL copied.\n" + newUrl);
    });
  }

  // Bilibili Video
  else if (hostname.endsWith(".bilibili.com")) {
    disableWebRTC();
    // Fuck AVIF - Deprecated: https://paste.ee/p/3VnPBsPK
    // TODO: https://www.bilibili.com/blackboard/newplayer.html?autoplay=0&&musth5=1aid=...&page=...&cid=...
    if (/(?:\/s)?\/video\/(av|BV|bv)(\w+)/.test(pathname)) {
      // https://github.com/mrhso/IshisashiWebsite/blob/4108b25d9be21ce3925d88259f6b0fddaf594217/BVwhodoneit/index.html#L24C1-L101C3
      // prettier-ignore
      const abv={table:[..."FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"],base:58n,xor:23442827791579n,rangeLeft:1n,rangeRight:2n**51n,av2bv(t){let i=t;if("[object String]"===Object.prototype.toString.call(i)&&(i=parseInt(i.replace(/^[Aa][Vv]/u,""))),("[object BigInt]"===Object.prototype.toString.call(i)||Number.isInteger(i))&&!((i=BigInt(i))<this.rangeLeft||i>=this.rangeRight)){i=i+this.rangeRight^this.xor;let t=[..."BV1000000000"],e=11;for(;2<e;)t[e]=this.table[Number(i%this.base)],i/=this.base,--e;return[t[3],t[9]]=[t[9],t[3]],[t[4],t[7]]=[t[7],t[4]],t.join("")}},bv2av(t){let i="";if(12===t.length)i=t;else if(10===t.length)i="BV"+t;else{if(9!==t.length)return;i="BV1"+t}if(i.match(/^bv1[1-9A-z]{9}$/iu)){i=[...i],[i[3],i[9]]=[i[9],i[3]],[i[4],i[7]]=[i[7],i[4]];let t=0n,e=3;for(;e<12;)t=(t*=this.base)+BigInt(this.table.indexOf(i[e])),e+=1;if(!(t<this.rangeRight||t>=2n*this.rangeRight||(t=t-this.rangeRight^this.xor)<this.rangeLeft))return"av"+t}}};

      function getInfoFromPathname() {
        if (/(?:\/s)?\/video\/(av|BV|bv)(\w+)/.test(location.pathname)) {
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
          .then(resp => resp.json())
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
          GM_toast({ title, text: "已复制：" + link, timeout: 2000 });
        } else {
          GM_toast({ title, text: "无法获取短链接", timeout: 2000 });
        }
      }
      GM_registerMenuCommand("复制 AV 短链接", () => notify("av"));
      GM_registerMenuCommand("复制 BV 短链接", () => notify("bv"));
      GM_registerMenuCommand("查看视频封面", getVideoCover);
    } else if (hostname === "space.bilibili.com") {
      // Fuck Bilibili Article Waterfall
      if (/^\/\d+\/upload\/opus/.test(pathname)) {
        GM_registerMenuCommand("Fuck Waterfall", () => {
          // 原本的瀑布流内容是动态加载的。因此每次执行只能重新排序当前屏幕上显示的内容，否则需要刷新页面。
          let oldCtn = document.querySelector(".masonry_grid_v2");
          let newCtn = oldCtn.cloneNode(true);
          newCtn.classList.remove("masonry_grid_v2");
          newCtn.querySelectorAll(".container > .item").forEach(el => el.removeAttribute("style"));
          document.head.insertAdjacentHTML(
            "beforeEnd",
            `<style>.opus-feed .container { display: flex; flex-wrap: wrap; justify-content: flex-start; flex-direction: row; gap: 20px; } .opus-feed .item { width: 160px; margin-bottom: 20px; }</style>`
          );
          oldCtn.replaceWith(newCtn);
        });
      }
    } else if (hostname === "live.bilibili.com") {
      GM_registerMenuCommand("查看直播封面", async () => {
        const roomId = pathname.match(/^\/(?:h5\/)?(\d+)/)?.[1];
        if (roomId) {
          let coverUrl =
            window?.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover ||
            (await (await fetch("https://api.live.bilibili.com/room/v1/Room/get_info?room_id=" + roomId)).json())?.data?.user_cover;
          if (coverUrl) window.open(coverUrl);
        }
      });
    }
  }

  // Lofter
  else if (hostname.endsWith(".lofter.com")) {
    // Get user permanent link
    const getUid = () => document.getElementById("control_frame").src.match(/blogId=\d+/)?.[0];
    GM_registerMenuCommand("Get user permanent link", () => {
      const uid = getUid();
      if (!uid) return;
      const url = "https://www.lofter.com/mentionredirect.do?" + uid;
      GM_setClipboard(url);
      GM_toast(url + " Copied.");
    });
    // Hover to show image post publish time accurately
    const fetchArchivedPostsByTime = async (uid, t) => {
      const url = "https://www.lofter.com/dwr/call/plaincall/ArchiveBean.getArchivePostByTime.dwr";
      const headers = {
        referer: "https://www.lofter.com",
        "content-type": "application/x-www-form-urlencoded"
      };
      const body = `callCount=1\nscriptSessionId=\${scriptSessionId}187\nhttpSessionId=\nc0-scriptName=ArchiveBean\nc0-methodName=getArchivePostByTime\nc0-id=0\nc0-param0=boolean:false\nc0-param1=number:${uid}\nc0-param2=number:${t}\nc0-param3=number:50\nc0-param4=boolean:false\nbatchId=235018`;
      try {
        const response = await GM_fetch(url, {
          method: "POST",
          headers,
          body
        });
        const respText = response.responseText;
        return respText;
      } catch (error) {
        Logger.error("Error fetching data:", error);
        throw error;
      }
    };

    const argsEvalHandler = (_, __, arr) => {
      /* const len = arr.length;
        arr.forEach((obj, i) => {
          Object.assign(obj, eval(`s${i + len}`));
        }); */
      return arr;
    };
    const searchPostById = (pid, arr) => {
      /* new RegExp(`s(\\d{1,2})\\.id=${pid};`); */
      return arr.filter(p => p.id === pid)?.[0];
    };
    const parseResp = respText => {
      const regex = new RegExp("dwr\\.engine\\._remoteHandleCallback", "g");
      const matches = respText.match(regex);
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        return respText.replace(lastMatch, argsEvalHandler.name);
      }
      return;
    };
    const setTimeAsTitle = (e, t) => {
      e.setAttribute("title", new Date(t).toString());
    };
    const queryPost = async (uid, pid, e, t = new Date().getTime(), isLocalSearched = false) => {
      let keyName = `_user${uid}CachedTimeLine`,
        obj = window[keyName];
      if (!obj) {
        window[keyName] = { isFetchCompleted: false, posts: [] };
        return await queryPost(uid, pid, e, t, true);
      } else {
        let targetPost;
        if (!isLocalSearched) {
          targetPost = searchPostById(pid, obj.posts);
          if (targetPost) {
            setTimeAsTitle(e, targetPost.time);
            return;
          } else if (obj.isFetchCompleted) {
            Logger.warn(`User ${uid}'s timeline query is completed.`);
            return;
          }
        }
        let resp = await fetchArchivedPostsByTime(uid, t);
        resp = parseResp(resp);
        if (!resp) {
          Logger.error(`User ${uid}'s timeline query is failure.`);
          return;
        } else {
          let itemList = eval(resp),
            itemCount = itemList.length;
          targetPost = searchPostById(pid, itemList);
          window[keyName].posts.push(...itemList);
          if (targetPost) {
            setTimeAsTitle(e, targetPost.time);
          } else {
            Logger.warn(`Post ${pid} not found in ${itemCount} post(s) published before ${new Date(t).toString()}.`);
          }
          if (!itemCount || itemCount < 50) {
            Logger.warn(`User ${uid}'s timeline query is completed.`);
            window[keyName].isFetchCompleted = true;
            return;
          } else if (!targetPost) {
            return await queryPost(uid, pid, e, itemList[49].time, true);
          }
        }
      }
    };
    for (let e of document.querySelectorAll("a.imgclasstag > img[src*='.lf127.net/img/'], a[href*='.lofter.com/post/'] > img[src*='.lf127.net/img/']")) {
      const permaLink = e.parentElement.href.replace(/#$/, "").split("/").reverse()[0],
        [uidHex, pidHex] = permaLink.split("_"),
        uid = parseInt(uidHex, 16),
        pid = parseInt(pidHex, 16);
      await queryPost(uid, pid, e.parentElement);
    }
  }

  // Xiaohongshu
  else if (hostname === "www.xiaohongshu.com") {
    GM_registerMenuCommand("Get purged URL", () => {
      let url = new URL(window.location.href),
        xt = url.searchParams.get("xsec_token");
      if (xt) {
        url.search = "";
        url.searchParams.set("xsec_token", xt);
        url = url.href;
        GM_setClipboard(url);
        window.history.replaceState(null, "", url);
        GM_toast(url + " Copied.");
      }
    });
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

  // Fanbox add entry to Pixiv & Kemono
  else if (hostname.endsWith(".fanbox.cc")) {
    if (!hostname.startsWith("downloads.")) {
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

  // Gumroad add entry to Kemono
  else if (hostname.endsWith(".gumroad.com")) {
    const getUid = () => JSON.parse(document.querySelector("script[data-component-name='Profile']")?.textContent)?.creator_profile.external_id;
    GM_registerMenuCommand("Get user permanent link", () => {
      const uid = getUid();
      if (!uid) return;
      const url = "https://gumroad.com/" + uid;
      GM_setClipboard(url);
      GM_toast(url + " Copied.");
    });
    GM_registerMenuCommand("View user on Kemono", () => {
      let uid = getUid();
      if (uid) window.open(`https://kemono.party/gumroad/user/${uid}`, "_blank");
    });
  }

  // Patreon
  else if (hostname === "www.patreon.com") {
    if (pathname.startsWith("/posts/")) return;
    const getUid = () => patreon?.bootstrap?.campaign?.data?.relationships?.creator?.data?.id;
    GM_registerMenuCommand("Get user permanent link", () => {
      const uid = getUid();
      if (!uid) return;
      const url = "https://www.patreon.com/user?u=" + uid;
      GM_setClipboard(url);
      GM_toast(url + " Copied.");
    });
    GM_registerMenuCommand("View user on Kemono", () => {
      const uid = getUid();
      if (!uid) return;
      window.open(`https://kemono.party/patreon/user/${uid}`, "_blank");
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
          'a[href="/i/premium_sign_up"], a[href="/jobs"], a[href="/settings/monetization"], a[href="https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb"], div[role=presentation]:has(a[href*="/highlights"]), div[data-testid=sidebarColumn] div[tabindex="0"] > div > div:has(a[href="/i/verified-choose"]), div[data-testid=sidebarColumn] div[tabindex="0"] > div > div:has(a[href="/i/trends"]) { display: none !important; } ' +
          // Blink multiple images media grid
          '@keyframes colorCycle{0%,100%{fill:black}50%{fill:white}}[id^=verticalGridItem-][id$="-profile-grid-0"] a svg{animation:2s infinite colorCycle}' +
          "</style>"
      );
    }
    const getUID = (short = true) => {
      const id = JSON.parse(document.head.querySelector('script[data-testid="UserProfileSchema-test"]')?.textContent || null)?.mainEntity?.identifier;
      if (id) {
        const preifx = short ? "https://x.com/i/user/" : "https://x.com/intent/user?user_id=";
        const url = preifx + id;
        GM_setClipboard(url);
        GM_toast(url + " Copied.");
      } else GM_toast("UID not found.");
    };
    GM_registerMenuCommand("Get user permanent link", () => getUID());
    GM_registerMenuCommand("Get user permanent linkᴸ", () => getUID(0));
    GM_registerMenuCommand("Get tweet publish time via snowflake ID", () => {
      // https://github.com/oduwsdl/tweetedat/blob/eae40b65ac99a05b596e75ac7ed015ee6134ab82/script/TimestampEstimator.py#L213
      const tid = Number(location.pathname.split("/status/")?.[1]);
      if (tid) {
        if (tid < 29700859247) window.open("https://oduwsdl.github.io/tweetedat/#" + String(tid));
        else {
          let ts = (BigInt(tid) >> 22n) + 1288834974657n;
          prompt("Unix Timestamp, ISO String:", `${String(ts)}, ${new Date(Number(ts)).toISOString()}`);
        }
      }
    });
    // Twitter Video Downloader - Legacy code: https://paste.ee/p/AtvoT
    // Reference: https://greasyfork.org/scripts/495368/code
    ({
      init() {
        document.head.insertAdjacentHTML("beforeend", `<style>${this.css}</style>`);
        let observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))));
        observer.observe(document.body, { childList: true, subtree: true });
        GM_registerMenuCommand("Manually detect media", () => {
          document.querySelectorAll("article").forEach(el => this.detect(el, true));
        });
      },
      detect: function (node, again = false) {
        let article = (node.tagName == "ARTICLE" && node) || (node.tagName == "DIV" && (node.querySelector("article") || node.closest("article")));
        if (article) {
          if (again && !article.querySelector(".twvf")) {
            this.addButton(article);
          } else if (!article.dataset.detected) {
            article.dataset.detected = "true";
            this.addButton(article);
          }
        }
      },
      addButton(article) {
        let mediaSelector = [
          ':not(div[role="link"]) div[role="progressbar"]',
          'button[data-testid="playButton"]', // For Data Saver Enabled
          'button[data-testid="captionsToggle"]' // For Audio
        ];
        let hasVideoMedia = article.querySelector(mediaSelector.join(", "));
        if (hasVideoMedia) {
          let tweetId = article.querySelector('a[href*="/status/"]').href.split("/status/").pop().split("/").shift();
          let buttonGroup = article.querySelector('div[role="group"]:last-of-type');
          let lastButton = Array.from(buttonGroup.querySelectorAll(":scope>div>div")).pop().parentNode;
          let buttonToShow = lastButton.cloneNode(true);
          buttonToShow.querySelector("button").removeAttribute("disabled");
          buttonToShow.querySelector("svg").innerHTML = this.svg;
          buttonToShow.title = "Get video link";
          this.status(buttonToShow, "twvf");
          this.status(buttonToShow, "fetch");
          lastButton.insertAdjacentElement("beforebegin", buttonToShow);
          buttonToShow.onclick = () => this.click(buttonToShow, tweetId);
        }
      },
      async click(el, tid) {
        if (el.classList.contains("loading")) return;
        this.status(el, "loading");
        let tweet = await this.fetchTweet(tid);
        let info = [];
        let { extended_entities, card } = tweet.legacy;
        if (extended_entities) {
          info = extended_entities.media.filter(i => i.type === "video" || i.type === "animated_gif").map(i => i.video_info.variants);
        } else if (card) {
          // Maybe only show 1 video in cart type tweet
          info = JSON.parse(card.binding_values.unified_card.string_value).media_entities;
          const keyName = Object.keys(info)[0];
          info = [info[keyName].video_info.variants];
        } else {
          Logger.log("No source found in API response.");
          el.remove();
          return;
        }
        let videoUrls = info.map(meta => meta.filter(i => i.content_type === "video/mp4").sort((a, b) => b.bitrate - a.bitrate)[0].url);
        Logger.log(videoUrls);
        if (videoUrls.length) {
          this.status(el, "fetch");
          this.dialog(el, videoUrls);
        }
      },
      dialog(el, data) {
        const dialogEl = document.createElement("div");
        dialogEl.classList.add("twvf-dialog");
        dialogEl.innerHTML = data.map(url => `<p><a href="${url}">${url}</a></p>`).join("");
        const rect = el.getBoundingClientRect();
        dialogEl.style.top = `${rect.top + window.scrollY - 56}px`;
        document.body.appendChild(dialogEl);
        document.addEventListener(
          "click",
          function handle(event) {
            const clickedEl = event.target;
            if (!dialogEl.contains(clickedEl)) {
              document.removeEventListener("click", handle, true);
              event.stopImmediatePropagation();
              event.preventDefault();
              dialogEl.remove();
            } else return;
          },
          true
        );
      },
      status: function (button, css) {
        button.classList.remove("fetch", "loading");
        button.classList.add(css);
      },
      async fetchTweet(tid) {
        let baseUrl = `https://${hostname}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId`;
        let variables = {
          tweetId: tid,
          with_rux_injections: false,
          includePromotedContent: true,
          withCommunity: true,
          withQuickPromoteEligibilityTweetFields: true,
          withBirdwatchNotes: true,
          withVoice: true,
          withV2Timeline: true
        };
        let features = {
          rweb_lists_timeline_redesign_enabled: true,
          responsive_web_graphql_exclude_directive_enabled: true,
          verified_phone_label_enabled: false,
          creator_subscriptions_tweet_preview_api_enabled: true,
          responsive_web_graphql_timeline_navigation_enabled: true,
          responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
          tweetypie_unmention_optimization_enabled: true,
          responsive_web_edit_tweet_api_enabled: true,
          graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
          view_counts_everywhere_api_enabled: true,
          longform_notetweets_consumption_enabled: true,
          responsive_web_twitter_article_tweet_consumption_enabled: false,
          tweet_awards_web_tipping_enabled: false,
          freedom_of_speech_not_reach_fetch_enabled: true,
          standardized_nudges_misinfo: true,
          tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
          longform_notetweets_rich_text_read_enabled: true,
          longform_notetweets_inline_media_enabled: true,
          responsive_web_media_download_video_enabled: false,
          responsive_web_enhance_cards_enabled: false
        };
        let url = encodeURI(`${baseUrl}?variables=${JSON.stringify(variables)}&features=${JSON.stringify(features)}`);
        let headers = {
          authorization: "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
          "x-twitter-active-user": "yes",
          "x-twitter-client-language": Cookie.get("lang"),
          "x-csrf-token": Cookie.get("ct0")
        };
        let tweetDetail = await fetch(url, { headers: headers }).then(result => result.json());
        let result = tweetDetail.data.tweetResult.result;
        return result.tweet || result;
      },
      css: `
  .twvf {margin-right: 8px; margin-left: 2px;}
  .twvf:hover > div > div > div > div {color: rgba(29, 161, 242, 1.0);}
  .twvf:hover > div > div > div > div > div {background-color: rgba(29, 161, 242, 0.1);}
  .twvf:active > div > div > div > div > div {background-color: rgba(29, 161, 242, 0.2);}
  .twvf:hover svg {color: rgba(29, 161, 242, 1.0);}
  .twvf:hover div:first-child:not(:last-child) {background-color: rgba(29, 161, 242, 0.1);}
  .twvf:active div:first-child:not(:last-child) {background-color: rgba(29, 161, 242, 0.2);}
  .twvf g {display: none;}
  .twvf.fetch g.fetch, .twvf.loading g.loading {display: unset;}
  .twvf.loading svg {animation: spin 1s linear infinite;}
  @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
  .twvf-dialog {position: absolute; z-index: 0; transform: translateX(10vw); width: 80vw; max-width: fit-content; height: auto; left: 0; border-radius: 12px; padding: 12px; background-color: white; box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;}
  .twvf-dialog > p {overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
  .twvf-dialog a {text-decoration: none; color: rgb(29, 155, 240);}
  .twvf-dialog a:hover {text-decoration: underline;}
  @media (prefers-color-scheme: dark) {
  .twvf-dialog {background-color: black; box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px;}
  }`,
      svg: `
  <g class="fetch"><path d="M18.36 5.64a4.985 4.985 0 0 0-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41a4.985 4.985 0 0 0 0-7.07zm-2.12 3.53-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71 1.42-1.42 1.41 1.42-1.41 1.41a4.985 4.985 0 0 0 0 7.07 4.985 4.985 0 0 0 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"/></g>
  <g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="#1DA1F2" stroke-width="4" opacity="0.4" /><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round" /></g>
  `
    }).init();
  }

  // Github
  else if (hostname === "github.com") {
    {
      const checkMark =
        "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z";
      document.addEventListener("click", e => {
        const target = e.target,
          tagName = e.target.tagName;
        const path = tagName === "svg" ? target.querySelector("path") : tagName === "path" ? target : null;
        if (path) {
          const div = target.closest("div.react-directory-filename-column");
          if (div) {
            const d = path.getAttribute("d");
            if (d === checkMark) return;
            const name = div.querySelector("div.react-directory-filename-cell a");
            GM_setClipboard(name.textContent);
            console.log(name);
            path.setAttribute("d", checkMark);
            setTimeout(() => {
              path.setAttribute("d", d);
            }, 1e3);
          }
        }
      });
    }
    const generateCmd = shellType => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      let owner,
        repo,
        branch,
        basePath = "";

      if (parts.length === 2) {
        // https://github.com/user/repo
        [owner, repo] = parts;
        branch = document.querySelector("div.ref-selector-button-text-container span")?.textContent?.trim();
        if (!branch) return GM_toast("Can't find branch info.");
      } else if (parts.length >= 4 && parts[2] === "tree") {
        // https://github.com/user/repo/tree/branch[/optional/path]
        [owner, repo, , branch] = parts;
        basePath = parts.slice(4).join("/");
      } else return GM_toast("Unsupported page.");

      const ruleInput = prompt(
        "Please enter the path (which can be a file or directory) you want to sparse-checkout (separated by spaces):",
        basePath || ""
      ).trim();
      if (!ruleInput) return;

      const rules = ruleInput
        .split(/\s+/)
        .map(r => r.trim())
        .filter(Boolean);
      const joinedRules = rules
        .map(s => {
          if (shellType === "bash") return `"${s.replace(/"/g, '\\"')}"`;
          return `"${s}"`;
        })
        .join(shellType === "powershell" ? "`n" : " ");
      const EOL = shellType === "cmd" ? "\r\n" : "\n";
      const cd = shellType === "powershell" ? `Set-Location "${repo}"` : `cd "${repo}"`;

      const scriptLines = [
        `git clone -n --depth=1 --filter=tree:0 https://github.com/${owner}/${repo}.git`,
        cd,
        `git sparse-checkout init --no-cone`,
        `git sparse-checkout set ${joinedRules}`,
        `git checkout ${branch}`
      ];
      const finalScript = scriptLines.join(EOL);
      GM_setClipboard(finalScript);
      GM_toast("Sparse-checkout command copied.");
    };

    GM_registerMenuCommand("git sparse-checkout (CMD)", () => generateCmd("cmd"));
    GM_registerMenuCommand("git sparse-checkout (PowerShell)", () => generateCmd("powershell"));
    GM_registerMenuCommand("git sparse-checkout (Git Bash)", () => generateCmd("bash"));
  }

  // Facebook
  else if (hostname.endsWith(".facebook.com")) {
    const getUid = () => {
      let scriptEl = Array.prototype.filter.call(document.getElementsByTagName("script"), el => {
        return el.innerText.indexOf('"owning_profile_id"') > -1 || el.innerText.indexOf('"pageID"') > -1;
      })?.[0];
      let matched = scriptEl?.innerText?.match(/"pageID":\s*?(\d+)|"owning_profile_id":\s*?"(\d+)"/);
      return matched?.[1] || matched?.[2];
    };
    GM_registerMenuCommand("Get profile ID link", () => {
      const uid = getUid();
      if (!uid) return;
      const url = "https://www.facebook.com/" + uid;
      GM_setClipboard(url);
      GM_toast(url + " Copied.");
    });
    GM_registerMenuCommand("Get profile ID linkᴸ", () => {
      const uid = getUid();
      if (!uid) return;
      const url = "https://www.facebook.com/profile.php?id=" + uid;
      GM_setClipboard(url);
      GM_toast(url + " Copied.");
    });
  }

  // SauceNAO
  else if (hostname === "saucenao.com") {
    const tBody = document.body;
    if (tBody.innerText.indexOf("Access to specified file was denied") > -1) {
      tBody.innerText += "\nGO BACK TO START IN 3S...";
      setTimeout(() => {
        location.href = "/";
      }, 3000);
    }
    document.querySelectorAll("div#yourimageretrylinks > a").forEach(a => a.setAttribute("target", "_blank"));
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

  // Yandex Image Search
  else if (hostname === "yandex.com") {
    // Disable content filter
    const mode = Cookie.get("yp")?.split("sp.family:")?.[1]?.[0];
    if (mode !== "0") {
      let tip = "Search Mode: ";
      if (mode === "2") tip += "Family mode 🔴";
      if (!mode) tip += "Moderate filter 🟡";
      GM_toast(tip);
      fetch("https://yandex.com/tune/search")
        .then(r => r.text())
        .then(html => {
          let sk = html.match(/&quot;sk&quot;:&quot;(\w{33})&quot;/)?.[1];
          if (sk) {
            fetch("https://yandex.com/portal/set/tune/", {
              headers: {
                "content-type": "application/x-www-form-urlencoded"
              },
              body: "family=0&fields=my_request_in_suggest%2Cfamily&sk=" + sk,
              method: "POST"
            }).then(async r => {
              if (r.ok) {
                GM_toast("Search Mode changed.");
                await wait(1000).then(() => location.reload());
              }
            });
          } else GM_toast("Error: `sk` not found.");
        });
    }
    // Region Fix
    if (document.querySelector("body > h1")?.innerText?.startsWith("The\u00A0service\u00A0is under construction.")) {
      fetch("https://yandex.com/tune/geo")
        .then(r => r.text())
        .then(html => {
          let sk = html.match(/&quot;sk&quot;:&quot;(\w{33})&quot;/)?.[1];
          if (sk) {
            return redirect(`https://yandex.com/portal/set/region/?name=Tokyo&id=10636&sk=${sk}&retpath=${encodeURIComponent(src)}`);
          }
        });
    }
  }

  // Danbooru Ehance
  else if (hostname.endsWith(".donmai.us")) {
    // Banned post helper
    {
      if (/\/posts\/\d+/.test(location.pathname)) {
        const p = document.querySelector("#page > p:last-child");
        if (p && p.innerText === "This page has been removed because of a takedown request.") {
          p.innerText = "Fetching data...";
          try {
            let html = await (
              await fetch(location, {
                headers: { "X-CSRF-Token": Danbooru.Utility.meta("csrf-token") }
              })
            ).text();
            // rails-ujs not broken; window not working somtimes
            unsafeWindow._rails_loaded = false;
            document.open();
            document.write(html);
            document.close();
            await wait(1000);
          } catch (e) {
            console.error("Error:", e);
          }
        }
      } else if (location.pathname === "/posts") {
        const p = document.querySelector("#page > p:last-child");
        if (p && p.innerText.indexOf("takedown request") > -1) {
          let tag = new URL(src).searchParams.get("tags")?.trim();
          tag = tag.replace(/(status|is|has|user):\w+\b/gi, "").trim();
          if (tag) {
            let url = new URL(`https://${hostname}/artists/show_or_new`);
            url.searchParams.set("name", tag);
            location.href = url;
          }
        }
        if (document.body.classList.contains("a-index")) {
          const postContainer = document.querySelector("#posts > div.post-gallery > div.posts-container");
          if (postContainer) {
            const userPerPage = Danbooru.CurrentUser.data("per-page");
            const postCount = postContainer.children.length;
            if (postCount !== userPerPage) {
              let newUrl = new URL(location);
              let searchText = (newUrl.searchParams.get("tags") || document.getElementById("tags").value).trim();
              if (!/\border:random\b/.test(searchText)) {
                const showDeleted = /\bstatus:(deleted|any)\b/.test(searchText) || Danbooru.CurrentUser.data("show-deleted-posts");
                newUrl.pathname = "/posts.json";

                const iconsHash = document.querySelector("a#close-notice-link use").href.baseVal.split(/-|\./)[1];
                const hideScore = Danbooru.Cookie.get("post_preview_show_votes") == "false";
                const postPreviewSize = Danbooru.Cookie.get("post_preview_size") || "180";

                // prettier-ignore
                const thumbnailData={variants:[{type:"180x180",url:"https://cdn.donmai.us/180x180/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.jpg",width:180,height:135,file_ext:"jpg"},{type:"360x360",url:"https://cdn.donmai.us/360x360/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.jpg",width:360,height:270,file_ext:"jpg"},{type:"720x720",url:"https://cdn.donmai.us/720x720/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.webp",width:720,height:540,file_ext:"webp"}]}
                let matchedThumbnailSize;
                switch (postPreviewSize) {
                  case "150":
                  case "180":
                    matchedThumbnailSize = "180x180";
                    break;
                  case "225":
                  case "270":
                  case "360":
                    matchedThumbnailSize = "360x360";
                    break;
                  case "720":
                    matchedThumbnailSize = "720x720";
                  default:
                    break;
                }
                let { width, height, url } = thumbnailData.variants.filter(info => {
                  return info.type === matchedThumbnailSize;
                })[0];

                let a = document.createElement("a");
                a.id = "check_banned_posts";
                a.href = "#";
                a.title = "Shortcut is c";
                a.setAttribute("data-shortcut", "c");
                a.innerHTML = "<i>Banned</i>";
                document.getElementById("show-posts-link").closest("li").insertAdjacentElement("beforeend", a);
                Danbooru.Shortcuts.initialize_data_shortcuts();

                const parsingPostData = ({ id, uploader_id, score, rating, tag_string, is_pending, is_flagged, is_deleted, has_children, parent_id }) => {
                  const dataFlag = is_pending ? "pending" : is_flagged ? "flagged" : is_deleted ? "deleted" : "";
                  const isBlacklisted = Danbooru.Blacklist.entries.some(entry => {
                    if (entry.disabled) {
                      return false;
                    }
                    let tags = Danbooru.Utility.splitWords(tag_string);
                    tags.push("rating:" + rating);
                    tags.push("uploaderid:" + uploader_id);
                    tags.push("status:" + dataFlag);
                    let score_test = entry.min_score === null || score < entry.min_score;
                    return (
                      Danbooru.Utility.is_subset(tags, entry.require) &&
                      score_test &&
                      (!entry.optional.length || Danbooru.Utility.intersect(tags, entry.optional).length) &&
                      !Danbooru.Utility.intersect(tags, entry.exclude).length
                    );
                  });

                  const classList = ["post-preview", "post-preview-" + postPreviewSize, "post-preview-fit-compact", "blacklisted"];
                  !hideScore && classList.push("post-preview-show-votes");
                  is_pending && classList.push("post-status-pending");
                  is_flagged && classList.push("post-status-flagged");
                  is_deleted && classList.push("post-status-deleted");
                  has_children && classList.push("post-status-has-children");
                  parent_id && classList.push("post-status-has-parent");
                  isBlacklisted && classList.push("blacklisted-active");
                  const scorePart = hideScore
                    ? ""
                    : `<div class="post-preview-score text-sm text-center mt-1">
                    <span class="post-votes inline-flex gap-1" data-id="${id}">
                    <a class="post-upvote-link inactive-link" data-remote="true" rel="nofollow" data-method="post" href="/posts/${id}/votes?score=1">
                    <svg class="icon svg-icon upvote-icon" viewBox="0 0 448 512">
                    <use fill="currentColor" href="/packs/static/icons-${iconsHash}.svg#arrow-alt-up"></use>
                    </svg></a>
                    <span class="post-score inline-block text-center whitespace-nowrap align-middle min-w-4">
                    <a rel="nofollow" href="/post_votes?search%5Bpost_id%5D=${id}&amp;variant=compact">${score}</a></span>
                    <a class="post-downvote-link inactive-link" data-remote="true" rel="nofollow" data-method="post" href="/posts/${id}/votes?score=-1">
                    <svg class="icon svg-icon downvote-icon" viewBox="0 0 448 512">
                    <use fill="currentColor" href="/packs/static/icons-${iconsHash}.svg#arrow-alt-down"></use>
                    </svg></a></span></div>`;
                  return `<article id="post_${id}"
                    class="${classList.join(" ")}" data-id="${id}" data-tags="${tag_string}" data-rating="${rating}" data-flags="${dataFlag}"
                    data-score="${score}" data-uploader-id="${uploader_id}">
                    <div class="post-preview-container">
                    <a class="post-preview-link" draggable="false" href="/posts/${id}">
                    <picture>
                    <img src="${url}" width="${width}" height="${height}" class="post-preview-image" title=""
                    alt="post #${id}" draggable="false" aria-expanded="false"
                    data-title="${tag_string} rating:${rating} score:${score}">
                    </picture></a></div>
                    ${scorePart}
                    </article>`;
                };

                a.addEventListener("click", function (event) {
                  event.preventDefault();
                  a.innerHTML = "<i>Checking...</i>";
                  fetch(newUrl)
                    .then(response => response.json())
                    .then(posts => {
                      let bannedPostsCount = posts.filter(post => post.is_banned === true).length;
                      if (!showDeleted) posts = posts.filter(post => !post.is_deleted);
                      let currentPosts = Array.from(postContainer.children);
                      const currentPostIds = currentPosts.map(el => {
                        return Number(el.getAttribute("data-id"));
                      });
                      currentPostIds.push(0);
                      let idx = 0,
                        bannedToShow = 0,
                        postsLength = posts.length;
                      currentPostIds.forEach((pid, index) => {
                        let htmlToInsert = "";
                        for (; idx < postsLength; idx++) {
                          let post = posts[idx];
                          if (post.id !== pid) {
                            if (post.is_banned) {
                              htmlToInsert += parsingPostData(post);
                              bannedToShow++;
                            }
                          } else break;
                        }
                        if (htmlToInsert) {
                          if (pid === 0) {
                            postContainer.insertAdjacentHTML("beforeend", htmlToInsert);
                          } else currentPosts[index].insertAdjacentHTML("beforebegin", htmlToInsert);
                        }
                      });
                      let msg = "";
                      if (bannedPostsCount === 0 && bannedToShow === 0) msg = "No banned posts found.";
                      else if (bannedToShow === 0 && bannedPostsCount > bannedToShow) {
                        if (bannedPostsCount === 1) msg = "1 banned post found.";
                        else msg = `${bannedPostsCount} banned posts found.`;
                      } else {
                        if (bannedToShow === 1) msg = "Show 1 banned post.";
                        else msg = `Show ${bannedToShow} banned posts.`;
                        if (bannedPostsCount != bannedToShow) {
                          msg += ` ${bannedPostsCount} posts found in total.`;
                        }
                      }
                      Danbooru.Utility.notice(msg);
                      $(a)
                        .html('<i style="color:var(--success-color)">Finished.</i>')
                        .fadeOut("slow", function () {
                          $(this).remove();
                        });
                    })
                    .catch(e => {
                      console.error("Error:", e);
                      a.innerHTML = '<i style="color:var(--error-color)">Failure</i>';
                    });
                });
              }
            }
          }
        }
      }
    }
    document.querySelectorAll("a.post-preview-link").forEach(a => (a.draggable = true)); // Fix for gesture plugin
    // Enable non-view mode on current page only
    document.querySelector("#mode-box select")?.addEventListener("change", () => setTimeout(() => localStorage.setItem("mode", "view")));
    document.addEventListener("click", event => {
      const el = event.target;
      if (el.tagName === "SPAN" && el.classList.contains("post-count") && !el.parentElement.classList.contains("ui-menu-item-wrapper")) {
        const tagStr = el.parentElement.dataset.tagName || el.previousElementSibling.innerText.replace(/\s+/g, "_");
        if (tagStr) {
          const msg = `Tag <b><i>${tagStr}</i></b> copied.`;
          unsafeWindow.Danbooru.Utility.copyToClipboard(tagStr, msg);
        }
      }
    });
    // Convert full-width characters to half-width in search bar or tag edit textbox
    // Legacy code: https://paste.ee/p/Eds99Iey
    {
      const replacementMap = new Map([
        ["——", "_"],
        ["（", "("],
        ["）", ")"],
        ["：", ":"],
        ["‘", "'"],
        ["’", "'"],
        ["“", '"'],
        ["”", '"']
      ]);
      const maxMatchLength = Math.max(...[...replacementMap.keys()].map(k => k.length));
      const contentEditableElements = document.querySelectorAll("input[data-autocomplete='tag-query'], textarea[data-autocomplete='tag-edit']");
      contentEditableElements.forEach(el => {
        el.addEventListener("input", function (e) {
          if (e.inputType && e.inputType.startsWith("delete")) return;
          const target = e.target;
          setTimeout(() => {
            let value = target.value;
            const cursorPos = target.selectionStart;

            for (let len = Math.min(maxMatchLength, cursorPos); len >= 1; len--) {
              const before = value.slice(cursorPos - len, cursorPos);
              if (replacementMap.has(before)) {
                const replacement = replacementMap.get(before);
                value = value.slice(0, cursorPos - len) + replacement + value.slice(cursorPos);
                target.value = value;
                cursorPos = cursorPos - len + replacement.length;
                target.setSelectionRange(cursorPos, cursorPos);
              }
            }
          }, 0);
        });
      });
    }
    // Auto Save Danbooru Upload Content
    const autoSave = {
      db: null,
      assetId: null,
      DB_STORE_NAME: "savedContentFromUploadPage",
      async init() {
        if (pathname.startsWith("/posts/") && !pathname.endsWith(".xml") && !pathname.endsWith(".json")) {
          this.assetId =
            document.querySelector("#related-tags-container")?.getAttribute("data-media-asset-id") ||
            document.querySelector("#post-info-size > a[href^='/media_assets/']")?.href.split("/media_assets/")[1];
          await this.openDB();
          this.remove(this.assetId);
        } else if (/^\/uploads\/\d+$/.test(pathname) || /^\/uploads\/\d+\/assets\/\d+/.test(pathname)) {
          this.assetId =
            document.querySelector("#media_asset_id")?.value || document.querySelector("#related-tags-container")?.getAttribute("data-media-asset-id");

          await this.openDB();

          const saved = await this.load();
          if (saved) {
            delete saved.asset_id;
            for (let elementName in saved) {
              const value = saved[elementName];
              if (elementName === "post_rating") {
                document.querySelector(`#${elementName}_${value}`).checked = true;
              } else {
                document.querySelector(`#${elementName}`).value = value;
              }
            }
            document.querySelector("#post_tag_string").dispatchEvent(new InputEvent("input"));
          }

          document.addEventListener("input", event => {
            let el = event.target;
            let { id, value } = el;
            switch (id) {
              case "post_rating_g":
              case "post_rating_s":
              case "post_rating_q":
              case "post_rating_e":
                this.save({ post_rating: id.slice(-1) });
                break;
              case "post_tag_string":
                value = value.trim() + " ";
              // case "post_source":
              // case "post_artist_commentary_title":
              // case "post_artist_commentary_desc":
              case "post_translated_commentary_title":
              case "post_translated_commentary_desc":
              case "post_parent_id":
                this.save({ [id]: value });
                break;
              default:
                break;
            }
          });

          const tagTextarea = document.querySelector("#post_tag_string");
          document.querySelector("#related-tags-container").addEventListener("click", event => {
            const el = event.target;
            if ((el.tagName === "A" || el.tagName === "INPUT") && el.closest("ul")?.className === "tag-list") {
              setTimeout(() => {
                const event = new Event("input", { bubbles: true });
                tagTextarea.dispatchEvent(event);
              });
            }
          });
        }
      },
      openDB() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open("AutoSavedDB", 1);
          request.onupgradeneeded = event => {
            this.db = event.target.result;
            if (!this.db.objectStoreNames.contains(this.DB_STORE_NAME)) {
              this.db.createObjectStore(this.DB_STORE_NAME, {
                keyPath: "asset_id"
              });
            }
          };
          request.onsuccess = event => {
            this.db = event.target.result;
            resolve();
          };
          request.onerror = event => reject(event.target.errorCode);
        });
      },
      save(content) {
        const objectStore = this.db.transaction(this.DB_STORE_NAME, "readwrite").objectStore(this.DB_STORE_NAME);
        const request = objectStore.get(this.assetId);
        request.onsuccess = event => {
          const updatedData = Object.assign({ asset_id: this.assetId }, event.target.result, content);
          objectStore.put(updatedData);
        };
      },
      load() {
        return new Promise((resolve, reject) => {
          const request = this.db.transaction(this.DB_STORE_NAME, "readonly").objectStore(this.DB_STORE_NAME).get(this.assetId);

          request.onsuccess = event => resolve(event.target.result);
          request.onerror = event => reject(event.target.errorCode);
        });
      },
      remove() {
        this.db.transaction(this.DB_STORE_NAME, "readwrite").objectStore(this.DB_STORE_NAME).delete(this.assetId);
      }
    };
    autoSave.init();
    if (pathname.startsWith("/posts/")) {
      const postId = document.body?.dataset["postId"] || document.head.querySelector("meta[name='post-id']").getAttribute("content");
      let image = document.querySelector("picture > img#image");
      if (image) {
        dragElement(image);
      }
      document.querySelector("div#a-show")?.addEventListener("click", e => {
        if (e.target.classList.contains("image-view-original-link")) {
          document.querySelector("picture > img#image").classList.remove("fit-width");
        }
      });
      // Add more data to info section
      {
        const size = document.querySelector("#post-info-size > a:last-child");
        size.previousSibling.data = size.previousSibling.data.replace("x", "×");
        // Search via MD5 - Deprecated: https://paste.ee/p/QzILE
        const time = document.querySelector("#post-info-date time");
        const node = time.parentNode.previousSibling;
        const span = document.createElement("span");
        span.textContent = node.textContent;
        time.closest("li").replaceChild(span, node);
        span.addEventListener("click", () => {
          const title = time.title;
          time.title = time.innerText;
          time.innerText = title;
        });
        if (postId) {
          const p1 = fetch("https://isshiki.donmai.us/post_views/" + postId)
            .then(resp => resp.text())
            .then(text => {
              if (/^\d+$/.test(text)) {
                document.getElementById("post-info-score")?.insertAdjacentHTML("afterend", `<li id="post-info-views">Views: ${text}</li>`);
              }
              resolve();
            });
          /* const p2 = fetch("/favorite_groups.json?only=id&limit=100&search%5Bpost_ids_include_all%5D=" + postId)
            .then(resp => resp.json())
            .then(json => {
              if (Array.isArray(json)) {
                let len = json.length;
                len = len === 100 ? len + "+" : len;
                if (len !== 0)
                  document
                    .getElementById("post-info-favorites")
                    ?.insertAdjacentHTML(
                      "afterend",
                      `<li id="post-info-favgroups">Favgroups: <a href="/favorite_groups?search%5Bpost_ids_include_all%5D=${postId}" target="_blank">${len}</a></li>`
                    );
              }
              resolve();
            }); */
          const p3 = fetch("https://danbooru.donmai.us/post_versions.json?limit=2&search%5Bpost_id%5D=" + postId)
            .then(resp => resp.json())
            .then(json => {
              if (Array.isArray(json) && json.length > 1) {
                document
                  .getElementById("post-info-status")
                  .insertAdjacentHTML(
                    "beforebegin",
                    `<li id="post-info-version" title="Latest update: ${json?.[0].updated_at}">Version: <a href="/post_versions?search%5Bpost_id%5D=${postId}" target="_blank">${json[0].version}</a></li>`
                  );
              }
              resolve();
            });
          Promise.allSettled([p1, /* p2, */ p3]).then(() => $("#post-information").fadeOut("fast").fadeIn("fast"));
        }
      }
      // Add a button to remove post in a favorite group to the end of the favorite group navi bar
      {
        let noticeSearchBar = document.querySelector(".post-notice-search"),
          favBars = noticeSearchBar?.querySelectorAll(".favgroup-navbar") || [],
          headers = {
            "X-CSRF-Token": unsafeWindow.Danbooru.Utility.meta("csrf-token")
          };
        if (favBars.length) {
          document.head.insertAdjacentHTML(
            "beforeend",
            `<style>.post-notice-search>.favgroup-navbar{display:flex;align-items:center}.favgroup-navbar>.favgroup-name{white-space:normal!important}.favgroup-navbar:hover .fav-remove-link{opacity:1}.favgroup-navbar .fav-remove-link{opacity:0}.fav-remove-link{color:var(--button-danger-background-color)}.fav-remove-link:hover{color:var(--button-danger-hover-background-color)}</style>`
          );
          let xhref = document.querySelector(".icon.svg-icon.close-icon > use").href.baseVal;
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
                    const url = encodeURI(`https://${hostname}/posts?tags=favgroup:"${matched[2]}"`);
                    const text = matched[1] + `<a href="${url}">${matched[2]}</a>`;
                    unsafeWindow.Danbooru.notice(text);
                    fav.remove();
                    if (noticeSearchBar.children.length === 0) noticeSearchBar.remove();
                  }
                });
            });
          });
        }
      }
      // Show Position and Dimensions on Note Box Changes
      {
        const hook = methodName => {
          unsafeWindow.Danbooru.Note.Box.prototype["hooked" + methodName] = unsafeWindow.Danbooru.Note.Box.prototype[methodName];
          unsafeWindow.Danbooru.Note.Box.prototype[methodName] = function () {
            this["hooked" + methodName](...arguments);
            const { id, x, y, w, h } = this.note;
            const prefix = id
              ? `<a href="/notes/${id}" target="_blank">Note #${id}</a> <a href="/note_versions?search%5Bnote_id%5D=${id}" target="_blank">»</a>`
              : "Current note";
            unsafeWindow.Danbooru.Utility.notice(
              `${prefix} changed: <code style="background-color: transparent;">x: ${x}, y: ${y}, w: ${w}, h: ${h}</code></span>`
            );
          };
        };
        // `place_note()` shouldn't be directly hooked; otherwise, a notice will be shown every time the page loads.
        hook("on_dragstop");
        hook("key_nudge");
        hook("key_resize");
      }
    } else if (pathname.startsWith("/artists/")) {
      if (document.body.dataset["artistId"]) {
        const el = document.querySelector("li#subnav-posts");
        const url = el.children[0].href.replace("posts?tags=", "post_versions?search%5Bchanged_tags%5D=");
        if (url) el.insertAdjacentHTML("afterend", '<li id="subnav-postchanges"><a id="subnav-postchanges-link" href="' + url + '">Post changes</a></li>');
      }
    } else if (pathname.startsWith("/media_assets/") || pathname.startsWith("/uploads/")) {
      const mediaAssetPanzoom = {
        isDashed: false,
        get media() {
          return document.querySelector(".media-asset-image");
        },
        init() {
          this.mediaInit();
          this.loadScript();
        },
        get initCheck() {
          return (
            document.querySelector(".media-asset-component")?.getAttribute("data-dynamic-height-initialized") === "true" &&
            ((this.media?.tagName === "VIDEO" && this.media.readyState === 4) ||
              (this.media?.tagName === "IMG" && this.media.complete === true && this.media.naturalHeight !== 0))
          );
        },
        loadScript() {
          let script = unsafeWindow.document.createElement("script");
          script.src = "//unpkg.com/panzoom@9.4.3/dist/panzoom.min.js";
          unsafeWindow.document.head.appendChild(script);
          script.onload = () => {
            if (this.initCheck && !this.isDashed) {
              this.isDashed = true;
              return this.dash();
            }
          };
        },
        mediaInit() {
          const initDelay = setInterval(() => {
            if (this.initCheck && unsafeWindow.panzoom) {
              clearInterval(initDelay);
              if (!this.isDashed) {
                this.isDashed = true;
                return this.dash();
              }
            }
          });
        },
        dash() {
          this.media.replaceWith(this.media.cloneNode());
          this.attrWidth = Number(this.media.getAttribute("width"));
          this.container = document.querySelector(".media-asset-container");

          let zoomLE = document.querySelector(".media-asset-zoom-level");
          zoomLE.replaceWith(zoomLE.cloneNode());
          this.zoomLE = document.querySelector(".media-asset-zoom-level");

          this.container.style.width = "100%";
          this.container.style.height = "100%";
          this.container.style.aspectRatio = "unset";
          this.zoomLE.style.zIndex = "1";
          this.media.style.maxHeight = "100%";
          this.curContainerWidth = this.containerWidth;

          this.media.classList.remove("cursor-zoom-in", "cursor-zoom-out");
          const that = this;
          this.panzoom = unsafeWindow.panzoom(this.media, {
            zoomDoubleClickSpeed: 1,
            onDoubleClick: function (e) {
              let nextLevel = that.zoomLevelQueue.filter(l => l - that.zoomLevel > 0.001 && l > that.zoomLevel)?.[0] || that.zoomLevelQueue[0];
              let { offsetX, offsetY } = e;
              if (e.target.tagName !== "DIV") {
                let { x, y } = that.panzoom.getTransform();
                offsetX += x;
                offsetY += y;
              }
              if (that.zoomLevel === 3) that.panzoom.zoomAbs(offsetX, offsetY, 0);
              else {
                let newScale = (that.attrWidth * nextLevel) / that.baseWidth;
                that.panzoom.zoomAbs(offsetX, offsetY, newScale);
              }
              return false;
            }
          });

          this.panzoom.on("zoom", () => {
            this.updateZoom();
            if (this.curContainerWidth != this.containerWidth) {
              this.curContainerWidth = this.containerWidth;
              this.updateScaleRange();
            }
          });
          this.panzoom.on("zoomend", () => {
            if (that.zoomLevel <= that.baseLevel) {
              that.moveToCenter();
            }
          });

          new ResizeObserver(() => {
            this.updateZoom();
            this.moveToCenter();
            this.updateScaleRange();
          }).observe(this.media);
        },
        get containerWidth() {
          return this.container.clientWidth;
        },
        get baseWidth() {
          return Math.min(this.containerWidth, this.media.width);
        },
        get baseLevel() {
          return this.baseWidth / this.attrWidth;
        },
        get zoomLevelQueue() {
          let arr = [0.25, 0.5, 1, 2, 3, this.baseLevel];
          arr.forEach((s, i) => {
            if (Math.abs(this.baseLevel - s) < 0.001) {
              arr[i] = this.baseLevel;
              return;
            } else if (this.baseLevel < s) {
              return arr.splice(i, 0, this.baseLevel);
            } else if (this.baseLevel > 3) return arr.push(this.baseLevel);
          });
          return arr;
        },
        get zoomLevel() {
          return (this.baseWidth * this.panzoom.getTransform().scale) / this.attrWidth;
        },
        updateZoom() {
          this.zoomLE.classList.remove("hidden");
          this.zoomLE.innerText = `${Math.round(100 * this.zoomLevel)}%`;
        },
        moveToCenter() {
          this.panzoom.smoothMoveTo(
            this.containerWidth / 2 - (this.baseWidth * this.panzoom.getTransform().scale) / 2,
            this.container.clientHeight / 2 - (((this.baseWidth * this.media.getAttribute("height")) / this.attrWidth) * this.panzoom.getTransform().scale) / 2
          );
        },
        updateScaleRange() {
          this.panzoom.setMaxZoom((this.attrWidth * 3) / this.baseWidth);
          this.panzoom.setMinZoom(Math.min(this.attrWidth / 4 / this.baseWidth, 1));
        }
      };
      mediaAssetPanzoom.init();
      if (pathname.startsWith("/uploads/")) {
        wait(1000).then(() => document.querySelector(".ai-tags-related-tags-column")?.classList?.remove("hidden"));
        const tagsField = document.querySelector("#post_tag_string");
        Danbooru.Autocomplete._ic = Danbooru.Autocomplete.insert_completion;
        Danbooru.Autocomplete.insert_completion = function () {
          this._ic(...arguments);
          // jQuery trigger('input') does not fire native JavaScript input event
          tagsField.dispatchEvent(new InputEvent("input", { bubbles: true }));
        };
        // Easier 1up https://gist.github.com/TypeA2/bff1474c0f4ca2188cf21897d4e4b2dd
        const easier1Up = {
          iconHash: document.querySelector("a#close-notice-link use").href.baseVal.split(/-|\./)[1],
          thumbnail: {
            id: 23609685,
            url: "https://cdn.donmai.us/180x180/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.jpg",
            width: 180,
            height: 135
          },
          init() {
            const relatedPosts = document.querySelector("#related-posts-by-source p.fineprint a");
            if (relatedPosts) {
              const shownCount = Number(relatedPosts.innerText.split(" ")[0]);
              let articles = document.querySelectorAll("#related-posts-by-source article");
              const addButton = articles =>
                articles.forEach(el => {
                  const div = document.createElement("div");
                  this.addButton(el, div);
                  el.querySelector(".post-preview-container").nextElementSibling.appendChild(div);
                });
              if ((articles.length === 5 && shownCount > 5) || articles.length === shownCount) addButton(articles);
              else {
                const url = new URL(relatedPosts.href);
                url.pathname = "/posts.json";
                url.searchParams.append("limit", 5);
                fetch(url)
                  .then(resp => resp.json())
                  .then(json => {
                    articles = this.updateArticles(json, articles, true);
                    addButton(articles);
                  });
              }
            }

            const similar = document.getElementById("iqdb-similar");
            this.observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(this.process.bind(this))));
            this.observer.observe(similar, {
              subtree: true,
              childList: true
            });
          },
          async process(node) {
            if (node.className !== "iqdb-posts") return;
            let articles = node.querySelectorAll("#iqdb-similar article");
            let shownCount = articles.length;
            let iqdbNoPostFound = shownCount === 0 && document.querySelector(".post-gallery-grid > p:only-child");
            if (!iqdbNoPostFound && shownCount !== 5) {
              let iqdbResults = await this.iqdbReq();
              if (iqdbResults.length !== shownCount) articles = this.updateArticles(iqdbResults, articles);
            }
            for (const post of articles) {
              const div = post.querySelector(".iqdb-similarity-score").parentElement;
              this.addButton(post, div);
            }
            this.observer?.disconnect();
          },
          copyTags(post, isParent) {
            const tags = post.dataset.tags.split(" ").filter(t => t === "social_commentary" || t.indexOf("commentary") == -1);
            tags.push((isParent ? "parent:" : "child:") + post.dataset.id);
            document.querySelector(`input.radio_buttons[value='${post.dataset.rating}']`).checked = true;
            tagsField.value = tags.join(" ") + " ";
            tagsField.dispatchEvent(new InputEvent("input", { bubbles: true }));
            document.querySelector(".source-tab").click();
            Danbooru.Utility.notice("Successfully copied tags. Please check the commentary tags.");
          },
          addButton(post, div) {
            const setParent = document.createElement("a");
            setParent.classList.add("inactive-link");
            setParent.href = "#";
            setParent.innerText = "parent";
            setParent.addEventListener("click", e => {
              e.preventDefault();
              this.copyTags(post, true);
            });
            const setChild = document.createElement("a");
            setChild.classList.add("inactive-link");
            setChild.href = "#";
            setChild.innerText = "child";
            setChild.addEventListener("click", e => {
              e.preventDefault();
              this.copyTags(post, false);
            });
            div.children.length && div.appendChild(document.createTextNode(" | "));
            div.appendChild(setParent);
            div.appendChild(document.createTextNode(" | "));
            div.appendChild(setChild);
          },
          async iqdbReq() {
            try {
              let mid = document.getElementById("media_asset_id").value;
              let resp = await (
                await fetch(`/iqdb_queries.json?limit=5&search%5Bmedia_asset_id%5D=${mid}&search%5Bsimilarity%5D=50&search%5Bhigh_similarity%5D=70`)
              ).json();
              if (Array.isArray(resp)) return resp;
              else throw new Error(JSON.stringify(resp));
            } catch (e) {
              console.error("Error:", e);
            }
          },
          updateArticles(posts, currentPosts, relatedSection = false) {
            currentPosts = Array.from(currentPosts);
            const currentPostIds = currentPosts.map(el => {
              return Number(el.getAttribute("data-id"));
            });
            currentPostIds.push(0);
            let idx = 0,
              postsLength = posts.length;
            currentPostIds.forEach((pid, index) => {
              let htmlToInsert = "";
              for (; idx < postsLength; idx++) {
                let post = relatedSection ? posts[idx] : posts[idx].post;
                if (post.id !== pid) {
                  if (post.is_banned) htmlToInsert += relatedSection ? this.render(post) : this.render(post, posts[idx].score);
                } else break;
              }
              if (htmlToInsert) {
                if (pid === 0) {
                  const prefix = relatedSection ? "#related-posts-by-source" : ".iqdb-posts";
                  document.querySelector(prefix + " .posts-container").insertAdjacentHTML("beforeend", htmlToInsert);
                } else currentPosts[index].insertAdjacentHTML("beforebegin", htmlToInsert);
              }
            });
            const prefix = relatedSection ? "#related-posts-by-source" : "#iqdb-similar";
            return document.querySelectorAll(prefix + " article");
          },
          render(
            {
              id,
              uploader_id,
              score,
              rating,
              tag_string,
              is_pending,
              is_flagged,
              is_deleted,
              has_children,
              parent_id,
              source,
              media_asset: { id: mid, image_width, image_height, file_size, file_ext }
            },
            similarity
          ) {
            const dataFlag = is_pending ? "pending" : is_flagged ? "flagged" : is_deleted ? "deleted" : "";

            const classList = ["post-preview", "post-preview-fit-compact", "post-preview-180"];
            is_pending && classList.push("post-status-pending");
            is_flagged && classList.push("post-status-flagged");
            is_deleted && classList.push("post-status-deleted");
            has_children && classList.push("post-status-has-children");
            parent_id && classList.push("post-status-has-parent");
            similarity && classList.push(similarity < 70 ? "iqdb-low-similarity hidden" : "iqdb-high-similarity");

            const { url, width, height } = this.thumbnail;
            const similarityHtml = similarity
              ? `<div><a class="inactive-link iqdb-similarity-score" href="/iqdb_queries?post_id=${id}">${similarity.toFixed(0)}% similar</a></div>`
              : "";

            return `<article id="post_${id}" class="${classList.join(
              " "
            )}" data-id="${id}" data-tags="${tag_string}" data-rating="${rating}" data-flags="${dataFlag}" data-score="${score}" data-uploader-id="${uploader_id}">
        <div class="post-preview-container">
        <a class="post-preview-link" draggable="false" href="/posts/${id}">
        <picture><img src="${url}" width="${width}" height="${height}" class="post-preview-image" title="" alt="post #${id}"draggable="false" aria-expanded="false" data-title="${tag_string} rating:${rating} score:${score}"></picture>
        </a></div><div class="text-xs text-center mt-1"><div>
        <a rel="external noreferrer nofollow" title="${source}" class="inline-block align-top" href="${source}">
        <svg class="icon svg-icon globe-icon h-4" viewBox="0 0 512 512"><use fill="currentColor" href="/packs/static/icons-${
          this.iconHash
        }.svg#globe"></use></svg>
        </a>
        <a href="/media_assets/${mid}">${this.formatBytes(file_size)} .${file_ext}, ${image_width}×${image_height}</a></div>${similarityHtml}</div>
        </article>`;
          },
          formatBytes(bytes) {
            if (bytes === 0) return "0 Bytes";
            const units = ["Bytes", "KB", "MB"];
            const k = 1024;
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const value = bytes / Math.pow(k, i);
            const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
            return `${formattedValue} ${units[i]}`;
          }
        };
        easier1Up.init();

        const hint = document.querySelector("div.post_tag_string span.hint");
        hint.insertAdjacentHTML("beforeend", "<br /><a class='cursor-pointer'>View detials for current tag in related tags page »</a>");
        hint.querySelector("a").addEventListener("click", () => {
          const currentTag = unsafeWindow.Danbooru.RelatedTag.current_tag();
          const url = `/related_tag?commit=Search&search%5Border%5D=Overlap&search%5Bquery%5D=${currentTag}`;
          if (currentTag) window.open(url, "_blank");
        });
      }
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
    }
  }

  // yande.re
  else if (hostname === "yande.re") {
    // Fix preview click issue
    if (Cookie.get("mode") === "null") Cookie.set("mode", "view", { expires: 365 });
    document.querySelectorAll("a.thumb > img.preview").forEach(e => {
      e.draggable = false;
    }); // Fix for gesture plugin
  } else if (hostname === "files.yande.re") {
    if (pathname.startsWith("/image/") || pathname.startsWith("/sample/")) {
      newSrc = src.replace(/(\/[a-z0-9]{32}\/).*(\..+)/, "$1$2");
      if (newSrc != src) return redirect("https://href.li/?" + newSrc);
    }
  }

  // SouthPlus
  else if (hostname === "bbs.imoutolove.me") {
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
              document.querySelectorAll(".r_two > div[align='center'] > a").forEach(a => {
                if (a.href.endsWith(`-${opUid}.html`)) {
                  a.appendChild(document.createTextNode(" "));
                  a.insertAdjacentElement("afterend", opEl.cloneNode(true));
                }
              });
            }
          }
        });
      document.querySelectorAll(".quote.jumbotron>.btn.btn-danger").forEach(button => {
        let url = button.getAttribute("onclick").replace(/location\.href='(.+)'/, "$1");
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
              mode: "no-cors"
            })
              .then(resp => resp.text())
              .then(text => {
                if (text.indexOf("操作完成") === -1) {
                  alert("购买失败！");
                }
                fetch(document.URL, {
                  credentials: "include",
                  mode: "no-cors"
                })
                  .then(resp => resp.text())
                  .then(html => {
                    let dummy = document.createElement("html");
                    dummy.innerHTML = html;
                    let purchased = dummy.querySelector("#" + post_id);
                    let notPurchased = document.querySelector("#" + post_id);
                    notPurchased.parentNode.replaceChild(purchased, notPurchased);
                    dummy = null;
                    btn.remove();
                    if (window.history && unsafeWindow.copyurl) {
                      window.history.pushState({}, document.title, unsafeWindow.copyurl + post_id.split("_")[1]);
                    }
                  });
              });
          } catch (error) {
            alert(`发送请求出错，购买失败！\n${error}`);
            Logger.log("Request Failed", error);
          }
        });
      });
    }
  }

  // EHentai
  else if (hostname === "exhentai.org" || hostname === "e-hentai.org") {
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
      let img = document.getElementById("img"),
        a = img.parentNode,
        i3 = document.getElementById("i3");
      i3.style.cssText = "text-align: center; position: relative;";
      i3.append(img);
      a.removeAttribute("href");
      let ap = a.cloneNode(),
        apCss = "width: 42%; height: 70%; position: absolute; left: 0; top: 15%; z-index: 12; cursor: url(//ehgt.org/g/p.png),auto;",
        aCss = "width: 42%; height: 70%; position: absolute; right: 0; top: 15%; z-index: 12; cursor: url(//ehgt.org/g/n.png),auto;";
      ap.onclick = document.querySelector("a#prev").onclick;
      a.style.cssText = aCss;
      ap.style.cssText = apCss;
      i3.prepend(ap);
      let hookedFn = unsafeWindow.apply_json_state;
      unsafeWindow.apply_json_state = function (a) {
        let apOnClikck = a.n.match(/prev.*?(return.*?)"/)[1];
        a.i3 = a.i3
          .replace(/href.*?"/, "")
          .replace(/(^.*?onclick.*?\)")(.*?>)(<img.*?\/>)(.*?$)/, `<a onclick="${apOnClikck}" style="${apCss}">$4$1 style="${aCss}"$2$4$3`);
        hookedFn(a);
      };
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
  }

  // BlueSky
  else if (hostname === "bsky.app" || hostname === "web-cdn.bsky.app") {
    GM_registerMenuCommand("Get user permanent link", () => {
      const dids = document.querySelectorAll("div[data-testid='profileHeaderAviButton'] img");
      const did = dids?.[dids.length - 1]?.src?.match(/did:plc:\w+/)?.[0];
      if (did) {
        const url = "https://bsky.app/profile/" + did;
        GM_setClipboard(url);
        GM_toast(url + " Copied.");
      } else GM_toast("did:plc: not found.");
    });
  }

  // Niconico Video Cover
  else if (hostname === "www.nicovideo.jp") {
    const getCoverUrl = async (id, htmlStr, t = 0) => {
      let coverUrlRegExp = new RegExp(`https[^"]+\\/${id}\\/${id}\\.\\d+\\.original[^"]+`);
      let coverUrl = htmlStr.match(coverUrlRegExp)?.[0];
      if (!coverUrl) {
        if (t) return;
        let req = await fetch(`https://www.nicovideo.jp/watch/sm${id}`);
        if (req.status === 200) {
          return getCoverUrl(id, (await req.text()).replace(/&quot;/g, '"').replace(/\\\//g, "/"), ++t);
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

  // Skep.jp
  else if (hostname === "skeb.jp") {
    if (/\/@\w+\/works\/\d+/.test(pathname)) {
      GM_registerMenuCommand("View <og:image>", () => {
        const ogImg = document.head.querySelector("meta[property='og:image']")?.getAttribute("content");
        ogImg && window.open(ogImg, "_blank");
      });
      const title = "View <article_image_url>";
      GM_registerMenuCommand(title, () => {
        let token = localStorage.getItem("token");
        if (!token)
          GM_toast({
            title,
            text: "Please login first",
            timeout: 2000
          });
        else
          fetch(unsafeWindow.location.pathname.replace(/^\/@/, "https://skeb.jp/api/users/"), {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(resp => resp.json())
            .then(data => {
              Logger.log(data);
              let url = data.article_image_url;
              if (url) window.open(url, "_blank");
              else
                GM_toast({
                  title,
                  text: "article_image_url not found in API",
                  timeout: 2000
                });
            });
      });
    }
  }

  // DBSearach: Skip R18 warning
  else if (hostname.endsWith("dbsearch.net")) {
    if (/^(adult(comic|novel|anime)|erogame)\./.test(hostname)) {
      let r18Warning = document.querySelector("div#warning-box > p:first-of-type") || document.querySelector("div#contents > p:first-of-type");
      if (r18Warning && r18Warning.innerText.indexOf("Adults only, or 18 and older.") > -1) {
        window.location.href = document.querySelector("ul#select > li > a").href;
        return;
      } else return;
    } else return;
  }

  // Poipiku
  else if (hostname === "poipiku.com") {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>section.UserInfoUser>.UserInfoCmd:not(:has(.UserInfoCmdFollow)),.IllustItemResList,.IllustItemResBtnList,.PcSideBar,.HeaderPoiPassAd,.SideBarMidInfScroll{display:none !important;}#IllustItemList{width:100%;flex:1;}</style>`
    );
    unsafeWindow.contentPageToClipboard = (a, b) => {
      const url = `https://poipiku.com/${a}/${b}.html`;
      GM_setClipboard(url);
      GM_toast(url + " Copied.");
    };
  }
})();
