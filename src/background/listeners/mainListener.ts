import { dialog, app, shell } from 'electron';
import path from 'path';

import CommonListener from './commonListener';

import Window from '../window';
import { settings } from '../store';
import cmd from '../cmd';
import { readMarkdownFile } from '../utils';
import Dispatcher from '../middleware/dispatcher';

export class MainListener extends CommonListener {
  window = new Window();

  constructor() {
    super('main');
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

  getVersion() {
    return app.getVersion();
  }

  getVisibleWindow() {
    return this.window.isVisible();
  }

  async selectDir(payload: any) {
    const res = await dialog.showOpenDialog(this.window, {
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
    const res = await dialog.showOpenDialog(this.window, {
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

  async restartDispatcher(payload: any) {
    // попытка остановить
    try {
      this.sendInfoMessage('DispatcherService', 'Остановка службы');
      await cmd.execSudo('net stop DispatcherService');
    } catch (e: AnyException) {
      console.log(e);
    }
    this.sendInfoMessage('DispatcherService', 'Запуск службы');
    await cmd.execSudo('net start DispatcherService');
    this.sendInfoMessage('DispatcherService', 'Служба запущена');
    return true;
  }

  async getChangeLog() {
    const result = readMarkdownFile(path.join(__dirname, '../CHANGELOG.md'));
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
}
