const botToken = BOT_TOKEN;
const ehAuthHash = EH_HASH;
const PREFLIGHT_INIT = {
  status: 200,
  statusText: "OK",
  headers: new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods":
      "GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS",
    "Access-Control-Max-Age": "1728000",
    "Access-Control-Allow-Headers": "*",
  }),
};

addEventListener("fetch", event => {
  event.respondWith(
    handleRequest(event.request).catch(
      err => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  const { pathname, searchParams } = new URL(request.url);
  switch (true) {
    case pathname === "/ehapi":
      return await ehCorsBypass(request);
    case pathname === "/navi/bg":
      return randomNaviBg();
    case pathname.startsWith("/img/tg/"):
      return await tgTempImage(pathname.slice(8), request);
    case pathname.startsWith("/img/search"):
      return await googleImgSearchFix(searchParams.get("url"), request);
    default:
      return http400();
  }
}

async function ehCorsBypass(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, PREFLIGHT_INIT);
  }
  const hash = req.headers.get("Authorization");
  if (!hash || !hash.endsWith(EH_HASH)) return http403();
  const resp = await fetch("https://api.e-hentai.org/api.php", {
    method: req.method,
    body: req.body,
  });

  const headers = new Headers(resp.headers);
  headers.set("Access-Control-Expose-Headers", "*");
  headers.set("Access-Control-Allow-Origin", "*");
  const body = await resp.arrayBuffer();

  return new Response(body, {
    headers,
    status: resp.status,
    statusText: resp.statusText,
  });
}

function randomNaviBg() {
  const images = [
    "https://m.360buyimg.com/babel/jfs/t1/117502/8/26767/134340/62e67cadE41401722/969b4f733c1c708e.png", // V2EX iDev
    "https://kjimg10.360buyimg.com/ott/jfs/t1/11091/29/19217/345646/632fb0c1E9181ddc3/6e7f1fd7fd6a4db5.jpg", // Steins;Gate 0 CG
    "https://kjimg10.360buyimg.com/ott/jfs/t1/129717/3/29698/1400803/632fb0c2E7420aa28/d3a952171180b1e4.jpg", // 美食殿堂水着
    "https://kjimg10.360buyimg.com/ott/jfs/t1/199023/31/26260/183562/632fb0bfE1b582eb3/ad9f34466941e3f5.jpg", // 白洲アズサ & 聖園ミカ
    "https://m.360buyimg.com/babel/jfs/t1/77110/20/20946/2349377/62f4436cE094e35a0/91bcf58f45a0be2c.png", // PLAY IT STRAIGHT
    "https://m.360buyimg.com/babel/jfs/t1/180168/15/29962/1108570/6365853aE361c32b1/8e2c7b72b093896e.jpg", // 勝利の女神：NIKKE トライアングルの 3 人
    "https://m.360buyimg.com/babel/jfs/t1/91102/5/30971/2786697/6365888cEd5167378/335c146148ff28e8.jpg", // 勝利の女神：NIKKE
  ];
  const n = images.length,
    url = images[Math.round(Math.random() * (n - 1))];
  const headers = new Headers({ Location: url });
  headers.set("access-control-expose-headers", "*");
  headers.set("access-control-allow-origin", "*");
  return new Response(null, {
    status: 302,
    redirect: "follow",
    headers,
  });
}

async function tgTempImage(cmd, req) {
  if (cmd && cmd === "save" && req.method === "POST") {
    const { path, id, type } = await req.json();
    if (path && id && type) {
      await IMGTG.put(id, JSON.stringify({ path, type }), {
        expirationTtl: 3600,
      });
      return new Response("Saved", { status: 200 });
    } else return new Response("Parameter Error", { status: 400 });
  }
  // https://api.coo11.workers.dev/src/tg/xxxxxxxx
  if (cmd && req.method === "GET") {
    let id = cmd,
      { path, type } = (await IMGTG.get(id, { type: "json" })) || {};
    if (!path) return new Response("File not found", { status: 404 });
    const resp = await fetch(
        `https://api.telegram.org/file/bot${botToken}/${path}`
      ),
      newHeaders = new Headers(resp.headers);
    newHeaders.set("Content-Type", type);
    newHeaders.set(
      "content-disposition",
      `inline; filename=${path.split("/")[1]}`
    );
    let init = {
        headers: newHeaders,
        status: resp.status,
        statusText: resp.statusText,
      },
      body = await resp.arrayBuffer();
    return new Response(body, init);
  }
  return http400();
}

async function googleImgSearchFix(imageUrl) {
  if (!imageUrl) return http400();
  let prefix = "https://lens.google.com/uploadbyurl?url=",
    ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    lensReq = await fetch(
      `${prefix}${encodeURIComponent(imageUrl)}&st=${new Date().getTime()}`,
      { headers: { "user-agent": ua } }
    );
  if (lensReq.status == 200) {
    let content = await lensReq.text(),
      searchUrl = content
        ?.match(
          /https:\/\/www\.google\.com\/search\?tbs\\u003dsbi:.*?(?=")/
        )?.[0]
        ?.replace("\\u003d", "=");
    if (searchUrl) return Response.redirect(searchUrl);
  }
  return http400();
}

function http400(text = "Bad Request") {
  return new Response(text, { status: 400 });
}

function http403(text = "Forbiden") {
  const headers = new Headers();
  headers.set("access-control-expose-headers", "*");
  headers.set("access-control-allow-origin", "*");
  return new Response(text, { status: 403, headers });
}
