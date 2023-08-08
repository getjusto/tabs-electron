import {spawn} from 'child_process'
import {dialog} from 'electron'
import fs from 'fs'
import Main from '..'
import {installQZTray} from './install'

const isMac = process.platform === 'darwin'

let isOpening = false

export async function openQZTray(): Promise<{success: boolean; message: string}> {
  if (isOpening) {
    return {
      success: false,
      message: 'Ya se está abriendo'
    }
  }

  isOpening = true

  try {
    const path = {
      mac: '/Applications/QZ Tray.app/Contents/MacOS/QZ Tray',
      win: `${process.env.PROGRAMFILES}\\QZ Tray\\qz-tray-console.exe`
    }[isMac ? 'mac' : 'win']

    // file exists
    if (!fs.existsSync(path)) {
      const choice = dialog.showMessageBoxSync(Main.mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Instalar QZ Tray',
        message: 'No se encontró QZ Tray, ¿Quieres instalarlo?'
      })
      if (choice === 0) {
        installQZTray()
      }
      isOpening = false
      return {
        success: false,
        message: 'No se encontró QZ Tray'
      }
    }

    const script = {
      mac: '"/Applications/QZ Tray.app/Contents/MacOS/QZ Tray"',
      win: `"%PROGRAMFILES%\\QZ Tray\\qz-tray.exe"`
    }[isMac ? 'mac' : 'win']

    const subprocess = spawn(script, [], {
      detached: true,
      stdio: 'ignore',
      shell: true
    })

    subprocess.unref()

    isOpening = false
    return {
      success: true,
      message: 'Se abrió con éxito'
    }
  } catch (error) {
    isOpening = false
    return {
      success: false,
      message: error.message
    }
  }
}
