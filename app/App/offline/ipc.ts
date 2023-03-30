import {ipcMain} from 'electron'
import {validateSender} from './validateSender'
import {getDeviceIP} from './ip'
import {AuthorizationRequest, respondToRequest} from './initConnection'
import {
  acceptConnection,
  getConnectedClientTokens,
  pong,
  rejectConnection,
  resetAllConnections,
  sendIntraSyncMessage,
  setIsCentral
} from './ws'

export interface IntraSyncAPI {
  getDeviceIP: () => Promise<string>
  respondToRequest: (token: string, status: 'accepted' | 'rejected') => void
  onNewAuthorizationRequest: (callback: (request: AuthorizationRequest) => void) => void

  acceptConnection: (token: string) => void
  rejectConnection: (token: string) => void
  getConnectedClientTokens: () => Promise<string[]>
  pong: (token: string) => void
  sendIntraSyncMessage: (token: string, data: any) => void
  resetAllConnections: () => void // when app starts, all connections are reset
  setIsCentral: (isCentral: boolean) => void // when app starts, all connections are reset

  onPing: (callback: (token: string) => void) => void
  onNewConnection: (callback: (token: string) => void) => void
  onConnectionClosed: (callback: (token: string) => void) => void
  onIntraSyncMessage: (callback: (params: {token: string; data: any}) => void) => void
}

export function registerIntraSync() {
  handleEvent('getDeviceIP', getDeviceIP)
  handleEvent('respondToRequest', respondToRequest)
  handleEvent('acceptConnection', acceptConnection)
  handleEvent('rejectConnection', rejectConnection)
  handleEvent('getConnectedClientTokens', getConnectedClientTokens)
  handleEvent('sendIntraSyncMessage', sendIntraSyncMessage)
  handleEvent('resetAllConnections', resetAllConnections)
  handleEvent('pong', pong)
  handleEvent('setIsCentral', setIsCentral)
}

function handleEvent(eventName: string, handler: (...args: any[]) => any) {
  console.log(`Registering handler for ${eventName}`)
  ipcMain.handle(`intraSync:${eventName}`, async (event, ...args) => {
    console.log(`Received ${eventName} event`, ...args)
    if (!validateSender(event.senderFrame)) return null
    const result = await handler(...args)
    return result
  })
}
