(() => {
  let images = new Set(),
    content = "";
  globalThis.hasCSP = true;
  let s = document.createElement("script");
  s.textContent = "globalThis.hasCSP = false;";
  document.body.appendChild(s);
  s.remove();
  let csp = globalThis.hasCSP;
  const parseImg = (image, isSrc = true) => {
    let url, desc;
    if (typeof image === "string") {
      url = image.replace(
        /\\?"/g,
        "%2522"
      ); /* In console, there must be "\%22" https://t.me/iv?url=.... */
      desc = "From CSS";
      if (!csp) desc += ": ";
    } else if (image.tagName === "svg") {
      let src = new XMLSerializer().serializeToString(image);
      if (src && !images.has(src)) {
        images.add(src);
        url = encodeURI(
          "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(src)))
        );
        desc = "Inline SVG: ";
        if (csp) {
          let rect = image.getBoundingClientRect();
          desc += `${rect.width}×${rect.height}`;
        }
      } else return "";
    } else if (image.tagName === "IMG") {
      /* encodeURI: https://web.telegram.org/z/#.... */
      url = encodeURI(decodeURI(image[isSrc ? "src" : "currentSrc"]));
      desc = isSrc ? "" : "currentSrc: ";
      if (csp) desc += `${image.naturalWidth}×${image.naturalHeight}`;
    }
    let codeUrl =
      url /* https://developer.android.com/studio/command-line/adb */
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    if (codeUrl.length > 3200)
      codeUrl = `<details><summary><code>Collapsed because of too many characters (${codeUrl.length})</code></summary><code>${codeUrl}</code></details>`;
    else codeUrl = `<code>${codeUrl}</code>`;
    return `<tr><td><img src="${url}"><p><code>${desc}</code></p></td><td>${codeUrl}</td></tr>`;
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
      doc = win.document,
      cap =
        images.size +
        " Image(s) Found" +
        (csp
          ? ' <span style="color:red;">(CSP Detected, size accuracy is less reliable)</span>'
          : ""),
      script = csp
        ? ""
        : '<script>document.querySelectorAll("img").forEach(e=>e.nextElementSibling.children[0].insertAdjacentText("beforeEnd",e.naturalWidth+"×"+e.naturalHeight));</script>';
    doc.write(
      `<style>table,td,th { border: 1px solid #ccc; border-collapse: collapse; } table { width: 100%; } img { max-width:320px; box-shadow:5px 5px 5px #BBB; } td:nth-child(1) { text-align: center; } td:nth-child(2) { word-break: break-all; } summary { color: purple; font-weight: bold; }</style><table cellpadding=10><caption>${cap}</caption><tr><th>Image</th><th>URL</th></tr>${content}</table>${script}`
    );
    doc.title = document.title;
    doc.close();
  } else alert("No images!");
})();
