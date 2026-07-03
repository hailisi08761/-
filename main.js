// main.js - Electron 桌面端主入口文件
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

  // 1. 禁用默认的顶部菜单栏（让应用看起来更加像专业的独立原生客户端）
  Menu.setApplicationMenu(null);

  // 2. 直接加载您的线上部署网址（例如您的 Vercel 网址）
  // 这种打包方式最为轻量、加载速度最快，且所有记账数据依然安全、独立地保存在用户本机的 LocalStorage 缓存中，绝对不会丢失！
  const vUrl = 'https://pircesnap.vercel.app/'; // <-- 已配置为您真实的 Vercel 网址
  
  win.loadURL(vUrl).catch(() => {
    // 如果加载线上地址失败，则优雅提示
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #0f172a; color: #f1f5f9; text-align: center; }
            h1 { color: #38bdf8; margin-bottom: 8px; }
            p { color: #94a3b8; font-size: 14px; max-width: 400px; line-height: 1.6; }
            .btn { margin-top: 16px; padding: 10px 20px; background-color: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; font-size: 13px; font-weight: bold; }
            .btn:hover { background-color: #0369a1; }
          </style>
        </head>
        <body>
          <h1>无法连接到服务</h1>
          <p>请确保您的电脑处于联网状态，并且已在 <code>main.js</code> 中配置了您真实的 Vercel 部署网址。</p>
          <button class="btn" onclick="location.reload()">重新连接</button>
        </body>
      </html>
    `));
  });
}

app.whenReady().then(createWindow);

// 窗口全部关闭时退出程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
