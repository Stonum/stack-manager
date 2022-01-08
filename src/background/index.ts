import { app, protocol, BrowserWindow, Tray, Menu } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';

import Window from './window';
import './middleware/index';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    new Window();
  }
});

let appTray = null;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e: AnyException) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  const window = new Window();

  appTray = new Tray(path.join(__dirname, '../build/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Выход',
      click() {
        window.close();
      },
    },
  ]);
  appTray.setToolTip('Electron.js App');
  appTray.setContextMenu(contextMenu);

  appTray.on('double-click', function (event: any) {
    window.show();
  });

  window.on('minimize', function (event: any) {
    event.preventDefault();
    window.hide();

    return false;
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
