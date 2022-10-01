import { dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';

import CommonListener from './commonListener';

import { getMainWindow } from '../mainWindow';

import { settings } from '../store';
import cmd from '../cmd';
import { readMarkdownFile } from '../utils';

export default class MainListener extends CommonListener {
  update_url = process.env.UPDATE_URL;

  constructor() {
    super('main');

    autoUpdater.autoDownload = false;
    if (this.update_url) {
      autoUpdater.setFeedURL({
        provider: 'generic',
        url: this.update_url,
      });
    }
  }

  getSettings(payload: any) {
    if (payload.key) {
      return settings.get(payload.key);
    }
    return '';
  }

  setSettings(payload: any) {
    if (payload.key) {
      // иногда перетирает список задач пустым массивом
      if (payload.key === 'tasks' && !payload.data?.length) {
        return '';
      }
      settings.set(payload.key, payload.data || '');
    }
    return '';
  }

  getVisibleWindow() {
    const window = getMainWindow();
    return window?.isVisible() && !window?.isMinimized();
  }

  async selectDir(payload: any) {
    const window = getMainWindow();
    if (!window) {
      return;
    }
    const res = await dialog.showOpenDialog(window, {
      defaultPath: payload.path,
      properties: ['openDirectory'],
    });
    if (res && !res.canceled) {
      return res.filePaths[0];
    } else {
      return payload.path || '';
    }
  }

  async selectFile(payload: any) {
    const window = getMainWindow();
    if (!window) {
      return;
    }
    const res = await dialog.showOpenDialog(window, {
      defaultPath: payload.path,
      filters: [payload.filter],
      properties: ['openFile'],
    });
    if (res && !res.canceled) {
      return res.filePaths[0];
    } else {
      return payload.path || '';
    }
  }

  async restartDispatcher() {
    // попытка остановить
    try {
      this.sendInfoMessage('DispatcherService', 'Остановка службы');
      await cmd.execSudo('net stop DispatcherService');
    } catch (e: AnyException) {
      //console.log(e);
    }
    this.sendInfoMessage('DispatcherService', 'Запуск службы');
    await cmd.execSudo('net start DispatcherService');
    this.sendInfoMessage('DispatcherService', 'Служба запущена');
    return true;
  }

  async getChangeLog() {
    const result = readMarkdownFile(path.join(__dirname, '../../../CHANGELOG.md'));
    return result;
  }

  openURL(payload: any) {
    if (payload.url) {
      shell.openExternal(payload.url);
    }
  }

  openPath(payload: any) {
    if (payload.path) {
      shell.openPath(payload.path);
    }
  }

  async checkForUpdates() {
    return new Promise((resolve, reject) => {
      autoUpdater.once('error', (error: AnyException) => {
        reject(new Error(`Updater error: ${error.message}`));
      });

      autoUpdater.once('update-available', () => {
        this.sendInfoMessage('Updater', 'update is available');
        autoUpdater.removeAllListeners();
        resolve(true);
      });

      autoUpdater.once('update-not-available', () => {
        // this.sendInfoMessage('Updater', 'update is not available');
        autoUpdater.removeAllListeners();
        resolve(false);
      });
      autoUpdater.checkForUpdates();
    });
  }

  downloadAndInstallUpdate() {
    return new Promise((resolve, reject) => {
      autoUpdater.once('error', (error: AnyException) => {
        reject(new Error(`Updater error: ${error.message}`));
      });

      autoUpdater.once('update-downloaded', () => {
        autoUpdater.removeAllListeners();
        autoUpdater.quitAndInstall();
        resolve(true);
      });

      autoUpdater.downloadUpdate();
    });
  }
}
