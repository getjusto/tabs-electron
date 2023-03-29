import {WebSocketServer, WebSocket} from 'ws'
import Main from '..'

const wss = new WebSocketServer({port: 2162})

interface Connection {
  token: string
  ws: WebSocket
  authenticated: boolean
}
const connections = new Map<string, Connection>()

wss.on('connection', ws => {
  let token: string = null
  console.log(`Received new ws connection with id`)

  ws.on('close', () => {
    if (token) {
      console.log(`Closing ws connection with token ${token}`)
      connections.delete(token)
      Main.mainWindow.webContents.send(`intraSync:onConnectionClosed`, token)
    } else {
      console.log(`Closing ws connection without token`)
    }
  })

  ws.on('message', message => {
    const data = JSON.parse(message.toString())
    console.log(`Received message from ws connection`, data)
    if (data.type === 'auth') {
      token = data.token
      connections.set(token, {
        token,
        ws,
        authenticated: false
      })
      console.log(`Set token for ws connection to ${token}`)
      Main.mainWindow.webContents.send(`intraSync:onNewConnection`, token)
    }
  })

  setTimeout(() => {
    console.log(`Checking ws connection with token ${token}`)
    const connection = connections.get(token)
    if (!connection?.authenticated) {
      console.log(`Closing ws connection with due to timeout`)
      ws.close()
    }
  }, 5000)
})

export function acceptConnection(token: string) {
  const {ws} = connections.get(token)
  if (ws) {
    ws.send(JSON.stringify({type: 'accepted'}))
  }
  connections.set(token, {
    token,
    ws,
    authenticated: true
  })
}

export function rejectConnection(token: string) {
  const connection = connections.get(token)
  if (!connection) return
  connection.ws.close()
}

export function getConnectedClientTokens() {
  const values = Array.from(connections.values())
  return values.filter(connection => connection.authenticated).map(connection => connection.token)
}
