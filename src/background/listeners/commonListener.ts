import { ipcMain, Notification } from 'electron';
import Window from '../window';

import log from '../log';

export default class CommonListener {
  window = new Window();

  constructor(_name: string) {
    ipcMain.on(_name, async (event, payload) => {
      const methodName = payload.message as string;

      log.debug(_name, payload);

      if (methodName && methodName in this) {
        try {
          //@ts-ignore
          const result = await this[methodName](payload);
          event.sender.send(methodName, result);
        } catch (e: AnyException) {
          log.error(e);
          this.window.webContents.send('error', e.message || e);
          event.sender.send(methodName, e);
        }
      } else {
        log.warn('Unknown method - ', methodName);
      }
    });
  }

  sendInfoMessage(title: string, message: string) {
    new Notification({ title, body: message }).show();
    // this.window.webContents.send('info', { title, message });
  }
}
