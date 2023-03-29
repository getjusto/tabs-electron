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
    if (data.type === 'ping') {
      Main.mainWindow.webContents.send(`intraSync:onPing`, token)
    }
    if (data.type === 'intraSyncMessage') {
      Main.mainWindow.webContents.send(`intraSync:onIntraSyncMessage`, {
        token,
        data: data.data
      })
    }
  })

  setTimeout(() => {
    console.log(`Checking ws connection with token ${token}`)
    const connection = connections.get(token)
    if (!connection?.authenticated) {
      console.log(`Closing ws connection with due to timeout`)
      ws.close(1000, 'unauthorized')
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
  connection.ws.close(1000, 'unauthorized')
}

export function getConnectedClientTokens() {
  const values = Array.from(connections.values())
  return values.filter(connection => connection.authenticated).map(connection => connection.token)
}

export function pong(token: string) {
  console.log(`Ponging ws connection with token ${token}`)
  const connection = connections.get(token)
  if (!connection) return
  connection.ws.send(JSON.stringify({type: 'pong'}))
}

export function sendIntraSyncMessage(token: string, data: any) {
  const connection = connections.get(token)
  if (!connection) return
  connection.ws.send(JSON.stringify({type: 'intraSyncMessage', data}))
}

export function resetAllConnections() {
  console.log(`Resetting all ws connections`)
  connections.forEach(connection => connection.ws.close(1000, 'reset'))
}
