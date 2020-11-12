# 常用 Android 调试桥命令行

- 查看设备连接

  ```
  adb devices
  ```

- 重启 ADB
  
  ```
  adb kill-server
  adb start-server

  # 重启失败
  taskkill /F /T /IM adb.exe

  # 或
  > netstat -ano | findstr "5037"
    TCP    127.0.0.1:58440    127.0.0.1:5037    ESTABLISHED    2376
  > taskkill /F /T /PID 2376
  ```

- 设备启动

  ```
  adb reboot [bootloader/recovery]

  # 多台设备指定设备 ID
  adb -s ID reboot

  # 关机
  adb shell reboot -p
  ```

- adb shell

  ```
  # 查看设备架构版本
  adb shell getprop ro.product.cpu.abi

  # Package Manager
  ## 列出所有包 
  ### "-d": 仅已停用; "-e": 仅已启用
  ### "-s": 仅系统包; "-3": 仅第三方包
  pm list packages

  ## 显隐、开启/停用
  pm enable [--user USER_ID] PACKAGE_OR_COMPONENT
  pm disable-user [--user USER_ID] PACKAGE_OR_COMPONENT
  pm hide [--user USER_ID] PACKAGE_OR_COMPONENT
  pm unhide [--user USER_ID] PACKAGE_OR_COMPONENT
  ```