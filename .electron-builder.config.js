/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    '!node_modules/@babel',
    '!node_modules/@mdi',
    '!node_modules/@vue',
    '!node_modules/@vueuse',
    '!node_modules/roboto-fontface',
    '!node_modules/rxjs',
    '!node_modules/vue',
    '!node_modules/vue-router',
    '!node_modules/vuedraggable',
    '!node_modules/vuetify',
    'packages/**/dist/**',
  ],
  nsis: {
    allowElevation: false,
    allowToChangeInstallationDirectory: true,
    oneClick: false,
    perMachine: true,
  },
  extraResources: [
    {
      from: './buildResources/icon.png',
      to: 'icon.png',
    },
    './CHANGELOG.md',
  ],
  publish: [{ provider: 'generic', url: 'http://arshinova:8090/manager_auto_update' }],
};

module.exports = config;
