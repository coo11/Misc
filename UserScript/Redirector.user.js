// ==UserScript==
// @name        Redirector
// @namespace   https://github.com/coo11/Backup/tree/master/UserScript
// @version     0.1.4
// @description Start taking over the world!
// @author      coo11
// @icon        data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' fill='%23fff' r='7'/%3E%3Cpath d='M9.167 4.5a1.167 1.167 0 1 1-2.334 0 1.167 1.167 0 0 1 2.334 0Z'/%3E%3Cpath d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM1 8a7 7 0 0 1 7-7 3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 0 0 7 7 7 0 0 1-7-7Zm7 4.667a1.167 1.167 0 1 1 0-2.334 1.167 1.167 0 0 1 0 2.334Z' fill-opacity='initial'/%3E%3C/svg%3E
// @run-at      document-start
// @match       *://link.zhihu.com/?target=*
// @match       *://www.douban.com/link2/?url=*
// @match       *://link.csdn.net/?target=*
// @match       *://www.oschina.net/action/GoToLink?url=*
// @match       *://www.pixiv.net/jump.php?*
// @match       *://www.jianshu.com/go-wild*
// @match       *://ref.gamer.com.tw/redir.php?url=*
// @match       *://nga.178.com/*
// @match       *://ngabbs.com/*
// @match       *://g.nga.cn/*
// @match       *://*.soul-plus.net/*
// @match       *://*.south-plus.net/*
// @match       *://*.south-plus.org/*
// @match       *://*.north-plus.net/*
// @match       *://*.east-plus.net/*
// @match       *://*.level-plus.net/*
// @match       *://*.white-plus.net/*
// @match       *://*.summer-plus.net/*
// @match       *://*.snow-plus.net/*
// @match       *://*.spring-plus.net/*
// @match       *://*.blue-plus.net/*
// @match       *://www.inoreader.com/*
// @match       *://*.moegirl.org/*
// @match       *://bangumi.tv/*
// @match       *://chii.in/*
// @match       *://t.cn/*
// @match       *://sinaurl.cn/*
// @match       *://weibo.cn/sinaurl?*
// @ Weibo, Zhihu, Bilibili, Alibaba, Baidu, NGA, Tencent, Lofter, Mihuashi, BCY
// @match       *://m.weibo.cn/*
// @match       *://video.h5.weibo.cn/1034:*
// @match       *://h5.video.weibo.com/show/*
// @match       *://*.weibo.com/*
// @match       *://*.sinaimg.cn/*
// @match       *://*.zhimg.com/*
// @match       *://*.hdslb.com/*
// @match       *://album.biliimg.com/*
// @match       *://*.alicdn.com/*
// @match       *://*.aliexpress-media.com/*
// @match       *://imgsrc.baidu.com/*
// @match       *://tiebapic.baidu.com/*
// @match       *://imgsa.baidu.com/*
// @match       *://*.hiphotos.baidu.com/*
// @match       *://bkimg.cdn.bcebos.com/*
// @match       *://img.nga.178.com/*
// @match       *://*.qpic.cn/*
// @match       *://*.lf127.net/*
// @match       *://pic-bucket.ws.126.net/*
// @match       *://image-assets.mihuashi.com/*
// @match       *://*.bcyimg.com/*
// @ Pixiv, Twitter, YouTube, Google, Artstation, Steam, Pinterest, Discord, Apple, Tumblr, Reddit, NicoSeiga, Foriio
// @match       *://i.pximg.net/*
// @match       *://i-f.pximg.net/*
// @match       *://i-cf.pximg.net/*
// @match       *://pixiv.pximg.net/*
// @match       *://booth.pximg.net/*
// @match       *://*.booth.pm/*
// @match       *://downloads.fanbox.cc/*
// @match       *://*.twimg.com/*
// @match       *://www.youtube.com/watch?v=*
// @match       *://www.youtube.com/shorts/*
// @match       *://*.ytimg.com/*
// @match       *://img.youtube.com/*
// @match       *://*.googleusercontent.com/*
// @match       *://www.google.com/search*tbs=sbi:*
// @match       *://www.google.com/search*tbs=sbi%3A*
// @match       *://cdna.artstation.com/*
// @match       *://cdnb.artstation.com/*
// @match       *://www.artstation.com/*
// @match       *://steamusercontent-a.akamaihd.net/*
// @match       *://steamuserimages-a.akamaihd.net/*
// @match       *://steamcdn-a.akamaihd.net/*
// @match       *://steamstore-a.akamaihd.net/*
// @match       *://*.steamstatic.com/*
// @match       *://*.pinimg.com/*
// @match       *://s3.amazonaws.com/media.pinterest.com/*
// @match       *://media.pinterest.com.s3.amazonaws.com/*
// @match       *://*.discordapp.net/*
// @match       *://*.discordapp.com/*
// @match       *://*.mzstatic.com/*
// @match       *://cdn.bsky.app/img/*
// @match       *://64.media.tumblr.com/*
// @match       *://www.reddit.com/media?url=*
// @match       *://lohas.nicoseiga.jp/thumb/*
// @match       *://lohas.nicoseiga.jp//thumb/*
// @match       *://deliver.cdn.nicomanga.jp/thumb/*
// @match       *://imgx.foriio.com/*
// @match       *://foriio.imgix.net/*
// @match       *://*.us.archive.org/*
// @match       *://coverartarchive.org/*
// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// ==/UserScript==

/* prettier-ignore */
const Logger = new Proxy({},{get:(o,n)=>n in window.console?function(o,...e){let c=`%c${GM_info.script.name}%c`,l="color: #3c89e8; padding: 1px 5px; border-radius: 4px; border: 1px solid #91caff;";"string"==typeof o?console[n](`${c} ${o}`,l,null,...e):console[n](c,l,null,o,...e)}:o[n]});

const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const bodyLoaded = cb => {
  if (document.body) cb(document.body);
  else {
    const onContentLoaded = () => {
      if (document.body) cb(document.body);
      document.removeEventListener("DOMContentLoaded", onContentLoaded);
    };
    document.addEventListener("DOMContentLoaded", onContentLoaded);
  }
};

const wait = (ms = 1e3) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  "use strict";
  let newSrc,
    matched,
    { hostname, pathname } = window.location;
  const src = window.location.href;

  // Jump to 3rd website
  if (
    hostname === "link.zhihu.com" ||
    hostname === "www.douban.com" ||
    hostname === "link.csdn.net" ||
    hostname === "www.oschina.net" ||
    (hostname === "www.pixiv.net" && src.indexOf("/jump.php?url=") > -1) ||
    (hostname === "www.jianshu.com" && src.indexOf("/go-wild?") > -1) ||
    (hostname === "ref.gamer.com.tw" && src.indexOf("/redir.php?url=") > -1)
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

  // NGA
  else if (hostname === "nga.178.com" || hostname === "ngabbs.com" || hostname === "g.nga.cn") {
    window.location.hostname = "bbs.nga.cn";
    return;
  }

  // SouthPlus
  else if (/\b(spring|summer|white|north|south|east|soul|level|snow|blue)-plus\.net$/i.test(hostname) || hostname.endsWith("south-plus.org")) {
    window.location.hostname = "bbs.imoutolove.me";
    return;
  }

  // Inoreader, Moegirl Wiki, Bangumi.tv
  else if (hostname === "www.inoreader.com") {
    window.location.hostname = "jp.inoreader.com";
    return;
  } else if (hostname.endsWith("moegirl.org")) {
    window.location.hostname = hostname + ".cn";
    return;
  } else if (hostname === "chii.in" || hostname === "bangumi.tv") {
    window.location.hostname = "bgm.tv";
    return;
  }

  // Sina
  else if (hostname === "t.cn" || hostname === "sinaurl.cn" || /^https?:\/\/weibo\.cn\/sinaurl\?(toasturl|u)=/.test(src)) {
    const div = document.querySelector("div.desc");
    if (div && div.innerText.startsWith("http")) {
      return redirect(div.innerText);
    } else {
      let queries = getQueries(src, true);
      let target = queries?.toasturl || queries?.u;
      if (target) return redirect(target);
      else if (hostname === "t.cn" && !target) {
        fetch(src).then(resp => {
          let url = resp.headers.get("Location");
          if (url) return redirect(url);
        });
      }
    }
  }

  /** Image Max URL Start
   * https://github.com/qsniyg/maxurl
   * https://greasyfork.org/users/2646
   */

  // It works as long as the content after the "?" is removed.
  else if (hostname === "steamusercontent-a.akamaihd.net" || hostname === "steamuserimages-a.akamaihd.net") {
    return redirect(src.replace(/\?.*$/, ""));
  }

  // Weibo
  else if (hostname.endsWith(".sinaimg.cn") || hostname.endsWith("weibo.cn") || hostname.endsWith("weibo.com")) {
    // prettier-ignore
    const weiboFn = {alphabet:"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",mid2id(r){let s="";for(let n=r.length-4;-4<n;n-=4){let e=n<0?0:n,t=n+4,o=r.substring(e,t);if(o=this.decodeBase62(o).toString(),0<e)for(;o.length<7;)o="0"+o;s=o+s}return s},id2mid(r){let s="";for(let n=(r=String(r)).length-7;-7<n;n-=7){let e=n<0?0:n,t=n+7,o=r.substring(e,t);if(o=this.encodeBase62(o),0<e)for(;o.length<4;)o="0"+o;s=o+s}return s},encodeBase62(e){let t="";for(;0!=e;)t=this.alphabet[e%62]+t,e=Math.floor(e/62);return t},decodeBase62(t){let o=0,n=t.length-1;for(let e=0;e<=n;e++)o+=this.alphabet.indexOf(t.substr(e,1))*Math.pow(62,n-e);return o},openHomepageFromSinaimg(e){const t=e.substr(0,8),o=t.startsWith("00")?this.decodeBase62(t):parseInt(t,16);window.open("https://weibo.com/u/"+o)}};

    if (hostname.endsWith(".sinaimg.cn")) {
      if (document.contentType.startsWith("text"))
        bodyLoaded(body =>
          body.insertAdjacentHTML(
            "beforeend",
            '<hr><center><h1><a href="https://weibo.cn/sinaurl?toasturl=' + encodeURIComponent(src) + '">Try</a> to add Weibo referer</h1></center>'
          )
        );
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
    } else {
      if (hostname === "m.weibo.cn")
        // Prevent from popuping PWA installation
        document.head?.querySelector('link[rel="manifest"]')?.remove();
      // Weibo Snapshot
      if (hostname.endsWith("weibo.com")) {
        GM_registerMenuCommand("🍑 Peachring.com", () => {
          const p = window.location.pathname;
          let matched = p.match(/^\/u\/(\d+)$/)?.[1];
          if (matched) window.open(`https://peachring.com/u/${matched}/`);
          matched = p.match(/^\/(\d+)\/([A-z0-9]+)$/);
          if (matched) {
            let [, uid, tid] = matched;
            if (!/^\d+$/.test(tid)) tid = weiboFn.mid2id(tid);
            window.open(`https://peachring.com/u/${uid}/?next=${tid}`);
          }
        });
      }
      GM_registerMenuCommand("Base62 Converter", () => {
        const input = prompt("Input String to execute Base 62 encode/decode:");
        if (!input) {
          return;
        }
        const isEncoded = /\D/.test(input);
        const output = isEncoded ? weiboFn.mid2id(input) : weiboFn.id2mid(input),
          tip = isEncoded ? "Decoded" : "Encoded";
        return prompt(`${tip} result:`, output);
      });
      const regex = [
        /\/\/m\.weibo\.cn\/(?:status|detail|\d+)\/([A-z0-9]+)/i,
        /\/\/m\.weibo\.cn\/s\/video\/index.*?(?:blog_mid|segment_id)=(\d+)/i,
        /\/\/h5\.video\.weibo\.com\/show\/1034:(\d+)/i,
        /\/\/video\.h5\.weibo\.cn\/1034:(\d+)\/\d+/i,
        /\/\/weibo\.com\/tv\/show\/1034:(\d+)/i,
        /\/\/service\.account\.weibo\.com\/reportspamobile/
      ];
      let i = 0;
      while (!(matched = src.match(regex[i]))) i++;
      const openUrl = (isH5 = true) => {
        const oid = matched[1];
        //DOM may be changed
        let currentOid = window.location.href.match(regex[4]);
        if (currentOid && currentOid[1] !== oid) {
          oid = currentOid[1];
        }
        fetch(`https://weibo.com/tv/api/component?page=%2Ftv%2Fshow%2F1034%3A${oid}`, {
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          body: `data={"Component_Play_Playinfo":{"oid":"1034:${oid}"}}`,
          method: "POST"
        })
          .then(resp => resp.json())
          .then(resp => {
            if (resp) {
              let info = resp.data.Component_Play_Playinfo,
                mid = info.mid;
              if (isH5) window.open(`https://m.weibo.cn/status/${mid}`);
              else {
                mid = weiboFn.id2mid(mid);
                window.open(`https://weibo.com/${info.user.id}/${mid}`);
              }
            }
          });
        return;
      };
      switch (i) {
        case 0:
          return GM_registerMenuCommand("Base62 URL", () => {
            let currentPid = window.location.href.match(/\/\/m\.weibo\.cn\/(?:status|detail|\d+)\/([A-z0-9]+)/i)?.[1];
            if (!currentPid) return;
            if (/^\d+$/.test(currentPid)) currentPid = weiboFn.id2mid(currentPid);
            const avatar = document.querySelector("div.main div.m-avatar-box a");
            // https://m.weibo.cn/profile/00000000
            const uid = avatar.href.split("/")[4];
            const b62Url = `https://weibo.com/${uid}/${currentPid}`;
            if (isMobileDevice) prompt("Base62 URL:", b62Url);
            else window.open(b62Url);
          });
        case 1:
          return redirect(`https://m.weibo.cn/status/${matched[1]}`);
        case 2:
          if (isMobileDevice) return GM_registerMenuCommand("Open Weibo URL", () => openUrl());
        case 3:
          return (isMobileDevice ? "https://h5.video.weibo.com/show/1034:" : "https://weibo.com/tv/show/1034:") + matched[1];
        case 4:
          return GM_registerMenuCommand("Open Base62 URL", () => openUrl(false));
        case 5:
          return GM_registerMenuCommand("View Weibo", () => {
            let rid = src.split("rid=")?.[1]?.split("&")?.[0];
            rid && window.open("https://m.weibo.cn/status/" + rid);
          });
        default:
          break;
      }
    }
  }

  // Zhihu
  else if (hostname.match(/pic[0-9a-z]\.zhimg\.com/)) {
    return redirect(src.replace(/\/((?:v[0-9]*-)?[0-9a-f]+)(?:_[^/._]*)?(\.[^/.]*)$/, "/$1_r$2"));
  }

  // Bilibili
  else if (hostname.match(/(i[0-9]*\.hdslb|album\.biliimg)\.com/)) {
    return redirect(
      src
        .replace(/(:\/\/[^/]*\/)\d+_\d+\//, "$1")
        .replace(/(?:@|%40)[^/]*$/, "")
        .replace(/(\/[0-9a-f]{20,}\.[^/._]+)_\d+x\d+\.[^/]+(?:[?#].*)?$/, "$1")
        .replace(/\?width=\d+&height=\d+/, "")
    );
  }

  // Alibaba
  else if (hostname.endsWith(".alicdn.com") || hostname.endsWith(".aliexpress-media.com")) {
    newSrc = src;
    if (hostname === "img-tmdetail.alicdn.com") {
      newSrc = src.replace(/^[a-z]+:\/\/[^/]+\/+bao\/+uploaded\/+([^/]+\.[^/]+\/+)/, "$1");
      if (!newSrc.match(/^https?:\/\//)) {
        newSrc = "https://" + newSrc;
      }
      return redirect(newSrc);
    }
    if (/[0-9]*\.alicdn\.com/.test(hostname) || hostname === "img.alicdn.com" || hostname.endsWith(".aliexpress-media.com")) {
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
  } else if (hostname === "bkimg.cdn.bcebos.com") {
    return redirect(
      src
        .replace("/smart/", "/pic/")
        .replace(/[?#].*/, "")
        .replace(/-bkimg-process.*/, "")
    );
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
    newSrc = src.split("!")[0].replace("/pfop/", "/");
    if (newSrc !== src) return redirect(newSrc);
  }

  // Banciyuan
  else if (hostname.endsWith(".bcyimg.com")) {
    newSrc = src.replace(/p\d-bcy-sign(.*?~).*/, "p3-bcy$1tplv-banciyuan-obj.image");
    if (newSrc !== src) return redirect(newSrc);
  }

  // Pixiv, Fanbox, Booth
  else if (/i(-c?f)?\.pximg\.net/.test(hostname) || hostname === "pixiv.pximg.net") {
    if (document.contentType.startsWith("text"))
      bodyLoaded(body =>
        body.insertAdjacentHTML(
          "beforeend",
          '<hr><center><h1><a href="https://www.pixiv.net/jump.php?url=' + encodeURIComponent(src) + '">Try</a> to add Pixiv referer</h1></center>'
        )
      );
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
  } else if (hostname === "downloads.fanbox.cc") {
    newSrc = src.replace(/\/(c|w)\/\d+(x\d+)?\//, "/");
    if (newSrc !== src) return redirect(addExts(newSrc, ["png", "jpeg"]));
  } else if (hostname.match(/s[0-9]*\.booth\.pm$/) || hostname === "booth.pximg.net") {
    newSrc = src.replace(/\/c\/[a-z]_[0-9]+\//, "/").replace(/_c_[0-9]+x[0-9]+(\.[^/.]*)$/, "$1");
    if (newSrc !== src) return redirect(addExts(newSrc));
    newSrc = src.replace(/(:\/\/[^/]*\/)c\/[0-9]+x[0-9]+(?:_[^/]*)?\//, "$1");
    if (newSrc !== src) return redirect(addExts(newSrc));
    newSrc = src.replace(/(\/[-0-9a-f]+)_[^/.]*(\.[^/.]*)$/, "$1$2");
    if (newSrc !== src) return redirect(addExts(newSrc));
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

    GM_registerMenuCommand("Get timestamp", () => {
      let str = prompt("Image URL or filename", src);
      str = str
        .split("/")
        .pop()
        .replace(/[.?:].*/, "")
        .replace(/_/g, "/")
        .replace(/-/g, "+");
      let pid = new DataView(Uint8Array.from(atob(str), m => m.codePointAt(0)).buffer).getBigUint64();
      prompt("Image date:", new Date(Number(1288834974657n + (pid >> 22n))).toISOString());
    });

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
  else if (hostname === "www.youtube.com") {
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
  } else if (hostname.startsWith("www.google.") && /tbs=sbi(:|%3A)/.test(src)) {
    // Close Safe Search & Show Image Direct Link
    if (src.indexOf("safe=off") === -1) {
      return redirect(addQueries(src, { safe: "off" }));
    }
  }

  // Artstation
  else if (/^cdn(?:a|b)\.artstation\.com$/.test(hostname)) {
    const regex =
      /(\/assets\/+(?:images|covers)\/+images\/+[0-9]{3}\/+[0-9]{3}\/+[0-9]{3}\/+)(?:[0-9]+\/+)?(?:small(?:er)?|micro|medium|large|4k)(?:_square)?\/([^/]*)$/;
    if (regex.test(src)) {
      return redirect([src.replace(regex, "$1original/$2"), src.replace(regex, "$14k/$2"), src.replace(regex, "$1large/$2")]);
    }
  } else if (hostname === "www.artstation.com") {
    GM_registerMenuCommand("View JSON", () => {
      const matched = location.pathname.match(/\/artwork\/([0-9A-Za-z]+)/)?.[1];
      if (matched) window.open(`/projects/${matched}.json`);
    });
  }

  // Steam
  else if (hostname.match(/(?:cdn|shared)\.[^.]*\.steamstatic\.com/) || hostname.match(/steamcdn(?:-[a-z]*)?\.akamaihd\.net/)) {
    newSrc = src.replace(/(\/steam\/+apps\/+[0-9]+\/+movie)[0-9]+(?:_vp9)?(\.[^/.]+)(?:[?#].*)?$/, "$1_max$2");
    if (newSrc !== src) return redirect(newSrc);

    newSrc = src.replace(/(\/steam\/+apps\/+[0-9]+\/+movie)\.(?:jpg|JPG|jpeg|JPEG|png|PNG)(?:[?#].*)?$/, "$1_max.webm");
    if (newSrc !== src) return redirect(newSrc);

    newSrc = src.replace(/(\/steamcommunity\/+public\/+images\/+clans\/+[0-9]+\/+[0-9a-f]{20,})_[0-9]+x[0-9]+(\.[^/.]+)(?:[?#].*)?$/, "$1$2");
    if (newSrc !== src) return redirect(newSrc);

    newSrc = src.replace(/(\/steam\/+apps\/+[0-9]+\/+library_[0-9]+x[0-9]+)\./, "$1_2x.");
    if (newSrc !== src) return redirect(newSrc);
    return redirect(src.replace(/\.[0-9]+x[0-9]+(\.[^/]*)$/, "$1"));
  } else if (hostname.endsWith(".steamstatic.com") && hostname.startsWith("avatars.")) {
    return redirect(src.replace(/(:\/\/[^/]+\/+[0-9a-f]{10,})(?:_medium)?\./, "$1_full."));
  } else if (hostname === "community.akamai.steamstatic.com") {
    if (!/\/public\/+images\/+sharedfiles\/+game_highlight_activethumb/.test(src)) {
      return redirect(src.replace(/(\/economy\/+image\/+[^/]+\/+)[0-9]+x[0-9]+([?#].*)?$/, "$1$2"));
    }
  }

  // Pinterest
  else if (
    hostname === "i.pinimg.com" ||
    (hostname.endsWith("pinimg.com") && hostname.match(/^(?:i|(?:s-)?media-cache)-[^.]*\.pinimg/)) ||
    (hostname.endsWith("s3.amazonaws.com") && src.indexOf("media.pinterest.com") > -1)
  ) {
    const noSuffix = src.replace(/[?#].*$/, "");
    if (noSuffix.match(/:\/\/[^/]*\/media\.pinterest\.com\//)) {
      newSrc = noSuffix.replace(/(:\/\/[^/]*\/media\.pinterest\.com\/)[^/]*(\/.*\/[^/]*\.[^/.]*)$/, "$1originals$2");
    } else {
      newSrc = noSuffix.replace(/(:\/\/[^/]*\/)[^/]*(\/.*\/[^/]*\.[^/.]*)$/, "$1originals$2");
    }
    return redirect(addExts(newSrc, ["gif", "png", "jpg"]));
  }

  // Discord
  else if (/\bdiscordapp\b/.test(hostname)) {
    if (hostname === "images.discordapp.net") {
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
      newSrc = src.replace(/(\/stickers\/+[0-9]{5,}\.[^/.?#]+)(?:[?#].*)?$/, "$1?size=4096");
      if (newSrc !== src) return redirect();
      if (/\/attachments\/+[0-9]+\/+/.test(src)) {
        let queries = getQueries(src);
        let keptQueries = {};
        ["ex", "is", "hm"].forEach(k => {
          keptQueries[k] = queries[k];
        });
        return redirect(addQueries(src.replace(/\?.*$/, ""), keptQueries));
      }
    }
    if (hostname.endsWith("discordapp.net") && hostname.match(/images-ext-[0-9]*\.discordapp\.net/)) {
      return redirect(decodeURIComponent(src.replace(/.*\/external\/[^/]*\/(?:([^/]*)\/)?(https?)\/(.*?)(?:\?[^/]*)?$/, "$2://$3$1")));
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

  // Tumblr (new URL only)
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

  // Blue Sky
  else if (hostname === "cdn.bsky.app") {
    newSrc = src.replace("feed_thumbnail", "feed_fullsize");
    if (newSrc !== src) return redirect(newSrc);
    GM_registerMenuCommand("com.atproto.sync.getBlob", () => {
      const matched = src.match(/(did:plc:\w+)\/(\w+)/);
      const did = matched?.[1];
      const cid = matched?.[2];
      if (did && cid) {
        const url = `https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`;
        window.open(url);
      }
    });
  }

  // Reddit
  else if (hostname === "www.reddit.com" && src.indexOf("/media?url=") > -1) {
    newSrc = getQueries(src, true)?.url?.replace(
      /:\/\/preview\.redd\.it\/(award_images\/t[0-9]*_[0-9a-z]+\/)?(?:[-0-9a-z]+-)*([^-/.]+\.[^.?]*)\?.*$/,
      "://i.redd.it/$1$2"
    );
    return redirect("https://www.reddit.com/media?url=" + encodeURIComponent(newSrc));
  }

  // NicoSeiga
  else if (hostname === "lohas.nicoseiga.jp") {
    let pid = pathname.match(/thumb\/(\d+)/)?.[1];
    // Need Login
    if (pid) return redirect("https://sp.seiga.nicovideo.jp/image/source/" + pid);
  } else if (hostname === "deliver.cdn.nicomanga.jp") {
    let b64 = pathname.match(/thumb\/([A-Za-z0-9+/]+)\./)?.[1];
    // Need Login
    if (b64) {
      let sp = new URL(atob(b64)).searchParams;
      return redirect(`https://deliver.cdn.nicomanga.jp/priv/${sp.get("h")}/${sp.get("e")}/${sp.get("id")}`);
    }
  }

  // Foriio
  else if (hostname === "imgx.foriio.com" || hostname === "foriio.imgix.net") {
    const matched = src.match(/\/store\/[0-9a-f]{32}\.(?:png|jpg|webp)/)?.[0];
    newSrc = "foriio.imgix.net" + matched;
    // dyci7co52mbcc.cloudfront.net
    if (matched) return redirect("https://foriio.imgix.net" + matched);
  }

  // Web Archive
  else if (hostname.endsWith(".archive.org") && /^ia[0-9]*\./.test(hostname)) {
    newSrc = src.replace(/(\/items\/+mbid-[-0-9a-f]+\/+mbid-[-0-9a-f]+)_(?:thumb[0-9]+|itemimage)(\.[^/.]*)(?:[?#].*)?$/, "$1$2");
    if (newSrc !== src) {
      return redirect(addExts(newSrc, ["png", "jpg"]));
    }
  } else if (hostname === "coverartarchive.org") {
    return redirect(src.replace(/(\/[0-9]+)-[0-9]+(\.[^/.]*)(?:[?#].*)?$/, "$1$2"));
  }

  /**
   * Add multiple extensions for guessing real url.
   * @param {String} obj - url(s) to edit suffix
   * @param {Array} extList - Extensions list
   */
  function addExts(obj, extList = ["jpg", "jpeg", "png", "gif", "webp", "avif", "JPG", "JPEG", "PNG", "GIF"]) {
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

  function guessUrl(urls, cb, method = "HEAD", count = 0) {
    if (count >= urls.length) return cb(null);
    fetch(urls[count], { method })
      .then(response => {
        if (response.ok) return cb(urls[count]);
        // For twimg always respose 503 if method is "HEAD"
        else if (response.status === 503) return guessUrl(urls, cb, "GET", count);
        else return guessUrl(urls, cb, method, count + 1);
      })
      .catch(error => {
        console.error("Network error:", error);
        return guessUrl(urls, cb, method, count + 1);
      });
  }

  function redirect(newSrc) {
    if (newSrc === src) return;
    if (Array.isArray(newSrc)) {
      guessUrl(newSrc, url => {
        if (url && url !== src) window.location.assign(url);
      });
    } else window.location.replace(newSrc);
  }
})();
