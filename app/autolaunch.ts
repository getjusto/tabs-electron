import AutoLaunch from 'easy-auto-launch'

// auto launch app on startup

const autoLauncher = new AutoLaunch({
  name: 'Rebrowser',
})

autoLauncher.enable()

//autoLauncher.disable();

autoLauncher
  .isEnabled()
  .then(isEnabled => {
    if (isEnabled) {
      return
    }
    autoLauncher.enable()
  })
  .catch(err => {
    // handle error
    console.error(err)
  })
