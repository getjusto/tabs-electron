import find from 'find-process'
import {exec} from 'child_process'
import tcpPortUsed from 'tcp-port-used'
import {killProcess} from './killProcess'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const isMac = process.platform === 'darwin'

export function fileExists(): Promise<boolean> {
  return new Promise(resolve => {
    if (isMac) {
      // check if file exists in mac
      exec('ls "/Applications/JSPrintManager5.app"', error => {
        console.log('error', error)
        if (error) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    } else {
      exec(
        'dir "C:\\Program Files (x86)\\Neodynamic\\jspm for Windows\\v5.0\\jspm5.exe"',
        error => {
          if (error) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
      )
    }
  })
}

export async function restartPrintManager(): Promise<{success: boolean; message: string}> {
  try {
    if (!(await fileExists())) return {success: false, message: 'noPrintManager'}

    let processes = [...(await find('name', 'jspm')), ...(await find('port', 25443))]
    // uniq by pid
    processes = processes.filter(
      (proc, index, self) => self.findIndex(p => p.pid === proc.pid) === index
    )

    console.log('Found processes', processes)
    const messages: string[] = []

    for (const proc of processes) {
      try {
        // open the same app again
        const result = await killProcess(proc.pid)
        messages.push(result)
      } catch (error) {
        messages.push(`No se pudo cerrar el proceso ${proc.pid}. ${error.message}`)
      }
    }

    // open the same app again
    if (isMac) {
      exec('open -a "/Applications/JSPrintManager5.app"')
      messages.push(`Se abrió la aplicación JSPrintManager5.app`)
    } else {
      exec('start "" "C:\\Program Files (x86)\\Neodynamic\\jspm for Windows\\v5.0\\jspm5.exe"')
      messages.push(`Se abrió la aplicación JSPrintManager5.exe`)
    }

    try {
      await tcpPortUsed.waitUntilUsed(25443, 500, 15000)
    } catch {}

    processes = [...(await find('name', 'jspm')), ...(await find('port', 25443))]

    if (!processes) {
      messages.push(`No se puso iniciar print manager. Intente reiniciar la computadora`)
      return {
        success: false,
        message: messages.join('\n')
      }
    }

    console.log('Found processes after restart', processes)

    if (!(await tcpPortUsed.check(25443))) {
      messages.push(`Print manager no se abrió en el puerto correcto. Reintentando...`)
      return restartPrintManager()
    }

    return {
      success: true,
      message: messages.join('\n')
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}
