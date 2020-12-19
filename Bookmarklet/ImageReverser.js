javascript: ({
  init: function () {
    if ("about:blank" !== location.href) {
      const div = document.createElement("div");
      div.id = "ImageReverseSearch";
      div.innerHTML =
        '搜索引擎 <select><option value="Google">Google</option><option value="Yandex">Yandex</option><option value="sauceNAO">sauceNAO</option><option value="ASCII2D">ASCII2D</option><option value="Baidu">Baidu</option><option value="WAIT">WAIT</option></select><button>访问</button>';
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
  handleEvent: function (event) {
    let element = event.target,
      div = document.getElementById("ImageReverseSearch");
    if (element.parentNode.id !== "ImageReverseSearch") {
      document.removeEventListener("click", this, true);
      event.stopImmediatePropagation(); // 阻止绑定在同一元素的其它事件
    } else return;
    event.preventDefault(); // 阻止默认事件
    if (element && element.tagName === "IMG") {
      event.stopPropagation(); // 阻止捕获和冒泡事件传播
      const engine = div.children[0].value;
      const { d, p } = this.engines[engine];
      const prefix = engine === "Baidu" ? p : d + p;
      window.open(prefix + encodeURIComponent(element.src), "_blank");
    }
    document.body.removeChild(div);
  },
  engines: {
    Google: {
      d: "https://image.google.com",
      p: "/searchbyimage?image_url=",
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
      p:
        "https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image=",
    },
    WAIT: {
      d: "https://trace.moe",
      p: "/?url=",
    },
  },
}.init());