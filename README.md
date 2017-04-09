【Crome 移动模拟器下测试】

demo演示地址：https://makeefforts.github.io/Gesture-password/index.html


一、思路：

1.移动端页面布局。做了简单的屏幕适配和百分比自适应布局。

2.JS动态创建canvas画布，初始化绘制手势密码图，开始绘制过程。

3.存储绘制结果。

4.功能模块实现

  模块选择：

  operate=$("#operate input:checked").attr('operate')

  1）设置密码【operate=='set'】

  2）验证密码【(operate=='valid'】

二、调试提示：

1.调试环境：【Crome 移动模拟器下测试】

2.调试提示：

1）为了方便调试，代码设定为：刷新会清空localStorage；

2）设置密码后，选择“设置密码”选项，会提示你已设置，是否重置密码，如果此时重新绘制的密码不符合规则，则保留原来的密码
