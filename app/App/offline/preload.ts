import {contextBridge, ipcRenderer} from 'electron'

export const methods = [
  'respondToRequest',
  'getDeviceIP',
  'getAppVersion',
  'checkForUpdates',
  'restartPrintManager',
  'installQZTray',
  'acceptConnection',
  'rejectConnection',
  'getConnectedClientTokens',
  'sendIntraSyncMessage',
  'resetAllConnections',
  'pong',
  'setIsCentral',
  'setCertificates'
]
export const events = [
  'onNewAuthorizationRequest',
  'onNewConnection',
  'onConnectionClosed',
  'onPing',
  'onIntraSyncMessage',
  'onRequestNewCertificates'
]

const exposeObj = {}

for (const methodName of methods) {
  console.log(`Exposing method ${methodName}`)
  exposeObj[methodName] = (...args: any[]) => ipcRenderer.invoke(`intraSync:${methodName}`, ...args)
}

for (const eventName of events) {
  console.log(`Exposing event ${eventName}`)
  exposeObj[eventName] = (callback: any) => ipcRenderer.on(`intraSync:${eventName}`, callback)
}

contextBridge.exposeInMainWorld('intraSyncAPI', exposeObj)
