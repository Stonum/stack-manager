import CommonListener from './commonListener';

import { app, shell } from 'electron';
import path from 'path';
import fs from 'fs';

import { projects, settings } from '../store';
import { getFiles, copyFiles, readIniFile, writeIniFile, parseArgs } from '../utils';

import Dispatcher from '../middleware/dispatcher';
import StaticServer from '../middleware/express';
import cmd from '../cmd';

export class ProjectListener extends CommonListener {
  private servers = [] as StaticServer[];

  constructor() {
    super('project');

    // стартанем статику при старте слушателя
    this.restartServers();
  }

  getAll() {
    const data = (projects.get('projects', []) as Project[]).map((project: Project) => {
      return { name: project.name, apps: project.apps, port: project.port };
    });

    return data;
  }

  async getAppStatus() {
    const webServer = getWebServer();
    const apps = await webServer.getItems();
    return apps.map((app: any) => {
      return { name: app.Name, status: +app.State };
    });
  }

  get(payload: any) {
    const id = payload.projectId;

    const data = projects.get('projects', []) as Project[];
    if (data && data[id]) {
      return data[id];
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }
  }

  async add(payload: any) {
    const allProjects = projects.get('projects', []) as Project[];
    const project = await addProject(payload.params);
    allProjects.push(project);
    projects.set('projects', allProjects);
    await buildProject(project);
    return project;
  }

  async delete(payload: any) {
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

    return {};
  }
  save(payload: any) {
    const id = payload.projectId;
    const project = payload.params as Project;

    const data = projects.get('projects', []) as Project[];
    if (data && data[id]) {
      data[id] = project;
      projects.set('projects', data);
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }

    this.restartServers();
    return {};
  }

  async rebuild(payload: any) {
    const id = payload.projectId;
    const project = payload.params as Project;

    const data = projects.get('projects', []) as Project[];
    if (data && data[id]) {
      await buildProject(project, data[id].apps);
      data[id] = project;
      projects.set('projects', data);
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }

    this.restartServers();
    return {};
  }

  moveProject(payload: any) {
    const id = payload.oldIndex;
    const newId = payload.newIndex;
    const allProjects = projects.get('projects', []) as Project[];
    if (allProjects[id]) {
      const project = allProjects[id];
      allProjects.splice(id, 1); // удаляем
      allProjects.splice(newId, 0, project); // добавляем в позицию нового ( если новый больше старого - то +1, иначе как есть)
      projects.set('projects', allProjects);
      return true;
    } else {
      return false;
    }
  }

  async readFolder(payload: any) {
    return await readProjectFolder(payload.path);
  }

  async readIniFile(payload: any) {
    return await getDataFromIni(payload.path);
  }

  async appStart(payload: any) {
    const webServer = getWebServer();
    const res = await webServer.startItem(payload.params);
    return res;
  }
  async appReStart(payload: any) {
    const webServer = getWebServer();
    const res = await webServer.restartItem(payload.params);
    return res;
  }
  async appStop(payload: any) {
    const webServer = getWebServer();
    const res = await webServer.stopItem(payload.params);
    return res;
  }

  async buildFront(payload: any) {
    const id = payload.projectId;
    const allProjects = projects.get('projects', []) as Project[];
    if (allProjects[id]) {
      const project = allProjects[id];
      if (!project.path.front) {
        throw new Error(`Не задан каталог Stack.Front`);
      }
      if (!fs.existsSync(project.path.front)) {
        throw new Error(`Не найден указанный каталог Stack.Front`);
      }
      await cmd.exec('npm ci', project.path.front);
      await cmd.exec('npm run build', project.path.front);
      if (fs.existsSync(path.join(project.path.front, 'dist'))) {
        copyFiles(path.join(project.path.front, 'dist'), path.join(app.getPath('userData'), 'domains', project.name));
        generateEnvJson(project, path.join(app.getPath('userData'), 'domains', project.name));
      } else {
        throw new Error(`Не найден dist каталог`);
      }
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }
    this.restartServers();
    return true;
  }

  async restartServers() {
    for (const server of this.servers) {
      server.close();
    }
    this.servers = [];

    const allProjects = projects.get('projects', []) as Project[];
    for (const project of allProjects) {
      if (project.port) {
        try {
          const server = new StaticServer(project.name, project.port);
          if (server.started) {
            this.servers.push(server);
          }
        } catch (e: AnyException) {
          console.error(e);
        }
      }
    }
  }

  openUrl(payload: any) {
    if (payload.params) {
      console.log(payload.params);
      shell.openExternal(payload.params);
    }
  }

  async fillProjects() {
    await fillProjects();
    return true;
  }
}

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
  result.commonFolder = '';

  const pathlist = [];

  if (data.AppPath.DB.length) {
    for (const cpath of data.AppPath.DB) {
      const res = cpath.match(verpattern);
      if (res) {
        result.version = res[0];
      }

      const cpath_res = path.resolve(path.dirname(pathFile), cpath);
      pathlist.push(cpath_res);
    }
  }

  for (let i = 1; i < pathlist.length; i++) {
    const checkString = pathlist[i - 1];
    let tmpString = pathlist[i];
    while (tmpString.length > 1) {
      if (checkString.indexOf(tmpString) >= 0) {
        result.commonFolder = tmpString;
        break;
      }
      tmpString = tmpString.slice(0, tmpString.length - 1);
    }
  }

  if (result.commonFolder) {
    const srv_index = result.commonFolder.toLowerCase().indexOf('stack.srv');
    if (srv_index > 0) {
      result.commonFolder = result.commonFolder.substring(0, srv_index);
    }
  }
  if (!result.version) {
    result.version = result.commonFolder;
  }

  return result;
}

async function addProject(payload: Project) {
  const project = {} as Project;
  project.name = payload.name;

  let bindir = settings.get('bin') as string;
  // если каталог не указан, то будем создавать в папке проекта
  if (!bindir) {
    bindir = path.join(payload.path.git, 'Stack.Srv', 'bin');
  }
  const pathbin_new = path.join(bindir, payload.name);

  project.path = {
    version: payload.path.version,
    bin: pathbin_new,
    git: payload.path.git,
    ini: payload.path.ini,
    front: payload.path.front,
  };

  project.sql = {
    server: payload.sql.server,
    base: payload.sql.base,
    login: payload.sql.login,
    password: payload.sql.password,
  };

  project.apps = [];

  for (const app of payload.apps) {
    project.apps.push({ id: app.id, port: app.port, name: app.name, path: app.path, args: app.args });
  }

  // проверим валидность путей
  for (const key of Object.keys(project.path) as Array<keyof typeof project.path>) {
    const cpath = project.path[key];
    if (cpath && !fs.existsSync(cpath) && key !== 'bin') {
      throw new Error(`Некорректный путь ${cpath}`);
    }
  }

  return project;
}

async function buildProject(project: Project, oldApps?: ProjectApp[]) {
  const webServer = getWebServer();

  // остановим приложения если есть
  for (const app of project.apps) {
    try {
      webServer.stopItem(app.name);
    } catch (e) {
      //
    }
  }

  const pathbin_old = path.dirname(project.path.ini);
  const pathbin_new = project.path.bin;
  const mathed = project.path.version.match(verpattern);
  let verdir = project.path.version;
  if (settings.get('stackversion')) {
    if (mathed && mathed[1]) {
      const ver = mathed[1].replaceAll('//', '');
      verdir = path.join(settings.get('stackversion') as string, ver);
    }

    // копируем каталог версии если его нет
    if (!fs.existsSync(verdir)) {
      await copyFiles(project.path.version, verdir);
    }
  }
  verdir = path.join(verdir, '\\');

  // копируем exe и прочие файлы в бин каталог
  const pathini = project.path.ini;
  const pathbin_ver = path.join(verdir, 'Stack.srv', 'Bin', '0');

  if (fs.existsSync(pathbin_ver)) {
    await copyFiles(pathbin_ver, pathbin_new);
  } else {
    // смотрим путь в котором лежит инишка, и копируем оттуда
    if (fs.existsSync(pathini)) {
      const bin_dir = path.dirname(pathini);
      await copyFiles(bin_dir, pathbin_new);
    }
  }

  // редактируем stack.ini и создаем в целевом каталоге
  if (fs.existsSync(pathini)) {
    const data = readIniFile(pathini);

    data['SQL-mode'].Server = project.sql.server;
    data['SQL-mode'].Base = project.sql.base;

    // correct path of resources
    for (const key of Object.keys(data['AppPath'])) {
      for (const idx in data['AppPath'][key]) {
        const respath = data['AppPath'][key][idx];
        if (respath.startsWith('..')) {
          data['AppPath'][key][idx] = path.join(pathbin_old, respath);
        } else {
          data['AppPath'][key][idx] = respath.replace(verpattern, verdir);
        }
      }
    }
    const libpath = data['LibPath'].Path || '';
    if (libpath.startsWith('..')) {
      data['LibPath'].Path = path.join(pathbin_old, libpath);
    } else {
      data['LibPath'].Path = libpath.replace(verpattern, verdir);
    }

    const jspath = data['JavaClient'].JCPath || '';
    if (jspath.startsWith('..')) {
      data['JavaClient'].JCPath = path.join(pathbin_old, jspath);
    } else {
      data['JavaClient'].JCPath = jspath.replace(verpattern, verdir);
    }

    const jrepath = data['JavaClient'].JREPath || '';
    if (jrepath.startsWith('..')) {
      data['JavaClient'].JREPath = path.join(pathbin_old, jrepath);
    } else {
      data['JavaClient'].JREPath = jrepath.replace(verpattern, verdir);
    }

    const jsupath = data['JavaClient'].JCUpdatePath || '';
    if (jsupath.startsWith('..')) {
      data['JavaClient'].JCUpdatePath = path.join(pathbin_old, jsupath);
    } else {
      data['JavaClient'].JCUpdatePath = jsupath.replace(verpattern, verdir);
    }
    writeIniFile(path.join(pathbin_new, 'stack.ini'), data);
  }

  if (oldApps && oldApps.length) {
    for (const app of oldApps) {
      // предварительно удалим если есть итемы с  этим именем
      try {
        await webServer.deleteItem(app.name);
      } catch (e: AnyException) {
        //
      }
    }
  }

  for (const app of project.apps) {
    await webServer.addItem(app.name, {
      UrlPathPrefix: app.path,
      StackProgramDir: project.path.bin,
      StackProgramParameters: `-u:${project.sql.login} -p:${project.sql.password} -t:${app.id} -LOADRES --inspect=${app.port || '0000'} -nc ${app.args}`,
      IsActive: 1,
      FunctionName: 'StackAPI_kvplata_v1',
      ResultContentType: 'application/json;charset=utf-8',
      UseComStack: 1,
      ShareStaticContent: 0,
      UploadStaticContent: 0,
      FallbackEnabled: 0,
      AllowServiceCommands: 0,
    });
    webServer.startItem(app.name);
  }
}

async function deleteProject(project: Project) {
  // удаляем веб серверы
  const webServer = getWebServer();
  for (const app of project.apps) {
    try {
      await webServer.deleteItem(app.name);
    } catch (e: AnyException) {
      // console.error(e);
    }
  }

  // удаляем созоданный каталог в бин
  if (fs.existsSync(project.path.bin)) {
    fs.rmSync(project.path.bin, { recursive: true, force: true });
  }

  return {};
}

function generateEnvJson(project: Project, envpath: string) {
  let envPath = path.join(project.path.front, '.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.join(project.path.front, '.env.example');
    if (fs.existsSync(envPath)) {
      throw new Error('Не найден .env файл');
    }
  }

  const tasks = settings.get('tasks') as Task[];
  const disp = new URL(settings.get('dispatcher_url') as string);
  const config = readIniFile(envPath);
  for (const app of project.apps) {
    const prefix = tasks.find((task) => {
      return task.id === app.id;
    })?.prefix;
    config['API_HOST_' + prefix?.toUpperCase()] = disp.origin + app.path;
  }
  fs.writeFileSync(path.join(envpath, 'env.json'), JSON.stringify(config, null, '\t'));
}

async function fillProjects() {
  const ws = getWebServer();
  const items = await ws.getItems();
  if (items.length === 0) {
    throw new Error('Не найдено элементов веб сервера');
  }
  const dispdir = settings.get('dispatcher_folder') as string;

  const allProjects = projects.get('projects', []) as Project[];
  const newProjects = [];

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
          args: '',
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

        const ignoreKeys = ['u', 'p', 't', 'inspect', 'nc', 'LOADRES'];
        for (const keyArg of Object.keys(args)) {
          if (!ignoreKeys.includes(keyArg)) {
            app.args += ` -${keyArg}:${args[keyArg]}`;
          }
        }

        const pathfront = fs.existsSync(path.join(data.commonFolder, 'Stack.Front')) ? path.join(data.commonFolder, 'Stack.Front') : '';

        project.path = {
          version: data.version,
          bin,
          git: data.commonFolder,
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
          const appindex = finded.apps.findIndex((item: ProjectApp) => {
            return item.name.toLowerCase() === app.name.toLowerCase();
          });
          if (appindex === -1) {
            finded.apps.push(app);
          }
        } else {
          project.apps = [];
          project.apps.push(app);
          allProjects.push(project);
          newProjects.push(project.name);
        }
      }
    }
  }

  for (const _name of newProjects) {
    const findIndex = allProjects.findIndex((item: Project) => {
      return item.name.toLowerCase() === _name.toLowerCase();
    });
    if (_name.length <= 2 && findIndex > 0) {
      const newName = path.basename(allProjects[findIndex].path.git);
      allProjects[findIndex].name += '_' + newName;
    }
  }

  projects.set('projects', allProjects);
}

let webServer: any;
function getWebServer() {
  if (webServer && webServer.isAuth) {
    return webServer;
  }

  const address = settings.get('dispatcher_url') as string;
  const secret = settings.get('dispatcher_password') as string;

  if (!address) {
    throw new Error('Не указан адрес диспетчера');
  }
  if (!secret) {
    throw new Error('Не указан пароль для диспетчера');
  }

  const setupDispatcher = new Dispatcher(address, secret);
  webServer = setupDispatcher.webServer();
  return webServer;
}
