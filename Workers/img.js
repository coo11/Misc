const botToken = globalThis.BOT_TOKEN;
const imgKv = globalThis.IMG_TG;
const hexToAscii = hexString => {
  let asciiString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexCode = hexString.substr(i, 2);
    const asciiChar = String.fromCharCode(parseInt(hexCode, 16));
    asciiString += asciiChar;
  }
  return asciiString;
};
const getSuffix = mimeType => {
  switch (true) {
    case mimeType === "image/jpeg":
      return "jpg";
    case mimeType.startsWith("image/"):
      return mimeType.slice(6);
    default:
      return;
  }
};

addEventListener("fetch", event => {
  event.respondWith(
    handleRequest(event.request).catch(
      err => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  const url = request.url;
  const { pathname, searchParams } = new URL(url);
  switch (true) {
    case pathname === "/favicon.ico":
      return new Response(
        Uint8Array.from(
          atob(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          ),
          c => c.charCodeAt(0)
        ),
        { status: 200, headers: { "Content-Type": "image/png" } }
      );
    case pathname === "/t/api":
      if (request.method === "POST") return saveImageInfoToKv(request);
    case pathname.startsWith("/t/"): {
      if (request.method === "GET")
        return fetchImageFromTelegram(pathname, searchParams.get("dl"));
    }
    default:
      return http400();
  }
}

async function saveImageInfoToKv(request) {
  const { path, id, type, ttl } = await request.json();
  if (path && id && type) {
    await imgKv.put(id, JSON.stringify({ path, type }), {
      expirationTtl: ttl || 3600
    });
    return new Response("Saved", { status: 200 });
  } else return http400("Parameter Error");
}

async function fetchImageFromTelegram(pathname, isDownload) {
  const sfx = pathname.split("/")[2],
    [hexString, ext] = sfx.split(".");
  const fileId = hexToAscii(hexString);
  const { path, type: mimeType } =
    (await imgKv.get(fileId, { type: "json" })) || {};
  if (!path || ext.toLowerCase() !== getSuffix(mimeType))
    return new Response("Not found", { status: 404 });
  const resp = await fetch(
      `https://api.telegram.org/file/bot${botToken}/${path}`
    ),
    newHeaders = new Headers(resp.headers);
  newHeaders.set("content-type", mimeType);
  newHeaders.set(
    "content-disposition",
    isDownload ? `attachment; filename=${path.split("/")[1]}` : "inline"
  );
  const init = {
      headers: newHeaders,
      status: resp.status,
      statusText: resp.statusText
    },
    body = await resp.arrayBuffer();
  return new Response(body, init);
}

function http400(text = "Bad Request") {
  return new Response(text, { status: 400 });
}
