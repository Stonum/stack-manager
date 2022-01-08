import { BrowserWindow, Menu, Tray } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';

export default class Window extends BrowserWindow {
  static current = null as null | Window;

  constructor() {
    if (!Window.current) {
      // Create the browser window.
      super({
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
          // Use pluginOptions.nodeIntegration, leave this alone
          // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
          nodeIntegration: true,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        },
        icon: path.join(__dirname, '../build/icon.png'),
      });

      Window.current = this;

      if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        this.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      } else {
        createProtocol('app');
        // Load the index.html when not in development
        this.loadURL('app://./index.html');
      }
      if (process.env.NODE_ENV === 'production') {
        const menu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(menu);
      }
    } else {
      return Window.current;
    }
  }
}
