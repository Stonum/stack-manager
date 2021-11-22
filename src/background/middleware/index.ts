import { ipcMain } from 'electron';
import { app } from 'electron';
import Store from 'electron-store';
Store.initRenderer();

const config = new Store({ cwd: app.getAppPath() });

ipcMain.on('main', (event, payload) => {
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
            config.set(key, payload.data[key]);
          }
        }
      }
      break;
  }

  if (data) {
    event.sender.send(payload.message, data);
  }
});
