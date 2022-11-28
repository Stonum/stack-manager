import CommonListener from './commonListener';

import path from 'path';
import fs from 'fs';

import { projects, settings } from '@/store';
import { parseArgs } from '@/utils';

import ProjectFactory from '@/project/projectFactory';

import Dispatcher from '@/middleware/dispatcher';
import StaticServer from '@/middleware/express';
import cmd from '@/cmd';

export default class ProjectListener extends CommonListener {
  private servers = [] as StaticServer[];

  constructor() {
    super('project');

    // стартанем статику при старте слушателя
    this.restartServers();

    const workspacePath = settings.get('workspacePath');
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath);
    }
  }

  getAll() {
    const data = projects.getAll().map((project: Project) => {
      const apps = [...project.apps];
      if (project.gateway?.name) {
        apps.unshift({
          name: project.gateway.name,
          port: null,
          path: '',
          id: 0,
          args: '',
          active: true,
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
        return { name: app.Name, status: +app.IsActive ? +app.State : -1 };
      })
    );

    const appServer = getDispatcher().appServer();
    apps = await appServer.getItems();
    statuses.push(
      ...apps.map((app: any) => {
        return { name: app.Name, status: +app.IsActive ? (+app.State ? 0 : 2) : -1 };
      })
    );

    return statuses;
  }

  async getEvents() {
    const webServer = getDispatcher().eventServer();
    const events = await webServer.getItems();

    const date = new Date().setHours(0, 0, 0, 0);

    return events
      .filter((event: any) => +event.EventDateTime * 1000 > date)
      .map((event: any) => {
        return {
          type: event.EventType === '1' ? 'error' : 'info',
          text: event.EventMessage,
          time: new Date(+event.EventDateTime * 1000),
        };
      });
  }

  get(payload: any) {
    const id = payload.projectId;

    const data = projects.get(id);
    if (data) {
      return data;
    } else {
      throw new Error(`Не найден проект с указанным id - ${id}`);
    }
  }

  init() {
    return ProjectFactory.init();
  }

  async add(payload: any) {
    const project = ProjectFactory.create(null, payload.params, true);
    projects.add(ProjectFactory.extractObject(project));

    this.sendInfoMessage(project.name, 'Сборка backend запущена');
    await project.build();
    this.sendInfoMessage(project.name, 'Сборка backend завершена');

    return ProjectFactory.extractObject(project);
  }

  async delete(payload: any) {
    const project = ProjectFactory.create(payload.projectId, this.get(payload));

    this.sendInfoMessage(project.name, 'удаление проекта');
    await project.delete();
    projects.delete(payload.projectId);

    return true;
  }

  async copy(payload: any) {
    const project = ProjectFactory.copy(this.get(payload));

    return ProjectFactory.extractObject(project);
  }

  async rebuild(payload: any) {
    const project = ProjectFactory.create(payload.projectId, payload.params, true);

    // получаем старый проект и удаляем приложения
    const old_project = ProjectFactory.create(payload.projectId, this.get(payload));
    this.sendInfoMessage(old_project.name, 'удаление приложений по задачам');
    await old_project.deleteApps();

    // создаем новый
    this.sendInfoMessage(project.name, 'cборка backend запущена');
    project.build();
    projects.set(payload.projectId, ProjectFactory.extractObject(project));
    this.sendInfoMessage(project.name, 'сборка backend завершена');

    this.restartServers();
    return ProjectFactory.extractObject(project);
  }

  moveProject(payload: any) {
    const id = payload.oldIndex;
    const newId = payload.newIndex;

    const allProjects = projects.getAll();

    if (allProjects[id]) {
      const project = allProjects[id];
      allProjects.splice(id, 1); // удаляем
      allProjects.splice(newId, 0, project); // добавляем в позицию нового ( если новый больше старого - то +1, иначе как есть)
      projects.setAll(allProjects);
      return true;
    } else {
      return false;
    }
  }

  async changeType(payload: any) {
    const project = ProjectFactory.create(null, payload.params);
    return { project: ProjectFactory.extractObject(project) };
  }

  async changeFolder(payload: any) {
    const project = ProjectFactory.create(null, payload.params);
    const iniFiles = await project.changeFolder();
    await project.changeIniFile();
    return { project: ProjectFactory.extractObject(project), iniFiles };
  }

  async changeIniFile(payload: any) {
    const project = ProjectFactory.create(null, payload.params);
    await project.changeIniFile();
    return { project: ProjectFactory.extractObject(project) };
  }

  async appStart(payload: any) {
    const project = ProjectFactory.create(payload.projectId, this.get(payload));
    await project.appStart(payload.params);

    projects.setAppStatus(payload.projectId, payload.params, true);
    return true;
  }

  async appReStart(payload: any) {
    const project = ProjectFactory.create(payload.projectId, this.get(payload));
    await project.appReStart(payload.params);

    return true;
  }

  async appStop(payload: any) {
    const project = ProjectFactory.create(payload.projectId, this.get(payload));
    await project.appStop(payload.params);

    projects.setAppStatus(payload.projectId, payload.params, false);
    return true;
  }

  async buildFront(payload: any) {
    const project = ProjectFactory.create(payload.projectId, this.get(payload));

    this.sendInfoMessage(project.name, 'Сборка frontend запущена');
    await project.buildFront();
    this.sendInfoMessage(project.name, 'Сборка frontend завершена');
    this.restartServers();
    return true;
  }

  async restartServers() {
    for (const server of this.servers) {
      server.close();
    }
    this.servers = [];

    const allProjects = projects.getAll();
    for (const project of allProjects) {
      if (project.port) {
        const server = new StaticServer(project.name, project.port);
        server.listen();
        if (server.started) {
          this.servers.push(server);
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

      const birt_name = settings.get('birt_name') as string;
      const birt_port = settings.get('birt_port') as number;

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

      const dotnet_name = settings.get('dotnetcore_name') as string;
      const dotnet_port = settings.get('dotnetcore_port') as number;

      const name = dotnet_name;
      const webServer = getDispatcher().appServer();
      // удалим если уже есть с таким именем для пересоздания
      try {
        await webServer.deleteItem(name);
      } catch (e: AnyException) {
        //
      }
      if (!fs.existsSync('C:\\Program Files\\dotnet\\dotnet.exe')) {
        cmd.execSudo(import.meta.env.VITE_DOTNET_PATH || '');
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

      this.sendInfoMessage(name, `Веб сервис создан`);
    }
  }

  async gitPull(payload: any) {

    const project = ProjectFactory.create(payload.projectId, this.get(payload));
    await project.gitPull();
    return true;
  }

  async openWorkspace(payload: any) {

    const project = ProjectFactory.create(payload.projectId, this.get(payload));
    await project.openWorkspace();
    return true;
  }
}

async function fillProjects() {
  const ws = getDispatcher().webServer();
  const as = getDispatcher().appServer();
  const items = [...(await ws.getItems()), ...(await as.getItems())];
  if (items.length === 0) {
    throw new Error('Не найдено элементов диспетчера');
  }
  const dispdir = settings.get('dispatcher_folder') as string;

  const allProjects = projects.getAll();
  const newProjects = [];

  for (const item of items) {
    if (item.FunctionName === 'StackAPI_kvplata_v1' && item.StackProgramDir) {
      const programDir = item.StackProgramDir;
      const bin = path.resolve(dispdir, programDir);
      const pathini = path.join(bin, 'stack.ini');

      if (fs.existsSync(bin) && fs.existsSync(pathini)) {
        const params = ProjectFactory.init();

        params.name = path.basename(programDir);

        params.path.bin = bin;
        params.path.ini = pathini;

        const project = ProjectFactory.create(null, params);
        const commonFolder = await project.changeIniFile();

        project.path.git = commonFolder || '';

        const args = parseArgs(item.StackProgramParameters) as StackArguments;

        project.sql.login = args.u?.trim() || '';
        project.sql.password = args.p?.trim() || '';

        const app = {
          name: item.Name,
          path: item.UrlPathPrefix,
          id: +(args.t || 0),
          port: +(args.inspect || 0),
          args: '',
          active: !!+item.IsActive,
        };

        const ignoreKeys = ['u', 'p', 't', 'inspect', 'nc', 'LOADRES'];
        for (const keyArg of Object.keys(args)) {
          if (!ignoreKeys.includes(keyArg)) {
            app.args += ` -${keyArg}:${args[keyArg]}`;
          }
        }

        const finded = allProjects.find((item: Project) => {
          return item.name.toLowerCase() === params.name?.toLowerCase() && item.path.ini.toLowerCase() === params.path?.ini.toLowerCase();
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
          allProjects.push(params);
          newProjects.push(params.name);
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

  projects.setAll(allProjects);

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
      if (+item.checkPort > 0) {
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

function getDispatcher() {
  const address = settings.get('dispatcher_url') as string;
  const secret = settings.get('dispatcher_password') as string;

  return new Dispatcher(address, secret);
}
