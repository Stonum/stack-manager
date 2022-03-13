import { dialog } from 'electron';

import CommonListener from './commonListener';

import Window from '../window';
import { settings } from '../store';
import cmd from '../cmd';

export class MainListener extends CommonListener {
  tasks: Task[] = [
    { title: 'АРМ администратора', prefix: 'admin', id: 11075, selected: true, port: 0 },
    { title: 'Расчеты с абонентами - физическими лицами', prefix: 'fl', id: 252, selected: true, port: 1 },
    { title: 'Расчеты с абонентами - юридическими лицами', prefix: 'ul', id: 11058, selected: true, port: 2 },
    { title: 'АРМ юриста', prefix: 'dlg_fl', id: 278, selected: true, port: 3 },
    { title: 'АРМ юриста (юридические лица)', prefix: 'dlg_ul', id: 284, selected: true, port: 4 },
    { title: 'Коммуникации', prefix: 'commun', id: 281, selected: true, port: 5 },
    { title: 'Касса', prefix: 'kassa', id: 11065, selected: false, port: 6 },
    { title: 'Паспортный стол', prefix: 'passport', id: 169, selected: false, port: 7 },
    { title: 'Аварийно-диспетчерская служба', prefix: 'avar', id: 11061, selected: false, port: 8 },
    { title: 'Подомовой учет', prefix: 'pdu', id: 253, selected: false, port: 9 },
    { title: 'АРМ юриста поставщика', prefix: 'post_ur', id: 5024, selected: false, port: 10 },
    { title: 'Расчеты с поставщиками', prefix: 'rsp', id: 279, selected: false, port: 11 },
  ];

  constructor() {
    super('main');
  }

  getSettings(payload: any) {
    if (payload.key) {
      const defValue = payload.key == 'tasks' ? this.tasks : '';
      return settings.get(payload.key) || defValue;
    }
    return '';
  }

  setSettings(payload: any) {
    if (payload.key) {
      settings.set(payload.key, payload.data || '');
    }
  }

  async selectDir(payload: any) {
    const window = new Window();
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

  async restartDispatcher(payload: any) {
    await cmd.execSudo('net stop DispatcherService');
    const res = await cmd.execSudo('net start DispatcherService');
    return res;
  }
}
