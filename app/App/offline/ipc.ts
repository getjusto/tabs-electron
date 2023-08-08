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
import {setCertificates} from './certs'
import {restartPrintManager} from '../print/restartPrintManager'
import {checkForUpdates, getAppVersion} from '../lifecycle'
import {installQZTray} from '../qztray/install'
import {getQZDigitalCertificate, getQZSignature} from '../qztray/ipc'
import {openQZTray} from '../qztray/open'

export interface IntraSyncAPI {
  getDeviceIP: () => Promise<string>
  getAppVersion: () => Promise<string>
  checkForUpdates: () => Promise<any>
  restartPrintManager: () => Promise<{success: boolean; message: string}>
  respondToRequest: (token: string, status: 'accepted' | 'rejected') => void
  onNewAuthorizationRequest: (callback: (request: AuthorizationRequest) => void) => void

  // QZ
  installQZTray: () => Promise<{success: boolean; message: string}>
  getQZDigitalCertificate: () => Promise<string>
  getQZSignature: (toSign: string) => Promise<string>
  openQZTray: () => Promise<{success: boolean; message: string}>

  // Intrasync
  acceptConnection: (token: string) => void
  rejectConnection: (token: string) => void
  getConnectedClientTokens: () => Promise<string[]>
  pong: (token: string) => void
  sendIntraSyncMessage: (token: string, data: any) => void
  resetAllConnections: () => void // when app starts, all connections are reset
  setIsCentral: (isCentral: boolean) => void // when app starts, all connections are reset
  setCertificates: (certificates: {key: string; crt: string; cacrt: string; ip: string}) => void

  onPing: (callback: (token: string) => void) => void
  onNewConnection: (callback: (token: string) => void) => void
  onConnectionClosed: (callback: (token: string) => void) => void
  onIntraSyncMessage: (callback: (params: {token: string; data: any}) => void) => void
  onRequestNewCertificates: (callback: (ip: string) => void) => void
}

export function registerIntraSync() {
  handleEvent('getDeviceIP', getDeviceIP)
  handleEvent('getAppVersion', getAppVersion)
  handleEvent('checkForUpdates', checkForUpdates)
  handleEvent('restartPrintManager', restartPrintManager)
  handleEvent('installQZTray', installQZTray)
  handleEvent('getQZDigitalCertificate', getQZDigitalCertificate)
  handleEvent('getQZSignature', getQZSignature)
  handleEvent('openQZTray', openQZTray)
  handleEvent('respondToRequest', respondToRequest)
  handleEvent('acceptConnection', acceptConnection)
  handleEvent('rejectConnection', rejectConnection)
  handleEvent('getConnectedClientTokens', getConnectedClientTokens)
  handleEvent('sendIntraSyncMessage', sendIntraSyncMessage)
  handleEvent('resetAllConnections', resetAllConnections)
  handleEvent('pong', pong)
  handleEvent('setIsCentral', setIsCentral)
  handleEvent('setCertificates', setCertificates)
}

function handleEvent(eventName: string, handler: (...args: any[]) => any) {
  ipcMain.handle(`intraSync:${eventName}`, async (event, ...args) => {
    console.log(`Received ${eventName} event`, ...args)
    if (!validateSender(event.senderFrame)) return null
    const result = await handler(...args)
    return result
  })
}
