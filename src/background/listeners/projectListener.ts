import CommonListener from './commonListener';

import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { projects, settings } from '../store';
import { getFiles, copyFiles, readSettingsFile, writeSettingsFile, parseArgs, readIniFile } from '../utils';

import Dispatcher from '../middleware/dispatcher';
import StaticServer from '../middleware/express';
import cmd from '../cmd';
import { exec } from 'sudo-prompt';

enum StackBackendType {
  stack = 0,
  apphost = 1,
}

const isDevelopment = process.env.NODE_ENV !== 'production';

export class ProjectListener extends CommonListener {
  private servers = [] as StaticServer[];
  private staticPath = path.join(app.getPath('userData'), 'domains');

  constructor() {
    super('project');

    // стартанем статику при старте слушателя
    this.restartServers();
  }

  getAll() {
    const data = (projects.get('projects', []) as Project[]).map((project: Project) => {
      const apps = [...project.apps];
      if (project.gateway) {
        apps.unshift({
          name: project.gateway.name,
          port: null,
          path: '',
          id: 0,
          args: '',
        });
      }
      return {
        name: project.name,
        port: project.port,
        apps,
      };
    });

    return data;
  }

  async getAppStatus() {
    const statuses = [];

    const webServer = getDispatcher().webServer();
    let apps = await webServer.getItems();
    statuses.push(
      ...apps.map((app: any) => {
        return { name: app.Name, status: +app.State };
      })
    );

    const appServer = getDispatcher().appServer();
    apps = await appServer.getItems();
    statuses.push(
      ...apps.map((app: any) => {
        return { name: app.Name, status: +app.State ? 0 : 2 };
      })
    );

    return statuses;
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
    checkProject(project, null);
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

    // удаляем веб серверы
    const webServer = project.type === StackBackendType.apphost ? getDispatcher().appServer() : getDispatcher().webServer();
    for (const app of project.apps) {
      try {
        await webServer.deleteItem(app.name);
      } catch (e: AnyException) {
        // console.error(e);
      }
    }
    if (project.gateway?.name) {
      try {
        await webServer.deleteItem(project.gateway.name);
      } catch (e: AnyException) {
        // console.error(e);
      }
    }

    // удаляем созоданный каталог в бин
    if (fs.existsSync(project.path.bin)) {
      fs.rmSync(project.path.bin, { recursive: true, force: true });
    }

    // удаляем созоданный фронт
    const frontPath = path.join(this.staticPath, project.name);
    if (fs.existsSync(frontPath)) {
      fs.rmSync(frontPath, { recursive: true, force: true });
    }

    projects.set('projects', allProjects);

    return {};
  }
  save(payload: any) {
    const id = payload.projectId;
    const project = payload.params as Project;

    const data = projects.get('projects', []) as Project[];
    if (data && data[id]) {
      checkProject(project, id);
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
      checkProject(project, id);
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
    const id = payload.projectId;
    const allProjects = projects.get('projects', []) as Project[];
    const apphost_project = (allProjects[id]?.type || StackBackendType.stack) === StackBackendType.apphost;

    const webServer = apphost_project ? getDispatcher().appServer() : getDispatcher().webServer();
    const res = await webServer.startItem(payload.params);
    return res;
  }
  async appReStart(payload: any) {
    const id = payload.projectId;
    const allProjects = projects.get('projects', []) as Project[];
    const apphost_project = (allProjects[id]?.type || StackBackendType.stack) === StackBackendType.apphost;

    const webServer = apphost_project ? getDispatcher().appServer() : getDispatcher().webServer();
    const res = await webServer.restartItem(payload.params);
    return res;
  }
  async appStop(payload: any) {
    const id = payload.projectId;
    const allProjects = projects.get('projects', []) as Project[];
    const apphost_project = (allProjects[id]?.type || StackBackendType.stack) === StackBackendType.apphost;

    const webServer = apphost_project ? getDispatcher().appServer() : getDispatcher().webServer();
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

      this.sendInfoMessage(project.name, 'Сборка запущена');
      await cmd.exec('npm ci', project.path.front);
      await cmd.exec('npm run build', project.path.front);
      if (fs.existsSync(path.join(project.path.front, 'dist'))) {
        if (fs.existsSync(path.join(this.staticPath, project.name))) {
          fs.rmSync(path.join(this.staticPath, project.name), { recursive: true, force: true });
        }
        await copyFiles(path.join(project.path.front, 'dist'), path.join(this.staticPath, project.name));
        await generateEnvJson(project, path.join(this.staticPath, project.name));
        this.sendInfoMessage(project.name, 'Сборка завершена');
      } else {
        this.sendInfoMessage(project.name, `Не найден dist каталог`);
        throw new Error(`Не найден dist каталог`);
      }
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }
    this.restartServers();
    return true;
  }

  async restartServers() {
    if (isDevelopment) {
      return;
    }

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

  async fillProjects() {
    await fillProjects();
    return true;
  }

  async createStaticApp(payload: any) {
    if (payload.name) {
      if (payload.name === 'share' || payload.name === 'upload') {
        const pathFolder = (await settings.get(payload.name)) as string;
        if (!pathFolder || !fs.existsSync(pathFolder)) {
          throw new Error('Не указан каталог сервиса');
        }
        const name = (await settings.get(payload.name + '_name')) as string;
        const webServer = getDispatcher().webServer();
        // удалим если уже есть с таким именем для пересоздания
        try {
          await webServer.deleteItem(name);
        } catch (e: AnyException) {
          //
        }
        await webServer.addItem(name, {
          UrlPathPrefix: '/' + payload.name,
          StaticContentPath: pathFolder,
          [payload.name === 'share' ? 'ShareStaticContent' : 'UploadStaticContent']: 1,
          IsActive: 1,
          UseComStack: 0,
          FallbackEnabled: 0,
          AllowServiceCommands: 0,
          CheckInterval: 0,
        });
        this.sendInfoMessage(name, `Веб сервис создан`);
      }
    }
    if (payload.name === 'birt') {
      const jre = (await settings.get('jre')) as string;
      if (!jre || !fs.existsSync(jre)) {
        throw new Error('Не указан каталог JRE');
      }
      const birt = (await settings.get('birt')) as string;
      if (!birt || !fs.existsSync(birt)) {
        throw new Error('Не указан каталог сервиса');
      }
      if (!fs.existsSync(path.join(birt, 'BirtWebReporter.jar'))) {
        throw new Error('Не найден файл BirtWebReporter.jar');
      }

      const birt_name = (await settings.get('birt_name')) as string;
      const birt_port = (await settings.get('birt_port')) as number;

      const name = birt_name;
      const webServer = getDispatcher().appServer();
      // удалим если уже есть с таким именем для пересоздания
      try {
        await webServer.deleteItem(name);
      } catch (e: AnyException) {
        //
      }
      await webServer.addItem(name, {
        IsActive: 1,
        cmd: path.join(jre, 'bin', 'javaw.exe'),
        path: birt,
        cmdArgs: ' -Xss4m -Xmx512m -Duser.country=RU -Duser.language=ru -jar BirtWebReporter.jar ' + birt_port + ' -log',
        restart: 1,
        restartMaxCount: 5,
        checkPort: birt_port,
      });
      webServer.startItem(name);
      this.sendInfoMessage(name, `Веб сервис создан`);
    }
    if (payload.name === 'dotnetcore') {
      const dotnet = (await settings.get('dotnetcore')) as string;
      if (!dotnet || !fs.existsSync(dotnet)) {
        throw new Error('Не указан каталог сервиса');
      }

      const dotnet_name = (await settings.get('dotnetcore_name')) as string;
      const dotnet_port = (await settings.get('dotnetcore_port')) as number;

      const name = dotnet_name;
      const webServer = getDispatcher().appServer();
      // удалим если уже есть с таким именем для пересоздания
      try {
        await webServer.deleteItem(name);
      } catch (e: AnyException) {
        //
      }
      await webServer.addItem(name, {
        IsActive: 1,
        cmd: 'C:\\Program Files\\dotnet\\dotnet.exe',
        cmdArgs: `DotNetCore.dll ` + dotnet_port,
        path: dotnet,
        restart: 1,
        restartMaxCount: 5,
        checkPort: dotnet_port,
      });
      webServer.startItem(name);

      if (!fs.existsSync('C:\\Program Files\\dotnet\\dotnet.exe')) {
        exec('\\\\FSRV\\KVP_VERSION\\Test\\dotnetcore\\dotnet-runtime-5.0.12-win-x64.exe');
      }

      this.sendInfoMessage(name, `Веб сервис создан`);
    }
  }

  async gitPull(payload: any) {
    const id = payload.projectId;
    const allProjects = projects.get('projects', []) as Project[];
    if (allProjects[id]) {
      const project = allProjects[id];

      if (!project.path.git) {
        throw new Error(`Не задан каталог git`);
      }

      await cmd.exec('git pull', project.path.git);
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }
  }
}

async function readProjectFolder(pathDir: string) {
  if (!pathDir) {
    throw 'Не указан каталог для чтения';
  }

  const result = {
    front: '',
    ini: [] as any[],
    type: StackBackendType.stack,
    gateway: '',
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

  if (fs.existsSync(path.join(pathBin, '0', 'app_host.exe'))) {
    result.type = StackBackendType.apphost;
    // поищем гейтвэй
    const pathGateWay = path.join(pathDir, 'StackGateway');
    if (fs.existsSync(pathGateWay)) {
      result.gateway = pathGateWay;
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

  const data = readSettingsFile(pathFile);

  result.server = data['SQL-mode'].Server;
  result.base = data['SQL-mode'].Base;
  result.version = '';
  result.commonFolder = '';
  result.gateway = '';

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

  // TODO пока убрал определение общей папки по количеству совпадений, т.к. не всегда клиентских каталогов больше 1, поэтому возьмем последний
  if (pathlist.length) {
    result.commonFolder = pathlist[pathlist.length - 1];
  }
  // for (let i = 1; i < pathlist.length; i++) {
  //   const checkString = pathlist[i - 1];
  //   let tmpString = pathlist[i];
  //   while (tmpString.length > 4) {
  //     // если окажется что у папок из общего только диск, то скипаем
  //     if (checkString.indexOf(tmpString) >= 0) {
  //       result.commonFolder = tmpString;
  //       break;
  //     }
  //     tmpString = tmpString.slice(0, tmpString.length - 1);
  //   }
  // }

  if (result.commonFolder) {
    const srv_index = result.commonFolder.toLowerCase().indexOf('stack.srv');
    if (srv_index > 0) {
      result.commonFolder = result.commonFolder.substring(0, srv_index);
    }
  }
  if (!result.version) {
    result.version = result.commonFolder;
  }

  // поищем гейтвэй
  const pathGateWay = path.join(result.version, 'StackGateway');
  if (fs.existsSync(pathGateWay)) {
    result.gateway = pathGateWay;
  }

  return result;
}

async function addProject(payload: Project) {
  const project = {} as Project;
  project.name = payload.name;

  project.port = payload.port;
  project.type = payload.type;

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

  if (project.type === StackBackendType.apphost) {
    project.gateway = {
      name: project.name + '_gateway',
      path: payload.gateway.path,
      port: payload.gateway.port,
    };
  }

  project.apps = [];

  for (const app of payload.apps) {
    project.apps.push({
      id: app.id,
      port: app.port,
      name: app.name,
      path: app.path,
      args: app.args,
    });
  }

  return project;
}

function checkProject(project: Project, index: number | null) {
  const allProjects = projects.get('projects', []) as Project[];

  const indname = allProjects.findIndex((p: Project, id: number) => {
    return p.name === project.name && id !== index;
  });
  if (indname >= 0) {
    throw new Error(`Уже есть проект с таким именем`);
  }

  // проверим валидность путей
  for (const key of Object.keys(project.path) as Array<keyof typeof project.path>) {
    const cpath = project.path[key];
    if (cpath && !fs.existsSync(cpath) && key !== 'bin') {
      throw new Error(`Некорректный путь ${cpath}`);
    }
  }

  if (project.type === StackBackendType.apphost) {
    if (project.gateway?.path && !fs.existsSync(project.gateway.path)) {
      throw new Error(`Некорректный путь ${project.gateway.path}`);
    }

    if (project.gateway?.path && !settings.get('jre')) {
      throw new Error(`Не задан каталг jre в настройках`);
    }
    if (!fs.existsSync(settings.get('jre'))) {
      throw new Error(`Не существующий каталог jre. Проверьте настройки`);
    }
  }

  const ports = [];
  ports.push(project.port);
  ports.push(project.gateway?.port);

  ports.forEach((port: number | null | undefined) => {
    if (port) {
      const res = allProjects.find((p: Project, id: number) => {
        return id !== index && (p.gateway?.port === port || p.port === port);
      });
      if (res) {
        throw new Error(`Указанный front порт ${port} уже используется в проекте ${res.name}`);
      }
    }
  });
}

async function buildProject(project: Project, oldApps?: ProjectApp[]) {
  const apphost_project = project.type === StackBackendType.apphost;
  const webServer = apphost_project ? getDispatcher().appServer() : getDispatcher().webServer();

  // удалим старые приложения если есть
  if (oldApps) {
    for (const app of oldApps) {
      try {
        await webServer.deleteItem(app.name);
      } catch (e) {
        //
      }
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
    generateStackIni(project, pathini, pathbin_old, pathbin_new, verdir);
  }

  if (apphost_project) {
    generateCredentials(project, pathbin_new);
    const gatewaySettingsPath = generateGatewaySettings(project, pathbin_new);

    try {
      await webServer.deleteItem(project.gateway.name);
    } catch (e) {
      //
    }

    // деплоим гейтвэй
    if (project.gateway.name) {
      await webServer.addItem(project.gateway.name, {
        IsActive: 1,
        cmd: path.join(settings.get('jre'), 'bin', 'javaw.exe'),
        cmdArgs: `-jar ${getGatewayFileName(project.gateway.path)} --spring.config.location=classpath:/application.yml,classpath:file:${gatewaySettingsPath}`,
        path: project.gateway.path,
        restart: 1,
        restartMaxCount: 5,
      });
      await webServer.startItem(project.gateway.name);
    }
  }

  if (!apphost_project) {
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
  if (apphost_project) {
    for (const app of project.apps) {
      generateTaskSettings(project, app);

      const task = (settings.get('tasks') as Task[])?.find((task: Task) => task.id === app.id);
      const syncThreadCount = app.syncThreadCount || 20;
      const asyncThreadCount = app.asyncThreadCount || 2;
      const asyncTaskCount = app.asyncTaskCount || 5;

      const addParams = app.id === 11075 ? ',очищатьПросроченныеДанные:true' : '';
      const expression = `ЗапуститьОчередьСообщений(@{количествоПотоков:${syncThreadCount},количествоАсинхронныхПотоков:${asyncThreadCount},количествоАсинхронныхРабот:${asyncTaskCount}${addParams}})`;
      const rabbitsettings = `settings_${task?.prefix || app.id}.toml`;
      const cmdArgs = `--task=${app.id} --inspect=${app.port || '0000'} -r testsrv:9898 -i "stack.ini" -c "credentials.ini" --rabbit="${rabbitsettings}" -f "${expression}"`;

      await webServer.addItem(app.name, {
        IsActive: 1,
        cmd: path.join(project.path.bin, 'app_host.exe'),
        cmdArgs,
        path: project.path.bin,
        restart: 1,
        restartMaxCount: 5,
      });
      webServer.startItem(app.name);
    }
  }
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
  if (project.type === StackBackendType.apphost) {
    config['API_HOST'] = `http://${os.hostname().toLowerCase()}:${project.gateway.port}`;
  }
  if (project.type === StackBackendType.stack) {
    for (const app of project.apps) {
      const prefix = tasks.find((task) => {
        return task.id === app.id;
      })?.prefix;
      config['API_HOST_' + prefix?.toUpperCase()] = disp.origin + app.path;
    }
  }

  const sharePath = settings.get('share') as string;
  if (sharePath) {
    config['API_HOST_SHARE'] = disp.origin + '/share';
  }
  const uploadPath = settings.get('upload') as string;
  if (uploadPath) {
    config['API_HOST_UPLOAD'] = disp.origin + '/upload';
  }

  fs.writeFileSync(path.join(envpath, 'env.json'), JSON.stringify(config, null, '\t'));
}

async function generateStackIni(project: Project, pathini: string, binold: string, binnew: string, version: string) {
  const data = readSettingsFile(pathini);

  data['SQL-mode'].Server = project.sql.server;
  data['SQL-mode'].Base = project.sql.base;
  data['SQL-mode'].Schema = project.type !== StackBackendType.apphost ? project.sql.base + '.stack' : 'stack';

  // correct path of resources
  for (const key of Object.keys(data['AppPath'])) {
    for (const idx in data['AppPath'][key]) {
      const respath = data['AppPath'][key][idx];
      if (respath.startsWith('..')) {
        data['AppPath'][key][idx] = path.join(binold, respath);
      } else {
        data['AppPath'][key][idx] = respath.replace(verpattern, version);
      }
    }
  }

  if (project.type !== StackBackendType.apphost) {
    const libpath = data['LibPath'].Path || '';
    if (libpath.startsWith('..')) {
      data['LibPath'].Path = path.join(binold, libpath);
    } else {
      data['LibPath'].Path = libpath.replace(verpattern, version);
    }
  }

  const jspath = data['JavaClient'].JCPath || '';
  if (jspath.startsWith('..')) {
    data['JavaClient'].JCPath = path.join(binold, jspath);
  } else {
    data['JavaClient'].JCPath = jspath.replace(verpattern, version);
  }

  const jrepath = data['JavaClient'].JREPath || '';
  if (jrepath.startsWith('..')) {
    data['JavaClient'].JREPath = path.join(binold, jrepath);
  } else {
    data['JavaClient'].JREPath = jrepath.replace(verpattern, version);
  }

  const jsupath = data['JavaClient'].JCUpdatePath || '';
  if (jsupath.startsWith('..')) {
    data['JavaClient'].JCUpdatePath = path.join(binold, jsupath);
  } else {
    data['JavaClient'].JCUpdatePath = jsupath.replace(verpattern, version);
  }

  if (!data['API']) {
    data['API'] = {};
  }

  const sharePath = settings.get('share') as string;
  if (sharePath) {
    data['API'].PublicFilesPath = sharePath;
  }
  const uploadPath = settings.get('upload') as string;
  if (uploadPath) {
    data['API'].UploadedFilesPath = uploadPath;
  }

  if (settings.get('birt') && settings.get('birt_port')) {
    if (!data['BirtStarter']) {
      data['BirtStarter'] = {};
    }
    if (project.type === StackBackendType.apphost) {
      data['BirtStarter'].Port = +(settings.get('birt_port') as number);
    } else {
      data['BirtStarter'].BSPort = +(settings.get('birt_port') as number);
    }
  }

  if (settings.get('dotnetcore') && settings.get('dotnetcore_port')) {
    if (!data['DotNetCore']) {
      data['DotNetCore'] = {};
    }
    data['DotNetCore'].Port = +(settings.get('dotnetcore_port') as number);
  }

  writeSettingsFile(path.join(binnew, 'stack.ini'), data);
}

function generateTaskSettings(project: Project, app: ProjectApp) {
  const commonSettingsPath = path.join(project.path.version, 'Stack.srv', 'Bin', 'ini', 'settings.toml');

  let tomlData = {} as any;

  if (fs.existsSync(commonSettingsPath)) {
    tomlData = readSettingsFile(commonSettingsPath);
  } else {
    tomlData.RabbitMQrpc = {};
    tomlData.RabbitMQrpc.exchange = '';
    tomlData.RabbitMQrpc.routing_key = 'rpc_queue';
    tomlData.RabbitMQrpc.qos = 1;
    tomlData.RabbitMQrpc.product_name = 'StackExe';

    tomlData.RabbitMQService = {};
    tomlData.RabbitMQService.queue = '';
    tomlData.RabbitMQService.product_name = 'StackService';
  }
  const task = (settings.get('tasks') as Task[])?.find((task: Task) => task.id === app.id);

  const taskid = task?.prefix || app.id;
  const rabbithost = new URL(settings.get('rabbitmq_url'));
  if (rabbithost) {
    tomlData.RabbitMQrpc.host = tomlData.RabbitMQService.host = rabbithost.hostname;
    tomlData.RabbitMQrpc.port = tomlData.RabbitMQService.port = +rabbithost.port;

    // tomlData.RabbitMQrpc.vhost = tomlData.RabbitMQService.vhost = '/';
    // settings.RabbitMQrpc.login = settings.RabbitMQService.login = 'stack';
    // settings.RabbitMQrpc.password = settings.RabbitMQService.password = 'stack';

    tomlData.RabbitMQrpc.routing_key = os.hostname + '_' + project.name + '_' + taskid;
    tomlData.RabbitMQrpc.routing_key_asynch = os.hostname + '_' + project.name + '_' + taskid;

    tomlData.RabbitMQService.exchange_in = os.hostname + '_' + project.name + '_service_to_backend';
    tomlData.RabbitMQService.exchange_out = os.hostname + '_' + project.name + '_service_from_backend';
    tomlData.RabbitMQService.task = taskid;
  }

  const queueSettingsPath = path.join(project.path.bin, `settings_${taskid}.toml`);
  writeSettingsFile(queueSettingsPath, tomlData);
}

function generateCredentials(project: Project, pathnew: string) {
  const data = {
    Database: {
      login: project.sql.login,
      password: project.sql.password,
    },
  };
  writeSettingsFile(path.join(pathnew, 'credentials.ini'), data);
}

function generateGatewaySettings(project: Project, pathnew: string) {
  const templateYaml = path.join(project.gateway.path || '', 'application.yml');
  if (fs.existsSync(templateYaml)) {
    const dataYaml = readSettingsFile(templateYaml);
    const common = dataYaml[0];

    common.server.port = +project.gateway.port || common.server.port;
    common.stack.security.cors.allowedOrigins = createAllowedOrigins([8080, 8081, project.port || 0]);

    const tasks = settings.get('tasks') as Task[];

    common.stack.queue.rpc.tasks = Object.fromEntries(
      project.apps.map((app: ProjectApp) => {
        const task = tasks.find((task: Task) => task.id === app.id);
        const taskid = task?.prefix || app.id;
        return [
          taskid,
          {
            url: '',
            exchange: '',
            routingKey: os.hostname + '_' + project.name + '_' + taskid,
            routingKeyAsync: os.hostname + '_' + project.name + '_' + taskid,
            useAsyncCache: false,
          },
        ];
      })
    );

    common.stack.queue.service.exchangeIn = os.hostname + '_' + project.name + '_service_from_backend';
    common.stack.queue.service.exchangeOut = os.hostname + '_' + project.name + '_service_to_backend';

    const rabbithost = new URL(settings.get('rabbitmq_url'));
    if (rabbithost) {
      common.spring.rabbitmq.host = rabbithost.hostname;
      common.spring.rabbitmq.port = +rabbithost.port;

      // common.spring.rabbitmq['virtual-host'] = '/';
      // common.spring.rabbitmq.username = 'stack';
      // common.spring.rabbitmq.password = 'stack';
    }

    common.spring.profiles.active = 'postgresql';
    const profile = (() => {
      for (let i = 1; i < dataYaml.length; i++) {
        const cur = dataYaml[i];
        if (cur.spring && cur.spring.config && cur.spring.config.activate && cur.spring.config.activate['on-profile'] === common.spring.profiles.active) {
          return cur;
        }
      }
      return {
        spring: {
          config: {
            activate: {
              'on-profile': common.spring.profiles.active,
            },
          },
        },
      };
    })();
    profile.spring.datasource = {
      url: `jdbc:postgresql://${project.sql.server}:${project.sql.port || 5432}/${project.sql.base}`,
      username: project.sql.login,
      password: project.sql.password,
    };

    writeSettingsFile(path.join(pathnew, 'application.yml'), dataYaml);
    return path.join(pathnew, 'application.yml');
  }
}

function createAllowedOrigins(ports: number[]) {
  const result = [] as string[];
  const push = (host: string) =>
    ports.forEach((port: number) => {
      result.push(`http://${host}:${port}`);
    });
  push('localhost');
  push(os.hostname());
  Object.values(os.networkInterfaces()).forEach((ni: any) => {
    ni.filter((el: any) => el.family === 'IPv4').forEach((el: any) => push(el.address));
  });
  return result;
}

function getGatewayFileName(path: string) {
  return (
    fs
      .readdirSync(path, { withFileTypes: true })
      .filter((e) => e.isFile() && /^stackgateway-.*\.jar$/.test(e.name))
      .map((e) => e.name)
      .pop() || 'stackgateway-0.0.3.jar'
  );
}

async function fillProjects() {
  const ws = getDispatcher().webServer();
  const as = getDispatcher().appServer();
  const items = [...(await ws.getItems()), ...(await as.getItems())];
  if (items.length === 0) {
    throw new Error('Не найдено элементов диспетчера');
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

  // заполним сервисы
  for (const item of items) {
    if (item.ShareStaticContent === '1' && item.StaticContentPath && !settings.get('share')) {
      settings.set('share', item.StaticContentPath);
      settings.set('share_name', item.Name);
    }
    if (item.UploadStaticContent === '1' && item.StaticContentPath && !settings.get('upload')) {
      settings.set('upload', item.StaticContentPath);
      settings.set('upload_name', item.Name);
    }
    if (item.cmdArgs?.indexOf('DotNetCore.dll') >= 0 && !settings.get('dotnetcore')) {
      settings.set('dotnetcore', item.path);
      settings.set('dotnetcore_name', item.Name);
      if (+item.checkPort > 0) {
        settings.set('dotnetcore_port', +item.checkPort);
      }
    }
    if (item.cmdArgs?.indexOf('BirtWebReporter.jar') >= 0 && !settings.get('birt')) {
      settings.set('birt', item.path);
      settings.set('birt_name', item.Name);
      if (item.checkPort > 0) {
        settings.set('birt_port', +item.checkPort);
      }
      if (item.cmd) {
        const ind_jre = item.cmd.indexOf('\\bin\\java');
        const jre_path = item.cmd.substring(0, ind_jre > 0 ? ind_jre : undefined);
        settings.set('jre', jre_path);
      }
    }
  }
}

let dispatcher: any;
function getDispatcher() {
  if (dispatcher && dispatcher.isAuth) {
    return dispatcher;
  }

  const address = settings.get('dispatcher_url') as string;
  const secret = settings.get('dispatcher_password') as string;

  if (!address) {
    throw new Error('Не указан адрес диспетчера');
  }
  if (!secret) {
    throw new Error('Не указан пароль для диспетчера');
  }

  dispatcher = new Dispatcher(address, secret);
  return dispatcher;
}
