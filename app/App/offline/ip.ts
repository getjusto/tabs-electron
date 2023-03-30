import os from 'os'

export function getDeviceIP(): string {
  console.log(`Will get ip`)
  // Get the network interfaces of the device
  const networkInterfaces = os.networkInterfaces()

  // Find the interface with a non-internal IPv4 address
  const interfaceKeys = Object.keys(networkInterfaces)
  for (const interfaceKey of interfaceKeys) {
    const interfaceInfo = networkInterfaces[interfaceKey]
    for (const iface of interfaceInfo) {
      if (!iface.internal && iface.family === 'IPv4') {
        console.log(`Local IP address: ${iface.address}`)
        return iface.address
      }
    }
  }
}
