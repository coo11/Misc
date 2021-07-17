## iOS 自动布局之 Autoresizing

作者：[刘坤](https://blog.cnbluebox.com/)

2014-09-09 来源：[刘坤的技术博客](https://blog.cnbluebox.com/blog/2014/09/09/appkai-fa-zhe-xu-yao-wei-iphone6zuo-chu-gai-bian/)

----

> 对于 iOS 的 APP 开发者来说，不会像 Android 开发者一样为很多的屏幕尺寸来做界面适配，因此硬编码的坐标也能工作良好，但是从设计模式上来说这不是好的做法。而且也还有一些问题，如 iPhone5 的适配，横竖屏的切换等。或许你可以做两套 UI 方案来做适配，但是这样增加重复工作量，而且不够高端，万一有出新的屏幕大小了呢。哲理就将介绍 iOS 中的两大自动布局利器：`Autoresizing` 和 `Autolayout`。 autoresizing 是 UIView 的属性，一直都有，使用简单，但是没有 autolayout 强大。autolayout 是 iOS6 以后的新技术，更加强大。本文主要介绍 `Autoresizing` 的特性和用法。

### 1. Autoresizing 特性
当 UIView 的 `autoresizesSubviews` 是 `YES` 时（默认是 YES）, 那么在其中的子 view 会根据它自身的 `autoresizingMask` 属性来自动适应其与 `superView` 之间的位置和大小。

`autoresizingMask` 是一个枚举类型, 默认是 `UIViewAutoresizingNone`, 也就是不会 autoresize：

```ObjC
typedef NS_OPTIONS(NSUInteger, UIViewAutoresizing) {
    UIViewAutoresizingNone   = 0,
    UIViewAutoresizingFlexibleLeftMargin   = 1 << 0,
    UIViewAutoresizingFlexibleWidth  = 1 << 1,
    UIViewAutoresizingFlexibleRightMargin  = 1 << 2,
    UIViewAutoresizingFlexibleTopMargin    = 1 << 3,
    UIViewAutoresizingFlexibleHeight = 1 << 4,
    UIViewAutoresizingFlexibleBottomMargin = 1 << 5
};
```

这个枚举类型，使用了 `1 << n` 这样的写法来定义，代表了它可以复选。如果你不明白为什么，可以复习下“位运算”。 那么这些值分别代表什么意思呢？

其实如何理解这几个值很简单，那就是从 xib 里面看。 我们在一个 xib 文件中，取消勾选 `autolayout`（默认使用 autolayout 时，autoresizing 看不到）。那么我们可以在布局那一栏看到如何设置 `autoresizing`。

![](https://blog.cnbluebox.com/images/autoresizing.png)

上图说明了在 xib 中设置的这些线条和实际属性对应的关系，这其中需要注意的是，其中 4 个 margin 虚线才代表设置了该值，而 width 和 height 是实线代表设置了该值，不能想当然的理解。

这些项分别代表：
- UIViewAutoresizingNone view 的 frame 不会随 superview 的改变而改变
- UIViewAutoresizingFlexibleLeftMargin 自动调整 view 与 superview 左边的距离保证右边距离不变
- UIViewAutoresizingFlexibleWidth 自动调整 view 的宽，保证与 superView 的左右边距不变
- UIViewAutoresizingFlexibleRightMargin 自动调整 view 与 superview 右边的距离保证左边距不变
- UIViewAutoresizingFlexibleTopMargin 自动调整 view 与 superview 顶部的距离保证底部距离不变
- UIViewAutoresizingFlexibleHeight 自动调整 view 的高，保证与 superView 的顶部和底部距离不变
- UIViewAutoresizingFlexibleBottomMargin 自动调整 view 与 superview 底部部的距离保证顶部距离不变

以上这些都较易理解, 但是 `autoresizing` 还有一些组合场景。那就是组合使用的场景。

| autoresizingMask | 说明 | xib 预览效果 |
|:-:|:-|:-:|
| `None` | view 的 frame 不会随 superview 的改变而改变（右图的 xib 中预览效果与实际效果有差，实际效果是 view 的上边距不变） | ![](https://blog.cnbluebox.com/images/autoresizings/none.gif) |
| `TopMargin \| BottomMargin` | view 与其 superView 的上边距和下边距的比例维持不变 | ![](https://blog.cnbluebox.com/images/autoresizings/top+bottom.gif) |
| `LeftMargin \| RightMargin` | view 与其 superView 的左边距和右边距的比例维持不变（右图的 xib 中预览效果与实际效果有差，实际效果是 view 的上边距不变） | ![](https://blog.cnbluebox.com/images/autoresizings/left+right.gif) |
| `LeftMargin \| RightMargin \| TopMargin \| BottomMargin` | view 与其 superView 的上下左右边距的比例维持不变 | ![](https://blog.cnbluebox.com/images/autoresizings/left+right+top+bottom.gif) |
| `LeftMargin \| Width` | view 与其 superView 的右边距的比例维持不变, 左边距和 width 按比例调整（右图的 xib 中预览效果与实际效果有差，实际效果是 view 的上边距不变） | ![](https://blog.cnbluebox.com/images/autoresizings/left+width.gif) |
| `LeftMargin \| Width \| RightMargin` | 左边距、右边距、宽按比例调整，（右图的 xib 中预览效果与实际效果有差，实际效果是 view 的上边距不变）**垂直方向是同样效果，故不列举** | ![](https://blog.cnbluebox.com/images/autoresizings/left+width+right.gif) |
| `Width \| Height` | 自动调整 view 的宽和高，保证上下左右边距不变。**如把 tableView 设置为此属性，那么无论 viewController 的 view 是多大，都能自动铺满** | ![](https://blog.cnbluebox.com/images/autoresizings/width+height.gif) |

### 2. 小结

Autoreszing 的最常见的实用场景就是 iPhone5 的兼容了。比如我们想要设置 tableView 的 frame，那我们只需要在初始化设置 frame 之后将 tableView 的 autoresizingMask 设置为 `UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight` 就行了。

另一种比如我们想要一个 view 一直停留在其 superview 的最下方，那么我们在初始化设置frame之后只需要将 autoresizingMask 设置为 `UIViewAutoresizingFlexibleTopMargin` 就可以了。

autorezingMask 简单的一个属性，理解它之后可以让很多事情变得简单。