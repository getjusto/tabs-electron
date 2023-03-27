import {BrowserWindow} from 'electron'
import {autoUpdater} from 'electron-updater'

import ElectronStore = require('electron-store')

import {baseURL, browserWindowConfig, isMac} from '../env'

const store = new ElectronStore()

export default class Main {
  static mainWindow: Electron.BrowserWindow
  static application: Electron.App
  static BrowserWindow: typeof BrowserWindow

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static onClosed() {
    // Dereference the window object.
    Main.mainWindow = null
  }

  private static onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      Main.createWindow()
    }
  }

  private static onClose() {
    const latestURL = Main.mainWindow.webContents.getURL()
    // save latestURL in local storage
    if (latestURL.startsWith(baseURL)) {
      store.set('latestURL', latestURL)
    }
  }

  private static onReadyToShow() {
    Main.mainWindow.show()
    if (!isMac) {
      Main.mainWindow.maximize()
    }
  }

  private static createWindow() {
    Main.mainWindow = new Main.BrowserWindow(browserWindowConfig)
    Main.mainWindow.on('close', Main.onClose)
    Main.mainWindow.on('closed', Main.onClosed)
    Main.mainWindow.once('ready-to-show', Main.onReadyToShow)

    const latestURL = (store.get('latestURL') || '') as string
    const initialURL = latestURL.startsWith(baseURL) ? latestURL : baseURL

    // and load the index.html of the app.
    Main.mainWindow.loadURL(initialURL)

    autoUpdater.checkForUpdatesAndNotify()
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow
    Main.application = app
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('ready', Main.createWindow)
    Main.application.on('activate', Main.onActivate)
  }
}
