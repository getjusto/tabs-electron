import log from 'electron-log/main'

// Optional, initialize the logger for any renderer process
log.initialize({preload: true})

log.info('Log from the main process')
console.log = log.log
