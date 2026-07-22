import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {getDigitalCertificate} from './getDigitalCertificate'
import {sudoPromise} from './sudoPromise'

const isMac = process.platform === 'darwin'

export async function installQZTray(): Promise<{success: boolean; message: string}> {
  try {
    const script = {
      mac: 'curl qz.sh | bash',
      win: `powershell -Command "irm pwsh.sh | iex"`,
    }[isMac ? 'mac' : 'win']

    await sudoPromise(script)
    await installCertificate()

    return {
      success: true,
      message: 'Se instaló con éxito',
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

async function installCertificate() {
  const digitalCertificate = await getDigitalCertificate()

  // write the file to a temp folder
  const certificatePath = path.join(os.tmpdir(), 'digital-certificate.txt')
  fs.writeFileSync(certificatePath, digitalCertificate)

  const script = {
    mac: `"/Applications/QZ Tray.app/Contents/MacOS/QZ Tray" --whitelist "${certificatePath}"`,
    win: `"%PROGRAMFILES%\\QZ Tray\\qz-tray-console.exe" --whitelist "${certificatePath}"`,
  }[isMac ? 'mac' : 'win']

  await sudoPromise(script)
}
