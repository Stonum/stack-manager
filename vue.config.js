module.exports = {
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/background/index.ts',
      // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
      rendererProcessFile: 'src/main.ts',
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: ['src/background'],

      externals: ['sudo-prompt'],

      builderOptions: {
        extraResources: ['./build/**', './CHANGELOG.md'],
        nsis: {
          allowElevation: false,
          allowToChangeInstallationDirectory: true,
          oneClick: false,
          perMachine: true,
        },
        publish: [{ provider: 'generic', url: process.env.UPDATE_URL }],
      },
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
};
