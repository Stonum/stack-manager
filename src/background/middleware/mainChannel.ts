import { ipcMain, dialog } from 'electron';

import path from 'path';
import fs from 'fs';

import window from '../window';
import { settings, projects } from '../store';
import { getFiles, copyFiles, readIniFile, writeIniFile } from '../utils';

ipcMain.on('main', async (event, payload) => {
  console.log(payload);

  switch (payload.message) {
    case 'getSettings':
      if (payload.key) {
        event.sender.send(payload.message, settings.get(payload.key) || '');
      } else {
        event.sender.send(payload.message, '');
      }

      break;

    case 'setSettings':
      if (payload.key && payload.data) {
        settings.set(payload.key, payload.data.toString() || '');
      }
      break;

    case 'selectDir': {
      const res = await dialog.showOpenDialog(window.current, {
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

    default:
      console.log('Unknown message - ', payload.message);
  }
});
