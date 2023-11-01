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
        "#headerbarright,.resultimage{float:unset;text-align:center}body{font-size:87.5%;font-family:Verdana,Helvetica,sans-serif}#headerarea,#mainarea{width:100%;min-width:unset}#headerbarright{width:100%;direction:unset}#mainarea,.resultmatchinfo,.resulttable tr,.resulttablecontent{display:flex;flex-direction:column;align-items:center}#left{width:100%;background-color:#1d1d1d}#yourimagecontainer{padding-top:0;text-align:center}#yourimage,#yourimagetext{display:inline-block;float:unset}#yourimage img,.resultimage img{max-width:unset}#yourimageretrylinks{display:flex;justify-content:center;flex-direction:row;margin:8px;gap:16px}#middle{margin:unset;width:100%}.result{margin:0 5px 5px}.resulttableimage{background-color:unset}.pixelated{width:unset;min-height:150px}.resultmatchinfo{row-gap:4px;margin:0}.resultmiscinfo{display:flex;flex-direction:row;align-items:flex-start;gap:8px}.resultcontent{width:100%}.resulttitle{margin-bottom:0}#footerarea,#headerbarleft,#headerbarmiddle,#smalllogo,#yourimageretrylinks>div,.resultcontentcolumn br:last-of-type{display:none}" +
        "</style></head>"
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

#yourimage,
#yourimagetext {
    display: inline-block;
    float: unset;
}

#yourimage img,
.resultimage img {
    max-width: unset;
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
#yourimageretrylinks>div,
#smalllogo,
.resultcontentcolumn br:last-of-type,
#footerarea {
    display: none;
}
*/
