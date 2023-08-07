// NO se usa, se hace desde la web
import {digitalCertificate} from './digital-certificate'
import {privateKey} from './keys/private-key'
import crypto from 'crypto'

export async function getQZDigitalCertificate() {
  return digitalCertificate
}

// sign the string with the private key using sha512
export async function getQZSignature(toSign: string): Promise<string> {
  const sign = crypto.createSign('sha512')
  sign.update(toSign)
  sign.end()
  const signature = sign.sign(privateKey, 'base64')
  return signature
}
