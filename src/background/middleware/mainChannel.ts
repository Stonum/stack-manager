import { ipcMain, dialog } from 'electron';

import Window from '../window';
import { settings } from '../store';
import log from '../log';
import cmd from '../cmd';

ipcMain.on('main', async (event, payload) => {
  log.debug('main', payload);

  switch (payload.message) {
    case 'getSettings':
      if (payload.key) {
        const defValue = payload.key == 'tasks' ? tasks : '';
        event.sender.send(payload.message, settings.get(payload.key) || defValue);
      } else {
        event.sender.send(payload.message, '');
      }

      break;

    case 'setSettings':
      if (payload.key) {
        settings.set(payload.key, payload.data || '');
      }
      break;

    case 'selectDir': {
      const window = new Window();
      const res = await dialog.showOpenDialog(window, {
        defaultPath: payload.path,
        properties: ['openDirectory'],
      });
      if (res && !res.canceled) {
        event.sender.send(payload.message, res.filePaths[0]);
      } else {
        event.sender.send(payload.message, payload.path || '');
      }
      break;
    }

    case 'restartDispatcher': {
      try {
        await cmd.execSudo('net stop DispatcherService');
        const res = await cmd.execSudo('net start DispatcherService');
        event.sender.send(payload.message, res);
      } catch (e: AnyException) {
        log.error(e);
        const window = new Window();
        window.webContents.send('error', e.message || e);
      }
      break;
    }

    default:
      log.warn('Unknown message - ', payload.message);
  }
});

const tasks: Task[] = [
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
