(async uid => {
  if (!uid) uid = prompt("Input Twitter user name or Pixiv UID:");
  const corsProxy = "https://cors-anywhere.herokuapp.com/";
  const isUserUrl =
    /w{0,3}\.?pixiv\.(?:me|net)\/(?:u\/|users\/|fanbox\/creator\/|member\.php\?id=)(\d+)/;
  let tname, tinfo, tid, pid;
  if (/^\d+$/.test(uid)) {
    console.info("Pixiv UID is Given.");
    pid = uid;
    tinfo = await (async () => {
      let res = await fetch(
        `${corsProxy}https://www.pixiv.net/touch/ajax/user/details?id=${pid}&lang=zh`
      );
      if (res.status == 200) {
        let data = await res.json();
        if (!data.error) {
          let social = data.body.user_details.social;
          if ("twitter" in social) {
            tname = social.twitter.url.match(/twitter\.com\/(\w+)/)[1];
            console.log(`Twitter user name is ${tname}.`);
            return await getTwitterInfo(tname);
          } else {
            console.warn("No Twitter info showed.");
            return;
          }
        }
      }
      console.warn("No Twitter info found in this Pixiv account.");
      return;
    })();
    if (tinfo) tid = tinfo.id_str;
    if (!tname) {
      tname = prompt(
        "Twitter user name not found. Please Input(Type 1 to ignore):"
      );
      if (!tname) {
        console.warn("Aborted.");
        return;
      } else if (tname !== "1") {
        tinfo = await getTwitterInfo(tname);
        // Using "id_str" instead of "id". The former is awlays correct.
        // https://api.twitter.com/1.1/users/show.json?screen_name=ero_YAPPY
        tid = tinfo.id_str;
      }
    }
  } else if (!uid) {
    console.warn("Name is not given.");
    return;
  } else {
    tname = uid;
    console.info("Twitter user name is Given.");
    tinfo = await getTwitterInfo(tname);
    tid = tinfo.id_str;
  }

  async function getTwitterInfo(username) {
    let res = await fetch(
      `${corsProxy}https://api.twitter.com/1.1/users/show.json?screen_name=${username}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization:
            "Bearer AAAAAAAAAAAAAAAAAAAAAE306wAAAAAA36Mv3CcyOwbTQIaPnQO77gINgMo%3D9rGZZoPDYZ9bhKHz2WkMe3Nn8Fv2QEFucYL3QYJ1DZiuCGfKbh",
          origin: "https://twitter.com"
        }
      }
    );
    if (res.status === 200) return await res.json();
    else throw new Error("Failed to request Twitter API.");
  }

  if (!pid) {
    e = tinfo.entities;
    for (let i in e) {
      if ("urls" in e[i]) {
        for (let j of e[i].urls) {
          let url = j.expanded_url;
          console.log(url);
          url = isUserUrl.exec(url);
          if (url) {
            pid = url[1];
            console.log(`Found Pixiv UID ${pid}.`);
            break;
          }
        }
      } else continue;
    }
  }

  if (!pid) {
    pid = prompt("Pixiv UID not found. Please Input(Type 1 to ignore):");
    if (!pid) {
      console.warn("Aborted.");
      return;
    }
  }

  const { tHtml, pHtml } = {
    tHtml:
      tname === "1"
        ? ""
        : `<p>Twitter：<a href="https://twitter.com/i/user/${tid}"><span style="color: #0ea54a">@${tname}</span></a></p>`,
    pHtml:
      pid === "1"
        ? ""
        : `<p>Pixiv：<a href="https://www.pixiv.net/users/${pid}"><span style="color: #00bfff">${pid}</span></a></p>`
  };

  let page = window.open("", "_blank"),
    d = page.document;
  d.write(
    `<html><body><div style="height:40%;width:100%"><textarea style="position:relative;width:100%;height:100%;" spellcheck="false"></textarea></div><script>var t = document.getElementsByTagName('textarea')[0];t.value='<div>${tHtml}${pHtml}<p>Source：<a href="0000"><span style="color: #ef5fa7">Exhentai-SouthPlus</span></a></p></div>';t.select()</script></body></html>`
  );
  d.title = "CalibreMetaHelper";
  d.close();
})();
