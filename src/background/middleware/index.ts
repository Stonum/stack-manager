import { app, ipcMain, dialog } from 'electron';
import Store from 'electron-store';

import path from 'path';
import fs from 'fs';

import window from '../window';
import { getFiles, copyFiles, readIniFile, writeIniFile } from '../utils';

const settings = new Store({ name: 'settings', cwd: app.getPath('userData') });
const projects = new Store({ name: 'projects', cwd: app.getPath('userData') });

ipcMain.on('main', async (event, payload) => {
  let data = null;

  console.log(payload);

  switch (payload.message) {
    case 'getConfig':
      data = {
        disp: settings.get('disp'),
        stackversion: settings.get('stackversion'),
        nginx: settings.get('nginx'),
        bin: settings.get('bin'),
      };
      break;

    case 'saveConfig':
      if (payload.data) {
        for (const key in payload.data) {
          settings.set(key, payload.data[key].toString() || '');
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
        defaultPath: payload.params.path,
        properties: ['openDirectory'],
      });
      if (data && !data.canceled) {
        data = data.filePaths[0];
      } else {
        data = null;
      }

      break;

    case 'readProjectFolder':
      data = await readProjectFolder(payload.params.path);
      break;

    case 'readIniFile':
      data = await getDataFromIni(payload.params.path);
      break;

    case 'addProject':
      await addProject(payload.data);
      break;

    default:
      console.log('Unknown message - ', payload.message);
  }

  if (data) {
    event.sender.send(payload.message, data);
  }
});

async function readProjectFolder(pathDir: string) {
  if (!pathDir) {
    throw 'Не указан путь';
  }

  const result = {
    front: '',
    ini: [] as any[],
  };

  if (fs.existsSync(path.join(pathDir, 'Stack.Front'))) {
    result.front = path.join(pathDir, 'Stack.Front');
  }

  const pathBin = path.join(pathDir, 'Stack.Srv', 'Bin');
  if (fs.existsSync(pathBin)) {
    const files = await getFiles(pathBin);
    for (const file of files) {
      if (path.basename(file).toLowerCase() == 'stack.ini') {
        result.ini.push(file);
      }
    }
  }

  return result;
}
const verpattern = /.+(\\\d\d\.\d\d.+?(\\|$))/i;

function getDataFromIni(pathFile: string) {
  const result = {} as any;

  const data = readIniFile(pathFile);

  result.server = data['SQL-mode'].Server;
  result.base = data['SQL-mode'].Base;

  if (data.AppPath.DB.length) {
    for (const path of data.AppPath.DB) {
      const res = path.match(verpattern);
      console.log(res);
      if (res) {
        result.version = res[0];
      }
    }
  }

  return result;
}

async function addProject(params: any) {
  console.log(params);
  const bindir = settings.get('bin') as string;
  const pathbin_old = path.dirname(params.inifile);
  const pathbin_new = path.join(bindir, '0_' + params.name);
  const ver = params.version.match(verpattern)[1].replaceAll('//', '');
  const verdir = path.join(settings.get('stackversion') as string, ver);

  if (!fs.existsSync(verdir)) {
    await copyFiles(params.version, verdir);
  }

  if (!fs.existsSync(pathbin_new)) {
    await copyFiles(pathbin_old, pathbin_new);
  }

  const pathini = path.join(pathbin_new, 'stack.ini');
  if (fs.existsSync(pathini)) {
    const data = readIniFile(pathini);
    data['SQL-mode'].Server = params.server;
    data['SQL-mode'].Base = params.base;

    // correct path of resources
    for (const key of Object.keys(data['AppPath'])) {
      for (const idx in data['AppPath'][key]) {
        const respath = data['AppPath'][key][idx];
        if (respath.startsWith('..')) {
          data['AppPath'][key][idx] = path.join(pathbin_old, respath);
        } else if (respath.startsWith(params.version)) {
          data['AppPath'][key][idx] = respath.replace(params.version, verdir);
        }
      }
    }
    const libpath = data['LibPath'].Path || '';
    if (libpath.startsWith('..')) {
      data['LibPath'].Path = path.join(pathbin_old, libpath);
    } else if (libpath.startsWith(params.version)) {
      data['LibPath'].Path = libpath.replace(params.version, verdir);
    }

    const jspath = data['JavaClient'].JCPath || '';
    if (jspath.startsWith('..')) {
      data['JavaClient'].JCPath = path.join(pathbin_old, jspath);
    } else if (jspath.startsWith(params.version)) {
      data['JavaClient'].JCPath = jspath.replace(params.version, verdir);
    }

    const jrepath = data['JavaClient'].JREPath || '';
    if (jrepath.startsWith('..')) {
      data['JavaClient'].JREPath = path.join(pathbin_old, jrepath);
    } else if (jrepath.startsWith(params.version)) {
      data['JavaClient'].JREPath = jrepath.replace(params.version, verdir);
    }

    const jsupath = data['JavaClient'].JRUpdatePath || '';
    if (jsupath.startsWith('..')) {
      data['JavaClient'].JRUpdatePath = path.join(pathbin_old, jsupath);
    } else if (jsupath.startsWith(params.version)) {
      data['JavaClient'].JRUpdatePath = jsupath.replace(params.version, verdir);
    }
    writeIniFile(pathini, data);
  }
}
