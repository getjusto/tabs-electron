/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configurtagation
 */
module.exports = async function () {
  return {
    productName: 'Crisp',
    appId: 'com.getjusto.crisp',
    afterSign: 'electron-builder-notarize',
    directories: {
      output: 'dist',
      buildResources: 'build'
    },
    publish: {
      provider: 'github',
      publishAutoUpdate: true
    },
    mac: {
      hardenedRuntime: true,
      electronLanguages: ['en'],
      icon: 'build/icon.icns',
      entitlements: './node_modules/electron-builder-notarize/entitlements.mac.inherit.plist',
      publish: ['github'],
      target: [
        {
          target: 'dmg',
          arch: ['arm64', 'x64']
        },
        {
          target: 'zip',
          arch: ['arm64', 'x64']
        }
      ]
    },
    win: {
      publish: ['github'],
      icon: 'build/icon.ico',
      signingHashAlgorithms: ['sha256'],
      sign: './scripts/sign.js',
      artifactName: `Crisp-Setup-v${process.env.npm_package_version}.exe`,
      target: [
        {
          target: 'nsis',
          arch: ['x64', 'ia32']
        }
      ]
    },
    nsis: {
      oneClick: true,
      perMachine: true
    },
    dmg: {
      icon: 'build/icon.icns',
      internetEnabled: true
    }
  }
}
