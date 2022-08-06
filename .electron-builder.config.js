/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: ['packages/**/dist/**'],
  nsis: {
    allowElevation: false,
    allowToChangeInstallationDirectory: true,
    oneClick: false,
    perMachine: true,
  },
  extraResources: [
    {
      from: './buildResources/icon.png',
      to: 'icon.png'
    },
    './CHANGELOG.md',
  ],
};

module.exports = config;
