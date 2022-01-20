(() => {
  const newWin = open(),
    newDoc = newWin.document,
    parse = str =>
      str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
  newDoc.open();
  newDoc.write(
    "<style>table,td,th { border: 1px solid #ccc; border-collapse: collapse; } table { width: 100%; word-break: break-all; } td:nth-child(2) { word-break: keep-all; text-align: center; } th:nth-child(3) { width: 80%; } .er { color: red; } pre { white-space: pre-wrap; }</style><table><thead><tr><th>Variable</th><th>Type</th><th>Value as string</th></tr></thead>"
  );
  for (let i in window) {
    if (i in newWin) continue;
    let value = window[i];
    newDoc.write(
      `<tr><td><code>${parse(
        i
      )}</code></td><td><code>${typeof value}</code></td><td><pre>`
    );
    if (value === null) newDoc.write("<b>null</b>");
    else if (value === undefined) newDoc.write("<b>undefined</b>");
    else
      try {
        value = value.toString();
        if (value.length) newDoc.write(parse(value));
        else newDoc.write(" ");
      } catch (e) {
        newDoc.write(`<span class="er">${parse(e.toString())}</span>`);
      }
    newDoc.write("</pre></td></tr>");
  }
  newDoc.write("</table>");
  newDoc.title = document.title;
  newDoc.close();
})();
