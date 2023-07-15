// handle all uncaught errors

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
})
