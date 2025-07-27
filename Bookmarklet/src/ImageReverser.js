// Legacy Code - https://pastee.dev/p/ZMSDCl4p
(() => {
  if (location.href === 'about:blank') return;

  const id = 'ImageReverseSearch';
  if (document.getElementById(id)) {
    // 如果已存在，只调整位置
    const host = document.getElementById(id);
    host.style.left = 'unset';
    host.style.right = '0';
    return;
  }

  // 搜索引擎列表
  const engines = {
    Google: { d: 'https://images.google.com', p: 'https://www.google.com/searchbyimage?client=Chrome&image_url=' },
    Lens:   { d: 'https://images.google.com', p: 'https://lens.google.com/uploadbyurl?url=' },
    sauceNAO: { d: 'https://saucenao.com', p: '/search.php?db=999&url=' },
    ASCII2D: { d: 'https://ascii2d.net', p: '/search/url/' },
    Danbooru: { d: 'https://danbooru.donmai.us', p: '/iqdb_queries?search[url]=' },
    Yandex: { d: 'https://yandex.com/images', p: '/search?rpt=imageview&url=' },
    Baidu: { d: 'https://image.baidu.com', p: 'https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData[isLogoShow]=1&image=' },
    Bing: { d: 'https://www.bing.com', p: '/images/search?view=detailv2&iss=sbi&q=imgurl:' },
    IQDB: { d: 'http://iqdb.org', p: '/?url=' },
    WAIT: { d: 'https://trace.moe', p: '/?auto&url=' }
  };

  // 创建宿主容器并添加到文档
  const host = document.createElement('div');
  host.id = id;
  host.style.position = 'fixed';
  host.style.top = '0';
  host.style.left = '0';
  host.style.zIndex = '999999999';
  // 建立 Shadow Root
  const shadow = host.attachShadow({ mode: 'open' });

  // 样式
  const style = document.createElement('style');
  style.textContent = `
    :host {
      background-color: rgba(20,20,20,.4);
      padding: 2px;
      border-radius: .25em;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      font-family: Verdana, Helvetica, sans-serif;
      font-size: clamp(16px, 2vmax, 2vh);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    select, a {
      border: 1px solid rgba(20,20,20,.4);
      border-radius: .2em;
      background-color: rgba(50,50,50,.4);
      color: #fff;
      padding: 2px 4px;
      cursor: pointer;
      text-decoration: none;
    }
    select {
      font-size: inherit;
      -webkit-appearance: auto;
      outline: none;
      text-align: center;
    }
    a:hover {
      background-color: rgba(150,150,150,.4);
    }
    span {
      color: #fff;
    }
  `;

  // 文本和控件
  const label = document.createElement('span');
  label.textContent = '使用';

  const select = document.createElement('select');
  for (const name in engines) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }

  const button = document.createElement('a');
  button.textContent = '搜索';
  button.href = 'javascript:void(0)';

  // 组装 Shadow DOM
  shadow.append(style, label, select, button);
  document.body.appendChild(host);

  // 点击“搜索”按钮时打开默认引擎首页
  button.addEventListener('click', e => {
    const eng = select.value;
    window.open(engines[eng].d, '_blank');
    host.remove();
  });

  // 全局点击拦截：选择图片后以图搜图
  const clickHandler = evt => {
    const el = evt.target;
    if (host.contains(el)) return;
    evt.preventDefault();
    evt.stopImmediatePropagation();
    document.removeEventListener('click', clickHandler, true);

    if (el.tagName === 'IMG') {
      const eng = select.value;
      const { d, p } = engines[eng];
      const prefix = p.startsWith('/') ? d + p : p;
      window.open(encodeURI(prefix + el.src), '_blank');
    }
    host.remove();
  };
  document.addEventListener('click', clickHandler, true);
})();
