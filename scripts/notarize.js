import {notarize} from '@electron/notarize'

exports.default = async function notarizing(context) {
  const {electronPlatformName, appOutDir} = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  // Package your app here, and code sign with hardened runtime
  await notarize({
    appBundleId: 'com.getjusto.crisp',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  })
}
