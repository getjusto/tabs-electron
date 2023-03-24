const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

const isLocal = process.env.JUSTO_ENV === 'local';

const url = isLocal
  ? 'http://crisp.internal:5140'
  : 'https://crisp.getjusto.com';

const createWindow = () => {
  const macConfig = {
    width: 1100,
    height: 750,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 10 },
  };
  const windowsConfig = {
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
  };

  const isMac = process.platform === 'darwin';
  const config = isMac ? macConfig : windowsConfig;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    center: true,
    ...config,
    webPreferences: {
      devTools: true,
      autoplayPolicy: 'no-user-gesture-required',
      allowRunningInsecureContent: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!isMac) {
      mainWindow.maximize();
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  autoUpdater.checkForUpdatesAndNotify();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
