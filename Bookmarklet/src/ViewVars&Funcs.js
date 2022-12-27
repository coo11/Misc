(() => {
  const newWin = open(),
    newDoc = newWin.document,
    parse = str =>
      str
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
  newDoc.open();
  newDoc.write(
    '<style>body { font-size: 87.5%; font-family: "Verdana", "Helvetica", sans-serif; } table,td,th { border: 1px solid #ccc; } table { border-collapse: collapse; width: 100%; word-break: break-all; } tbody tr:hover { background: #e1e8ff; } tr:nth-child(even) { background: #e8e8ec; } td:nth-child(2) { word-break: keep-all; text-align: center; } td:nth-child(3) { width: 80%; } .re { color: green; } .er { color: red; } .ar { color: purple; } pre { white-space: pre-wrap; }</style><table onclick=""><tbody><tr><th>Variable</th><th>Type</th><th>Value as string</th></tr>'
  );
  for (let i in window) {
    if (i in newWin) continue;
    let value = window[i];
    newDoc.write(
      `<tr><td><code>${parse(
        i
      )}</code></td><td><code>${typeof value}</code></td><td><pre>`
    );
    if (value === null || value === undefined || typeof value === "boolean")
      newDoc.write(`<b>${value}</b>`);
    else if (value instanceof RegExp)
      newDoc.write(`<span class="re">${value.toString()}</span>`);
    else if (Array.isArray(value))
      newDoc.write(`<span class="ar">${JSON.stringify(value)}</span>`);
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
  newDoc.write("</tbody></table>");
  newDoc.title = document.title;
  newDoc.close();
})();
