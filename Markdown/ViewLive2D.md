# 预览 Live2D 踩坑

1. 工具
    - [Live2D Viewer](http://sites.cybernoids.jp/cubism2/tools/live2d-viewer) + [Adobe AIR Runtime](https://airsdk.harman.com/runtime) (For Cubism 2.1)
    - [Cubism Viewer (for OW)](https://docs.live2d.com/cubism-editor-manual/cubism3-viewer-for-ow/) (已包含于 [Live2D Cubism Editor](https://www.live2d.com/download/cubism/) 中)
    - [Cubism Viewer (for Unity)](https://docs.live2d.com/cubism-editor-manual/cubism-viewer-unity/) (不推荐，无法播放某些 *.moc3 的 motions)
    - [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) (在 Web 上预览，[文档](https://guansss.github.io/pixi-live2d-display/README.zh/))

2. 使用
    - Viewer 对于 `model.json` 的格式**非常严格**（注意检查删掉大括号末尾的逗号、检查键名是否正确等）。起码对此资源（<https://github.com/Eikanya/Live2d-model>）的部分 Cubism 2.1 模型好好检查，否则总是加载失败。

    - Web 版本参考文档中给出的 demo 使用。