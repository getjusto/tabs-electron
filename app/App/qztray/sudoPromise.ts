import sudo from 'sudo-prompt'

export async function sudoPromise(script: string) {
  return await new Promise<string>((resolve, reject) => {
    console.log(`Will run sudo promise: ${script}`)
    sudo.exec(script, {name: 'Justo Hub'}, (error, stdout, stderr) => {
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
