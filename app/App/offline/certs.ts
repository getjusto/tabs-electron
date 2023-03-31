import ElectronStore from 'electron-store'
import Main from '..'
import {restartServer} from './initConnection'
import {getDeviceIP} from './ip'
import {restartWebsocket} from './ws'

const store = new ElectronStore()

function areCertsValid({crt, key, cacrt, ip}) {
  return crt && key
}

function restartServers({crt, key, cacrt}) {
  restartWebsocket({crt, key, cacrt})
  restartServer({
    crt,
    key,
    cacrt
  })
}

export async function checkCertsAndStartServer() {
  const ip = getDeviceIP()

  const crt = store.get('intrasync.cert.crt') as string
  const cacrt = store.get('intrasync.ca.crt') as string
  const key = store.get('intrasync.cert.key') as string

  if (!areCertsValid({crt, key, cacrt, ip})) {
    requestNewCertificates(ip)
  } else {
    restartServers({crt, key, cacrt})
  }
}

let receivedCertificates = false

export async function requestNewCertificates(ip: string) {
  receivedCertificates = false
  Main.mainWindow.webContents.send(`intraSync:onRequestNewCertificates`, ip)

  setTimeout(() => {
    if (!receivedCertificates) {
      requestNewCertificates(ip)
    }
  }, 10000)
}

export async function setCertificates({crt, key, cacrt}) {
  receivedCertificates = true

  store.set('intrasync.cert.crt', crt)
  store.set('intrasync.cert.key', key)
  store.set('intrasync.ca.crt', cacrt)

  restartServers({
    crt,
    key,
    cacrt
  })
}
