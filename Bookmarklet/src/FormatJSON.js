//usage:
//save as bookmark and click it whenever you open a json response in a browser tab/window
//forked from https://gist.github.com/monostere0/e142ccf2218fd70abfdc

(() => {
  let { body, head } = document;
  if (window.isf) {
    document.getElementsByTagName("PRE")[0].removeAttribute("style");
  } else {
    head.insertAdjacentHTML(
      "beforeend",
      "<style>:root{--key:#c18401;--null:#a626a4;--num:#50a14f;--bool:#0184bb;--key-dark:#78dce8;--null-dark:#f92672;--num-dark:#a6e22e;--bool-dark:#ae81ff}body{--key-clr:var(--key);--null-clr:var(--null);--num-clr:var(--num);--bool-clr:var(--bool)}@media (prefers-color-scheme:dark){body{--key-clr:var(--key-dark);--null-clr:var(--null-dark);--num-clr:var(--num-dark);--bool-clr:var(--bool-dark)}}</style>"
    );
    body.innerHTML =
      "<pre style='white-space:pre-wrap;'>" +
      JSON.stringify(JSON.parse(body.innerText), null, 4).replace(
        /"([^"\\]*(?:\\.[^"\\]*)*)": (\[|{|".*"|\d+|\btrue\b|\bfalse\b|null)/g,
        (_, $1, $2) => {
          let pre = `<span style="color:var(--key-clr)">${$1}</span>&colon;&nbsp;`;
          let sfx =
            $2 === "null"
              ? `<span style="font-weight:bold;font-style:italic;color:var(--null-clr)">${$2}</span>`
              : /^\d+$/.test($2)
              ? `<span style="font-weight:bold;color:var(--num-clr)">${$2}</span>`
              : $2 === "false" || $2 === "true"
              ? `<span style="font-weight:bold;color:var(--bool-clr)">${$2}</span>`
              : $2;
          return pre + sfx;
        }
      ) +
      "</pre>";
    window.isf = true;
  }
})();
