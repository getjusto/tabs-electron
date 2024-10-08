import {BrowserWindow, dialog, powerSaveBlocker} from 'electron'
import ElectronStore from 'electron-store'
import {autoUpdater} from 'electron-updater'
import {baseURL, browserWindowConfig, isMac} from '../env'
import {registerIntraSync} from './offline/ipc'
import {shell} from 'electron'

import './offline'
import {checkCertsAndStartServer} from './offline/certs'

const store = new ElectronStore()

export default class Main {
  static mainWindow: Electron.BrowserWindow
  static application: Electron.App
  static powerSaveBlockerId: number
  static BrowserWindow: typeof BrowserWindow

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static onClosed() {
    // Dereference the window object.
    Main.mainWindow = null
    powerSaveBlocker.stop(Main.powerSaveBlockerId)
  }

  private static onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      Main.createWindow()
    }
  }

  private static onClose(e: Electron.Event) {
    const choice = dialog.showMessageBoxSync(Main.mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirma tus acciones',
      message: '¿Realmente quieres cerrar la aplicación?',
    })
    if (choice > 0) e.preventDefault()

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

  private static onReady() {
    Main.createWindow()
    registerIntraSync()
    checkCertsAndStartServer()
  }

  private static createWindow() {
    Main.mainWindow = new Main.BrowserWindow(browserWindowConfig)
    Main.mainWindow.on('close', Main.onClose)
    Main.mainWindow.on('closed', Main.onClosed)
    Main.mainWindow.once('ready-to-show', Main.onReadyToShow)

    // disable background throttling
    Main.mainWindow.webContents.setBackgroundThrottling(false)

    // make links open in default browser
    Main.mainWindow.webContents.setWindowOpenHandler(({url}) => {
      shell.openExternal(url)
      return {action: 'deny'}
    })

    const latestURL = (store.get('latestURL') || '') as string
    const initialURL = latestURL.startsWith(baseURL) ? latestURL : baseURL

    console.log('opening...', initialURL)

    Main.mainWindow.loadURL(initialURL)

    autoUpdater.checkForUpdatesAndNotify()

    Main.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension')
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow
    Main.application = app
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('ready', Main.onReady)
    Main.application.on('activate', Main.onActivate)
  }
}
