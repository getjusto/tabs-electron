// const wss = new WebSocketServer({port: 2162})
// const connections = new Map<string, WebSocket>()

// wss.on('connection', ws => {
//   const connectionId = uuidv4()
//   console.log(`Received new ws connection with id ${connectionId}`)
//   connections.set(connectionId, ws)
//   ws.on('close', () => {
//     console.log(`Closing ws connection with id ${connectionId}`)
//     connections.delete(connectionId)
//   })
// })

// const sendMessage: IntraSyncAPI['sendMessage'] = async ({connectionId, message}) => {
//   const ws = connections.get(connectionId)
//   if (ws) {
//     ws.send(message)
//   }
// }
