javascript: ({
  init() {
    if ("about:blank" !== location.href) {
      const div = document.createElement("div"),
        options = Object.keys(this.engines)
          .map(i => `<option value="${i}">${i}</option>`)
          .join("");
      div.id = "ImageReverseSearch";
      div.innerHTML = `使用 <select>${options}</select><button>搜索</button>`;
      div.style =
        "color: white; background-color: rgba(20, 20, 20, 0.4); position: fixed; z-index: 999999; left: 0px; top: 0px;padding: 0 2px 2px;";
      document.body.appendChild(div);
      document.addEventListener("click", this, true);
      div.children[1].onclick = () => {
        const n = div.children[0].value;
        window.open(this.engines[n].d, "_blank");
        div.parentNode.removeChild(div);
      };
    }
  },
  handleEvent(event) {
    let element = event.target,
      div = document.getElementById("ImageReverseSearch");
    if (element.parentNode.id !== "ImageReverseSearch") {
      document.removeEventListener("click", this, true);
      event.stopImmediatePropagation(); // 阻止绑定在同一元素的其它事件
    } else return;
    event.preventDefault(); // 阻止默认事件
    if (element.tagName === "IMG") {
      event.stopPropagation(); // 阻止捕获和冒泡事件传播
      const engine = div.children[0].value;
      const { d, p } = this.engines[engine];
      const prefix = engine === "Baidu" || engine === "Google" ? p : d + p;
      window.open(prefix + encodeURIComponent(element.src), "_blank");
    }
    document.body.removeChild(div);
  },
  engines: {
    Google: {
      d: "https://images.google.com",
      p: "https://www.google.com/searchbyimage?client=ie&image_url=",
    },
    Yandex: {
      d: "https://yandex.com/images",
      p: "/search?rpt=imageview&url=",
    },
    sauceNAO: {
      d: "https://saucenao.com",
      p: "/search.php?db=999&url=",
    },
    ASCII2D: {
      d: "https://ascii2d.net",
      p: "/search/url/",
    },
    Baidu: {
      d: "https://image.baidu.com",
      p: "https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image=",
    },
    Bing: {
      d: "https://www.bing.com",
      p: "/images/searchbyimage?cbir=sbi&imgurl=",
    },
    KarmaDecay: {
      d: "https://karmadecay.com",
      p: "/search?q=",
    },
    IQDB: {
      d: "http://iqdb.org",
      p: "/?url=",
    },
    WAIT: {
      d: "https://trace.moe",
      p: "/?auto&url=",
    },
  },
}.init());
