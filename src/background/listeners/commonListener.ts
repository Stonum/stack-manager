import { ipcMain, Notification } from 'electron';
import Window from '../window';

import log from '../log';

export default class CommonListener {
  window = new Window();

  constructor(_name: string) {
    ipcMain.handle(_name, async (event, payload) => {
      const methodName = payload.message as string;

      log.debug(_name, payload);

      if (methodName && methodName in this) {
        try {
          //@ts-ignore
          return await this[methodName](payload);
        } catch (e: AnyException) {
          log.error(e);
          this.window.webContents.send('error', e.message || e);
          throw e;
        }
      } else {
        log.warn('Unknown method - ', methodName);
      }
      return null;
    });
  }

  sendInfoMessage(title: string, message: string) {
    new Notification({ title, body: message }).show();
    // this.window.webContents.send('info', { title, message });
  }
}
