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
      desc = image.width + "×" + image.height;
    }
    return `<tr><td><img src="${url}"><p><code>${desc}</code></p></td><td><code>${url}</code></td></tr>`;
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
      `<style>table,td,th { border: 1px solid #ccc; border-collapse: collapse; } table { width: 100%; } img { max-width:320px; box-shadow:5px 5px 5px #BBB; } td:nth-child(1) { text-align: center; } td:nth-child(2) { word-break: break-all; }</style><table cellpadding=10><caption>${images.size} Image(s) Found</caption><tr><th>Image</th><th>URL</th></tr>${content}</table>`
    );
    doc.title = document.title;
    doc.close();
  } else alert("No images!");
})();
