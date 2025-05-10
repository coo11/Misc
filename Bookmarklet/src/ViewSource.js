(() => {
  if (location.href == "about:blank") return;
  let dom = window.open("").document,
    html = document.documentElement.outerHTML.replace(/[\u00A0-\u9999<>\&]/gim, i => `&#${i.charCodeAt(0)};`);
  dom.write(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="//cdnjs.snrat.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css"><script src="//cdnjs.snrat.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script><script src="//cdnjs.snrat.com/ajax/libs/highlightjs-line-numbers.js/2.9.0/highlightjs-line-numbers.min.js"></script><script>hljs.highlightAll(),hljs.initLineNumbersOnLoad()</script><style>td.hljs-ln-numbers{text-align:center;color:#646464;white-space:nowrap;padding-right:4px;border-right:1px solid #202329}td.hljs-ln-code{padding-left:7px}td.hljs-ln-line{vertical-align:baseline;height:14px}body,pre{margin:0}code{padding:.5em 1px!important}.swtich{margin:.5em 0;font-family:monospace;user-select:none;vertical-align:middle}#wrap:checked~pre{width:100%;word-break:break-word;white-space:pre-line}</style><label class="swtich" for="wrap">Auto Wrap</label> <input class="swtich" id="wrap" type="checkbox"><pre><code>${html}</code></pre>`
  );
  dom.close();
})();
