(() => {
  let body = $response.body;
  body = body
    .replace(
      "<head>",
      "<head>" +
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
    )
    .replace(
      "</head>",
      "<style>" +
        '#headerbarright,.resultimage{float:unset;text-align:center}body{font-size:87.5%;font-family:Verdana,Helvetica,sans-serif}#headerarea,#mainarea{width:100%;min-width:unset}#headerbarright{width:100%;direction:unset}#mainarea,.resultmatchinfo,.resulttable tr,.resulttablecontent{display:flex;flex-direction:column;align-items:center}#left{width:100%;background-color:#1d1d1d}#yourimagecontainer{padding-top:0;text-align:center}#yourimage{display:inline-block;float:none;position:relative;min-height:150px}#yourimage::before{content:"click to edit your image";position:absolute;bottom:0;left:0;font-size:smaller;background-color:rgba(0,0,0,.5);backdrop-filter:blur(2px)}#yourimageretrylinks{display:flex;justify-content:center;flex-direction:row;margin:8px;gap:16px}#middle{margin:unset;width:100%}.result{margin:0 5px 5px}.resulttableimage{background-color:unset}.resultimage{min-width:unset}.resultimage_showmessage::after{left:0;padding:unset;font-size:smaller}.pixelated{width:unset;min-height:150px}.resultmatchinfo{row-gap:4px;margin:0}.resultmiscinfo{display:flex;flex-direction:row;align-items:flex-start;gap:8px}.resultcontent{width:100%}.resulttitle{margin-bottom:0}#footerarea,#headerbarleft,#headerbarmiddle,#smalllogo,#yourimageretrylinks>div,#yourimagetext,.resultcontentcolumn br:last-child{display:none}' +
        "</style></head>"
    )
    .replace(
      "https://lens.google.com/uploadbyurl?url=",
      "https://www.google.com/searchbyimage?client=Chrome&image_url="
    )
    .replaceAll(
      /('|")[^'"]*?\/static\/(patreon|btn_donate|bannersmall|yourimage270).*?\1/g,
      "$1data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==$1"
    );
  $done({ body });
})();

/*
body {
    font-size: 87.5%;
    font-family: "Verdana", "Helvetica", sans-serif;
}

#headerarea,
#mainarea {
    width: 100%;
    min-width: unset;
}

#headerbarright {
    width: 100%;
    text-align: center;
    float: unset;
    direction: unset;
}

#mainarea,
.resulttable tr,
.resulttablecontent,
.resultmatchinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#left {
    width: 100%;
    background-color: #1D1D1D;
}

#yourimagecontainer {
    padding-top: 0;
    text-align: center;
}

#yourimage {
    display: inline-block;
    float: none;
    position: relative;
    min-height: 150px;
}

#yourimage::before {
    content: "click to edit your image";
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: smaller;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);

}

#yourimageretrylinks {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin: 8px;
    gap: 16px;
}

#middle {
    margin: unset;
    width: 100%;
}

.result {
    margin: 0 5px 5px 5px;
}

.resulttableimage {
    background-color: unset;
}

.resultimage {
    float: unset;
    text-align: center;
    min-width: unset;
}

.resultimage_showmessage::after {
    left: 0;
    padding: unset;
    font-size: smaller;
}

.pixelated {
    width: unset;
    min-height: 150px;
}

.resultmatchinfo {
    row-gap: 4px;
    margin: 0;
}

.resultmiscinfo {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
}

.resultcontent {
    width: 100%;
}

.resulttitle {
    margin-bottom: 0;
}

#headerbarleft,
#headerbarmiddle,
#yourimagetext,
#yourimageretrylinks>div,
#smalllogo,
.resultcontentcolumn br:last-child,
#footerarea {
    display: none;
}
*/
