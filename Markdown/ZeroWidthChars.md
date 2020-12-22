## 零宽度字符

一种不可打印的 Unicode 字符，在浏览器等环境不可见，但是真是存在，获取字符串长度时也会占位置，表示某一种控制功能的字符。

### 常见的零宽字符

| 名称 | Unicode | HTML | 说明 |
|:-:|:-:|:-:|:-|
| [零宽空格](https://unicode-table.com/cn/200B/)（*zero-width space, ZWSP*） | `U+200B` | `&#8203;` | 用于可能需要换行处。 |
| [零宽不连字](https://unicode-table.com/cn/200C/)（*zero-width non-joiner, ZWNJ*） | `U+200C` | `&#8204;` | 用于矫正文本中连字的出现和替代性字形显示。 |
| [零宽连字](https://unicode-table.com/cn/200D/)（*zero-width joiner, ZWJ*） | `U+200D` | `&#8205;` | 用于两个本不会发生连字的字符产生连字效果。 |
| [左至右符号](https://unicode-table.com/cn/200E/)（*left-to-right mark, LRM*） | `U+200E` | `&#8206;` | 用于包含左至右文字的文稿排版。 |
| [右至左符号](https://unicode-table.com/cn/200F/)（*Right-to-left mark, RLM*） | `U+200F` | `&#8207;` | 用于包含右至左文字的文稿排版。 |
| [字节顺序标记](https://unicode-table.com/cn/FEFF/)（*byte-order mark, BOM*） | `U+FEFF` | `&#65279;` | 用于区分 UTF-16 和 UTF-32 的字节序。 |

### 经验之谈

- 零宽空格已无法规避微博的敏感字词审核。
- 零宽连字用于组成部分 Emoji。
- 字符串首尾会被 Excel 添加零宽字符 `U+202C` 和 `U+202D`。

### 过滤字符

```JavaScript
str.replace(/[\u200B-\u200D\uFEFF\u200E\u200F]/g, "");
```