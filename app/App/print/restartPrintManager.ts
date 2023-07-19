import find from 'find-process'
import {exec} from 'child_process'
import tcpPortUsed from 'tcp-port-used'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function restartPrintManager(): Promise<{success: boolean; message: string}> {
  try {
    let processes = [...(await find('name', 'jspm')), ...(await find('port', 25443))]
    // uniq by pid
    processes = processes.filter(
      (proc, index, self) => self.findIndex(p => p.pid === proc.pid) === index
    )

    console.log('Found processes', processes)
    const messages: string[] = []

    for (const proc of processes) {
      try {
        // force quit the process
        const signal = 'SIGKILL'
        process.kill(proc.pid, signal)
        messages.push(`Se ha cerrado el proceso`)
        await tcpPortUsed.waitUntilFree(25443, 500, 30000)
        await sleep(20000)
      } catch (error) {
        messages.push(`No se pudo cerrar el proceso ${proc.pid}`)
      }
    }

    // open the same app again
    const isMac = process.platform === 'darwin'
    if (isMac) {
      exec('open -a "/Applications/JSPrintManager5.app"')
      messages.push(`Se abrió la aplicación JSPrintManager5.app`)
    } else {
      exec('start "" "C:\\Program Files (x86)\\Neodynamic\\jspm for Windows\\v5.0\\jspm5.exe"')
      messages.push(`Se abrió la aplicación JSPrintManager5.exe`)
    }

    await sleep(10000)

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
