import tcpPortUsed from 'tcp-port-used'
import {exec} from 'child_process'
import sudo from 'sudo-prompt'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const isMac = process.platform === 'darwin'

export async function killProcess(processId: number): Promise<string> {
  if (isMac) {
    return killProcessMac(processId)
  } else {
    return killProcessWindows(processId)
  }
}

async function killProcessMac(processId: number) {
  // force quit the process
  const signal = 'SIGKILL'
  process.kill(processId, signal)
  await tcpPortUsed.waitUntilFree(25443, 500, 30000)
  await sleep(30000) // si no se espera lo suficiente, el proceso parte en un puerto incorrecto

  return `Se ha cerrado el proceso`
}

async function killProcessWindows(processId: number) {
  await new Promise<void>((resolve, reject) => {
    exec(`taskkill /F /PID ${processId}`, (err, stdout, stderr) => {
      if (err) {
        // Process couldn't be killed or command couldn't be executed
        console.error(`Error: ${err} ${stderr}, will try with sudo`)

        sudo.exec(
          `taskkill /F /PID ${processId}`,
          {
            name: 'Crisp'
          },
          function (error, stdout, stderr) {
            if (error) {
              console.error(`Error killing with sudo: ${err}`, stdout, stderr)
              reject(`Error: ${error.message}`)
            } else {
              resolve()
            }
          }
        )
      } else {
        // Successfully killed the process
        console.log(`Output: ${stdout}`)
        resolve()
      }
    })
  })
  await sleep(2000)
  await tcpPortUsed.waitUntilFree(25443, 500, 30000)

  return `Se ha cerrado el proceso [${processId}]`
}
