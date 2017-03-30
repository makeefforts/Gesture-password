【Crome 移动模拟器下测试】


一、思路：

1.移动端页面布局。做了简单的屏幕适配和百分比自适应布局。

2.JS动态创建canvas画布，初始化绘制手势密码图，开始绘制过程。


1）监听手指滑动事件(touchmove)。

   实时监测手指位置是否位于进入某圆内(手指相对于画布的坐标距圆心的距离小于半径),并将滑过的圆的圆心坐标按顺序存储起来。


2）将鼠标滑过的圆选中并按顺序连线，同时绘制当前手指位置与最后一个圆心的连线，两者组成整个绘制痕迹。


   手指滑动时，touchmove事件实时发生，不断刷新画布重复上述绘制过程且速度很快，所以呈现给用户动态绘制过程的图像。


   其中：pointDraw函数：填充选中圆

         lineDraw函数：绘制选中圆心之间的连线


3.存储绘制结果。

  当手指抬起即触发touchend事件，将先后滑过的圆的序号(即push到数组中的该圆心坐标的索引+1)按顺序存储，

  存储数据作为本次手势密码存储到e.data.that.result用于后续逻辑判断。


4.功能模块实现

  模块选择：

  operate=$("#operate input:checked").attr('operate')

  1）设置密码【operate=='set'】

    ①判断是否设置过密码，如果设置过则提示：“您设置过密码，如需重置请继续”，没有设置过，则提示：“请输入手势密码”；    //新加功能

    ②判断密码设置的长度，如果＜5，返回：“密码太短,至少需要5个点”，并重置密码；否则，将密码存储，并提示：“请再次输入密码”；

    ③再次输入密码确认，并与已存储密码比对，一致，返回：“密码设置成功”，并将密码存储在localStorage；否则：“两次输入的不一致,请重新输入”，并重置界面；

  2）验证密码【(operate=='valid'】

    ①判断是否设置过密码，如果没有，提示：“您还没有设置过密码”，否则，提示验证密码 ：“请输入您设置的密码”；     //新加功能

    ②比对输入的验证密码，如果与存储的密码一致，返回：“输入密码正确”，否则：“输入密码错误”。

二、调试提示：

1.调试环境：【Crome 移动模拟器下测试】

2.调试提示：①为了方便调试，代码设定为：刷新会清空localStorage；

	    ②设置密码后，选择“设置密码”选项，会提示你已设置，是否重置密码，如果此时重新绘制的密码不符合规则，则保留原来的密码