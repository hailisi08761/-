# 跨多端桌面版本（Desktop App）部署与打包指南

本应用是一个基于 **React 18 + Vite** 开发的精算与记账系统。在成功部署到 Vercel 等平台后，您可以选择最简单、轻量的 **Electron + electron-builder** 方案，直接将您的云端网页打包为一个**独立的桌面应用安装包（setup.exe）**。

本指南为您提供两种最佳方案：
1. **方案一：【强烈推荐】极简云端版 —— 直接封装 Vercel 网页，打包为独立安装包（setup.exe）** （无需运行本地服务器，打包体积小，安装即用，最简单）
2. **方案二：本地离线版 —— 包装本地全栈服务，打包为免安装绿色版文件夹** （适合完全离线、不依赖外部网站的用户）

---

## 方案一：【强烈推荐】极简云端包装版 (直接生成 `setup.exe` 桌面安装包)

由于本应用已成功部署到 Vercel 等平台，并且已完美兼容浏览器本地存储（LocalStorage）及实时公网汇率同步，您**无需**在用户本地运行 Express 节点，直接将其包装为桌面应用即可！

### 1️⃣ 第一步：安装 Electron 和 打包工具
在您的项目根目录下，运行以下命令安装：
```bash
npm install electron electron-builder --save-dev
```

### 2️⃣ 第二步：编写极简 Electron 入口文件
在项目根目录下创建一个名为 `main.js` 的文件，写入以下内容（将 `https://你的网页.com` 替换为您的 Vercel 实际部署链接）：

```javascript
// main.js
const { app, BrowserWindow, Menu } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    title: "PriceSnap - 跨境采购记账与多站点财务精算系统",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 1. 禁用默认顶部菜单栏（让应用看起来更像专业原生软件）
  Menu.setApplicationMenu(null);

  // 2. 直接载入您的 Vercel 部署网址
  win.loadURL('https://你的网页.com'); // <-- 替换成您的实际 Vercel 地址，例如 https://price-snap.vercel.app
}

app.whenReady().then(createWindow);

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

### 3️⃣ 第三步：在 `package.json` 中配置打包配置
在您的 `package.json` 中补充主入口及 `build` 打包配置：

1. 确认 `"main"` 指向 `main.js`：
   ```json
   "main": "main.js",
   ```
2. 在 `"scripts"` 增加启动和一键打包指令：
   ```json
   "scripts": {
     "dev": "tsx server.ts",
     "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
     "start": "node dist/server.cjs",
     "preview": "vite preview",
     "clean": "rm -rf dist server.js",
     "lint": "tsc --noEmit",
     
     "electron:start": "electron .",
     "electron:build": "electron-builder"
   },
   ```
3. 在 `package.json` 最外层添加 `build` 属性（指定 `electron-builder` 的打包行为，如生成 `setup.exe` 和应用图标）：
   ```json
   "build": {
     "appId": "com.pricesnap.app",
     "productName": "PriceSnap",
     "directories": {
       "output": "dist-desktop"
     },
     "win": {
       "target": [
         "nsis"
       ]
     },
     "nsis": {
       "oneClick": false,
       "allowToChangeInstallationDirectory": true,
       "createDesktopShortcut": true,
       "createStartMenuShortcut": true,
       "shortcutName": "PriceSnap"
     }
   }
   ```

### 4️⃣ 第四步：测试与自动打包

* **本地测试桌面效果：**
  ```bash
  npm run electron:start
  ```
* **一键打包为 `setup.exe`：**
  ```bash
  npm run electron:build
  ```

#### 👉 自动生成：
打包完成后，项目根目录下的 `dist-desktop/` 文件夹内会自动生成：
* 🎁 **`PriceSnap Setup.exe` (标准的 Windows 桌面安装包)**
* 用户双击该 `.exe` 即可像安装常规微信、千牛等软件一样，一键安装、生成桌面快捷方式、一键打开并完美使用！

---

## 方案二：全本地免安装绿色版 (包含 Express 后端)

如果您希望用户即使**完全断网**、不用云端网页，也能在本地单机运行一整套服务，您可以使用以下方案在本地自动拉起 Express 服务：

### 1. 安装 Electron 及打包依赖
```bash
npm install electron --save-dev
npm install electron-packager --save-dev
```

### 2. 编写本地主进程代码 (`main.js`)
如果您需要打包全本地版，请把 `main.js` 替换成下面这套可以静默启动本地 `dist/server.cjs` 服务的代码：

```javascript
// main.js (本地服务包装版)
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let serverProcess;

function startExpressServer() {
  const serverPath = path.join(__dirname, 'dist', 'server.cjs');
  serverProcess = fork(serverPath, [], {
    env: { 
      NODE_ENV: 'production',
      PORT: '3000'
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    title: "PriceSnap - 跨境财务精算系统",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  Menu.setApplicationMenu(null);

  // 延迟 1 秒等待 Express 启动后载入本地地址
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 1000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startExpressServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
```

### 3. 修改 package.json 打包指令
```json
"scripts": {
  "electron:local-start": "npm run build && electron .",
  "electron:local-pack": "npm run build && electron-packager . PriceSnap --platform=win32 --arch=x64 --out=release-builds --overwrite"
}
```
运行 `npm run electron:local-pack` 会在 `release-builds/` 目录下生成免安装、解压即用的免安装绿色版客户端文件夹。

---

## 💡 为什么这两个方案的数据不会丢失？
Electron 拥有独立的用户沙盒目录。即使用户关闭软件或电脑，他们记录的采购账单、商品汇损、模拟器参数依然会被安全地保存在他们本机的存储沙盒中（LocalStorage / IndexedDB），实现了完美的**本地离线存储**体验。
