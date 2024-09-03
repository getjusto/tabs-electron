import {execPromise} from '../qztray/execPromise'
import {sudoPromise} from '../qztray/sudoPromise'

const isWindows = process.platform === 'win32'

export async function initRustdesk() {
  console.log('will init rustdesk windows')
  if (!isWindows)
    return `ID:No
PASSWORD:Solo para Windows`

  try {
    const results: string[] = []
    const randomPassword = Math.floor(Math.random() * 100000000) + 100000000

    results.push(
      `ID:${await execPromise(`"%ProgramFiles%\\RustDesk\\rustdesk.exe" --get-id | more`)}`,
    )
    results.push(
      `PSTD:${await sudoPromise(`"%ProgramFiles%\\RustDesk\\rustdesk.exe" --password ${randomPassword}`)}`,
    )
    results.push(`PASSWORD:${randomPassword}`)

    return results.join('\n')
  } catch (error) {
    return `Error al iniciar rustdesk: ${error.message}`
  }
}
