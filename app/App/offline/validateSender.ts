import {host} from '../../env'

export function validateSender(frame: Electron.WebFrameMain | null | undefined) {
  if (!frame?.url) return false
  try {
    // Value the host of the URL using an actual URL parser and an allowlist
    if (new URL(frame.url).host === host) return true
    return false
  } catch {
    return false
  }
}
