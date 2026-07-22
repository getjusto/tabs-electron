import crypto from 'node:crypto'
import {getDigitalCertificate} from './getDigitalCertificate'
import {privateKey} from './keys/private-key'

// NO se usa, se hace desde la web
export async function getQZDigitalCertificate() {
  return getDigitalCertificate()
}

// sign the string with the private key using sha512
export async function getQZSignature(toSign: string): Promise<string> {
  const sign = crypto.createSign('sha512')
  sign.update(toSign)
  sign.end()
  const signature = sign.sign(privateKey, 'base64')
  return signature
}
