import { ipcMain } from 'electron';
import { getMainWindow } from '../mainWindow';

import log from '../log';

export default class CommonListener {

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
          const window = getMainWindow();
          window?.webContents.send('error', e.message || e);
          throw e;
        }
      } else {
        log.warn('Unknown method - ', methodName);
      }
      return null;
    });
  }

  sendInfoMessage(title: string, message: string) {
    const window = getMainWindow();
    window?.webContents.send('info', { title, message });
  }

  sendErrorMessage(message: string) {
    const window = getMainWindow();
    window?.webContents.send('error', message);
  }
}
