({
  id: "ImageReverseSearch",
  get el() {
    return document.getElementById(this.id);
  },
  init() {
    let id = this.id,
      el = this.el;
    if (el) {
      el.style.left = "unset";
      el.style.right = 0;
      return;
    }
    if ("about:blank" !== location.href) {
      const div = document.createElement("div"),
        options = Object.keys(this.engines)
          .map(i => `<option value="${i}">${i}</option>`)
          .join("");
      div.id = id;
      // prettier-ignore
      div.innerHTML = `<span>使用</span><select>${options}</select><a>搜索</a><style>#${id}{background-color:rgba(20,20,20,.4);position:fixed;z-index:calc(9e999);left:0;top:0;padding:2px 2px 2px 0;border-radius:.25em;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}#${id} :not(style){display:inline-block;font-family:Verdana,Helvetica,sans-serif;font-size:clamp(16px,2vmax,2vh);float:none;line-height:initial;color:#fff;margin:2px;text-align:center;text-decoration:none;vertical-align:middle;user-select:none;-webkit-user-select:none}#${id}>:not(style):not(span){border:1px solid rgba(20,20,20,.4);border-radius:.2em;background-color:rgba(50,50,50,.4)}#${id}>select{width:fit-content;height:fit-content;box-shadow:0 0 2px 0 #bbb inset;outline:0;padding:initial;-webkit-appearance:auto}#${id} option{background-color:darkgrey}#${id}>a{padding:0 4px}#${id}>a:focus,#${id}>a:hover{background-color:rgba(150,150,150,.4)}</style>`;
      document.body.appendChild(div);
      document.addEventListener("click", this, true);
      div.children[2].onclick = () => {
        const n = div.children[1].value;
        window.open(this.engines[n].d, "_blank");
        div.parentNode.removeChild(div);
      };
    }
  },
  handleEvent(event) {
    let element = event.target,
      el = this.el;
    if (el.contains(element)) return;
    document.removeEventListener("click", this, true);
    event.stopImmediatePropagation(); // 阻止绑定在同一元素的其它事件
    event.preventDefault(); // 阻止默认事件
    if (element.tagName === "IMG") {
      event.stopPropagation(); // 阻止捕获和冒泡事件传播
      const engine = el.children[1].value;
      const { d, p } = this.engines[engine];
      const prefix = p.startsWith("/") ? d + p : p;
      window.open(encodeURI(prefix + element.src), "_blank");
    }
    document.body.removeChild(el);
  },
  engines: {
    Google: {
      d: "https://images.google.com",
      p: "https://www.google.com/searchbyimage?client=Chrome&image_url="
    },
    Lens: {
      d: "https://images.google.com",
      p: "https://lens.google.com/uploadbyurl?url="
    },
    sauceNAO: {
      d: "https://saucenao.com",
      p: "/search.php?db=999&url="
    },
    ASCII2D: {
      d: "https://ascii2d.net",
      p: "/search/url/"
    },
    Yandex: {
      d: "https://yandex.com/images",
      p: "/search?rpt=imageview&url="
    },
    Baidu: {
      d: "https://image.baidu.com",
      p: "https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image="
    },
    Bing: {
      d: "https://www.bing.com",
      p: "/images/search?view=detailv2&iss=sbi&q=imgurl%3A"
    },
    IQDB: {
      d: "http://iqdb.org",
      p: "/?url="
    },
    WAIT: {
      d: "https://trace.moe",
      p: "/?auto&url="
    }
  }
}).init();
