(() => {
  if ("about:blank" == location.href) return;
  let d = document,
    a = d.createElement("script");
  a.src =
    "//cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js";
  d.body.appendChild(a);
  a.onload = function () {
    let t = prompt("Enter a DOM Object or just Selector:");
    if (t) {
      try {
        t = eval(t);
      } catch (e) {
        try {
          t = d.querySelector(t);
        } catch (e) {
          if (e instanceof SyntaxError) return;
        }
      }
      if (typeof t === "string" || !(t instanceof HTMLElement)) return;
      window.pageYOffset = 0;
      d.documentElement.scrollTop = 0;
      d.body.scrollTop = 0;
      let f = [null, 3],
        x = prompt(
          "Enter your custom params (backgroundColor,scale):",
          "null,3"
        );
      if (!x) f = x.split(",");
      html2canvas(t, {
        dpi: window.devicePixelRatio,
        backgroundColor: f[0] === "null" ? null : f[0],
        scale: f[1] === "0" ? 0 : f[1],
        useCORS: true,
      }).then(c => {
        let p = c.toDataURL("image/png", 1.0),
          w = window.open("", "_blank");
        w.document.write(
          `<html><head></head><body><img src="${p}" style="width: 100%"></body></html>`
        );
      });
    }
  };
})();
