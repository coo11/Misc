(() => {
  let caption = document.querySelector("caption.mvis");
  if (caption) {
    caption.innerText = caption.innerText.split("Found")[0] + " Found";
    return document.querySelectorAll("img").forEach(e => {
      let code = e.nextElementSibling.children[0];
      let text = code.innerText.replace(/[\d.]+×[\d.]+/, "").trim();
      let size = e.naturalWidth + "×" + e.naturalHeight;
      if (!text) code.innerText = size;
      else if (text.endsWith(":")) code.innerText = text + " " + size;
      else code.innerText = text + ": " + size;
    });
  }
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
      url = image[isSrc ? "src" : "currentSrc"];
      /* url = encodeURI(decodeURI(image[isSrc ? "src" : "currentSrc"])); */
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
    return `<tr><td><img ${
      csp ? "" : 'onload="load(this)" '
    }src="${url}"><p><code>${desc}</code></p></td><td>${codeUrl}</td></tr>`;
  };
  const getComputedUrl = (elmStyle, prop, e) => {
    const regex = /url\((['"]?)(.*?)\1\)/;
    const url = elmStyle.getPropertyValue(prop).match(regex)?.[2];
    if (url && !images.has(url)) {
      images.add(url);
      content += parseImg(url);
    }
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
      [null, "::after", "::before"].forEach(pseudo => {
        let style = getComputedStyle(element, pseudo);
        getComputedUrl(style, "background-image");
        getComputedUrl(style, "border-image-source");
        getComputedUrl(style, "content");
      });
    }
  });
  if (content) {
    let win = window.open("", "_blank"),
      doc = win.document,
      tip = "Run me again in current page to refetch images size",
      cap =
        images.size +
        " Image(s) Found" +
        (csp
          ? ` <span style="color:red;">(CSP Detected. ${tip})</span>`
          : ` (${tip})`),
      script = csp
        ? ""
        : '<script>function load(e){e.nextElementSibling.children[0].insertAdjacentText("beforeEnd",e.naturalWidth+"×"+e.naturalHeight)}</script>',
      //Deprecated: https://jsfiddle.net/yau5crm6/
      viewerjs =
        '<link href="https://cdn.jsdelivr.net/npm/viewerjs@1.11.6/dist/viewer.min.js" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/viewerjs@1.11.6/dist/viewer.min.css"></script><script>const gallery=new Viewer(document.getElementsByTagName("tbody")[0],{navbar:false,toolbar:{rotateLeft:"large",rotateRight:"large",flipHorizontal:"large",flipVertical:"large"}});</script>';
    doc.write(
      `<style>body { font-size: 87.5%; font-family: "Verdana", "Helvetica", sans-serif; } table,td,th { border: 1px solid #ccc; } table { border-collapse: collapse; width: 100%; } caption { margin-bottom: 0.5em; } tbody tr { border-bottom: 1px solid #d1d1da; } tbody tr:hover { background: #e1e8ff; } tr:nth-child(even) { background: #e8e8ec; } tr img { max-width:320px; box-shadow:5px 5px 5px #BBB; } tr:hover img { max-width:320px; box-shadow:-5px 5px 5px #BBB; } td:nth-child(1) { text-align: center; } td:nth-child(2) { word-break: break-all; } summary { color: purple; font-weight: bold; }</style>${script}<table onclick="" cellpadding=10><caption class="mvis">${cap}</caption><tbody><tr><th>Image</th><th>URL</th></tr>${content}</tbody></table>`
    );
    if (!csp) doc.write(viewerjs);
    doc.title = document.title;
    doc.close();
  } else alert("No images!");
})();
