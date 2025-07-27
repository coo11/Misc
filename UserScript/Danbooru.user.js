// ==UserScript==
// @name          Danbooru
// @namespace     https://github.com/coo11/Misc/tree/master/UserScript
// @match         *://*.donmai.us/*
// @exclude-match *://cdn.donmai.us/*
// @version       1.13
// @author        coo11
// @icon          data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientTransform='rotate(85)'%3E%3Cstop offset='.49' stop-color='%23ba9570'/%3E%3Cstop offset='.67' stop-color='%23a4815f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg stroke='%23000'%3E%3Cpath d='M1.5 14.5V4.25L4.25 1.5H14.5v10.25l-2.75 2.75z' fill='url(%23a)'/%3E%3Cpath d='M1.5 4.5h10v10m0-10 3-3' fill='none'/%3E%3C/g%3E%3C/svg%3E
// @run-at        document-end
// @resource      panzoom https://registry.npmmirror.com/panzoom/9.4.3/files/dist/panzoom.min.js
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @description   Start taking over the world!
// ==/UserScript==

if (typeof unsafeWindow === "undefined") globalThis.unsafeWindow = window;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const formatBytes = bytes => {
  if (bytes === 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  return `${formattedValue} ${units[i]}`;
};

const secondsToMinutes = seconds => {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`.slice(0, 5);
};

const createElement = (tag, props = {}, dataset = {}) => {
  const el = document.createElement(tag);
  Object.assign(el, props);
  Object.assign(el.dataset, dataset);
  return el;
};

const decodeHtml = html => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const BOORU = {
  hostPrefix: location.hostname.split(".")[0],
  controller: document.body.dataset?.controller,
  action: document.body.dataset?.action,
  postId: document.body.dataset?.postId,
  pathname: location.pathname,
  searchParams: new URLSearchParams(location.search),
  iconUri: document.querySelector("a#close-notice-link use").href.baseVal.split("#")[0],
  tagBox: document.getElementById("post_tag_string"),
  isMobile: window.matchMedia("(max-width: 660px)").matches,
  async init() {
    if (document.title.startsWith("Page Removed") || this.action === "error") {
      if (this.pathname === "/posts") {
        this.controller = "posts";
        this.action = "index";
        bannedPostsHelper.handleTakedownTip();
        tooltipHelper.init();
        return;
      } else {
        const postId = this.pathname.match(/^\/posts\/(\d+)/)?.[1];
        if (postId) {
          this.postId = postId;
          this.controller = "posts";
          this.action = "show";
          await bannedPostsHelper.showBannedPost();
        }
      }
    }
    tooltipHelper.init();
    full2HalfWidthChar();
    enhancePage();

    switch (this.controller) {
      case "artists":
        if (this.action === "show" || this.action === "edit") addPostChangesButtonToArtistPage();
        bannedPostsHelper.setArtistPagePostsLink();
        break;
      case "upload-media-assets":
      case "uploads":
        if (this.action === "show") {
          !this.isMobile && mediaAssetPanzoom.init();
          easierOneUp.init();
          autoSaver.init();
          enhanceUploadPage();
        }
        break;
      case "media-assets":
        if (this.action === "show") !this.isMobile && mediaAssetPanzoom.init();
        break;
      case "favorite-groups":
        if (this.action === "edit") initFavgroupSorter();
        break;
      case "posts":
        if (this.action === "index") {
          document.querySelector("#mode-box select")?.addEventListener("change", () => setTimeout(() => localStorage.setItem("mode", "view")));
          bannedPostsHelper.handleBannedPosts();
        } else if (this.action === "show") {
          tooltipHelper.initFavgroupCountTooltip();
          autoSaver.init(false);
          hookNoteBoxChanges.init();
          enhancePostPage();
        }
        break;
      case "iqdb-queries":
        bannedPostsHelper.handleIqdbQueries();
        break;
      case "static":
        if (this.action === "not-found") fakeTagBox();
        break;
      default:
        break;
    }
  }
};

const bannedPostsHelper = {
  thumbnailData: {
    // /media_assets/23609685
    variants: [
      {
        type: "180x180",
        url: "https://cdn.donmai.us/180x180/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.jpg",
        width: 180,
        height: 135,
        file_ext: "jpg"
      },
      {
        type: "360x360",
        url: "https://cdn.donmai.us/360x360/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.jpg",
        width: 360,
        height: 270,
        file_ext: "jpg"
      },
      {
        type: "720x720",
        url: "https://cdn.donmai.us/720x720/3e/3c/3e3c7baac2a12a0936ba1f62a46a3478.webp",
        width: 720,
        height: 540,
        file_ext: "webp"
      }
    ]
  },
  postPreviewSize: BOORU.controller === "posts" ? Danbooru.Cookie.get("post_preview_size") || "180" : "180",
  get tipElement() {
    const p = document.querySelector("#page > p:last-child");
    return p?.innerText === "This page has been removed because of a takedown request." ? p : {};
  },
  userPerPage: Danbooru.CurrentUser.data("per-page"),
  searchParams: new URLSearchParams({ tags: "" }),
  initSearchParams() {
    let tags = BOORU.searchParams.get("tags") || "";
    let re = "\\blimit:(\\d+)\\b";
    let tagsLimit = Number(tags.match(new RegExp(re, "i"))?.[1] || Infinity);
    let searchLimit = Number(BOORU.searchParams.get("limit") || Infinity);
    let realLimit = Math.min(tagsLimit, searchLimit);
    if (realLimit !== Infinity) {
      tags = tags.replace(new RegExp(re, "gi"), "").trim() + " limit:" + realLimit;
      this.userPerPage = realLimit;
    }
    this.searchParams.set("tags", tags.trim());
    const page = BOORU.searchParams.get("page");
    if (page) this.searchParams.set("page", page);
  },
  handleTakedownTip() {
    this.initSearchParams();
    const tags = this.searchParams
      .get("tags")
      .replace(/(status|is|has|user|id|limit):\S+/gi, "")
      .trim();
    if (tags && !/\s/.test(tags)) {
      this.searchParams.set("tags", this.searchParams.get("tags") + " -1");
      this.tipElement.innerHTML =
        'This page has been removed because of <a class="dtext-wiki-link tag-type-1" href="/artists/show_or_new?name=' +
        `${tags}">${tags.replace(/_/g, " ")}</a>'s takedown request. ` +
        `<a href="/posts?${this.searchParams.toString()}#show-banned">Show page</a>.`;
    }
  },
  handleBannedPosts() {
    this.initSearchParams();
    const postContainer = document.querySelector("#posts > div.post-gallery > div.posts-container");
    if (postContainer) {
      const tags = this.searchParams.get("tags");
      if (!/\border:random\b/.test(tags)) {
        if (location.hash === "#show-banned") {
          this.fetchAllPosts(postContainer);
          document.querySelectorAll("#posts div.paginator a, #related-list a[href$='status%3Adeleted']").forEach(a => {
            a.href = a.href + "#show-banned";
          });
        } else {
          const userPerPage = this.userPerPage;
          const postCount = postContainer.children.length;
          if (postCount !== userPerPage) {
            let a = document.createElement("a");
            a.id = "check_banned_posts";
            a.href = "#";
            a.title = "Shortcut is c";
            a.setAttribute("data-shortcut", "c");
            a.innerHTML = "<i>Banned</i>";
            a.addEventListener("click", event => {
              event.preventDefault();
              a.innerHTML = "<i>Checking...</i>";
              this.fetchAllPosts(postContainer)
                .then(() =>
                  $(a)
                    .html('<i style="color:var(--success-color)">Finished.</i>')
                    .fadeOut("slow", function () {
                      $(this).remove();
                    })
                )
                .catch(() => $(a).html('<i style="color:var(--error-color)">Failure</i>'));
            });
            document.getElementById("show-posts-link").closest("li").insertAdjacentElement("beforeend", a);
            unsafeWindow.Danbooru.Shortcuts.initialize_data_shortcuts();
          }
        }
      }
    }
  },
  fetchAllPosts(postContainer) {
    const tags = this.searchParams.get("tags");
    const showDeleted = /\bstatus:(deleted|any|all)\b/.test(tags) || unsafeWindow.Danbooru.CurrentUser.data("show-deleted-posts");
    return fetch("/posts.json?" + this.searchParams.toString())
      .then(response => response.json())
      .then(posts => {
        let bannedPostsCount = posts.filter(post => post.is_banned === true).length;
        if (!showDeleted) posts = posts.filter(post => !post.is_deleted);
        this.insertBannedPosts(postContainer, Array.from(postContainer.children), posts, shownBannedPostsCount => {
          let msg = "";
          if (bannedPostsCount === 0 && shownBannedPostsCount === 0) msg = "No banned posts found.";
          else if (shownBannedPostsCount === 0 && bannedPostsCount > shownBannedPostsCount) {
            if (bannedPostsCount === 1) msg = "1 banned post found.";
            else msg = `${bannedPostsCount} banned posts found.`;
          } else {
            if (shownBannedPostsCount === 1) msg = "Show 1 banned post.";
            else msg = `Show ${shownBannedPostsCount} banned posts.`;
            if (bannedPostsCount != shownBannedPostsCount) {
              msg += ` ${bannedPostsCount} posts found in total.`;
            }
          }
          unsafeWindow.Danbooru.Notice.info(msg);
          BOORU.isMobile && tooltipHelper.touchScreenTooltipFixer(postContainer);
          this.fixBlacklist(postContainer);
        });
      })
      .catch(e => {
        console.error("Error:", e);
      });
  },
  insertBannedPosts(container, currentPosts, posts, callback) {
    const currentPostIds = currentPosts.map(el => Number(el.dataset.id));
    currentPostIds.push(0);
    let idx = 0,
      bannedToShow = 0,
      postsLength = posts.length;
    currentPostIds.forEach((pid, index) => {
      let htmlToInsert = "";
      for (; idx < postsLength; idx++) {
        let post = posts[idx].post || posts[idx];
        if (post.id !== pid) {
          if (post.is_banned) {
            htmlToInsert += this.renderPreviewData({
              similarity: posts[idx].score,
              ...post
            });
            bannedToShow++;
          }
        } else break;
      }
      if (htmlToInsert) {
        if (pid === 0) {
          container.insertAdjacentHTML("beforeend", htmlToInsert);
        } else currentPosts[index].insertAdjacentHTML("beforebegin", htmlToInsert);
      }
    });
    callback?.(bannedToShow);
  },
  setArtistPagePostsLink() {
    const isBannedArtist = document.getElementsByClassName("banned-artist-label").length;
    if (isBannedArtist) {
      const a = document.getElementById("subnav-posts");
      a.href = a.href + "+-1#show-banned";
    }
  },
  fixBlacklist(container) {
    const articles = container.querySelectorAll("article:not(.blacklist-initialized)");
    if (articles.length) {
      const blacklistEl = document.getElementById("blacklist-box");
      const blacklistObj = blacklistEl.blacklist;
      articles.forEach(article => {
        const post = new Danbooru.Blacklist.Post(article, blacklistObj);
        post.applyRules();
        if (post.rules.size) blacklistObj.blacklistedPosts?.push(post);
        blacklistObj.posts.push(post);
      });
      blacklistEl.querySelectorAll("div:nth-child(2)>div").forEach(el => {
        let posts = el._x_dataStack?.[0]?.rule.posts;
        el._x_runEffects();
        if (posts?.size) el.children[2]._x_runEffects();
      });
      blacklistEl.querySelector("label>input")._x_runEffects();
      blacklistEl.children[0].children[1]._x_runEffects();
      blacklistObj.rules.some(rule => rule.posts.size > 0) && blacklistEl._x_doShow();
    }
  },
  handleIqdbQueries() {
    // app/logical/iqdb_client.rb
    // Priority: hash, file, url, id
    let params = ["search[hash]", "search[file]", "search[url]", "search[post_id]", "search[media_asset_id]", "hash", "file", "url", "post_id", "media_asset_id"];
    document.querySelector("#c-iqdb-queries form").addEventListener("submit", e => {
      const data = new FormData(e.currentTarget);
      for (let key of params.slice(0, 4)) {
        const val = data.get(key);
        if (val) {
          if (key === "search[file]") {
            console.warn("TODO: Find way to get file's iqdb_hash.");
          } else {
            e.preventDefault();
            location.href = `/iqdb_queries?${key}=${val}`;
            break;
          }
        }
      }
    });
    const hasParam = params.some(param => BOORU.searchParams.has(param));
    if (!hasParam) return;
    fetch("/iqdb_queries.json?" + BOORU.searchParams.toString())
      .then(resp => resp.json())
      .then(json => {
        const container = document.querySelector("div.iqdb-posts div.posts-container");
        this.insertBannedPosts(container, Array.from(container.children), json);
        this.fixBlacklist(container);
      });
  },
  renderPreviewData({ id, uploader_id, score, rating, tag_string, is_pending, is_flagged, is_deleted, has_children, parent_id, media_asset, source, similarity }) {
    const { width, height, url } = this.thumbnailData.variants.filter(info => {
      const sizeMap = {
        150: "180x180",
        180: "180x180",
        225: "360x360",
        270: "360x360",
        360: "360x360",
        720: "720x720"
      };
      return info.type === sizeMap[this.postPreviewSize];
    })[0];
    const dataFlag = is_pending ? "pending" : is_flagged ? "flagged" : is_deleted ? "deleted" : "";
    const classList = ["post-preview", "post-preview-" + this.postPreviewSize, "post-preview-fit-compact"];
    is_pending && classList.push("post-status-pending");
    is_flagged && classList.push("post-status-flagged");
    is_deleted && classList.push("post-status-deleted");
    has_children && classList.push("post-status-has-children");
    parent_id && classList.push("post-status-has-parent");

    let bottomPart = "";
    if (BOORU.controller === "posts") {
      const hideScore = Danbooru.Cookie.get("post_preview_show_votes") === "false";
      if (!hideScore) {
        classList.push("post-preview-show-votes");
        bottomPart = `<div class="post-preview-score text-sm text-center mt-1">
<span class="post-votes inline-flex gap-1" data-id="${id}">
<a class="post-upvote-link inactive-link" data-remote="true" rel="nofollow" data-method="post" href="/posts/${id}/votes?score=1">
<svg class="icon svg-icon upvote-icon" viewBox="0 0 448 512">
<use fill="currentColor" href="${BOORU.iconUri}#arrow-alt-up"></use></svg></a>
<span class="post-score inline-block text-center whitespace-nowrap align-middle min-w-4">
<a rel="nofollow" href="/post_votes?search%5Bpost_id%5D=${id}&amp;variant=compact">${score}</a></span>
<a class="post-downvote-link inactive-link" data-remote="true" rel="nofollow" data-method="post" href="/posts/${id}/votes?score=-1">
<svg class="icon svg-icon downvote-icon" viewBox="0 0 448 512">
<use fill="currentColor" href="${BOORU.iconUri}#arrow-alt-down"></use>
</svg></a></span></div>`;
      }
    } else {
      similarity && classList.push(similarity < 70 ? "iqdb-low-similarity hidden" : "iqdb-high-similarity");
      const similarityHtml = similarity ? `<div><a class="inactive-link iqdb-similarity-score" href="/iqdb_queries?post_id=${id}">${similarity.toFixed(0)}% similar</a></div>` : "";
      const { id: mid, image_width, image_height, file_size, file_ext } = media_asset;
      bottomPart = `<div class="text-xs text-center mt-1"><div>
<a rel="external noreferrer nofollow" title="${source}" class="inline-block align-top" href="${source}">
<svg class="icon svg-icon globe-icon h-4" viewBox="0 0 512 512">
<use fill="currentColor" href="${BOORU.iconUri}#globe"></use></svg></a>
<a href="/media_assets/${mid}">${formatBytes(file_size)} .${file_ext}, ${image_width}×${image_height}</a></div>${similarityHtml}</div>`;
    }

    return `<article id="post_${id}" class="${classList.join(" ")}" 
data-id="${id}" data-tags="${tag_string}" data-rating="${rating}" data-flags="${dataFlag}" data-score="${score}" data-uploader-id="${uploader_id}">
<div class="post-preview-container"><a class="post-preview-link" draggable="false" href="/posts/${id}"><picture>
<img class="post-preview-image" src="${url}" width="${width}" height="${height}" alt="post #${id}" data-title="${tag_string} rating:${rating} score:${score}" title="" draggable="false" aria-expanded="false"></picture></a></div>${bottomPart}</article>`;
  },
  async showBannedPost() {
    this.tipElement.innerText = "Fetching data....";
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
};
const tooltipHelper = {
  init() {
    GM_addStyle(
      `.stt-bubble,.stt-bubble>.stt-arrow{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.stt-bubble{--stt-bgcolor:var(--post-tooltip-background-color);--stt-title-bgcolor:var(--post-tooltip-header-background-color);--stt-arrow-color:var(--stt-bgcolor);background:var(--stt-bgcolor);border:1px solid var(--post-tooltip-border-color);position:absolute;text-align:center;border-radius:4px;z-index:9999;box-shadow:var(--shadow-lg)}.stt-style{cursor:help;border-bottom:1px dotted}.stt-bubble .stt-title{background:var(--stt-title-bgcolor);font-size:10px;border-radius:3px 3px 0 0}.stt-content{word-wrap:break-word;padding:.5em}.stt-bubble>.stt-arrow{position:absolute;border-width:0;pointer-events:none;left:50%;margin-left:0}.stt-bubble>.stt-arrow::after,.stt-bubble>.stt-arrow::before{content:'';position:absolute;left:0;border-style:solid;border-color:transparent}.stt-bubble.top>.stt-arrow{top:100%}.stt-bubble.top>.stt-arrow::before{top:0;border-width:7px 7px 0;border-top-color:var(--stt-arrow-color)}.stt-bubble.top>.stt-arrow::after{top:1px;border-width:7px 7px 0;border-top-color:var(--post-tooltip-border-color);z-index:-1}.stt-bubble.bottom>.stt-arrow{bottom:100%}.stt-bubble.bottom>.stt-arrow::before{bottom:0;border-width:0 7px 7px;border-bottom-color:var(--stt-arrow-color)}.stt-bubble.bottom>.stt-arrow::after{bottom:1px;border-width:0 7px 7px;border-bottom-color:var(--post-tooltip-border-color);z-index:-1}` +
        `.stt-content>div.artist-info{display:flex;flex-direction:column}.stt-content>div.artist-info>ul{max-height:240px;padding-right:.2rem;margin-bottom:.3rem;text-align:left}.stt-content>div.artist-info li{line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.stt-bubble div.artist-info>p:last-of-type{display:inline-block;text-align:left;margin:0}.stt-content>div.artist-info>p>span:last-of-type{float:right;margin-right:.3rem;color:var(--muted-text-color)}` +
        `table.stt-favgroup thead tr{border-bottom:2px solid var(--table-header-border-color)}table.stt-favgroup tbody tr{border-bottom:1px solid var(--table-row-border-color)}table.stt-favgroup tbody tr:hover{background:var(--table-row-hover-background)}table.stt-favgroup tr:nth-child(2n){background:var(--table-even-row-background)}table.stt-favgroup td,table.stt-favgroup th{line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;padding-right:.5rem}table.stt-favgroup th{text-align:center}table.stt-favgroup td,table.stt-favgroup th:first-child{text-align:left}`
    );

    // Simple Tooltip v1.0.10 - Forked from [tipso](https://github.com/object505/tipso)
    // prettier-ignore
    ((t,e)=>{const i="stt",s={background:null,titleBackground:null,titleContent:"",width:200,content:null,fetchContentUrl:null,fetchContentBuffer:0,contentElementId:null,useTitle:!1,templateEngineFunc:null,onBeforeShow:null,onShow:null,onHide:null};class n{constructor(i,n){this.element=i,this.$element=t(this.element),this.doc=t(document),this.win=t(e),this.settings={...s,...n,...this.$element.data("stt")},this._title=this.$element.attr("title"),this.mode="hide",this.init()}init(){const t=this.$element;t.addClass("stt-style").removeAttr("title");let e=null,s=null;t.on(`mouseover.${i}`,(t=>{t.ctrlKey||t.altKey||(clearTimeout(e),clearTimeout(s),s=setTimeout((()=>this.show()),150))})).on(`mouseout.${i}`,(()=>{clearTimeout(e),clearTimeout(s),e=setTimeout((()=>this.hide()),150),this.tooltip().on(`mouseenter.${i}`,(()=>{this.mode="tooltipHover"})).on(`mouseleave.${i}`,(()=>{this.mode="show",clearTimeout(e),e=setTimeout((()=>this.hide()),150)})).on(`contextmenu.${i}`,(()=>{this.isContextMenuOpen=!0,this.win.on(`mouseover.${i}`,(t=>{this.tooltip()[0].contains(t.target)||(this.isContextMenuOpen=!1,this.mode="show",this.hide())}))}))})),this.settings.fetchContentUrl&&(this.fetchContent=null)}tooltip(){return this.stt_bubble||(this.stt_bubble=t('<div class="stt-bubble"><div class="stt-title"></div><div class="stt-content"></div><div class="stt-arrow"></div></div>')),this.stt_bubble}async show(){const t=this.tooltip(),e=this.win;"function"==typeof this.settings.onBeforeShow&&this.settings.onBeforeShow(this.$element,this.element,this);const s=this.settings.width?{width:this.settings.width}:{width:200};if(t.css({"--stt-bgcolor":this.settings.background,"--stt-title-bgcolor":this.settings.titleBackground,...s}),this.mode="show",t.find(".stt-content").html(await this.content()),t.find(".stt-title").html(this.titleContent()),o(this),e.on(`resize.${i}`,(()=>o(this))),clearTimeout(this.timeout),"hide"===this.mode)return this.hide(!0);this.timeout=setTimeout((()=>{t.appendTo("body").stop(!0,!0).fadeIn(200,(()=>{"function"==typeof this.settings.onShow&&this.settings.onShow(this.$element,this.element,this)}))}),200)}hide(t=!1){const e=this.tooltip(),s=t?0:50;clearTimeout(this.timeout),this.timeout=setTimeout((()=>{"tooltipHover"===this.mode||this.isContextMenuOpen||e.stop(!0,!0).fadeOut(200,(()=>{e.remove(),"function"==typeof this.settings.onHide&&"show"===this.mode&&this.settings.onHide(this.$element,this.element,this),this.mode="hide",this.win.off(`.${i}`)}))}),s)}close(){this.hide(!0)}destroy(){this.$element.off(`.${i}`).removeData(i).removeClass("stt-style").attr("title",this._title),this.win.off(`.${i}`)}titleContent(){return this.settings.titleContent||this.$element.data("stt-title")}async content(){let e;return this.settings.fetchContentUrl?this._fetchContent?e=this._fetchContent:(e=await(await fetch(this.settings.fetchContentUrl)).text(),this.settings.fetchContentBuffer>0?(this._fetchContent=e,setTimeout((()=>{this._fetchContent=null}),this.settings.fetchContentBuffer)):this._fetchContent=null):e=this.settings.contentElementId?t(`#${this.settings.contentElementId}`).text():this.settings.content?this.settings.content:this.settings.useTitle?this._title:this.$element.data("stt"),this.settings.templateEngineFunc&&(e=this.settings.templateEngineFunc(e,this)),e}update(t,e){if(!e)return this.settings[t];this.settings[t]=e}}function o(e){const i=e.tooltip(),s=e.$element,n=t(window);let{width:o,height:h}=function(t){const e=t.clone().css("visibility","hidden").appendTo("body"),i=e.outerHeight(),s=e.outerWidth();return e.remove(),{width:s,height:i}}(i),l=s.offset().left+s.outerWidth()/2-o/2,r=s.offset().top-h-10;const c=e.titleContent()?"var(--stt-title-bgcolor)":"var(--stt-bgcolor)";if(i.find(".stt-arrow").css({marginLeft:-7,marginTop:""}),r<n.scrollTop()?(r=s.offset().top+s.outerHeight()+10,i.css({"--stt-arrow-color":c}).removeClass("top bottom").addClass("bottom")):i.css({"--stt-arrow-color":"var(--stt-bgcolor)"}).removeClass("top bottom").addClass("top"),l<n.scrollLeft()&&(i.find(".stt-arrow").css({marginLeft:l-7}),l=10),l+o>n.innerWidth()){const t=n.innerWidth()-(l+o);i.find(".stt-arrow").css({marginLeft:-t-7,marginTop:""}),l+=t-10}i.css({left:l,top:r})}t.fn[i]=function(e){if("object"==typeof e||void 0===e)return this.each((function(){t.data(this,`plugin_${i}`)||t.data(this,`plugin_${i}`,new n(this,e))}));if("string"==typeof e&&"_"!==e[0]&&"init"!==e){let s;return this.each((function(){const o=t.data(this,`plugin_${i}`);o instanceof n&&"function"==typeof o[e]&&(s=o[e].apply(o,Array.prototype.slice.call(arguments,1))),"destroy"===e&&t.data(this,`plugin_${i}`,null)})),void 0!==s?s:this}}})(jQuery,"undefined"!=typeof unsafeWindow&&unsafeWindow&&unsafeWindow!==window?unsafeWindow:window)

    this.bindTooltipsToElements();
    this.hookDtextPreview();
  },
  globalTooltipConfig: [
    {
      selector: ".tag-type-1 a, a.dtext-wiki-link.tag-type-1, a.dtext-artist-id-link",
      options: {
        width: 360,
        fetchContentBuffer: 15e3,
        onBeforeShow: (_, el, instance) => {
          const url = new URL(el.href);
          const artist = url.searchParams.get("name") || url.searchParams.get("tags");
          if (artist) {
            return instance.update("fetchContentUrl", `/artists/show_or_new?name=${artist}`);
          } else if (url.pathname.startsWith("/artists/")) {
            const uid = url.pathname.slice(9);
            if (/^\d+$/.test(uid)) {
              return instance.update("fetchContentUrl", `/artists/${uid}`);
            }
          }
          instance.destroy();
        },
        templateEngineFunc: content => {
          const doc = new DOMParser().parseFromString(content, "text/html");
          const uid = doc.body.dataset.artistId;
          const name = doc.querySelector("a.tag-type-1")?.innerText?.replace(/ /g, "_");
          const count = doc.querySelector("div#a-show span.post-count")?.innerText;
          let p = `<p><a target="_blank" href="/artists/${uid}/edit">Edit artist</a>&nbsp;|&nbsp;<a target="_blank" href="/post_versions?search%5Bchanged_tags%5D=${name}">Post Changes</a><span>`;
          if (count && count !== "0") {
            p += `<a target="_blank" class="inactive-link" href="/posts?tags=status%3Aany+${name}">${count}</a>,&nbsp;`;
          }
          p += `<a target="_blank" class="inactive-link" href="/artist_versions?search%5Bartist_id%5D=${uid}">0</a></span></p>`;
          const ul = doc.querySelector("div#a-show > *:not(.artist-wiki) ul:not(#blacklist-list)");
          if (ul) {
            ul.classList.add("thin-scrollbar", "text-xs");
            let lis = ul.children;
            let activeCount = Array.prototype.filter.call(lis, li => !li.children[1].classList.contains("inactive-artist-url")).length;
            ul.querySelectorAll("a").forEach(a => a.setAttribute("target", "_blank"));
            return `<div class="artist-info">${ul.outerHTML}${p.replace(">0</a></span>", `>${activeCount}/${lis.length}</a></span>`)}</div>`;
          } else if (!name) {
            const p = doc.querySelector("div#page>p").textContent;
            return `<div class="artist-info"><p class="m-0 py-1 text-sm" style="text-align:center"><i>${p}</i></p></div>`;
          } else return `<div class="artist-info"><p class="m-0 py-1 text-sm"><i>No URLs yet</i></p>${p}</div>`;
        }
      }
    },
    {
      selector: "a.dtext-media-asset-id-link",
      options: {
        width: "auto",
        fetchContentBuffer: 15e3,
        onBeforeShow(_, el, instance) {
          const assetId = el.innerText.split("#")?.[1];
          if (assetId && /^\d+$/.test(assetId)) {
            instance.tooltip().css({ "min-width": "max-content" });
            instance.tooltip().find(".stt-title").css({
              padding: "0 1rem",
              display: "flex",
              "flex-direction": "row",
              "justify-content": "center",
              "align-items": "center",
              gap: ".2rem",
              height: "1.3rem"
            });
            return instance.update("fetchContentUrl", `/media_assets/${assetId}.json?only=md5,file_ext,file_size,image_width,image_height,duration,variants,post[id]`);
          }
          instance.destroy();
        },
        templateEngineFunc: (content, instance) => {
          let { md5, file_ext, file_size, image_width, image_height, duration, variants, post, error, message } = JSON.parse(content);
          file_size = formatBytes(file_size);
          duration = duration ? ` (${secondsToMinutes(duration)})` : "";
          let title = '<a target="_blank" class="inactive-link text-xs"';
          let meta = `${file_size} .${file_ext}, ${image_width}×${image_height}${duration}`;
          if (md5) {
            const url = variants.filter(s => s.type === "original")[0].url;
            title += ` href="${url}">${meta}`;
          } else title += error ? `>Error: ${error}` : `><s>${meta}</s>`;
          title += "</a>";
          const postId = post?.id;
          if (postId) {
            let src = md5
              ? "https://cdn.donmai.us/original/10/97/1097ebd471c28b70b4181f2dc1d44ca6.webp"
              : "https://cdn.donmai.us/original/69/3b/693ba3d904804b7e26ad1b0d831e64c9.png";
            title += `&nbsp;<a target="_blank" href="/posts/${postId}"><img class="icon h-3" src="${src}"></a>`;
          }
          instance.update("titleContent", title);
          if (!md5) return `<p class="m-0 py-1 text-sm"><i>${message || "Image unavailable."}</i></p>`;
          else {
            const { url, height } = variants.filter(s => s.type.startsWith("360"))[0]; // "180" "720"
            return `<div class="stt-preview-container"><img style="height:${Math.min(240, height)}px" src="${url}"></div>`;
          }
        }
      }
    }
  ],
  bindTooltipsToElements(container = document) {
    this.globalTooltipConfig.forEach(({ selector, options }) => {
      $(selector).each(function () {
        if (!$.data(this, "plugin_stt")) {
          $(this).stt(options);
        }
      });
    });
    BOORU.isMobile && this.touchScreenTooltipFixer(container);
  },
  hookDtextPreview() {
    const fn = Danbooru.DTextEditor.prototype.html,
      that = this;
    Danbooru.DTextEditor.prototype.html = async function () {
      const html = await fn.apply(this, arguments);
      setTimeout(() => that.bindTooltipsToElements(arguments[3]));
      return html;
    };
  },
  initFavgroupCountTooltip() {
    const postId = BOORU.postId;
    fetch("/favorite_groups.json?only=id,name,creator&limit=100&search%5Bpost_ids_include_all%5D=" + postId)
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
          $("li#post-info-favgroups > a").stt({
            width: "auto",
            content: json,
            fetchContentBuffer: 15e3,
            templateEngineFunc: (content, instance) => {
              instance.tooltip().find(".stt-content").css({
                overflow: "hidden auto",
                "max-height": "240px",
                "overscroll-behavior-x": "contain",
                "scrollbar-width": "thin"
              });
              let html = '<table class="stt-favgroup text-xs"><thead><tr><th>Group</th><th>User</th></tr></thead><tbody>';
              for (let {
                id,
                name,
                creator: { id: uid, level_string, name: un, level }
              } of content) {
                html += `<tr><td><a href="/favorite_groups/${id}" target="_blank">${name}</a></td><td><a class="user user-${level_string.toLowerCase()}"  data-user-id="${uid}" data-user-name="${un}" data-user-level="${level}" href="/users/${uid}" target="_blank">${un}</a></td></tr>`;
              }
              html += "</tbody></table>";
              return html;
            }
          });
          BOORU.isMobile && this.touchScreenTooltipFixer("li#post-info-favgroups");
        }
      });
  },
  touchScreenTooltipFixer(container) {
    $(container)
      .find(".post-score>a,.post-favcount>a,a.stt-style")
      .on("click", function (event) {
        const el = event.currentTarget;
        if (!el.dataset.focused) {
          event.preventDefault();
          el.dataset.focused = "true";
          el.addEventListener(
            "blur",
            () => {
              delete el.dataset.focused;
            },
            { once: true }
          );
        }
      });
  }
};
const mediaAssetPanzoom = {
  get media() {
    return document.querySelector(".media-asset-image");
  },
  get initCheck() {
    if (!this._initCheck) {
      this._initCheck =
        document.querySelector(".media-asset-component")?.dataset?.dynamicHeightInitialized === "true" &&
        ((this.media?.tagName === "VIDEO" && this.media.readyState === 4) || (this.media?.tagName === "IMG" && this.media.complete === true && this.media.naturalHeight !== 0));
    }
    return this._initCheck;
  },
  init() {
    let lib = GM_getResourceText("panzoom");
    new Function(lib)();
    const initDelay = setInterval(() => {
      if (this.initCheck) {
        clearInterval(initDelay);
        return this.load();
      }
    });
  },
  load() {
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
const easierOneUp = {
  init() {
    const relatedPosts = document.querySelector("#related-posts-by-source p.fineprint a");
    if (relatedPosts) {
      const shownCount = Number(relatedPosts.innerText.split(" ")[0]);
      let container = document.querySelector("#related-posts-by-source .posts-container");
      let articles = container.children;
      const addButton = articles =>
        [...articles].forEach(el => {
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
            bannedPostsHelper.insertBannedPosts(container, Array.from(articles), json);
            addButton(articles);
          });
      }
      bannedPostsHelper.fixBlacklist(container);
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
    let container = node.querySelector("#iqdb-similar .posts-container");
    if (container) {
      let articles = container.children;
      let shownCount = articles.length;
      let iqdbNoPostFound = shownCount === 0 && document.querySelector(".post-gallery-grid > p:only-child");
      if (!iqdbNoPostFound && shownCount !== 5) {
        let iqdbResults = await this.iqdbReq();
        if (iqdbResults.length !== shownCount) bannedPostsHelper.insertBannedPosts(container, Array.from(articles), iqdbResults);
      }
      for (const post of articles) {
        const div = post.querySelector(".iqdb-similarity-score").parentElement;
        this.addButton(post, div);
      }
      bannedPostsHelper.fixBlacklist(container);
    }
    this.observer?.disconnect();
  },
  copyTags(post, isParent) {
    const tags = post.dataset.tags.split(" ").filter(t => t === "social_commentary" || t.indexOf("commentary") == -1);
    tags.push((isParent ? "parent:" : "child:") + post.dataset.id);
    document.querySelector(`input.radio_buttons[value='${post.dataset.rating}']`).checked = true;
    BOORU.tagBox.value = tags.join(" ") + " ";
    BOORU.tagBox.dispatchEvent(new InputEvent("input", { bubbles: true }));
    document.querySelector(".source-tab").click();
    Danbooru.Notice.info("Successfully copied tags. Please check the commentary tags.");
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
      let resp = await (await fetch(`/iqdb_queries.json?limit=5&search%5Bmedia_asset_id%5D=${mid}&search%5Bsimilarity%5D=50&search%5Bhigh_similarity%5D=70`)).json();
      if (Array.isArray(resp)) return resp;
      else throw new Error(JSON.stringify(resp));
    } catch (e) {
      console.error("Error:", e);
    }
  }
};
const autoSaver = {
  db: null,
  assetId: null,
  DB_STORE_NAME: "savedContentFromUploadPage",
  async init(uploadingPage = true) {
    if (!uploadingPage) {
      this.assetId =
        document.querySelector("#related-tags-container")?.getAttribute("data-media-asset-id") ||
        document.querySelector("#post-info-size > a[href^='/media_assets/']")?.href.split("/").pop();
      await this.openDB();
      this.remove(this.assetId);
    } else {
      this.assetId = document.getElementById("media_asset_id")?.value || document.getElementById("related-tags-container").dataset.mediaAssetId;
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
        BOORU.tagBox.dispatchEvent(new InputEvent("input"));
      }
      document.querySelector("div.tab-panels").addEventListener("input", event => {
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

      document.getElementById("related-tags-container").addEventListener("click", event => {
        const el = event.target;
        if ((el.tagName === "A" || el.tagName === "INPUT") && el.closest("ul")?.className === "tag-list") {
          setTimeout(() => {
            const event = new Event("input", { bubbles: true });
            BOORU.tagBox.dispatchEvent(event);
          });
        }
      });

      this.fixInsertCompletion();
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
  },
  fixInsertCompletion() {
    const fn = unsafeWindow.Danbooru.Autocomplete.insert_completion;
    unsafeWindow.Danbooru.Autocomplete.insert_completion = function () {
      fn.apply(this, arguments);
      // jQuery trigger('input') does not fire native JavaScript input event
      BOORU.tagBox.dispatchEvent(new InputEvent("input", { bubbles: true }));
    };
  }
};
const hookNoteBoxChanges = {
  hook(methodName) {
    {
      const fn = unsafeWindow.Danbooru.Note.Box.prototype[methodName];
      unsafeWindow.Danbooru.Note.Box.prototype[methodName] = function () {
        fn.apply(this, arguments);
        const { id, x, y, w, h } = this.note;
        const prefix = id ? `<a href="/notes/${id}" target="_blank">Note #${id}</a> <a href="/note_versions?search%5Bnote_id%5D=${id}" target="_blank">»</a>` : "Current note";
        unsafeWindow.Danbooru.Notice.info(`${prefix} changed: <code style="background-color: transparent;">x: ${x}, y: ${y}, w: ${w}, h: ${h}</code></span>`);
      };
    }
  },
  init() {
    // `place_note()` shouldn't be directly hooked; otherwise, a notice will be shown every time the page loads.
    this.hook("on_dragstop");
    this.hook("key_nudge");
    this.hook("key_resize");
  }
};

const initFavgroupSorter = () => {
  const sortIds = (ascending = true) => {
    let tArea = document.querySelector("#favorite_group_post_ids_string"),
      ids = tArea.value.trim(),
      idsArr = ids.split(/\s+/).filter(id => /^\d+$/.test(id));
    idsArr = [...new Set(idsArr)];
    idsArr.sort((a, b) => (ascending ? a - b : b - a));
    tArea.value = idsArr.join(" ");
    Danbooru.Notice.info(`Sort in ${ascending ? "ascending" : "descending"} order.`);
  };
  const label = document.querySelector(".favorite_group_post_ids_string > label");
  const span = createElement("span", { classList: "text-xxs text-center", style: "font-weight:normal" });
  const aA = createElement("a", { textContent: "Ascending" });
  const aD = createElement("a", { textContent: "Descending" });
  span.append("  ", aA, " | ", aD);
  label.append(span);
  aA.addEventListener("click", () => sortIds());
  aD.addEventListener("click", () => sortIds(false));
};
const addPostChangesButtonToArtistPage = () => {
  const el = document.querySelector("a#subnav-posts");
  const url = el.href.replace("posts?tags=", "post_versions?search%5Bchanged_tags%5D=");
  if (url) el.insertAdjacentHTML("beforebegin", '<a id="subnav-postchanges" class="py-1.5 px-3" href="' + url + '">Post changes</a>');
};
const full2HalfWidthChar = () => {
  // Convert full-width characters to half-width in search bar or tag edit textbox
  // Legacy code: https://pastee.dev/p/Eds99Iey
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
          const beforeStart = cursorPos - len;
          const before = value.slice(beforeStart, cursorPos);
          if (replacementMap.has(before)) {
            const replacement = replacementMap.get(before);
            const newValue = value.slice(0, beforeStart) + replacement + value.slice(cursorPos);
            if (newValue !== value) {
              target.value = newValue;
              const newCursorPos = beforeStart + replacement.length;
              target.setSelectionRange(newCursorPos, newCursorPos);
            }
            break;
          }
        }
      }, 0);
    });
  });
};
const dragElement = el => {
  if (!el) return;
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
const fakeTagBox = () => {
  GM_addStyle("#post_tag_string{width:100%;height:60vh}#post_tag_string::placeholder{padding:initial}");
  document.getElementById(
    "page"
  ).innerHTML = `<div class="fake-tag-box w-full h-full"><div class="flex justify-between"><label for="post_tag_string">Tags</label> <span data-tag-counter="" data-for="#post_tag_string" class="text-muted text-sm"><span class="tag-count"></span></span></div><div class="input text optional post_tag_string w-full h-full"><textarea data-autocomplete="tag-edit" data-shortcut="e" class="text optional ui-autocomplete-input" name="post[tag_string]" id="post_tag_string" autocomplete="off" title="Shortcut is e" placeholder="Page not found" style=""></textarea></div></div>`;
  setTimeout(() => {
    Danbooru.Autocomplete.initialize_tag_autocomplete();
    const countElement = document.querySelector(".fake-tag-box [data-tag-counter]");
    if (!countElement.innerText) new Danbooru.TagCounter($(countElement));
  }, 0);
};

function enhancePage() {
  !BOORU.isMobile && document.querySelectorAll("a.post-preview-link").forEach(a => (a.draggable = true)); // Fix for gesture plugin
  // Copy tags
  $("#page").on("click", "span.post-count", function () {
    const tagString = this.parentElement.dataset.tagName || this.previousElementSibling.textContent.replace(/\s+/g, "_");
    if (tagString) unsafeWindow.Danbooru.Utility.copyToClipboard(tagString, `Tag <b><i>${tagString}</i></b> copied.`);
  });
  // Top search-box
  {
    let searchForm = document.getElementById("search-box-form"),
      searchInput;
    if (searchForm) {
      searchInput = document.getElementById("tags");
    } else {
      searchForm = createElement("form", { id: "search-box-form", className: "flex", action: "/posts", "accept-charset": "UTF-8", method: "get" });
      searchInput = createElement(
        "input",
        {
          type: "text",
          name: "tags",
          id: "tags",
          className: "flex-auto ui-autocomplete-input",
          autocapitalize: "none",
          autocomplete: "off",
          title: "Shortcut is q"
        },
        {
          shortcut: "q",
          autocomplete: "tag-query"
        }
      );
      searchForm.append(searchInput);
      searchForm.insertAdjacentHTML(
        "beforeend",
        `<button id="search-box-submit" type="submit"><svg class="icon svg-icon search-icon" viewBox="0 0 512 512"><use fill="currentColor" href="${BOORU.iconUri}#magnifying-glass"></use></svg></button>`
      );
    }
    let header = document.getElementById("top"),
      div = document.createElement("div");
    div.id = "search-header";
    document.body.insertBefore(div, header);
    div.appendChild(searchForm);
    document.getElementById("app-name").remove();
    document.getElementById("search-box")?.remove();
    document.querySelector('#post-sections a[href="#search-box"]')?.remove();
    setTimeout(() => {
      Danbooru.Autocomplete.initialize_tag_autocomplete();
      $(searchInput).autocomplete("option", "appendTo", "#search-header");
    }, 0);
    GM_addStyle(
      "body{height:unset;min-height:100%}#search-header{position:sticky;top:0;z-index:11;background-color:var(--body-background-color)}#search-box-form{min-width:180px;width:50vw;margin:0 30px;padding:.5rem 0}#search-box-form input{height:26px}#app-name-header{display:none}#notice{top:calc(1rem + 26px)}#main-menu a{outline-offset:-1px}header#top,header#top>nav{margin-top:0!important}@media screen and (max-width:660px){header#top{z-index:11;position:sticky;top:calc(26px + 1.5rem)}header#top>div{display:block;margin:0}#app-name-header{display:block;position:fixed;top:.3rem;left:.5rem}header#top>div>a{position:fixed;top:.7rem;right:.5rem}#search-box-form{width:70vw;transition:width 0.2s ease;margin:0 auto;padding:.75rem 0}#search-box-form:focus-within{width:90vw}#search-box-form input#tags{min-width:180px}#search-header .ui-menu{width:70vw!important}#notice{top:calc(1.5rem + 26px)}}"
    );
    searchForm.addEventListener("focusin", () => {
      div.style.zIndex = "12";
    });
    searchForm.addEventListener("focusout", () => {
      div.style.zIndex = "11";
    });
    document.getElementById("app-logo").addEventListener("click", e => {
      e.preventDefault();
      e.currentTarget.blur();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    !BOORU.isMobile &&
      searchInput.addEventListener("keydown", function (event) {
        if (event.altKey && event.key === "Enter") {
          event.preventDefault();
          const query = encodeURIComponent(this.value.trim());
          if (query) {
            const searchUrl = `/posts?tags=${query}`;
            window.open(searchUrl, "_blank");
          }
        }
      });
  }
}
function enhanceIndexPage() {
  // Enable non-view mode on current page only
  document.querySelector("#mode-box select")?.addEventListener("change", () => setTimeout(() => localStorage.setItem("mode", "view")));
}
function enhancePostPage() {
  /* Sidebar */
  const size = document.querySelector("#post-info-size > a:last-child");
  size.previousSibling.data = size.previousSibling.data.replace("x", "×");
  // Search via MD5 - Deprecated: https://pastee.dev/p/QzILE
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
  // Newly added ↓
  const viewCount = fetch("https://isshiki.donmai.us/post_views/" + BOORU.postId)
    .then(resp => resp.text())
    .then(text => {
      if (/^\d+$/.test(text)) {
        document.getElementById("post-info-score")?.insertAdjacentHTML("afterend", `<li id="post-info-views">Views: ${text}</li>`);
      }
      resolve();
    });
  const versionCount = fetch("https://danbooru.donmai.us/post_versions.json?limit=2&search%5Bpost_id%5D=" + BOORU.postId)
    .then(resp => resp.json())
    .then(json => {
      if (Array.isArray(json) && json.length > 1) {
        document
          .getElementById("post-info-status")
          .insertAdjacentHTML(
            "beforebegin",
            `<li id="post-info-version" title="Latest update: ${json?.[0].updated_at}">Version: <a href="/post_versions?search%5Bpost_id%5D=${BOORU.postId}" target="_blank">${json[0].version}</a></li>`
          );
      }
      resolve();
    });
  Promise.allSettled([viewCount, versionCount]).then(() => $("#post-information").fadeOut("fast").fadeIn("fast"));
  /* Image */
  if (!BOORU.isMobile) {
    let image = document.querySelector("picture > img#image");
    dragElement(image);
    $(".image-view-original-link").on("click", () => image.classList.remove("fit-width"));
  }
  /* Navibar */
  // Shortcut to remove a post from the favorite group
  const noticeSearchBar = document.querySelector(".post-notice-search"),
    favgroupBars = noticeSearchBar?.querySelectorAll(".favgroup-navbar"),
    addToAnchors = document.querySelectorAll(".add-to-favgroup");
  const handleFavgroupBar = (bar, groupName, pathname) => {
    const xEl = createElement("a", { classList: "favgroup-removal text-lg", title: "Remove from this group" });
    xEl.innerHTML = `<svg class="icon svg-icon close-icon" viewBox="0 0 320 512"><use fill="currentColor" href="${BOORU.iconUri}#xmark"></use></svg>`;
    if (!bar) {
      bar = createElement("li", { classList: "favgroup-navbar" }, { selected: false });
      let nameEl = createElement("span", { classList: "favgroup-name" });
      let a = createElement("a", { href: pathname, textContent: "Favgroup: " + groupName });
      nameEl.append(a, xEl);
      bar.appendChild(nameEl);
      noticeSearchBar.appendChild(bar);
    } else {
      const nameEl = bar.querySelector(".favgroup-name");
      nameEl.appendChild(xEl);
      pathname = nameEl.children[0].pathname;
    }
    xEl.addEventListener("click", () => {
      fetch(`${pathname}/remove_post.js?post_id=${BOORU.postId}`, {
        method: "PUT",
        headers: { "X-CSRF-Token": Danbooru.Utility.meta("csrf-token") }
      })
        .then(resp => resp.text())
        .then(text => {
          const matched = text.match(/"(Removed post from favorite group )(.+?)"\);/);
          if (matched) {
            const url = encodeURI(`/posts?tags=favgroup:"${matched[2]}"`);
            const text = matched[1] + `<a href="${url}">${matched[2]}</a>`;
            Danbooru.Notice.info(text);
            bar.remove();
          }
        });
    });
  };
  if (addToAnchors.length) {
    GM_addStyle(
      ".favgroup-name{white-space:normal!important}.favgroup-navbar:hover .favgroup-removal{opacity:1}.favgroup-removal{opacity:0;color:var(--button-danger-background-color);position:absolute;transform:translate(50%,-5%);cursor:pointer}.favgroup-removal:hover{color:var(--button-danger-hover-background-color)}"
    );
    const origOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
      if (method === "PUT") {
        let groupId = url.match(/\/favorite_groups\/(\d+)\/add_post\.js/)?.[1];
        if (groupId)
          this.addEventListener("readystatechange", function () {
            if (this.readyState !== XMLHttpRequest.DONE) return;
            const groupName = this.response.match(/"Added post to favorite group (.+?)"/)?.[1];
            if (groupName) {
              const isShown = Array.from(favgroupBars).some(bar => bar.querySelector(".favgroup-name>a:first-of-type").pathname.split("/")[2] === groupId);
              if (!isShown) handleFavgroupBar(null, decodeHtml(groupName), `/favorite_groups/${groupId}`);
            }
          });
      }
      return origOpen.apply(this, [].slice.call(arguments));
    };
  } else return;
  if (favgroupBars.length) favgroupBars.forEach(bar => handleFavgroupBar(bar));
}
function enhanceUploadPage() {
  // wait(1000).then(() => document.querySelector(".ai-tags-related-tags-column")?.classList?.remove("hidden"));

  const hint = document.querySelector("div.post_tag_string span.hint");
  hint.insertAdjacentHTML("beforeend", "<br /><a class='cursor-pointer'>View detials for current tag in related tags page »</a>");
  hint.querySelector("a").addEventListener("click", () => {
    const currentTag = unsafeWindow.Danbooru.RelatedTag.current_tag();
    const url = `/related_tag?commit=Search&search%5Border%5D=Overlap&search%5Bquery%5D=${currentTag}`;
    if (currentTag) window.open(url, "_blank");
  });
}

BOORU.init();
