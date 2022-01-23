import { ipcMain } from 'electron';
import Window from '../window';

import path from 'path';
import fs from 'fs';

import { projects, settings } from '../store';
import { getFiles, copyFiles, readIniFile, writeIniFile, parseArgs } from '../utils';
import log from '../log';

import Dispatcher from './dispatcher';

ipcMain.on('project', async (event, payload) => {
  log.debug('project', payload);

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
              const wsapp = await webServer.getItem(app.name);
              try {
                app.status = +wsapp.State;
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
        const res = await webServer.restartItem(payload.params);
        event.sender.send(payload.message, res);
        break;
      }

      case 'appStop': {
        const webServer = getWebServer();
        const res = await webServer.stopItem(payload.params);
        event.sender.send(payload.message, res);
        break;
      }

      case 'fillProjects': {
        await fillProjects();
        event.sender.send(payload.message, true);
        break;
      }

      default:
        log.warn('Unknown message - ', payload.message);
    }
  } catch (e: AnyException) {
    log.error(e);
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
  result.version = '';

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
  log.debug(payload);

  const project = {} as Project;
  project.name = payload.name;

  const bindir = settings.get('bin') as string;
  const pathbin_old = path.dirname(payload.path.ini);
  const pathbin_new = path.join(bindir, payload.name);
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
    ini: path.join(pathbin_new, 'stack.ini'),
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
    await webServer.addItem(app.name, {
      UrlPathPrefix: app.path,
      StackProgramDir: project.path.bin,
      StackProgramParameters: `-u:${project.sql.login} -p:${project.sql.password} -t:${app.id} -LOADRES --inspect=${app.port || '0000'} -nc`,
      IsActive: 1,
      FunctionName: 'StackAPI_kvplata_v1',
      ResultContentType: 'application/json;charset=utf-8',
      UseComStack: 1,
      ShareStaticContent: 0,
      UploadStaticContent: 0,
      FallbackEnabled: 0,
      AllowServiceCommands: 0,
    });
    await webServer.restartItem(app.name);
    project.apps.push({ id: app.id, port: app.port, name: app.name, path: app.path });
  }

  return project;
}

async function deleteProject(project: Project) {
  // удаляем веб серверы
  const webServer = getWebServer();
  for (const app of project.apps) {
    try {
      const _app = webServer.deleteItem(app.name);
    } catch (e: AnyException) {
      log.error(e);
    }
  }

  // удаляем созоданный каталог в бин
  if (fs.existsSync(project.path.bin)) {
    fs.rmSync(project.path.bin, { recursive: true, force: true });
  }

  return {};
}

async function fillProjects() {
  const ws = getWebServer();
  const items = await ws.getItems();
  if (items.length === 0) {
    throw new Error('Не найдено элементов веб сервера');
  }
  const dispdir = settings.get('dispatcher_folder') as string;

  const allProjects = projects.get('projects', []) as Project[];

  for (const item of items) {
    if (item.FunctionName === 'StackAPI_kvplata_v1' && item.StackProgramDir) {
      const programDir = item.StackProgramDir;
      const bin = path.resolve(dispdir, programDir);
      const pathini = path.join(bin, 'stack.ini');

      if (fs.existsSync(bin) && fs.existsSync(pathini)) {
        const project = {} as Project;

        project.name = path.basename(programDir);
        if (project.name.startsWith('0_')) {
          project.name = project.name.substring(2);
        }

        const app = {
          name: item.Name,
          path: item.UrlPathPrefix,
          id: 0,
          port: 0,
        };

        const data = getDataFromIni(pathini);
        const args = parseArgs(item.StackProgramParameters);

        project.sql = {
          server: data.server,
          base: data.base,
          login: args.u.trim(),
          password: args.p.trim(),
        };

        app.id = +args.t;
        app.port = +args.inspect;

        const dataIni = readIniFile(pathini);
        let gitpath = '';
        // тут ищем клиенсткий каталог, если нашли пробуем его зарезолвить
        // находим stack.srv
        if (dataIni?.AppPath?.DB?.length) {
          for (const cpath of dataIni.AppPath.DB) {
            if (cpath.toLowerCase().indexOf('client') >= 0) {
              gitpath = path.resolve(bin, cpath);
              const srv_index = gitpath.toLowerCase().indexOf('stack.srv');
              if (srv_index > 0) {
                gitpath = gitpath.substring(0, srv_index);
              }
            }
          }
        }

        const pathfront = fs.existsSync(path.join(gitpath, 'Stack.Front')) ? path.join(gitpath, 'Stack.Front') : '';

        project.path = {
          version: data.version,
          bin,
          git: gitpath,
          ini: pathini,
          front: pathfront,
        };

        const finded = allProjects.find((item: Project) => {
          return item.name.toLowerCase() === project.name.toLowerCase() && item.path.ini.toLowerCase() === project.path.ini.toLowerCase();
        });
        if (finded) {
          if (!finded.apps) {
            finded.apps = [];
          }
          const appindex = finded.apps.findIndex((item: App) => {
            return item.name.toLowerCase() === app.name.toLowerCase();
          });
          if (appindex === -1) {
            finded.apps.push(app);
          }
        } else {
          project.apps = [];
          project.apps.push(app);
          allProjects.push(project);
        }
      }
    }
  }

  projects.set('projects', allProjects);
}

function getWebServer() {
  const address = settings.get('dispatcher_url') as string;
  const secret = settings.get('dispatcher_password') as string;

  if (!address) {
    throw new Error('Не указан адрес диспетчера');
  }
  if (!secret) {
    throw new Error('Не указан пароль для диспетчера');
  }

  const setupDispatcher = new Dispatcher(address, secret);
  const webServer = setupDispatcher.webServer();
  return webServer;
}
