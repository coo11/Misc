/**
 * Quantumult X
 * hostname:
 * app.bilibili.com
 */
let body = $response.body,
  url = $request.url;
body = JSON.parse(body);

if (url.indexOf("feed/index") > -1) {
  /**
   * Target:
   * ^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\?access_key url script-response-body THIS_FILE_URL
   */
  body.data.items = body.data.items.filter(
    i =>
      !("ad_info" in i) &&
      !("banner_item" in i) &&
      i["card_type"] != "small_cover_v2"
  );
} else if (url.indexOf("show/tab") > -1) {
  /**
   * Target:
   * ^https:\/\/app\.bilibili\.com\/x\/resource\/show\/tab\?access_key url script-response-body THIS_FILE_URL
   */
  /* prettier-ignore */
  const data={tab:[{id:39,tab_id:"\u76f4\u64adtab",name:"\u76f4\u64ad",uri:"bilibili://live/home",pos:1},{id:40,tab_id:"\u63a8\u8350tab",default_selected:1,name:"\u63a8\u8350",uri:"bilibili://pegasus/promo",pos:2},{id:41,tab_id:"\u70ed\u95e8tab",name:"\u70ed\u95e8",uri:"bilibili://pegasus/hottopic",pos:3},{id:42,tab_id:"\u8ffd\u756aTab",name:"\u8ffd\u756a",uri:"bilibili://pgc/home",pos:4},{id:151,tab_id:"\u5f71\u89c6tab",name:"\u5f71\u89c6",uri:"bilibili://pgc/cinema-tab",pos:5}],top:[{id:176,icon:"http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png",tab_id:"\u6d88\u606fTop",name:"\u6d88\u606f",uri:"bilibili://link/im_home",pos:1}],bottom:[{uri:"bilibili://main/home/",tab_id:"\u9996\u9875Bottom",pos:1,id:177,icon_selected:"http://i0.hdslb.com/bfs/archive/e5106aa688dc729e7f0eafcbb80317feb54a43bd.png",icon:"http://i0.hdslb.com/bfs/archive/63d7ee88d471786c1af45af86e8cb7f607edf91b.png",name:"\u9996\u9875"},{uri:"bilibili://pegasus/channel/",tab_id:"\u9891\u9053Bottom",pos:2,id:178,icon_selected:"http://i0.hdslb.com/bfs/archive/79d29e6ac3b6e52652881b050e63988e2038130f.png",icon:"http://i0.hdslb.com/bfs/archive/9c453a54eb83f5140cd098bf2e8ed8a599edc7fe.png",name:"\u9891\u9053"},{uri:"bilibili://following/home/",tab_id:"\u52a8\u6001Bottom",pos:3,id:179,icon_selected:"http://i0.hdslb.com/bfs/archive/25b658e1f6b6da57eecba328556101dbdcb4b53f.png",icon:"http://i0.hdslb.com/bfs/archive/86dfbe5fa32f11a8588b9ae0fccb77d3c27cedf6.png",name:"\u52a8\u6001"},{uri:"bilibili://user_center/",tab_id:"\u6211\u7684Bottom",pos:4,id:181,icon_selected:"http://i0.hdslb.com/bfs/archive/a54a8009116cb896e64ef14dcf50e5cade401e00.png",icon:"http://i0.hdslb.com/bfs/archive/4b0b2c49ffeb4f0c2e6a4cceebeef0aab1c53fe1.png",name:"\u6211\u7684"}]};
  for (let i in data) body.data[i] = data[i];
} else if (url.indexOf("account/mine") > -1) {
  /**
   * Target:
   * ^https:\/\/app\.bilibili\.com\/x\/v2\/account\/mine\?access_key url script-response-body THIS_FILE_URL
   */
  /* prettier-ignore */
  body.data.sections_v2=[{items:[{id:396,title:"\u79bb\u7ebf\u7f13\u5b58",icon:"http://i0.hdslb.com/bfs/archive/5fc84565ab73e716d20cd2f65e0e1de9495d56f8.png",uri:"bilibili://user_center/download"},{id:397,title:"\u5386\u53f2\u8bb0\u5f55",icon:"http://i0.hdslb.com/bfs/archive/8385323c6acde52e9cd52514ae13c8b9481c1a16.png",uri:"bilibili://user_center/history"},{id:398,title:"\u6211\u7684\u6536\u85cf",icon:"http://i0.hdslb.com/bfs/archive/d79b19d983067a1b91614e830a7100c05204a821.png",uri:"bilibili://user_center/favourite"},{id:399,title:"\u7a0d\u540e\u518d\u770b",icon:"http://i0.hdslb.com/bfs/archive/63bb768caa02a68cb566a838f6f2415f0d1d02d6.png",need_login:1,uri:"bilibili://user_center/watch_later"},{need_login:1,display:1,id:171,title:"\u521b\u4f5c\u4e2d\u5fc3",global_red_dot:1,uri:"bilibili://uper/homevc",icon:"http://i0.hdslb.com/bfs/archive/d3aad2d07538d2d43805f1fa14a412d7a45cc861.png"},{icon:"http://i0.hdslb.com/bfs/archive/7f4fa86d99bf3814bf10f8ee5d6c8c9db6e931c8.png",need_login:1,uri:"bilibili://uper/user_center/archive_selection",title:"\u53d1\u5e03",id:170},{id:404,title:"\u6211\u7684\u94b1\u5305",icon:"http://i0.hdslb.com/bfs/archive/f416634e361824e74a855332b6ff14e2e7c2e082.png",uri:"bilibili://bilipay/mine_wallet"},{id:401,title:"\u770b\u89c6\u9891\u514d\u6d41\u91cf",icon:"http://i0.hdslb.com/bfs/archive/393dd15a4f0a149e016cd81b55bd8bd6fe40882c.png",uri:"bilibili://user_center/free_traffic"},{id:406,title:"\u76f4\u64ad\u4e2d\u5fc3",icon:"http://i0.hdslb.com/bfs/archive/1db5791746a0112890b77a0236baf263d71ecb27.png",uri:"bilibili://user_center/live_center"},{id:514,title:"\u53cd\u9988\u8bba\u575b",icon:"http://i0.hdslb.com/bfs/archive/551a39b7539e64d3b15775295c4b2e13e5513b43.png",need_login:1,uri:"bilibili://following/activity_group_landing/7?page_id=262&tab_module_id=19"},{id:407,title:"\u8054\u7cfb\u5ba2\u670d",icon:"http://i0.hdslb.com/bfs/archive/7ca840cf1d887a45ee1ef441ab57845bf26ef5fa.png",uri:"bilibili://user_center/feedback"},{id:410,title:"\u8bbe\u7f6e",icon:"http://i0.hdslb.com/bfs/archive/e932404f2ee62e075a772920019e9fbdb4b5656a.png",uri:"bilibili://user_center/setting"}],style:1,button:{}}];
}

body = JSON.stringify(body);
$done({ body });
