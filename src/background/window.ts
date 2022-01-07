import { BrowserWindow, Menu } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';

// let current = undefined as any;

// async function create() {
//   // Create the browser window.
//   current = new BrowserWindow({
//     width: 1280,
//     height: 720,
//     webPreferences: {
//       // Use pluginOptions.nodeIntegration, leave this alone
//       // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
//       nodeIntegration: true,
//       contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
//     },
//     icon: path.join(__dirname, '../publick/img/icons/favicon16x16.png'),
//   });

//   if (process.env.WEBPACK_DEV_SERVER_URL) {
//     // Load the url of the dev server if in development mode
//     await current.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
//   } else {
//     createProtocol('app');
//     // Load the index.html when not in development
//     current.loadURL('app://./index.html');
//   }
//   if (process.env.NODE_ENV === 'production') {
//     const menu = Menu.buildFromTemplate([]);
//     Menu.setApplicationMenu(menu);
//   }
// }

// function get() {
//   return current;
// }

export default class Window extends BrowserWindow {
  static current = null as null | Window;

  constructor() {
    if (!Window.current) {
      // Create the browser window.
      super({
        width: 1280,
        height: 720,
        webPreferences: {
          // Use pluginOptions.nodeIntegration, leave this alone
          // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
          nodeIntegration: true,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        },
        icon: path.join(__dirname, '../publick/img/icons/favicon16x16.png'),
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

// export default {
//   create,
//   get,
// };
