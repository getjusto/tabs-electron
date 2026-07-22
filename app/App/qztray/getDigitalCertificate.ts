const digitalCertificateUrl = 'https://vite.getjusto.com/qztray/digital-certificate.txt'

export async function getDigitalCertificate(): Promise<string> {
  const response = await fetch(digitalCertificateUrl, {cache: 'no-store'})
  if (!response.ok) {
    throw new Error(`Could not download QZ Tray certificate: ${response.status}`)
  }

  return response.text()
}
