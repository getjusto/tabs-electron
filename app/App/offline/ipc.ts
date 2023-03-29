import {ipcMain} from 'electron'
import {validateSender} from './validateSender'
import {getDeviceIP} from './ip'
import {AuthorizationRequest, respondToRequest} from './initConnection'
import {acceptConnection, getConnectedClientTokens, rejectConnection} from './ws'

export interface IntraSyncAPI {
  getDeviceIP: () => Promise<string>
  respondToRequest: (token: string, status: 'accepted' | 'rejected') => void
  onNewAuthorizationRequest: (callback: (request: AuthorizationRequest) => void) => void

  acceptConnection: (token: string) => void
  rejectConnection: (token: string) => void
  getConnectedClientTokens: () => Promise<string[]>
  onNewConnection: (callback: (token: string) => void) => void
  onConnectionClosed: (callback: (token: string) => void) => void
}

export function registerIntraSync() {
  handleEvent('getDeviceIP', getDeviceIP)
  handleEvent('respondToRequest', respondToRequest)
  handleEvent('acceptConnection', acceptConnection)
  handleEvent('rejectConnection', rejectConnection)
  handleEvent('getConnectedClientTokens', getConnectedClientTokens)
}

function handleEvent(eventName: string, handler: (...args: any[]) => any) {
  console.log(`Registering handler for ${eventName}`)
  ipcMain.handle(`intraSync:${eventName}`, async (event, ...args) => {
    console.log(`Received ${eventName} event`, ...args)
    if (!validateSender(event.senderFrame)) return null
    console.log(`Validated sender for ${eventName} event`, ...args)
    const result = await handler(...args)
    return result
  })
}
