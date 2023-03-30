import {host} from '../../env'

export function validateSender(frame: Electron.WebFrameMain) {
  // Value the host of the URL using an actual URL parser and an allowlist
  if (new URL(frame.url).host === host) return true
  return false
}
