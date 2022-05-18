import { app, protocol, BrowserWindow, Tray, Menu } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';

import Window from './window';
import { MainListener, ProjectListener } from './listeners';
import upgradeBeforeStart from './upgrade';

const isDevelopment = process.env.NODE_ENV !== 'production';

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.setAppUserModelId(app.getName());

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
  await upgradeBeforeStart();
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e: AnyException) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  const window = new Window();

  app.on('second-instance', () => {
    if (window) {
      // Focus on the main window if the user tried to open another
      if (window.isMinimized()) {
        window.restore();
      }
      if (!window.isVisible()) {
        window.show();
      }

      window.focus();
    }
  });

  // регистрируем слушателей для общения фронта с бэком
  new MainListener();
  new ProjectListener();

  appTray = new Tray(path.join(__dirname, '../build/icon.png'));
  appTray.setToolTip(`${app.getName()} ${app.getVersion()}`);

  appTray.on('click', function (event: any) {
    window.show();
    window.setTitle(`${app.getName()} ${app.getVersion()}`);
  });

  const closeHndl = function (event: any) {
    event.preventDefault();
    window.hide();

    return false;
  };

  window.on('close', closeHndl);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Выход',
      click() {
        window.removeListener('close', closeHndl);
        window.close();
      },
    },
  ]);
  appTray.setContextMenu(contextMenu);
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
