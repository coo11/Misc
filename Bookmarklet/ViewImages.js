(() => {
  let images = new Set(),
    content = "";
  const parseImg = (image, isSrc = true) => {
    let url, desc;
    if (typeof image === "string") {
      url = image.replace(
        /\\?"/g,
        "%2522"
      ); /* In console, there must be "\%22" https://t.me/iv?url=.... */
      desc = "From CSS";
    } else if (image.tagName === "svg") {
      let src = new XMLSerializer().serializeToString(image);
      if (src && !images.has(src)) {
        images.add(src);
        url = encodeURI(
          "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(src)))
        );
        let rect = image.getBoundingClientRect();
        desc = `Inline SVG: ${rect.width}×${rect.height}`;
      } else return "";
    } else if (image.tagName === "IMG") {
      /* encodeURI: https://web.telegram.org/z/#.... */
      url = encodeURI(decodeURI(image[isSrc ? "src" : "currentSrc"]));
      desc = image.width + "×" + image.height;
      desc += isSrc ? "" : " (currentSrc)";
    }
    let codeUrl =
      url /* https://developer.android.com/studio/command-line/adb */
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    return `<tr><td><img src="${url}"><p><code>${desc}</code></p></td><td><code>${codeUrl}</code></td></tr>`;
  };
  document.querySelectorAll("*").forEach(element => {
    if (element.tagName === "IMG") {
      let src = element.src,
        curSrc = element.currentSrc;
      /* currentSrc: apps.apple.com/app/id; src: www.instagram.com/p */
      if (src && !images.has(src)) {
        images.add(src);
        content += parseImg(element);
      }
      if (curSrc && curSrc !== src && !images.has(curSrc)) {
        images.add(curSrc);
        content += parseImg(element, false);
      }
    } else if (element.tagName === "svg") {
      content += parseImg(element);
    } else {
      let regex = /url\((['"]?)(.*?)\1\)/;
      [null, "::after", "::before"].forEach(pseudo => {
        let style = getComputedStyle(element, pseudo);
        if (
          regex.test(style.getPropertyValue("background-image")) ||
          regex.test(style.getPropertyValue("content"))
        ) {
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
