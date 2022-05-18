import { BrowserWindow, Menu, app } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';

export default class Window extends BrowserWindow {
  static current = null as null | Window;

  constructor() {
    if (!Window.current) {
      createProtocol('app');
      const icon = path.join(__dirname, '../build/icon.png');

      // Create the browser window.
      super({
        title: `${app.getName()} ${app.getVersion()}`,
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        },
        icon,
        show: false,
      });

      Window.current = this;

      this.webContents.once('dom-ready', () => {
        this.show();
      });

      if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        this.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      } else {
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
