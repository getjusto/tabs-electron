import {exec} from 'child_process'

export async function execPromise(script: string) {
  return await new Promise<string>((resolve, reject) => {
    console.log(`Will run exec promise: ${script}`)
    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error in sudo promise: ${error}`, stdout, stderr)
        reject(`Error: ${error.message}`)
      } else {
        console.log('Sudo promise success', {
          stdout,
        })
        resolve(stdout.toString())
      }
    })
  })
}
