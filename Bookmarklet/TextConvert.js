(() => {
  let html =
    "<head><meta name='viewport' content='width=device-width,initial-scale=1.0,user-scalable=no'><style>::selection{color:#FFF;background:#0AE}div.t{height:40%;padding:5px}button{background:#0AE;border:none;outline:none;margin:2px;padding:2px 4px;color:#FFF;box-shadow:0 0 5px #b6b6b6;border-radius:.2em}button:hover{background:#3BBCED}textarea{position:relative;width:100%;height:100%;border-color:#888;border-radius:.5em;resize:none}textarea:focus,textarea:hover{outline:0;border-color:#0AE !important}</style></head><body><div class='t i'><textarea spellcheck='false' placeholder='Enter Something...'></textarea></div><div style='text-align:center;'>";
  [
    "Base64 Encode",
    "Base64 Decode",
    "URL Encode",
    "URL Decode",
    "To Lower Case",
    "To Upper Case",
    "Clear"
  ].forEach(val => {
    html += `<button>${val}</button>`;
  });
  html +=
    "</div><div class='t o'><textarea spellcheck='false' placeholder='Result'></textarea></div></body>";
  let win = window.open("", "_blank"),
    doc = win.document;
  doc.write(html);
  doc.title = "Text Convert";
  let querySelector = path => doc.querySelector(path),
    inputArea = querySelector(".i > *"),
    outputArea = querySelector(".o > *"),
    buttonArea = inputArea.parentElement.nextElementSibling;
  inputArea.value = top.getSelection().toString();
  let input = () => {
    let text = inputArea.value;
    !text && win.alert("Nothing Input!");
    return text;
  };
  let select = result => {
    outputArea.value = result;
    result && outputArea.select();
  };
  let buttonFn = [
    () => select(win.btoa(unescape(encodeURIComponent(input())))),
    () => {
      let text = input();
      if (!text) return;
      try {
        // 'btoa' support ASCII only
        select(
          decodeURIComponent(
            escape(win.atob(text.replace(/_/g, "/").replace(/-/g, "+")))
          )
        );
      } catch (e) {
        win.alert(e.message);
        return;
      }
    },
    () => select(encodeURIComponent(input())),
    () => select(decodeURIComponent(input())),
    () => select(input().toLowerCase()),
    () => select(input().toUpperCase()),
    () => {
      inputArea.value = "";
      outputArea.value = "";
    }
  ];
  buttonFn.forEach((fn, index) => {
    buttonArea.children[index].onclick = fn;
  });
  doc.close();
})();
