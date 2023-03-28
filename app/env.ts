import path from 'path'

type JustoEnv = 'local' | 'develop' | 'prod'
export const env = (process.env.JUSTO_ENV || 'prod') as JustoEnv

export const host = {
  local: 'crisp.internal:5140',
  develop: 'crisp.bejusto.com',
  prod: 'crisp.getjusto.com'
}[env]

export const baseURL = {
  local: 'http://crisp.internal:5140',
  develop: 'https://crisp.bejusto.com',
  prod: 'https://crisp.getjusto.com'
}[env]

const macConfig: Electron.BrowserWindowConstructorOptions = {
  width: 1100,
  height: 750,
  titleBarStyle: 'hidden',
  trafficLightPosition: {x: 10, y: 10}
}
const windowsConfig: Electron.BrowserWindowConstructorOptions = {
  autoHideMenuBar: true
}

export const isMac = process.platform === 'darwin'
const platformConfig = isMac ? macConfig : windowsConfig

export const browserWindowConfig: Electron.BrowserWindowConstructorOptions = {
  show: false,
  center: true,
  ...platformConfig,
  webPreferences: {
    preload: path.join(__dirname, './App/offline/preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    devTools: true,
    autoplayPolicy: 'no-user-gesture-required',
    allowRunningInsecureContent: true
  }
}
