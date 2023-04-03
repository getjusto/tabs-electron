import ElectronStore from 'electron-store'
import Main from '..'
import {restartServer} from './initConnection'
import {getDeviceIP} from './ip'
import {restartWebsocket} from './ws'

const store = new ElectronStore()

function areCertsValid(ip: string) {
  const crt = store.get('intrasync.cert.crt') as string
  const key = store.get('intrasync.cert.key') as string
  const certIp = store.get('intrasync.cert.ip') as string
  const date = store.get('intrasync.cert.createdAt') as string

  if (certIp !== ip) return false

  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
  if (diffDays > 300) return false

  if (!crt || !key) return false

  return true
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

  console.log('are certs valid', areCertsValid(ip))
  if (!areCertsValid(ip)) {
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

export async function setCertificates({crt, key, cacrt, ip}) {
  receivedCertificates = true

  store.set('intrasync.cert.crt', crt)
  store.set('intrasync.cert.key', key)
  store.set('intrasync.ca.crt', cacrt)
  store.set('intrasync.cert.ip', ip)
  store.set('intrasync.cert.createdAt', new Date())

  restartServers({
    crt,
    key,
    cacrt
  })
}
