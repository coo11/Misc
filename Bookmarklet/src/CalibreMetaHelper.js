(async uid => {
  if (!uid) uid = prompt("Input Twitter user name or Pixiv UID:");
  const GAS_ID =
    "AKfycbxTxbDpJj3RRfP7yIq06v7hP5zUJcBjanurZvsj37iBUtsGgYDkBGW6yl4tYIlIcxbr";
  const urlPrefix = `https://script.google.com/macros/s/${GAS_ID}/exec?type=calibremetadata&id=`;
  let res = await (await fetch(`${urlPrefix}${uid}`)).text();
  let tname, tid, pid;
  isPid = /^\d+$/.test(uid);
  try {
    res = JSON.parse(res || "{}");
    pid = isPid ? uid : res.pid;
    tname = isPid ? res.tname : uid;
    tid = res.tid;
  } catch (e) {
    console.error("Nothing found, invalid Twitter username or Pixiv UID.");
    return;
  }

  if (!pid) {
    pid = prompt("Pixiv UID not found. Please Input(Type 1 to ignore):");
    if (!pid) {
      console.warn("Aborted.");
      return;
    }
  }

  if (!tname) {
    tname = prompt(
      "Twitter user name not found. Please Input(Type 1 to ignore):"
    );
    if (!tname) {
      console.warn("Aborted.");
      return;
    } else if (tname !== "1") {
      let res = await (await fetch(`${urlPrefix}${tname}`)).text();
      tid = JSON.parse(res || null)?.tid;
      if (!tid) {
        console.error("Invalid Twitter username.");
        return;
      }
    }
  }

  const { tHtml, pHtml } = {
    tHtml:
      tname === "1"
        ? ""
        : `<p>Twitter: <a href="https://twitter.com/i/user/${tid}"><span style="color: #0ea54a">@${tname}</span></a></p>`,
    pHtml:
      pid === "1"
        ? ""
        : `<p>Pixiv: <a href="https://www.pixiv.net/users/${pid}"><span style="color: #00bfff">${pid}</span></a></p>`
  };

  let page = window.open("", "_blank"),
    d = page.document;
  d.write(
    `<html><body><div style="height:40%;width:100%"><textarea style="position:relative;width:100%;height:100%;" spellcheck="false"></textarea></div><script>var t = document.getElementsByTagName('textarea')[0];t.value='<div>${tHtml}${pHtml}<p>Source: <a href="0000"><span style="color: #ef5fa7">Exhentai-SouthPlus</span></a></p></div>';t.select()</script></body></html>`
  );
  d.title = "CalibreMetaHelper";
  d.close();
})();
