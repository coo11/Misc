/**
 * Quantumult X
 * hostname:
 * app.bilibili.com
 * Target:
 * ^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\?access_key url script-response-body THIS_FILE_URL
 */
let body = $response.body;
body = JSON.parse(body);

body.data.items = body.data.items.filter(
  i =>
    !("ad_info" in i) &&
    !("banner_item" in i) &&
    i["card_type"] == "small_cover_v2"
);

body = JSON.stringify(body);
$done({ body });