(() => {
  let caption = document.querySelector("caption.mvis");
  if (caption) {
    caption.innerHTML = caption.innerHTML.split(" (")[0];
    return document.querySelectorAll("img").forEach(e => {
      let code = e.nextElementSibling.children[0];
      let text = code.innerText.replace(/[\d.]+×[\d.]+/, "").trim();
      let size = e.naturalWidth + "×" + e.naturalHeight;
      if (!text) code.innerText = size;
      else if (text.endsWith(":")) code.innerText = text + " " + size;
      else code.innerText = text + ": " + size;
    });
  }
  const safeBtoa = t => btoa(Array.from(new TextEncoder().encode(t), byte => String.fromCharCode(byte)).join(""));
  const urlEscape = t => t.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  let images = new Set();
  let content = ["", "", ""];
  globalThis.hasCSP = true;
  let s = document.createElement("script");
  s.textContent = "globalThis.hasCSP = false;";
  document.body.appendChild(s);
  s.remove();
  let csp = globalThis.hasCSP;
  const parseImg = (image, type = "src") => {
    let url, desc, sort;
    switch (type) {
      case "src":
      case "currentSrc":
        url = image[type];
        if (!url || (type === "currentSrc" && url === image.src)) return;
        desc = type === "src" ? "" : type + ": ";
        if (csp) desc += `${image.naturalWidth}×${image.naturalHeight}`;
        sort = 0;
        break;
      case "string":
        if (!image) return;
        url = image.replace(/\\?"/g, encodeURI('"')); /* Fix double encode issue */
        desc = "From CSS";
        if (!csp) desc += ": ";
        sort = 1;
        break;
      case "svgElement": {
        let src = new XMLSerializer().serializeToString(image);
        if (src) {
          url = "data:image/svg+xml;base64," + safeBtoa(src);
          desc = "Inline SVG: ";
          if (csp) {
            let rect = image.getBoundingClientRect();
            desc += `${rect.width}×${rect.height}`;
          }
          sort = 2;
        } else return;
        break;
      }
      default:
        break;
    }
    if (!images.has(url)) {
      images.add(url);
      let escaped = `<code>${urlEscape(url)}</code>`;
      if (escaped.length > 3213)
        escaped = `<details><summary><code>Collapsed because of too many characters (${escaped.length - 13})</code></summary>${escaped}</details>`;
      let finalHtml = `<tr><td><img${csp ? " " : ' onload="load(this)"'} src="${url}"><p><code>${desc}</code></p></td><td>${escaped}</td></tr>`;
      content[sort] += finalHtml;
    }
  };
  const getComputedUrl = (elmStyle, prop) => {
    const regex = /url\((['"]?)(.*?)\1\)/;
    const url = elmStyle.getPropertyValue(prop).match(regex)?.[2];
    parseImg(url, "string");
  };
  document.body.querySelectorAll("*").forEach(element => {
    if (element.tagName === "IMG") {
      parseImg(element, "src");
      parseImg(element, "currentSrc"); /* currentSrc: apps.apple.com/app/id; src: www.instagram.com/p */
    } else if (element.tagName === "svg") parseImg(element, "svgElement");
    else
      [null, "::after", "::before"].forEach(pseudo => {
        let style = getComputedStyle(element, pseudo);
        getComputedUrl(style, "background-image");
        getComputedUrl(style, "border-image-source");
        getComputedUrl(style, "content");
      });
  });
  if (content) {
    let imageWindow = window.open("", "_blank"),
      dom = imageWindow.document;
    let headContent =
      '<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><style>body,code{font-size:87.5%}tr img,tr:hover img{max-width:calc(36vw - 8px)}body{font-family:Verdana,Helvetica,sans-serif}code{font-family:Monaco,Menlo,Consolas,"Courier New",Courier,monospace}table,td,th{border:1px solid #ccc}table{border-collapse:collapse;width:100%}caption{margin-bottom:.5em}tbody tr{border-bottom:1px solid #d1d1da}tbody tr:hover{background:#e1e8ff}tr>:first-child{max-width:calc(36vw - 4px)}tr:nth-child(2n){background:#e8e8ec}tr img{box-shadow:5px 5px 5px #bbb}tr:hover img{box-shadow:-5px 5px 5px #bbb}td:first-child{text-align:center}td:nth-child(2){word-break:break-all}summary{color:purple;font-weight:700}</style>';
    let bodyContent = "";
    let caption = images.size + " Image" + (images.size === 1 ? "" : "s");
    caption += " Found (Run me again to refetch images size)";
    if (!csp) {
      headContent +=
        '<script>function load(e){e.nextElementSibling.children[0].insertAdjacentText("beforeEnd",e.naturalWidth+"×"+e.naturalHeight)}</script>' +
        '<link rel="stylesheet" href="https://cdnjs.snrat.com/ajax/libs/viewerjs/1.11.7/viewer.min.css"></link>';
      bodyContent =
        '<script type="module">import Viewer from"https://cdnjs.snrat.com/ajax/libs/viewerjs/1.11.7/viewer.esm.min.js";const gallery=new Viewer(document.getElementsByTagName("tbody")[0],{navbar:false,toolbar:{rotateLeft:"large",rotateRight:"large",flipHorizontal:"large",flipVertical:"large"}}),caption=document.querySelector(".mvis");caption.innerHTML=\'<span style="color:green;">[ViewerJS Loaded] </span>\'+caption.innerHTML;</script>';
    } else {
      caption = '<span style="color:red;">[CSP Detected] </span>' + caption;
    }
    bodyContent =
      '<table onclick="" cellpadding=10><caption class="mvis">' +
      caption +
      "</caption><tbody><tr><th>Image</th><th>URL</th></tr>" +
      content.join("") +
      "</tbody></table>" +
      bodyContent;
    dom.write(`<html><head>${headContent}</head><body>${bodyContent}</body></html>`);
    dom.title = document.title;
    dom.close();
  } else alert("No images!");
})();
