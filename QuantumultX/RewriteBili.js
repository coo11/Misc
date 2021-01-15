/**
 * ReEdit: https://github.com/blackmatrix7/ios_rule_script/tree/master/script/bilibili
 */
(() => {
  let body = $response.body,
    url = $request.url;
  switch (true) {
    /**
     * ^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\? url script-response-body THIS_FILE_URL
     */
    case /x\/v2\/feed\/index\?/.test(url):
      try {
        let obj = JSON.parse(body);
        const items = [];
        for (let item of obj.data.items) {
          if ("banner_item" in item) {
            let bannerItems = [];
            bannerItems = item.banner_item.filter(
              i => !i.is_ad && !i.is_ad_loc
            );
            if (bannerItems.length >= 1) {
              items.banner_item = bannerItems;
              items.push(item);
            }
          } else if (
            (!("ad_info" in item) && item.card_type === "small_cover_v2") ||
            item.card_type === "large_cover_v1"
          ) {
            items.push(item);
          }
        }
        obj.data.items = items;
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`推荐去广告出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/app\.bilibili\.com\/x\/v2\/splash\/list url script-response-body THIS_FILE_URL
     */
    case /x\/v2\/splash\/list/.test(url):
      try {
        let obj = JSON.parse(body);
        obj["data"]["max_time"] = 0;
        obj["data"]["min_interval"] = 31536000;
        obj["data"]["pull_interval"] = 31536000;
        for (let i = 0; i < obj["data"]["list"].length; i++) {
          obj["data"]["list"][i]["duration"] = 0;
          obj["data"]["list"][i]["begin_time"] = 1915027200;
          obj["data"]["list"][i]["end_time"] = 1924272000;
        }
        for (let i = 0; i < obj["data"]["show"].length; i++) {
          obj["data"]["show"][i]["stime"] = 1915027200;
          obj["data"]["show"][i]["etime"] = 1924272000;
        }
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`开屏广告处理出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/app\.bilibili\.com\/x\/resource\/show\/tab url script-response-body THIS_FILE_URL
     */
    case /x\/resource\/show\/tab/.test(url):
      try {
        const classes = {
          tab: new Set(["直播", "推荐", "热门", "追番", "影视"]),
          top: new Set(["消息"]),
          bottom: new Set(["首页", "频道", "动态", "我的"])
        };
        let obj = JSON.parse(body);
        for (let i in classes) {
          if (i in obj.data)
            obj.data[i] = obj.data[i].filter(e => classes[i].has(e));
          for (let j = 0; j < obj.data.length; j++) obj.data.pos = j;
        }
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`标签页处理出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/app\.bilibili\.com\/x\/v2\/account\/mine url script-response-body THIS_FILE_URL
     */
    case /x\/v2\/account\/mine/.test(url):
      try {
        const sections = [
          new Set(["离线缓存", "历史记录", "我的收藏", "稍后再看"]),
          new Set(["创作首页", "创作学院", "打卡挑战"]),
          new Set(["看视频免流量", "我的钱包", "直播中心", "反馈论坛"]),
          new Set(["联系客服", "设置"])
        ];
        let obj = JSON.parse(body);
        for (let i = 0; i < 4; i++) {
          const items = obj.data.sections_v2[i].items.filter(e =>
            sections[i].has(e.title)
          );
          obj.data.sections_v2[i].items = items;
        }
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`我的页面处理出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/api\.live\.bilibili\.com\/xlive\/app-room\/v1\/index\/getInfoByRoom url script-response-body THIS_FILE_URL
     */
    case /api\.live\.bilibili\.com\/xlive\/app-room\/v1\/index\/getInfoByRoom/.test(
      url
    ):
      try {
        let obj = JSON.parse(body);
        obj.data.activity_banner_info = null;
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`直播去广告出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/api\.bilibili\.com\/pgc\/page\/bangumi url script-response-body THIS_FILE_URL
     */
    case /api\.bilibili\.com\/pgc\/page\/bangumi/.test(url):
      try {
        let obj = JSON.parse(body);
        for (let card of obj.data.cards) {
          delete card["extra"];
        }
        delete obj.data.attentions;
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`追番去广告出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/api\.vc\.bilibili\.com\/dynamic_svr\/v1\/dynamic_svr\/dynamic_new\? url script-response-body THIS_FILE_URL
     */
    case /api\.vc\.bilibili\.com\/dynamic_svr\/v1\/dynamic_svr\/dynamic_new\?/.test(
      url
    ):
      try {
        let obj = JSON.parse(body);
        let cards = [];
        obj.data.cards.forEach(e => {
          if ("display" in e && e.card.indexOf("ad_ctx") == -1) {
            e["desc"]["dynamic_id"] = e["desc"]["dynamic_id_str"];
            e["desc"]["pre_dy_id"] = e["desc"]["pre_dy_id_str"];
            e["desc"]["orig_dy_id"] = e["desc"]["orig_dy_id_str"];
            e["desc"]["rid"] = e["desc"]["rid_str"];
            cards.push(e);
          }
        });
        obj.data.cards = cards;
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`动态去广告出现异常：${e}`);
      }
      break;
    default:
      console.log("触发意外的请求处理，请确认脚本或复写配置正常。");
      break;
  }
  body ? $done({ body }) : $done();
})();
