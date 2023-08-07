import {digitalCertificate} from './digital-certificate'
import {sudoPromise} from './sudoPromise'
import fs from 'fs'
import os from 'os'

const isMac = process.platform === 'darwin'

export async function installQZTray(): Promise<{success: boolean; message: string}> {
  try {
    const script = {
      mac: 'curl qz.sh | bash',
      win: `powershell -Command "irm pwsh.sh | iex"`
    }[isMac ? 'mac' : 'win']

    await sudoPromise(script)
    await installCertificate()

    return {
      success: true,
      message: 'Se instaló con éxito'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

async function installCertificate() {
  // write the file to a temp folder
  const path = os.tmpdir() + '/digital-certificate.txt'
  fs.writeFileSync(path, digitalCertificate)

  const script = {
    mac: `"/Applications/QZ Tray.app/Contents/MacOS/QZ Tray" --whitelist "${path}"`,
    win: `"%PROGRAMFILES%\\QZ Tray\\qz-tray-console.exe" --whitelist "${path}"`
  }[isMac ? 'mac' : 'win']

  await sudoPromise(script)
}
