# iOS-从三维立方体到理解CATransform3D&CGAffineTransform&m34 

作者：[Tr2e](https://tr2e.com.cn/)

2017-09-12 来源：[Tr2e's Blog](https://tr2e.com.cn/2017/09/12/iOS-Transform/) & [简书](https://www.jianshu.com/p/3dd14cfbdc53)

----

## 前言

在写 Custom Layout 的 demo 时，用到了 CATransform3D 的 **m34** 参数，不务正业的想探究下这个矩阵到底为什么能影响到图形的透视旋转等等变换，所以通过本篇文章总结一下收获，供以后参考。

## 目录

+ [简单实现三维立方体](#简单实现三维立方体)
+ [CATransform3D & CGAffineTransform 使用介绍](#catransform3d--cgaffinetransform-使用介绍)
    + [CGAffineTransform](#cgaffinetransform)
    + [CATransform3D](#catransform3d)
+ [原理解释](#原理解释)
    + [CGAffineTransform](#cgaffinetransform-1)
    + [CATransform3D](#catransform3d-1)

## 简单实现三维立方体

![Cube.gif](https://upload-images.jianshu.io/upload_images/1742463-0abd0a0a94a4bb44.gif)

实现这个蛮简单的，只需要合理的调整旋转角度和平移，再加上一个定时器，完美（显然这个效果没什么卵用，但是笔者这只鶸来说，刚蹦出来的时候还是蛮开心的）

**实现步骤**
1. 定义一个 Basic View
2. 调整并添加立方体的六个面
3. 定时器调整 Basic View 的 layer 旋转

**特别注意**
旋转时，我们需要同时作用于 6 个子 layer，所以请留意 `self.animateCube.layer.sublayerTransform = transform` 中使用的是 **`sublayerTransform`** 而非 **`transform`**


```Obj-C
CGRect targetBounds = (CGRect){CGPointZero,CGSizeMake(200, 200)};
self.animateCube = [[UIView alloc] initWithFrame:targetBounds];
_animateCube.center = self.view.center;
[self.view addSubview:self.animateCube];


UIView *test = [[UIView alloc] initWithFrame:targetBounds];// front
test.backgroundColor = [[UIColor blueColor] colorWithAlphaComponent:0.25];
test.layer.transform = CATransform3DTranslate(test.layer.transform, 0, 0, 100);

UIView *test1 = [[UIView alloc] initWithFrame:targetBounds];// back
test1.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
test1.layer.transform = CATransform3DTranslate(test1.layer.transform, 0, 0, -100);

UIView *test2 = [[UIView alloc] initWithFrame:targetBounds];// left
test2.backgroundColor = [[UIColor yellowColor] colorWithAlphaComponent:0.5];
test2.layer.transform = CATransform3DTranslate(test2.layer.transform, -100, 0, 0);
test2.layer.transform = CATransform3DRotate(test2.layer.transform, M_PI_2, 0, 1, 0);

UIView *test3 = [[UIView alloc] initWithFrame:targetBounds];// right
test3.backgroundColor = [[UIColor purpleColor] colorWithAlphaComponent:0.5];
test3.layer.transform = CATransform3DTranslate(test3.layer.transform, 100, 0, 0);
test3.layer.transform = CATransform3DRotate(test3.layer.transform, M_PI_2, 0, 1, 0);

UIView *test4 = [[UIView alloc] initWithFrame:targetBounds];// head
test4.backgroundColor = [[UIColor orangeColor] colorWithAlphaComponent:0.5];
test4.layer.transform = CATransform3DTranslate(test4.layer.transform, 0, 100, 0);
test4.layer.transform = CATransform3DRotate(test4.layer.transform, M_PI_2, 1, 0, 0);

UIView *test5 = [[UIView alloc] initWithFrame:targetBounds];// foot
test5.backgroundColor = [[UIColor greenColor] colorWithAlphaComponent:0.5];
test5.layer.transform = CATransform3DTranslate(test5.layer.transform, 0, -100, 0);
test5.layer.transform = CATransform3DRotate(test5.layer.transform, M_PI_2, -1, 0, 0);

[self.animateCube addSubview:test];
[self.animateCube addSubview:test1];
[self.animateCube addSubview:test2];
[self.animateCube addSubview:test3];
[self.animateCube addSubview:test4];
[self.animateCube addSubview:test5];

self.animateCube.transform = CGAffineTransformMakeScale(0.5, 0.5);//CGAffineTransform

__block CATransform3D transform = CATransform3DIdentity;

NSLog(@"%@",[NSString logForCATransform3D:transform]);

// Label
UILabel *label = [[UILabel alloc] init];
label.frame = CGRectOffset(self.animateCube.frame, 0, - 100);
label.text = @"AnimatedCube";
[label sizeToFit];
[self.view addSubview:label];

transform.m34 = 1.0/-500;

float angle = M_PI / 360;
self.animateCube.layer.sublayerTransform = transform;
NSTimer *timer = [NSTimer timerWithTimeInterval:1.0/60 repeats:YES block:^(NSTimer * _Nonnull timer) {
    transform = CATransform3DRotate(transform, angle, 1, 1, 0.5);
    self.animateCube.layer.sublayerTransform = transform;//
}];
[[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
```

## CATransform3D & CGAffineTransform 使用介绍

### CGAffineTransform

![CGAffineTransform.png](https://upload-images.jianshu.io/upload_images/1742463-ccdc9679c4ce990e.png)

> [CGAffineTransform](https://developer.apple.com/documentation/coregraphics/cgaffinetransform?language=objc)
>
> An affine transformation matrix for use in drawing 2D graphics
>
> 用于绘制2D图形的仿射变换矩阵

以上为官方文档定义，那么什么是仿射变换，看看这里数学咖们的解释就能大概理解了→[如何通俗地讲解「仿射变换」这个概念？](https://www.zhihu.com/question/20666664)

1. **`CGAffineTransformMake`** 返回直接控制每一个参数的仿射变换矩阵

    ```Obj-C
    CGAffineTransform CGAffineTransformMake(CGFloat a, CGFloat b, CGFloat c, CGFloat d, CGFloat tx, CGFloat ty);
    ```

2. **`CGAffineTransformScale`** 返回通过缩放现有仿射变换构造的仿射变换矩阵，`sx`/`sy`即为 **x 方向** 和 **y 方向** 的缩放比例

    ```Obj-C
    CGAffineTransform CGAffineTransformScale(CGAffineTransform t, CGFloat sx, CGFloat sy);
    ```

3. **`CGAffineTransformRotate`** 返回通过旋转现有仿射变换构造的仿射变换矩阵，`angle` 为旋转弧度

    ```Obj-C
    CGAffineTransform CGAffineTransformRotate(CGAffineTransform t, CGFloat angle);
    ```

4. **`CGAffineTransformInvert`** 返回通过反转现有仿射变换构造的仿射变换矩阵。

    ```Obj-C
    CGAffineTransform CGAffineTransformInvert(CGAffineTransform t);
    ```

5. **`CGAffineTransformTranslate`** 返回实现平移的仿射变换矩阵。`tx/ty` 为偏移量。

    ```Obj-C
    CGAffineTransform CGAffineTransformTranslate(CGAffineTransform t, CGFloat tx, CGFloat ty);
    ```

6. **`CGAffineTransformConcat`** 返回通过组合两个现有仿射变换构造的仿射变换矩阵。**本质就是两个矩阵的乘法，上述平移、旋转、缩放的操作，如配图所示，都是可以通过点的齐次坐标与仿射变换矩阵的乘积获得，原理笔者会在第三部分解释**

    ```Obj-C
    CGAffineTransform CGAffineTransformConcat(CGAffineTransform t1, CGAffineTransform t2);
    ```

7. 几个特殊的仿射变换矩阵

    **`CGAffineTransformMakeScale`**/**`CGAffineTransformMakeRotation`**/**`CGAffineTransformMakeTranslation`** 都是在**原视图初始坐标**的基础上变化，所以并不会累加效果，相比上述 API 它少了基础仿射矩阵参数 `CGAffineTransform t`

    ```Obj-C
    // scale
    CGAffineTransform CGAffineTransformMakeScale(CGFloat sx, CGFloat sy);
    // rotaion
    CGAffineTransform CGAffineTransformMakeRotation(CGFloat angle);
    // translation
    CGAffineTransform CGAffineTransformMakeTranslation(CGFloat tx, CGFloat ty);
    ```

8. `CGAffineTransformIdentity` 即**单位矩阵**如下图所示，他并不会对图形造成任何影响，通常用来恢复初始状态

    ![CGAffineTransformIdentity.png](https://upload-images.jianshu.io/upload_images/1742463-a1d4d4184fa3d142.png)

    **我们要想将文字视图翻转该怎么做呢？**

    ![2D翻转](https://upload-images.jianshu.io/upload_images/1742463-09ec25987cf3b994.png)

    很简单，只需要将 `CGAffineTransformMakeScale` 中的参数设置为 **-1** 即可。是不是很有趣

    ```Obj-C
    label.transform = CGAffineTransformMakeScale(-1, -1);
    ```

### CATransform3D

![CATransform3D.png](https://upload-images.jianshu.io/upload_images/1742463-98c7c91b8e8ae1e7.png)

> [CATransform3D](https://developer.apple.com/documentation/quartzcore/transforms?language=objc)
>
> Defines the standard transform matrix used throughout Core Animation.
>
> 定义核心动画中使用的标准变换矩阵

`CATransform` 同样定义为结构体，代表了三维图形 4×4 的变换矩阵。网上有几篇文章，对每个参数功能都进行了标注，但是这样 **并不十分严谨**。因为左上 3×3 的矩阵区域，各个参数需要相互作用才能达到理想的准确状态，并不单纯的是某个值负责某种准确的三维图形变换。笔者将在本文的第三部分**原理探究及理解**中具体解释，感(hen)兴(wu)趣(liao)的同学可以往下看看。

因为只是从 2D 变换变成 3D 变换，而且 4×4 矩阵本身就是 3×3 矩阵的拓展，原理是一样的，所以有很多相似相通的地方。

1. **`CATransform3DScale`** 返回通过缩放现有变换构造的变换矩阵，`sx`/`sy`/`sz` 即为 `x 方向`、`y 方向`和 `z 方向`的缩放比例

    ```Obj-C
    CATransform3D CATransform3DScale (CATransform3D t, CGFloat sx, CGFloat sy, CGFloat sz)
    ```

2. **`CATransform3DRotate`** 返回通过旋转现有变换构造的变换矩阵，`angle` 代表弧度，`x`, `y`, `z` 代表各个轴上旋转的弧度倍数

    ```Obj-C
    CATransform3D CATransform3DRotate (CATransform3D t, CGFloat angle, CGFloat x, CGFloat y, CGFloat z)
    ```

3. **`CATransform3DInvert`** 返回反转后的变换矩阵

    ```Obj-C
    CATransform3D CATransform3DInvert (CATransform3D t)
    ```

4. **`CATransform3DTranslate`** 返回实现 `x`/`y`/`z` 轴上平移相应距离的变换矩阵

    ```Obj-C
    CATransform3D CATransform3DTranslate (CATransform3D t, CGFloat tx, CGFloat ty, CGFloat tz)
    ```

5. **`CATransform3DConcat`** 返回同时作用两种变换矩阵的矩阵

    ```Obj-C
    CATransform3D CATransform3DConcat (CATransform3D a, CATransform3D b)
    ```

6. 几个特殊的变换矩阵

    **`CATransform3DMakeScale`**/**`CATransform3DMakeRotation`**/**`CATransform3DMakeTranslation`** 同样是作用于原始视图的变换矩阵

    ```Obj-C
    /* Returns a transform that translates by '(tx, ty, tz)':
    * t' =  [1 0 0 0; 0 1 0 0; 0 0 1 0; tx ty tz 1]. */
    CATransform3D CATransform3DMakeTranslation (CGFloat tx,
    CGFloat ty, CGFloat tz)
    
    /* Returns a transform that scales by `(sx, sy, sz)':
    * t' = [sx 0 0 0; 0 sy 0 0; 0 0 sz 0; 0 0 0 1]. */
    CATransform3D CATransform3DMakeScale (CGFloat sx, CGFloat sy,
    CGFloat sz)
    
    /* Returns a transform that rotates by 'angle' radians about the vector
    * '(x, y, z)'. If the vector has length zero the identity transform is
    * returned. */
    CATransform3D CATransform3DMakeRotation (CGFloat angle, CGFloat x,
    CGFloat y, CGFloat z)
    ```

7. **`CATransform3DIdentity`**，人畜无害矩阵，通常用于恢复初始状态

    `[1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]`

## 原理解释

### CGAffineTransform

**以下是苹果官方文档对于CGAffineTransform二维变换矩阵对图形影响的注解**

> [CGAffineTransform官方文档注解](https://developer.apple.com/documentation/coregraphics/cgaffinetransform?language=objc)
>
> An affine transformation matrix is used to rotate, scale, translate, or skew the objects you draw in a graphics context. The CGAffineTransform
> type provides functions for creating, concatenating, and applying affine transformations.
> Affine transforms are represented by a 3 by 3 matrix:
>
> ![A 3 by 3 matrix.](https://upload-images.jianshu.io/upload_images/1742463-3dc4eb7d73f2ee5b.png)
>
> Because the third column is always (0,0,1), the CGAffineTransform
> data structure contains values for only the first two columns.
> Conceptually, an affine transform multiplies a row vector representing each point (x,y) in your drawing by this matrix, producing a vector that represents the corresponding point (x’,y’):
>
> ![A row vector multiplying a 3 by 3 matrix.](https://upload-images.jianshu.io/upload_images/1742463-aa57b592c9b92045.png)
>
> Given the 3 by 3 matrix, the following equations are used to transform a point (x, y) in one coordinate system into a resultant point (x’,y’) in another coordinate system.
>
> ![Transformation equations.](https://upload-images.jianshu.io/upload_images/1742463-ddc8eb566766ac37.png)

看到这里，[线代大神](https://baike.baidu.com/item/%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/800?fr=aladdin)一定会嘴角上扬了，所以如果以下内容有任何理解或书写错误，请您务必留言给笔者鶸渣评论勘误打脸，千万不要高抬贵手。

二维的变换都可以看作是坐标的[齐次坐标](https://baike.baidu.com/item/%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87/511284?fr=aladdin)同 `[a b 0; c d 0; tx ty 1]` 的[乘法运算](http://www.ruanyifeng.com/blog/2015/09/matrix-multiplication.html)

![矩阵乘法图示-阮一峰博客](https://upload-images.jianshu.io/upload_images/1742463-42c978969d209aee.png)

**矩阵的乘法规则**：第 m 行与第 n 行交叉位置的值，等于第一个矩阵第 m 行与第二个矩阵第 n 列对应位置的乘积之和。依

![image.png](https://upload-images.jianshu.io/upload_images/1742463-7c0c7c6b64e8669d.png)

知道了原理后，我们继续探究 `translate`/`scale`/`rotate` 到底“背地里”干了些什么

上文中我们提到了，单独对结构体中**某个的参数**（Translate 平移的参数当然不会出错，问题集中在对于**线性变化区域**的标注，即 **CGAffineTransform 左上 2×2 区域**、**CATransform3D 左上 3×3 区域**）进行功能注释是**不够严谨**的。

为了证明这一观点，笔者绘制了 `CGAffineTransformRotate` 仿射矩阵的推导过程图（这一结论在 **CATransform3DRotate 矩阵**中，同样适用，证明**具体参数标注的不严谨**）

![CGAffineTransformRotate的仿射矩阵推导](https://upload-images.jianshu.io/upload_images/1742463-ba2244a0184a6c76.png)

相关推导用到的转换公式

```
sin(A+B) = sinAcosB + cosAsinB
sin(A-B) = sinAcosB - cosAsinB
cos(A+B) = cosAcosB - sinAsinB
cos(A-B) = cosAcosB + sinAsinB
```


下面给出相对简单的 `CGAffineTransformTranslate` 和 `CGAffineTransformScale` 的矩阵的简单推导

![CGAffineTransformTranslate](https://upload-images.jianshu.io/upload_images/1742463-dfcd3d13be62fd56.png)
![CGAffineTransformScale](https://upload-images.jianshu.io/upload_images/1742463-6880cd38730e4a1a.png)

细心的同学可能会发现，系统 API 修改的都是矩阵的前两列参数。那么调整第三列，会有什么样的效果？

第三列参数，直接作用到[齐次坐标](https://baike.baidu.com/item/%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87/511284?fr=aladdin)的 n+1 维的参数上，它同普通坐标的转换关系以我们一直讨论的二维为例，如下图。为保证 `x = x' y = y'`,所以默认转换后，齐次坐标的 `d = 1`，如果第三列前两个参数均为 0，那么修改**右下位置的参数**，可以直接控制图形的缩放。前两个参数则是随着图形中点的 x、y 值的变化改变对于齐次坐标中 `d` 值得影响。

![](https://upload-images.jianshu.io/upload_images/1742463-b86a67f833e71728.png)

不过苹果并没有给我们提供这三个参数，而是选择在二维变换时把这一列去掉了-。- 可能觉得意义不大吧。但是，在 **CATransform3D** 中，这一列得到了保留，我们熟悉的 **m34**，正是受 **z 轴**影响的透视关键参数，相信看到这里的你，应该已经能够理解为什么改变 **m34** 能够影响**屏幕坐标**中的透视关系了。

### CATransform3D

3D 矩阵变换，其实就是 2D 矩阵变换的拓展，相应的 3×3 矩阵变成 CATransform3D 代表的 4×4 矩阵

经过对于 CGAffineTransform 的学习，这里我们就不再推导常用的 3D API 对应的变换了，直接贴上结果图（来自 [Apple Documentation Archive](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreAnimation_guide/CoreAnimationBasics/CoreAnimationBasics.html#//apple_ref/doc/uid/TP40004514-CH2-SW10)）
    
![Matrix configurations for common transformations](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreAnimation_guide/Art/transform_manipulations_2x.png)

**变换矩阵根据功能划分为四个区域，这里不做 T1、T3 区域的单独标注，观点在上文中已经提出，不再赘述**

![变换矩阵功能区分](https://upload-images.jianshu.io/upload_images/1742463-8f9c889124a1f522.png)

- **投影变换**

    目前大部分电子设备的图形显示，都是只能用二维图形表示三维物体，因此三维物体就要靠投影来降低位数得到二维平面图形，3D 到 2D 转换的过程，称为投影变换

- **m34为什么能改变透视关系**：

    m34 影响到了 T4 区域的 **s 值**，**s 值**会对投影的图形在 **z 轴**方向产生**线性**影响，为什么通常会用 **1/d** 的**负值**，因为用户特殊的观察视角，决定了感官上近大远小的特性，同时 **iOS 中的坐标系，是左手坐标系，远离我们的方向，是 z 轴的负方向，所以越深入屏幕，图像中点的齐次坐标中的d就越大，屏幕上的投影就越小**

- **旋转正方向的确定**：
    
    左手坐标系适用于左手定律（反之亦然），握住指定轴，拇指指向该轴正方向，四指指向方向即为正方向