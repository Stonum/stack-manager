import { app, ipcMain, dialog } from 'electron';
import Store from 'electron-store';

import window from '../window';

Store.initRenderer();

const config = new Store({ cwd: app.getAppPath() });

ipcMain.on('main', async (event, payload) => {
  let data = null;

  switch (payload.message) {
    case 'getConfig':
      data = {
        disp: config.get('disp'),
        stackversion: config.get('stackversion'),
        nginx: config.get('nginx'),
      };
      break;

    case 'saveConfig':
      if (payload.data) {
        for (const key in payload.data) {
          if (key !== 'message') {
            config.set(key, payload.data[key].toString());
          }
        }
      }
      break;

    case 'getProjects': // пока возвращаем моковые данные
      data = [
        {
          name: 'Магнитогорск',
          tasks: [
            { name: 'ЮЛ', status: 0 },
            { name: 'ФЛ', status: 2 },
            { name: 'Админ', status: 1 },
          ],
        },
        {
          name: 'Норильск',
          tasks: [
            { name: 'ЮЛ', status: 0 },
            { name: 'ФЛ', status: 2 },
            { name: 'Коммун', status: 0 },
            { name: 'Админ', status: 0 },
          ],
        },
      ];
      break;

    case 'selectDir':
      data = await dialog.showOpenDialog(window.current, {
        properties: ['openDirectory'],
      });
      if (data && !data.canceled) {
        data = data.filePaths[0];
      } else {
        data = null;
      }

      break;

    default:
      console.log('Unknown message - ', payload.message);
  }

  if (data) {
    event.sender.send(payload.message, data);
  }
});
