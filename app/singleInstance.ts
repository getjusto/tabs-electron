import {app} from 'electron'
import Main from './App'

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (Main.mainWindow) {
      if (Main.mainWindow.isMinimized()) Main.mainWindow.restore()
      Main.mainWindow.focus()
    }
  })
}
