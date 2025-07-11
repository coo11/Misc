(() => {
  let opener = window.open;
  if (globalThis.needfixWinObj) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    opener = iframe.contentWindow.open.bind(window);
    document.body.removeChild(iframe);
  }
  try {
    const newWin = opener(),
      newDoc = newWin.document,
      parse = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    let headContent =
      '<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><style>body,code,pre{font-size:87.5%}table,td:first-child,td:nth-child(2){word-break:break-all}body{font-family:Verdana,Helvetica,sans-serif}code,pre{font-family:Monaco,Menlo,Consolas,"Courier New",Courier,monospace}table,td,th{border:1px solid #ccc}table{border-collapse:collapse;width:100%}tbody tr:hover{background:#e1e8ff}tr:nth-child(2n){background:#e8e8ec}td:first-child{min-width:144px}td:nth-child(2){min-width:72px;text-align:center}td:nth-child(3){max-width:calc(100% - 216px)}@media screen and (max-width:660px){td:first-child{min-width:56px}td:nth-child(3){max-width:calc(100% - 128px)}}.re{color:green}.er{color:red}.ar{color:purple}pre{white-space:pre-wrap}</style>';
    let bodyContent = '<table onclick=""><tbody><tr><th>Name</th><th>Type</th><th>Value as string</th></tr>';
    for (let i in window) {
      if (i in newWin) continue;
      let value = window[i];
      let tr = `<tr><td><code>${parse(i)}</code></td><td><code>${typeof value}</code></td><td><pre>`;
      if (value === null || value === undefined || typeof value === "boolean") tr += `<b>${value}</b>`;
      else if (value instanceof RegExp) tr += `<span class="re">${value.toString()}</span>`;
      else if (Array.isArray(value)) tr += `<span class="ar">${JSON.stringify(value)}</span>`;
      else
        try {
          value = value.toString();
          if (value.length) tr += parse(value);
          else tr += " ";
        } catch (e) {
          tr += `<span class="er">${parse(e.toString())}</span>`;
        }
      tr += "</pre></td></tr>";
      bodyContent += tr;
    }
    bodyContent += "</tbody></table>";
    newDoc.write(`<html><head>${headContent}</head><body>${bodyContent}</body></html>`);
    newDoc.title = document.title;
    newDoc.close();
  } catch (e) {
    globalThis.needfixWinObj = true;
  }
})();
