/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configurtagation
 */

module.exports = async () => ({
	productName: "Justo Hub",
	appId: "com.getjusto.Justo Hub",
	// afterSign: './scripts/notarize.js',
	directories: {
		output: "dist",
		buildResources: "build",
	},
	publish: {
		provider: "github",
		publishAutoUpdate: true,
	},
	mac: {
		hardenedRuntime: true,
		electronLanguages: ["en"],
		icon: "build/icon.icns",
		entitlements:
			"./node_modules/electron-builder-notarize/entitlements.mac.inherit.plist",
		publish: ["github"],
		target: [
			{
				target: "dmg",
				arch: ["arm64", "x64"],
			},
			{
				target: "zip",
				arch: ["arm64", "x64"],
			},
		],
		notarize: {
			teamId: process.env.APPLE_TEAM_ID,
		},
	},
	win: {
		publish: ["github"],
		icon: "build/icon.ico",
		signingHashAlgorithms: ["sha256"],
		sign: "./scripts/sign.js",
		artifactName: `Justo-Hub-Setup-v${process.env.npm_package_version}.exe`,
		target: [
			{
				target: "nsis",
				arch: ["x64", "ia32"],
			},
		],
	},
	nsis: {
		oneClick: true,
		perMachine: true,
	},
	dmg: {
		icon: "build/icon.icns",
		internetEnabled: true,
	},
});
