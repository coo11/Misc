const UglifyJS = require("uglify-js");
const CleanCSS = require("clean-css");
const fs = require("fs");
const axios = require("axios");

let SOURCE_LOC = "https://github.com/coo11/Misc/tree/master/Bookmarklet/";

function prefix(css) {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>
${css}
      </style>
    </head>
    <body>
      <div id="page" class="mt-4">
        <h1>My Bookmarklets</h1>
        <p>
          This is a bookmarklets checklist I used. You can drag the item link to bookmarks toolbar or copy and save it as a bookmark.
          <br/>
          Items end with * is wrote by other people. Thank them for saving my time.
        </p>
        <table>
          <thead>
            <tr>
              <th class="item-column">Item</th>
              <th class="desc-column">Description</th>
              <th class="opt-column">Options</th>
            </tr>
          </thead>
          <tbody onclick="">
`;
}

function suffix() {
  return `        </tbody>
  </table>
</div>
<footer class="mt-4">
  <a href="https://github.com/coo11/Misc/tree/master/Bookmarklet" target="_blank"
    >Github</a
  >
</footer>
<script>
  function copy(text) {
    let textArea = document.createElement("textArea");
    textArea.value = text;
    document.body.appendChild(textArea);
    let range, selection;
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
  function exec(elem) {
    let ic = elem.children[0].classList;
    if (ic.contains("i-tick")) return;
    let a =
      elem.parentElement.previousElementSibling.previousElementSibling
        .children[0];
    copy(decodeURIComponent(a.href));
    ic.remove("i-copy");
    ic.add("i-tick");
    setTimeout(() => {
      ic.remove("i-tick");
      ic.add("i-copy");
    }, 1000);
  }
</script>
</body>
</html>`;
}

function template(uri, name, desc, view, is3rd) {
  return `  <tr>
    <td>
      <a ${is3rd ? 'class="f3"' : ""} href="${uri}">${name}</a>
    </td>
    <td>
      <p>${desc}</p>
    </td>
    <td>
    <a class="icon-link" onclick="exec(this)"><i class="icon i-copy"></i></a>
    <a class="icon-link" href="${view}" target="_blank"><i class="icon i-open"></i></a>
    </td>
  </tr>
`;
}

(async () => {
  if (fs.existsSync("./dist"))
    fs.rmSync("./dist", { recursive: true, force: true });
  fs.mkdirSync("dist/");

  let css = fs.readFileSync("style.css", "utf-8");
  css = new CleanCSS().minify(css).styles;
  let data = JSON.parse(fs.readFileSync("items.json", "utf-8"));
  let content = "";
  for (let item of data) {
    let scriptContent,
      view,
      is3rd = item.view.startsWith("http");
    if (item.src.startsWith("http")) {
      let req = await axios.get(item.src);
      if (req.status !== 200) continue;
      scriptContent = req.data;
      view = item.view;
    } else {
      scriptContent = fs.readFileSync(item.src, "utf-8");
      view = item.view || SOURCE_LOC + item.src;
    }
    scriptContent = scriptContent.trim().replace(/^javascript:/i, "");
    if (!item.hasMinified) scriptContent = UglifyJS.minify(scriptContent).code;
    content += template(
      "javascript:" + encodeURIComponent(scriptContent),
      item.name,
      item.desc,
      view,
      is3rd
    );
  }
  fs.writeFileSync("./dist/index.html", `${prefix(css)}${content}${suffix()}`);
})();
