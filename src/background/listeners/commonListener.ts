import { ipcMain } from 'electron';
import Window from '../window';

import log from '../log';

export default class CommonListener {
  constructor(_name: string) {
    const window = new Window();

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
          window.webContents.send('error', e.message || e);
        }
      } else {
        log.warn('Unknown method - ', methodName);
      }
    });
  }
}
