import {app} from 'electron'
import {autoUpdater} from 'electron-updater'
import Main from '.'

export function getAppVersion() {
  console.log('will get app version')
  return app.getVersion()
}

export async function checkForUpdates() {
  if (!autoUpdater.isUpdaterActive()) {
    throw new Error('Updater is not active')
  }
  const result = await autoUpdater.checkForUpdates()
  console.log(result)
  if (result.downloadPromise) {
    await result.downloadPromise
    autoUpdater.quitAndInstall()
  }
  return JSON.parse(JSON.stringify(result))
}

export function setKiosk(flag: boolean) {
  console.log('Setting kiosk mode to', flag)
  Main.mainWindow?.setKiosk(flag)
}
