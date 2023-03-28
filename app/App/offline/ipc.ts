import {ipcMain} from 'electron'
import {validateSender} from './validateSender'
import {getDeviceIP} from './ip'
import {AuthorizationRequest, respondToRequest} from './initConnection'

export interface IntraSyncAPI {
  getDeviceIP: () => Promise<string>
  respondToRequest: (token: string, status: 'accepted' | 'rejected') => void
  onNewAuthorizationRequest: (callback: (request: AuthorizationRequest) => void) => void

  removeListener: (eventName: string, callback: any) => void
}

export function registerIntraSync() {
  handleEvent('getDeviceIP', getDeviceIP)
  handleEvent('respondToRequest', respondToRequest)
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
