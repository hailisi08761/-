@echo off
chcp 65001 >nul
echo ====================================================
echo   PriceSnap 桌面端一键编译并打包脚本 (Windows)
echo ====================================================
echo.
echo 正在检查本地 Node.js 环境...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 本机未检测到 Node.js 环境！
    echo 请先前往 https://nodejs.org/ 下载并运行安装包安装 Node.js (建议 LTS 版本)。
    echo 安装完毕后，请重新双击运行此脚本。
    echo.
    pause
    exit /b
)

echo [1/3] 正在安装打包所需的底层依赖库 (首次执行可能需要 1-2 分钟)...
call npm install

echo [2/3] 正在编译前端网页与后端汇率控制中心...
call npm run build

echo [3/3] 正在将网页、汇率引擎、Chromium内核及Node运行环境一键融合为 .exe 安装程序...
call npm run electron:build

echo.
echo ====================================================
echo   恭喜！桌面应用打包已成功完成！
echo ====================================================
echo 您可以将生成的安装包直接发送给任何人，他们双击即可使用：
echo 📂 目标文件夹: 项目根目录下的 \dist-desktop\
echo 🎁 生成的文件: PriceSnap Setup.exe (无任何环境依赖，双击即运行)
echo ====================================================
echo.
pause
