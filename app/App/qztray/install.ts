import sudo from 'sudo-prompt'

const isMac = process.platform === 'darwin'

export async function installQZTray(): Promise<{success: boolean; message: string}> {
  try {
    const script = {
      mac: 'curl qz.sh | bash',
      win: 'irm pwsh.sh | iex'
    }[isMac ? 'mac' : 'win']

    await new Promise<void>((resolve, reject) => {
      sudo.exec(script, {name: 'Crisp'}, function (error, stdout, stderr) {
        if (error) {
          console.error(`Error installing qztray: ${error}`, stdout, stderr)
          reject(`Error: ${error.message}`)
        } else {
          resolve()
        }
      })
    })

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
