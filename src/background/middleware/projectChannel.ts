import { ipcMain } from 'electron';
import Window from '../window';

import path from 'path';
import fs from 'fs';

import { projects, settings } from '../store';
import { getFiles, copyFiles, readIniFile, writeIniFile } from '../utils';

import Dispatcher from './dispatcher';

ipcMain.on('project', async (event, payload) => {
  console.log(payload);

  const window = new Window();

  try {
    switch (payload.message) {
      case 'getAll': {
        const webServer = getWebServer();

        const data = (projects.get('projects', []) as Project[]).map((project: Project) => {
          return { name: project.name, apps: project.apps };
        });

        for (const project of data) {
          if (project.apps) {
            for (const app of project.apps) {
              const wsapp = webServer.item(app.name);
              try {
                app.status = await wsapp.getState();
              } catch (e: AnyException) {
                window.webContents.send('error', e.message || e);
              }
            }
          }
        }

        event.sender.send(payload.message, data);
        break;
      }

      case 'get': {
        const id = payload.projectId;

        const data = projects.get('projects', []) as Project[];
        if (data && data[id]) {
          event.sender.send(payload.message, data[id]);
        } else {
          throw new Error(`Не найден проект с указанным id - ${id}`);
        }

        break;
      }

      case 'add': {
        const allProjects = projects.get('projects', []) as Project[];
        const project = await addProject(payload.params);
        allProjects.push(project);
        projects.set('projects', allProjects);
        event.sender.send(payload.message, project);
        break;
      }

      case 'delete': {
        const id = payload.projectId;
        const allProjects = projects.get('projects', []) as Project[];
        let project = null;
        if (allProjects && allProjects[id]) {
          project = allProjects[id];
          allProjects.splice(id, 1);
        }

        if (!project) {
          throw new Error(`Не найден проект с указанным id - ${id}`);
        }

        await deleteProject(project);
        projects.set('projects', allProjects);

        event.sender.send(payload.message, {});
        break;
      }

      case 'rebuild': {
        const id = payload.projectId;
        const project = payload.params as Project;

        const data = projects.get('projects', []) as Project[];
        if (data && data[id]) {
          await deleteProject(data[id]);
          data[id] = await addProject(project);
          projects.set('projects', data);
        } else {
          throw new Error(`Не найден проект с указанным id - ${id}`);
        }
        break;
      }

      case 'readFolder':
        event.sender.send(payload.message, await readProjectFolder(payload.path));
        break;

      case 'readIniFile':
        event.sender.send(payload.message, await getDataFromIni(payload.path));
        break;

      case 'appStart': {
        const webServer = getWebServer();
        const wsapp = webServer.item(payload.params);
        event.sender.send(payload.message, await wsapp.restart());
        break;
      }

      case 'appStop': {
        const webServer = getWebServer();
        const wsapp = webServer.item(payload.params);
        event.sender.send(payload.message, await wsapp.stop());
        break;
      }

      default:
        console.log('Unknown message - ', payload.message);
    }
  } catch (e: AnyException) {
    console.log(e);
    window.webContents.send('error', e.message || e);
  }
});

async function readProjectFolder(pathDir: string) {
  if (!pathDir) {
    throw 'Не указан каталог для чтения';
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
  if (!pathFile) {
    throw 'Не указан файл';
  }

  const result = {} as any;

  const data = readIniFile(pathFile);

  result.server = data['SQL-mode'].Server;
  result.base = data['SQL-mode'].Base;

  if (data.AppPath.DB.length) {
    for (const path of data.AppPath.DB) {
      const res = path.match(verpattern);
      if (res) {
        result.version = res[0];
      }
    }
  }

  return result;
}

async function addProject(payload: Project) {
  console.log(payload);

  const project = {} as Project;
  project.name = payload.name;

  const bindir = settings.get('bin') as string;
  const pathbin_old = path.dirname(payload.path.ini);
  const pathbin_new = path.join(bindir, '0_' + payload.name);
  const mathed = payload.path.version.match(verpattern);
  let verdir = '';
  if (mathed && mathed[1]) {
    const ver = mathed[1].replaceAll('//', '');
    verdir = path.join(settings.get('stackversion') as string, ver);
  }

  project.path = {
    version: verdir,
    bin: pathbin_new,
    git: payload.path.git,
    ini: payload.path.ini,
    front: payload.path.front,
  };

  // копируем каталог версии если его нет
  if (!fs.existsSync(verdir)) {
    await copyFiles(payload.path.version, verdir);
  }

  // копируем exe и прочие файлы в бин каталог
  const pathbin_ver = path.join(verdir, 'Stack.srv', 'Bin', '0');
  // if (!fs.existsSync(pathbin_new)) {
  await copyFiles(pathbin_ver, pathbin_new);
  // }

  // редактируем stack.ini и создаем в целевом каталоге
  const pathini = path.join(pathbin_old, 'stack.ini');
  if (fs.existsSync(pathini)) {
    const data = readIniFile(pathini);
    data['SQL-mode'].Server = payload.sql.server;
    data['SQL-mode'].Base = payload.sql.base;

    // correct path of resources
    for (const key of Object.keys(data['AppPath'])) {
      for (const idx in data['AppPath'][key]) {
        const respath = data['AppPath'][key][idx];
        if (respath.startsWith('..')) {
          data['AppPath'][key][idx] = path.join(pathbin_old, respath);
        } else if (respath.startsWith(payload.path.version)) {
          data['AppPath'][key][idx] = respath.replace(payload.path.version, verdir);
        }
      }
    }
    const libpath = data['LibPath'].Path || '';
    if (libpath.startsWith('..')) {
      data['LibPath'].Path = path.join(pathbin_old, libpath);
    } else if (libpath.startsWith(payload.path.version)) {
      data['LibPath'].Path = libpath.replace(payload.path.version, verdir);
    }

    const jspath = data['JavaClient'].JCPath || '';
    if (jspath.startsWith('..')) {
      data['JavaClient'].JCPath = path.join(pathbin_old, jspath);
    } else if (jspath.startsWith(payload.path.version)) {
      data['JavaClient'].JCPath = jspath.replace(payload.path.version, verdir);
    }

    const jrepath = data['JavaClient'].JREPath || '';
    if (jrepath.startsWith('..')) {
      data['JavaClient'].JREPath = path.join(pathbin_old, jrepath);
    } else if (jrepath.startsWith(payload.path.version)) {
      data['JavaClient'].JREPath = jrepath.replace(payload.path.version, verdir);
    }

    const jsupath = data['JavaClient'].JRUpdatePath || '';
    if (jsupath.startsWith('..')) {
      data['JavaClient'].JRUpdatePath = path.join(pathbin_old, jsupath);
    } else if (jsupath.startsWith(payload.path.version)) {
      data['JavaClient'].JRUpdatePath = jsupath.replace(payload.path.version, verdir);
    }
    writeIniFile(path.join(pathbin_new, 'stack.ini'), data);
  }

  project.sql = {
    server: payload.sql.server,
    base: payload.sql.base,
    login: payload.sql.login,
    password: payload.sql.password,
  };

  project.apps = [];

  const webServer = getWebServer();

  for (const app of payload.apps) {
    await webServer.add(app.name);
    const _app = webServer.item(app.name);
    await _app.setParams({
      UrlPathPrefix: app.path,
      StackProgramDir: project.path.bin,
      StackProgramParameters: `-u:${project.sql.login} -p:${project.sql.password} -t:${app.id} -LOADRES -nc`,
      IsActive: 1,
      FunctionName: 'StackAPI_kvplata_v1',
      ResultContentType: 'application/json;charset=utf-8',
      UseComStack: 1,
      ShareStaticContent: 0,
      UploadStaticContent: 0,
      FallbackEnabled: 0,
      AllowServiceCommands: 0,
    });
    await _app.restart();
    project.apps.push({ id: app.id, port: app.port, name: app.name, path: app.path });
  }

  return project;
}

async function deleteProject(project: Project) {
  // удаляем веб серверы
  const webServer = getWebServer();
  for (const app of project.apps) {
    try {
      const _app = webServer.item(app.name);
      await _app.stop();
      await _app.delete();
    } catch (e: AnyException) {
      console.log(e);
    }
  }

  // удаляем созоданный каталог в бин
  if (fs.existsSync(project.path.bin)) {
    fs.rmSync(project.path.bin, { recursive: true, force: true });
  }

  return {};
}

function getWebServer() {
  const address = settings.get('dispatcher_url') as string;
  const secret = settings.get('dispatcher_password') as string;
  const setupDispatcher = new Dispatcher(address, secret);
  const webServer = setupDispatcher.webServer;
  return webServer;
}
