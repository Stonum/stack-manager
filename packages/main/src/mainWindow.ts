import { BrowserWindow, app, Menu, Tray, nativeImage } from 'electron';
import windowStateKeeper from 'electron-window-state';
import { join } from 'path';
import { URL } from 'url';
import icon from '../../../buildResources/icon.png';

function closeHndl(event: Event) {
  const window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  event.preventDefault();
  if (window !== undefined) {
    window.hide();
  }

  return false;
}

export function getMainWindow() {
  return BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
}

async function createWindow() {

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1300,
    defaultHeight: 720
  });

  const browserWindow = new BrowserWindow({
    title: `${app.getName()} ${app.getVersion()}`,

    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,

    minWidth: 650,
    minHeight: 450,
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,

      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  mainWindowState.manage(browserWindow);

  if (import.meta.env.PROD) {
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);
  }

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test.
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  await browserWindow.loadURL(pageUrl);

  browserWindow.on('close', closeHndl);

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = getMainWindow();

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}

/**
 * Create tray
 */
export async function createTrayMenu() {
  const appTray = new Tray(nativeImage.createFromDataURL(icon));
  appTray.setToolTip(`${app.getName()} ${app.getVersion()}`);

  appTray.on('click', function () {
    const window = getMainWindow();
    if (window) {
      window.show();
      window.setTitle(`${app.getName()} ${app.getVersion()}`);
    }
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Выход',
      click() {
        const window = getMainWindow();
        if (window) {
          window.removeListener('close', closeHndl);
          window.close();
        }
      },
    },
  ]);
  appTray.setContextMenu(contextMenu);
}
