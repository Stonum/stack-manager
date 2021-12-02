import { ipcMain, dialog } from 'electron';

import path from 'path';
import fs from 'fs';

import { projects, settings } from '../store';
import { getFiles, copyFiles, readIniFile, writeIniFile } from '../utils';

ipcMain.on('project', async (event, payload) => {
  console.log(payload);

  switch (payload.message) {
    case 'getAll': {
      const data = (projects.get('projects', []) as any).map((project: any) => {
        return { name: project.name, tasks: [] };
      });

      event.sender.send(payload.message, data);
      break;
    }

    case 'get': {
      break;
    }

    case 'add':
      event.sender.send(payload.message, await addProject(payload.params));
      break;

    case 'readFolder':
      event.sender.send(payload.message, await readProjectFolder(payload.path));
      break;

    case 'readIniFile':
      event.sender.send(payload.message, await getDataFromIni(payload.path));
      break;

    default:
      console.log('Unknown message - ', payload.message);
  }
});

async function readProjectFolder(pathDir: string) {
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

  const project = {} as any;
  project.name = params.name;

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

  const allProjects = projects.get('projects', []) as any;
  allProjects.push(project);
  projects.set('projects', allProjects);

  return {};
}
