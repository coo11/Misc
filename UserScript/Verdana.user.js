// ==UserScript==
// @name        Verdana
// @namespace   https://github.com/coo11/Backup/tree/master/UserScript
// @match       *://*.donmai.us/*
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @resource    verdana https://cdn.jsdelivr.net/gh/coo11/files@main/fonts/verdana/verdana.woff2
// @resource    verdanab https://cdn.jsdelivr.net/gh/coo11/files@main/fonts/verdana/verdanab.woff2
// @resource    verdanai https://cdn.jsdelivr.net/gh/coo11/files@main/fonts/verdana/verdanai.woff2
// @resource    verdanaz https://cdn.jsdelivr.net/gh/coo11/files@main/fonts/verdana/verdanaz.woff2
// @version     1.01
// @author      coo11
// @description FuckMIUIAlias
// ==/UserScript==

GM_addStyle(`@font-face {
    font-family: Verdana;
    src: url('${GM_getResourceURL("verdana")}') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap
}
@font-face {
    font-family:  Verdana;
    src: url('${GM_getResourceURL("verdanab")}') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap
}
@font-face {
    font-family: Verdana;
    src: url('${GM_getResourceURL("verdanai")}') format('woff2');
    font-weight: 400;
    font-style: italic;
    font-display: swap
}
@font-face {
    font-family: Verdana;
    src: url('${GM_getResourceURL("verdanaz")}') format('woff2');
    font-weight: 700;
    font-style: italic;
    font-display: swap
}`);

if (location.host.endsWith(".donmai.us")) {
  GM_addStyle(":root{--header-font:Verdana;--body-font:Verdana}");
}
