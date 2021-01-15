/**
 * Quantumult X
 * hostname:
 * app.bilibili.com
 * Target:
 * ^https:\/\/app\.bilibili\.com\/x\/resource\/show\/tab\?access_key url script-response-body THIS_FILE_URL
 */
let body = $response.body;
body = JSON.parse(body);

/* prettier-ignore */
const data={tab:[{id:39,tab_id:"\u76f4\u64adtab",name:"\u76f4\u64ad",uri:"bilibili://live/home",pos:1},{id:40,tab_id:"\u63a8\u8350tab",default_selected:1,name:"\u63a8\u8350",uri:"bilibili://pegasus/promo",pos:2},{id:41,tab_id:"\u70ed\u95e8tab",name:"\u70ed\u95e8",uri:"bilibili://pegasus/hottopic",pos:3},{id:42,tab_id:"\u8ffd\u756aTab",name:"\u8ffd\u756a",uri:"bilibili://pgc/home",pos:4},{id:151,tab_id:"\u5f71\u89c6tab",name:"\u5f71\u89c6",uri:"bilibili://pgc/cinema-tab",pos:5}],top:[{id:176,icon:"http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png",tab_id:"\u6d88\u606fTop",name:"\u6d88\u606f",uri:"bilibili://link/im_home",pos:1}],bottom:[{uri:"bilibili://main/home/",tab_id:"\u9996\u9875Bottom",pos:1,id:177,icon_selected:"http://i0.hdslb.com/bfs/archive/e5106aa688dc729e7f0eafcbb80317feb54a43bd.png",icon:"http://i0.hdslb.com/bfs/archive/63d7ee88d471786c1af45af86e8cb7f607edf91b.png",name:"\u9996\u9875"},{uri:"bilibili://pegasus/channel/",tab_id:"\u9891\u9053Bottom",pos:2,id:178,icon_selected:"http://i0.hdslb.com/bfs/archive/79d29e6ac3b6e52652881b050e63988e2038130f.png",icon:"http://i0.hdslb.com/bfs/archive/9c453a54eb83f5140cd098bf2e8ed8a599edc7fe.png",name:"\u9891\u9053"},{uri:"bilibili://following/home/",tab_id:"\u52a8\u6001Bottom",pos:3,id:179,icon_selected:"http://i0.hdslb.com/bfs/archive/25b658e1f6b6da57eecba328556101dbdcb4b53f.png",icon:"http://i0.hdslb.com/bfs/archive/86dfbe5fa32f11a8588b9ae0fccb77d3c27cedf6.png",name:"\u52a8\u6001"},{uri:"bilibili://user_center/",tab_id:"\u6211\u7684Bottom",pos:4,id:181,icon_selected:"http://i0.hdslb.com/bfs/archive/a54a8009116cb896e64ef14dcf50e5cade401e00.png",icon:"http://i0.hdslb.com/bfs/archive/4b0b2c49ffeb4f0c2e6a4cceebeef0aab1c53fe1.png",name:"\u6211\u7684"}]};
for (let i in data) body.data[i] = data[i];

body = JSON.stringify(body);
$done({ body });
