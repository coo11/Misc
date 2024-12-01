// ==UserScript==
// @name        Aegis
// @namespace   https://github.com/coo11/Backup/tree/master/UserScript
// @version     0.1.83
// @description Start taking over the world for Via!
// @author      coo11
// @run-at      document-end
// @match       *://mp.weixin.qq.com/*
// @match       *://*.bilibili.com/video/*
// @match       *://*.bilibili.com/s/video/*
// @match       *://live.bilibili.com/*
// @match       *://www.pixiv.net/*
// @match       *://*.fanbox.cc/*
// @match       *://fantia.jp/posts/*
// @match       *://fantia.jp/fanclubs/*
// @match       *://*.gumroad.com/*
// @match       *://www.patreon.com/*
// @match       *://x.com/*
// @match       *://saucenao.com/search.php*
// @match       *://danbooru.donmai.us/*
// @match       *://betabooru.donmai.us/*
// @match       *://files.yande.re/*
// @match       *://bbs.imoutolove.me/read.php*
// @match       *://bbs.imoutolove.me/simple/index.php*
// @match       *://exhentai.org/*
// @match       *://e-hentai.org/*
// @match       *://bsky.app/*
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
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
      const { biz, mid, idx, sn } = window;
      const newUrl = `https://mp.weixin.qq.com/s?__biz=${biz}&mid=${mid}&idx=${idx}&sn=${sn}`;
      GM_setClipboard(newUrl);
      GM_toast("Permanent / Purged URL copied.\n" + newUrl);
    });
  }

  // Bilibili Video
  else if (hostname.endsWith(".bilibili.com")) {
    if (/\/video\/(av|BV|bv)\w+/.test(pathname)) {
      // https://github.com/mrhso/IshisashiWebsite/blob/4108b25d9be21ce3925d88259f6b0fddaf594217/BVwhodoneit/index.html#L24C1-L101C3
      // prettier-ignore
      const abv={table:[..."FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"],base:58n,xor:23442827791579n,rangeLeft:1n,rangeRight:2n**51n,av2bv(t){let i=t;if("[object String]"===Object.prototype.toString.call(i)&&(i=parseInt(i.replace(/^[Aa][Vv]/u,""))),("[object BigInt]"===Object.prototype.toString.call(i)||Number.isInteger(i))&&!((i=BigInt(i))<this.rangeLeft||i>=this.rangeRight)){i=i+this.rangeRight^this.xor;let t=[..."BV1000000000"],e=11;for(;2<e;)t[e]=this.table[Number(i%this.base)],i/=this.base,--e;return[t[3],t[9]]=[t[9],t[3]],[t[4],t[7]]=[t[7],t[4]],t.join("")}},bv2av(t){let i="";if(12===t.length)i=t;else if(10===t.length)i="BV"+t;else{if(9!==t.length)return;i="BV1"+t}if(i.match(/^bv1[1-9A-z]{9}$/iu)){i=[...i],[i[3],i[9]]=[i[9],i[3]],[i[4],i[7]]=[i[7],i[4]];let t=0n,e=3;for(;e<12;)t=(t*=this.base)+BigInt(this.table.indexOf(i[e])),e+=1;if(!(t<this.rangeRight||t>=2n*this.rangeRight||(t=t-this.rangeRight^this.xor)<this.rangeLeft))return"av"+t}}};

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
        if (link) {
          GM_setClipboard(link);
          GM_toast("已复制：" + link);
        } else GM_toast("无法获取短链接");
      }
      GM_registerMenuCommand("复制 AV 短链接", () => notify("av"));
      GM_registerMenuCommand("复制 BV 短链接", () => notify("bv"));
      GM_registerMenuCommand("查看视频封面", getVideoCover);
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
    // Twitter Video Downloader - Deprecated: https://paste.ee/p/AtvoT
    // Reference: https://greasyfork.org/scripts/495368/code
    {
      const TVD = {
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
          let baseUrl = `https://${hostname}/i/api/graphql/NmCeCgkVlsRGS1cAwqtgmw/TweetDetail`;
          let variables = {
            focalTweetId: tid,
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
          let tweetEntry = tweetDetail.data.threaded_conversation_with_injections_v2.instructions[0].entries.find(n => n.entryId == `tweet-${tid}`);
          let result = tweetEntry.content.itemContent.tweet_results.result;
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
  .twvf-dialog {position: absolute; z-index: 0; transform: translateX(10vw); width: 80vw; max-width: fit-content; height: auto; left: 0; border-radius: 12px; padding: 0 12px; background-color: white; box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;}
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
      };
      try {
        TVD.init();
      } catch (e) {
        GM_toast(e.message);
      }
    }
  }

  // SauceNAO
  else if (hostname === "saucenao.com") {
    document.head.insertAdjacentHTML("afterBegin", '<meta name="viewport" content="width=device-width,initial-scale=1">');
    document.head.insertAdjacentHTML(
      "beforeEnd",
      "<style>" +
        '#headerbarright,.resultimage{float:unset;text-align:center}body{font-size:87.5%;font-family:source-sans-pro,sans-serif}#headerarea,#mainarea{width:100%;min-width:unset}#headerbarright{width:100%;direction:unset}#mainarea,.resultmatchinfo,.resulttable tr,.resulttablecontent{display:flex;flex-direction:column;align-items:center}#left{width:100%;background-color:#1d1d1d}#yourimagecontainer{padding-top:0;text-align:center}#yourimage{display:inline-block;float:none;position:relative;min-height:150px}#yourimage::before{content:"click to edit your image";position:absolute;bottom:0;left:0;font-size:smaller;background-color:rgba(0,0,0,.5);backdrop-filter:blur(2px)}#yourimageretrylinks{display:flex;justify-content:center;flex-direction:row;margin:8px;gap:16px}#middle{margin:unset;width:100%}.result{margin:0 5px 5px}.resulttableimage{background-color:unset}.resultimage{min-width:unset}.resultimage_showmessage::after{left:0;padding:unset;font-size:smaller}.pixelated{width:unset;min-height:150px}.resultmatchinfo{row-gap:4px;margin:0}.resultmiscinfo{display:flex;flex-direction:row;align-items:flex-start;gap:8px}.resultcontent{width:100%}.resulttitle{margin-bottom:0}#footerarea,#headerbarleft,#headerbarmiddle,#smalllogo,#yourimageretrylinks>div,#yourimagetext,.resultcontentcolumn br:last-child{display:none}#message{display:none}' +
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

  // Danbooru Ehance
  else if (hostname.endsWith(".donmai.us")) {
    // Banned post helper
    {
      if (/\/posts\/\d+/.test(location.pathname)) {
        const p = document.querySelector("#page > p:last-child");
        if (p && p.innerText === "This page has been removed because of a takedown request.") {
          p.innerText = "Fetching data...";
          try {
            const html = await (
              await fetch(location, {
                headers: { "X-CSRF-Token": Danbooru.Utility.meta("csrf-token") }
              })
            ).text();
            // rails-ujs not broken
            window._rails_loaded = false;
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
                  is_pending && classList.push("post-status-flagged");
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
                        while (idx < postsLength && posts[idx].id !== pid) {
                          if (posts[idx].is_banned) {
                            htmlToInsert += parsingPostData(posts[idx]);
                            bannedToShow++;
                          }
                          idx++;
                        }
                        idx++;
                        if (htmlToInsert) {
                          if (pid === 0) {
                            postContainer.insertAdjacentHTML("afterbegin", htmlToInsert);
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
    // Enable non-view mode on current page only
    document.querySelector("#mode-box select")?.addEventListener("change", () => setTimeout(() => localStorage.setItem("mode", "view")));
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

          if (inputType?.startsWith("insert") && data && hasFullWidthSearchChar(data)) {
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
          const p2 = fetch("/favorite_groups.json?only=id&limit=100&search%5Bpost_ids_include_all%5D=" + postId)
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
            });
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
          Promise.allSettled([p1, p2, p3]).then(() => $("#post-information").fadeOut("fast").fadeIn("fast"));
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
      const tagsField = document.querySelector("#post_tag_string");
      Danbooru.Autocomplete._ic = Danbooru.Autocomplete.insert_completion;
      Danbooru.Autocomplete.insert_completion = function () {
        this._ic(...arguments);
        // jQuery trigger('input') does not fire native JavaScript input event
        tagsField.dispatchEvent(new InputEvent("input", { bubbles: true }));
      };
      // Easier 1up https://gist.github.com/TypeA2/bff1474c0f4ca2188cf21897d4e4b2dd
      const easier1Up = {
        init() {
          document.querySelectorAll("#related-posts-by-source article").forEach(el => {
            const div = document.createElement("div");
            this.addButton(el, div);
            el.querySelector(".post-preview-container").nextElementSibling.appendChild(div);
          });
          const similar = document.getElementById("iqdb-similar");
          this.observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(this.process.bind(this))));
          this.observer.observe(similar, {
            subtree: true,
            childList: true
          });
        },
        process(node) {
          if (node.className !== "iqdb-posts") return;
          for (const post of node.getElementsByTagName("article")) {
            const div = post.querySelector(".iqdb-similarity-score").parentElement;
            this.addButton(post, div);
          }
          this.observer?.disconnect();
        },
        copyTags(post, isParent) {
          const tags = post.dataset.tags.split(" ").filter(t => t === "social_commentary" || t.indexOf("commentary") == -1);
          document.querySelector(`input.radio_buttons[value='${post.dataset.rating}']`).checked = true;
          if (isParent) {
            document.getElementById("post_parent_id").value = post.dataset.id;
          } else tags.push("child:" + post.dataset.id);
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
    return;
  }

  // yande.re
  else if (hostname === "files.yande.re") {
    if (pathname.startsWith("/image/") || pathname.startsWith("/sample/")) {
      newSrc = src.replace(/(\/[a-z0-9]{32}\/).*(\..+)/, "$1$2");
      if (newSrc != src) return redirect("https://href.li/?" + newSrc);
    }
  }

  // SouthPlus
  else if (hostname === "bbs.imoutolove.me") {
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
  }

  // BlueSky
  else if (hostname === "bsky.app") {
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
})();
