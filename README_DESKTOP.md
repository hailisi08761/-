# 跨多端桌面版本（Desktop App）部署与打包指南

本应用是一个基于 **React 18 + Vite + Express** 的全栈架构应用。您可以轻松地将其下载、解压并作为**本地桌面应用**运行，或者通过 **Electron** 将其打包为真正的桌面客户端可执行程序（如 Windows `.exe`、macOS `.dmg`）。

本指南将为您提供两种方案：
1. **方案一：本地一键启动运行（最推荐，简单高效）**
2. **方案二：打包为独立桌面应用安装包（使用 Electron）**

---

## 方案一：本地一键启动运行 (Local Web App)

用户只需要在本地电脑上拥有 Node.js 环境，即可通过 Git 下载或解压 ZIP，并在本地双击或通过终端运行。

### 1. 环境准备
确保电脑已安装 [Node.js](https://nodejs.org/)（推荐使用 v18 或 v20 LTS 版本）。

### 2. 运行步骤
打开终端（Windows 的 CMD / PowerShell，或 macOS 的 Terminal），依次执行以下命令：

```bash
# 1. 克隆仓库或解压后进入项目目录
git clone <您的Git仓库地址>
cd <项目文件夹>

# 2. 安装所有依赖包
npm install

# 3. 编译并启动本地全栈服务
npm run build
npm run start
```

### 3. 使用体验
启动成功后，控制台会输出 `Server running on http://localhost:3000`。
* 此时直接在浏览器中打开 `http://localhost:3000` 即可完全在本地运行所有记账、汇率核算及模拟器功能。
* **离线/本地存储**：所有数据均存储在用户的本地浏览器缓存中（LocalStorage），断网亦可正常记账与使用基础模拟器。

---

## 方案二：打包为真正的桌面端独立应用 (Electron Desktop App)

如果您希望用户双击打开的就是一个**独立的软件窗口**（没有浏览器地址栏，像普通桌面软件一样），您可以使用 **Electron** 包装此应用。由于应用包含后端 Express 服务（处理汇率 API），最稳妥且无需改动代码的方案是：**在 Electron 启动时静默拉起 Express 后端，再用 Electron 窗口加载该本地服务**。

以下是具体的集成与打包配置步骤：

### 步骤 1：安装 Electron 相关依赖
在您的项目根目录下，运行以下命令安装 Electron 依赖：
```bash
npm install electron --save-dev
npm install electron-packager --save-dev
```

### 步骤 2：创建 Electron 主进程文件
在项目根目录下创建一个名为 `main.js` 的文件，写入以下代码。它会在后台拉起您已编译好的 `dist/server.cjs`（即全栈服务端），并打开桌面窗口：

```javascript
// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let serverProcess;

function startExpressServer() {
  // 在生产环境中，通过子进程启动打包好的 Express 服务 (dist/server.cjs)
  const serverPath = path.join(__dirname, 'dist', 'server.cjs');
  
  // 注入生产环境环境变量，确保 Express 正常读取静态资源
  serverProcess = fork(serverPath, [], {
    env: { 
      NODE_ENV: 'production',
      PORT: '3000'
    }
  });

  serverProcess.on('message', (msg) => {
    console.log('Express Server:', msg);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "跨境采购记账与多站点财务精算系统",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    // 隐藏默认菜单栏（可选）
    autoHideMenuBar: true
  });

  // 稍作延迟（给子进程 Express 启动留出 1 秒时间），然后加载本地服务
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 1000);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 当 Electron 初始化完成时
app.whenReady().then(() => {
  startExpressServer();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口关闭时退出应用，并杀掉后台的 Express 子进程
app.on('window-all-closed', function () {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});
```

### 步骤 3：修改 `package.json` 配置
在您的 `package.json` 中，需要补充入口字段及快捷打包指令。

1. **添加主入口字段**：
   ```json
   "main": "main.js",
   ```

2. **在 `"scripts"` 中添加打包与本地启动指令**：
   ```json
   "scripts": {
     "dev": "tsx server.ts",
     "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
     "start": "node dist/server.cjs",
     "preview": "vite preview",
     "clean": "rm -rf dist server.js",
     "lint": "tsc --noEmit",
     
     "electron:start": "npm run build && electron .",
     "electron:pack": "npm run build && electron-packager . 跨境记账精算系统 --platform=win32 --arch=x64 --out=release-builds --overwrite"
   }
   ```
   *注：上面的 `electron:pack` 示例打包为 Windows 64位版本。如果是 macOS 系统，可以修改 `--platform=darwin` 或使用 `--platform=all`。*

### 步骤 4：本地测试与一键打包

1. **在本地运行测试桌面版**：
   ```bash
   npm run electron:start
   ```
   系统会自动编译 React 和 Express 服务，并弹出一个独立的精美软件窗口。

2. **一键生成解压即用的桌面可执行程序 (exe/dmg)**：
   ```bash
   npm run electron:pack
   ```
   打包完成后，项目根目录下的 `release-builds/` 文件夹中会生成一个免安装的绿色版文件夹（例如：`跨境记账精算系统-win32-x64`）。
   * **如何发布给用户**：您只需将这个文件夹整体右键打包压缩成 **ZIP 格式**，上传到 Git 或任何网盘，用户下载解压后，**双击里面的 `.exe` 即可直接打开桌面软件运行**，体验无异于常规客户端，且所有的本地记账数据和精算配置完全由用户本地保管。

---

## 💡 开发与分发建议
* **跨平台兼容**：因为 Electron 基于 Chromium 内核，打包出来的应用在 Windows 和 macOS 下的显示、动画完全一致。
* **数据持久化**：应用使用浏览器的 LocalStorage 或 IndexedDB，作为桌面版本运行时，Electron 会在用户系统应用目录下自动分配独立的存储分区，**即便关闭或重启电脑，记账数据也不会丢失**。
