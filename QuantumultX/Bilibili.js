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
            bannerItems = item.banner_item.filter(i => {
              if (i.type === "ad") return;
              else if (i.static_banner && !i.static_banner.is_ad_loc) {
                return true;
              }
            });
            if (bannerItems.length >= 1) {
              items.banner_item = bannerItems;
              items.push(item);
            }
          } else if (
            !("ad_info" in item) &&
            (item.card_type === "small_cover_v2" ||
              item.card_type === "large_cover_v1")
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
          // 442 开始为概念版 ID 适配港澳台代理模式
          tab: new Set([39, 40, 41, 545, 151, 442, 99, 100, 101, 554, 556]),
          // 消息
          top: new Set([176]),
          // 102 开始为概念版 ID
          bottom: new Set([177, 179, 181, 102, 103, 104, 105, 106])
        };
        let obj = JSON.parse(body);
        for (let i in classes) {
          if (i in obj.data) {
            obj.data[i] = obj.data[i].filter(e => classes[i].has(e.id));
            for (let j = 0; j < obj.data[i].length; j++) obj.data[i].pos = j;
          }
        }
        body = JSON.stringify(obj);
      } catch (e) {
        console.log(`标签页处理出现异常：${e}`);
      }
      break;
    /**
     * ^https?:\/\/app\.bilibili\.com\/x\/v2\/account\/mine url script-response-body THIS_FILE_URL
     */
    case /\/\/app\.bilibili\.com\/x\/v2\/account\/mine/.test(url):
      try {
        const itemList = new Set([
          396, 397, 398, 399, 171, 401, 404, 406, 514, 407, 410
        ]);
        // "离线缓存", "历史记录", "我的收藏", "稍后再看", "创作首页", "看视频免流量", "我的钱包", "直播中心", "反馈论坛", "联系客服", "设置"
        let obj = JSON.parse(body);
        for (let i = 0; i < obj.data.sections_v2.length; i++) {
          const items = obj.data.sections_v2[i].items.filter(e =>
            itemList.has(e.id)
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
          if (e.hasOwnProperty("display") && e.card.indexOf("ad_ctx") <= 0) {
            // 解决number类型精度问题导致B站动态中图片无法打开的问题
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
    /**
     * ^https?://api\.bilibili\.com/x/share/click url script-response-body THIS_FILE_URL
     */
    case /api\.bilibili\.com\/x\/share\/click/.test(url):
      try {
        let reqBody = $request.body;
        if (/oid=(\d+)/.test(reqBody)) {
          let obj = JSON.parse(body);
          obj.data.content =
            `https://b23.tv/${RegExp.$1}\n` + obj.data.content;

          body = JSON.stringify(obj);
        }
      } catch (e) {
        console.log(`处理分享数据出现异常：${e}`);
      }
      break;
    default:
      console.log("触发意外的请求处理，请确认脚本或复写配置正常。");
      break;
  }
  body ? $done({ body }) : $done();
})();
