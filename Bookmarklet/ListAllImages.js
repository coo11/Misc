(() => {
  const pesudos = [
    null,
    ":active",
    ":checked",
    ":focus",
    ":hover",
    ":visited",
    "::after",
    "::before"
  ];
  const parseImg = image => {
    if (typeof image === "string") {
      url = image;
      desc = "From CSS";
    } else {
      url = image.src;
      desc = image.height + " * " + image.width;
    }
    return `<tr><td style="text-align:center;"><img src="${url}"style="max-width:320px;box-shadow:5px 5px 5px #BBB;"><p><code>${desc}</code></p></td><td class="src" style="word-break:break-all"><code>${url}</code></td></tr>`;
  };
  let images = new Set(),
    content = "";
  document.querySelectorAll("*").forEach(element => {
    if (element.tagName === "IMG") {
      let src = element.src;
      if (src && !images.has(src)) {
        images.add(src);
        content += parseImg(element);
      }
    } else {
      pesudos.forEach(pesudo => {
        let i = 0,
          regex = /url\((['"]?)(.*?)\1\)/,
          style = getComputedStyle(element, pesudo),
          props = ["background-image", "background", "content"];
        while (i < 3 && !regex.test(style.getPropertyValue(props[i]))) i++;
        if (i < 3) {
          let url = RegExp.$2;
          if (!images.has(url)) {
            images.add(url);
            content += parseImg(url);
          }
        }
      });
    }
  });
  if (content) {
    let win = window.open("", "_blank"),
      doc = win.document;
    doc.write(
      `<table width=100% border=1 cellpadding=10><caption>${images.size} Image(s) Found</caption><tr><th>Image</th><th>URL</th></tr>${content}</table>`
    );
    doc.title = document.title;
    doc.close();
  } else alert("No images!");
})();
